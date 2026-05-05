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
import { equipments, users, refreshTokens, spaces } from '../../../database/schema/index'
import type * as dbSchema from '../../../database/schema/index'

type DrizzleDB = PostgresJsDatabase<typeof dbSchema>

describe('Equipments (e2e)', () => {
  let app: INestApplication
  let db: DrizzleDB
  let adminToken: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.setGlobalPrefix('api/v1')
    app.useGlobalPipes(new ZodValidationPipe())
    await app.init()

    db = moduleFixture.get<DrizzleDB>(DRIZZLE)

    await db.delete(refreshTokens)
    await db.delete(equipments)
    await db.delete(spaces)
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
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await db.delete(equipments)
  })

  let seedCounter = 0

  const seedEquipment = async (overrides: Partial<typeof equipments.$inferInsert> = {}) => {
    seedCounter++
    const [equipment] = await db
      .insert(equipments)
      .values({
        name: 'Test Equipment',
        serialNumber: `SN-${seedCounter}-${Date.now()}`,
        conservationStatus: 'new',
        ...overrides,
      })
      .returning()
    return equipment
  }

  describe('GET /api/v1/equipments', () => {
    it('returns empty array when no equipments exist', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/equipments')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
      expect(res.body).toEqual([])
    })

    it('returns all equipments', async () => {
      await seedEquipment({ name: 'Projector A' })
      await seedEquipment({ name: 'Projector B' })

      const res = await request(app.getHttpServer())
        .get('/api/v1/equipments')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(res.body).toHaveLength(2)
      expect(res.body[0]).toHaveProperty('id')
      expect(res.body[0]).toHaveProperty('name')
      expect(res.body[0]).toHaveProperty('serialNumber')
      expect(res.body[0]).toHaveProperty('conservationStatus')
      expect(res.body[0]).toHaveProperty('createdAt')
      expect(res.body[0]).toHaveProperty('updatedAt')
    })
  })

  describe('GET /api/v1/equipments/:id', () => {
    it('returns an equipment by ID', async () => {
      const equipment = await seedEquipment({ name: 'Projector A' })

      const res = await request(app.getHttpServer())
        .get(`/api/v1/equipments/${equipment.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(res.body.id).toBe(equipment.id)
      expect(res.body.name).toBe('Projector A')
    })

    it('returns 404 when equipment does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/equipments/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404)

      expect(res.body.message).toContain('not found')
    })
  })

  describe('POST /api/v1/equipments', () => {
    it('creates an equipment', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/equipments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Projector',
          serialNumber: 'SN-NEW-001',
          manufacturer: 'Epson',
          conservationStatus: 'new',
        })
        .expect(201)

      expect(res.body).toHaveProperty('id')
      expect(res.body.name).toBe('New Projector')
      expect(res.body.serialNumber).toBe('SN-NEW-001')
      expect(res.body.conservationStatus).toBe('new')
    })

    it('returns 400 when name is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/equipments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ serialNumber: 'SN-MISSING-NAME' })
        .expect(400)

      expect(res.body).toHaveProperty('message')
    })

    it('returns 400 when serialNumber is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/equipments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'No Serial' })
        .expect(400)

      expect(res.body).toHaveProperty('message')
    })

    it('returns 401 when not authenticated', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/equipments')
        .send({ name: 'Unauthorized', serialNumber: 'SN-UNAUTH' })
        .expect(401)
    })
  })

  describe('PATCH /api/v1/equipments/:id', () => {
    it('updates and returns the equipment', async () => {
      const equipment = await seedEquipment({ name: 'Old Name' })

      const res = await request(app.getHttpServer())
        .patch(`/api/v1/equipments/${equipment.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'New Name', conservationStatus: 'good' })
        .expect(200)

      expect(res.body.name).toBe('New Name')
      expect(res.body.conservationStatus).toBe('good')
    })

    it('returns 404 when equipment does not exist', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/equipments/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Ghost' })
        .expect(404)
    })
  })

  describe('DELETE /api/v1/equipments/:id', () => {
    it('deletes an equipment and returns 204', async () => {
      const equipment = await seedEquipment()

      await request(app.getHttpServer())
        .delete(`/api/v1/equipments/${equipment.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204)

      const remaining = await db.select().from(equipments)
      expect(remaining).toHaveLength(0)
    })

    it('returns 404 when equipment does not exist', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/equipments/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404)
    })
  })
})
