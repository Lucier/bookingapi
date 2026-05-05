import 'reflect-metadata'
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import * as bcrypt from 'bcrypt'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { AppModule } from '../../../app.module'
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe'
import { DRIZZLE } from '../../../database/drizzle.provider'
import { movingEquipment, equipments, spaces, users, refreshTokens } from '../../../database/schema/index'
import type * as dbSchema from '../../../database/schema/index'

type DrizzleDB = PostgresJsDatabase<typeof dbSchema>

describe('Moving (e2e)', () => {
  let app: INestApplication
  let db: DrizzleDB
  let adminToken: string
  let equipmentId: string
  let spaceId: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.setGlobalPrefix('api/v1')
    app.useGlobalPipes(new ZodValidationPipe())
    await app.init()

    db = moduleFixture.get<DrizzleDB>(DRIZZLE)

    await db.delete(movingEquipment)
    await db.delete(equipments)
    await db.delete(spaces)
    await db.delete(refreshTokens)
    await db.delete(users)

    const passwordHash = await bcrypt.hash('admin123', 10)
    await db.insert(users).values({
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash,
      role: 'ADMIN',
    })

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@example.com', password: 'admin123' })

    adminToken = res.body.accessToken

    const [space] = await db
      .insert(spaces)
      .values({ name: 'Storage Room', description: 'Storage', status: 'active' })
      .returning()
    spaceId = space.id

    const [equipment] = await db
      .insert(equipments)
      .values({
        name: 'Projector X100',
        serialNumber: 'SN-TEST-001',
        conservationStatus: 'good',
      })
      .returning()
    equipmentId = equipment.id
  })

  afterAll(async () => {
    await db.delete(movingEquipment)
    await db.delete(refreshTokens)
    await db.delete(equipments)
    await db.delete(spaces)
    await db.delete(users)
    await app.close()
  })

  beforeEach(async () => {
    await db.delete(movingEquipment)
  })

  describe('POST /api/v1/moving', () => {
    it('creates a maintenance movement and returns 201 with joined data', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/moving')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          equipmentId,
          movementType: 'maintenance',
          description: 'Scheduled maintenance',
        })
        .expect(201)

      expect(res.body).toHaveProperty('id')
      expect(res.body.equipmentId).toBe(equipmentId)
      expect(res.body.movementType).toBe('maintenance')
      expect(res.body.equipmentName).toBe('Projector X100')
    })

    it('creates a transfer movement with destinationSpaceId', async () => {
      const [destination] = await db
        .insert(spaces)
        .values({ name: 'Conference Room', status: 'active' })
        .returning()

      const res = await request(app.getHttpServer())
        .post('/api/v1/moving')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          equipmentId,
          originSpaceId: spaceId,
          destinationSpaceId: destination.id,
          movementType: 'transfer',
        })
        .expect(201)

      expect(res.body.movementType).toBe('transfer')
      expect(res.body.destinationSpaceId).toBe(destination.id)
      expect(res.body.destinationSpaceName).toBe('Conference Room')
    })

    it('returns 400 when transfer is missing destinationSpaceId', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/moving')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ equipmentId, movementType: 'transfer' })
        .expect(400)
    })

    it('returns 404 when equipmentId does not exist', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/moving')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          equipmentId: '00000000-0000-0000-0000-000000000000',
          movementType: 'maintenance',
        })
        .expect(404)
    })

    it('returns 401 without a token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/moving')
        .send({ equipmentId, movementType: 'maintenance' })
        .expect(401)
    })

    it('binds the authenticated userId to the movement', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/moving')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ equipmentId, movementType: 'loan' })
        .expect(201)

      const [record] = await db.select().from(movingEquipment)
      expect(record.userId).toBe(res.body.userId)
    })
  })

  describe('GET /api/v1/moving', () => {
    it('returns empty array when no movements exist', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/moving')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(res.body).toEqual([])
    })

    it('returns all movements with equipment and space names', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/moving')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ equipmentId, movementType: 'maintenance' })

      const res = await request(app.getHttpServer())
        .get('/api/v1/moving')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(res.body).toHaveLength(1)
      expect(res.body[0]).toHaveProperty('equipmentName')
      expect(res.body[0].equipmentName).toBe('Projector X100')
    })
  })

  describe('GET /api/v1/moving/:id', () => {
    it('returns a movement by ID', async () => {
      const created = await request(app.getHttpServer())
        .post('/api/v1/moving')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ equipmentId, movementType: 'maintenance' })

      const res = await request(app.getHttpServer())
        .get(`/api/v1/moving/${created.body.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(res.body.id).toBe(created.body.id)
    })

    it('returns 404 when movement does not exist', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/moving/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404)
    })
  })

  describe('PATCH /api/v1/moving/:id', () => {
    it('updates the description of a movement', async () => {
      const created = await request(app.getHttpServer())
        .post('/api/v1/moving')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ equipmentId, movementType: 'maintenance' })

      const res = await request(app.getHttpServer())
        .patch(`/api/v1/moving/${created.body.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ description: 'Corrected description' })
        .expect(200)

      expect(res.body.description).toBe('Corrected description')
    })

    it('returns 404 when movement does not exist', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/moving/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ description: 'Ghost' })
        .expect(404)
    })
  })

  describe('DELETE /api/v1/moving/:id', () => {
    it('deletes a movement and returns 204', async () => {
      const created = await request(app.getHttpServer())
        .post('/api/v1/moving')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ equipmentId, movementType: 'write-off' })

      await request(app.getHttpServer())
        .delete(`/api/v1/moving/${created.body.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204)

      const remaining = await db.select().from(movingEquipment)
      expect(remaining).toHaveLength(0)
    })

    it('returns 404 when movement does not exist', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/moving/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404)
    })
  })
})
