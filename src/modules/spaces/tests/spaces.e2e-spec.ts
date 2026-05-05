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
import { spaces, users, refreshTokens, movingEquipment, equipments } from '../../../database/schema/index'
import type * as dbSchema from '../../../database/schema/index'

type DrizzleDB = PostgresJsDatabase<typeof dbSchema>

describe('Spaces (e2e)', () => {
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

    await db.delete(movingEquipment)
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
    await db.delete(spaces)
  })

  const seedSpace = async (overrides: Partial<typeof spaces.$inferInsert> = {}) => {
    const [space] = await db
      .insert(spaces)
      .values({
        name: 'Test Space',
        description: 'A test space',
        status: 'active',
        ...overrides,
      })
      .returning()
    return space
  }

  describe('GET /api/v1/spaces', () => {
    it('returns empty array when no spaces exist', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/spaces')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
      expect(res.body).toEqual([])
    })

    it('returns all spaces', async () => {
      await seedSpace({ name: 'Room A' })
      await seedSpace({ name: 'Room B' })

      const res = await request(app.getHttpServer())
        .get('/api/v1/spaces')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(res.body).toHaveLength(2)
      expect(res.body[0]).toHaveProperty('id')
      expect(res.body[0]).toHaveProperty('name')
      expect(res.body[0]).toHaveProperty('status')
      expect(res.body[0]).toHaveProperty('createdAt')
      expect(res.body[0]).toHaveProperty('updatedAt')
    })
  })

  describe('GET /api/v1/spaces/:id', () => {
    it('returns a space by ID', async () => {
      const space = await seedSpace({ name: 'Room A' })

      const res = await request(app.getHttpServer())
        .get(`/api/v1/spaces/${space.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(res.body.id).toBe(space.id)
      expect(res.body.name).toBe('Room A')
    })

    it('returns 404 when space does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/spaces/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404)

      expect(res.body.message).toContain('not found')
    })
  })

  describe('POST /api/v1/spaces', () => {
    it('creates a space', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/spaces')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'New Room', description: 'A new room' })
        .expect(201)

      expect(res.body).toHaveProperty('id')
      expect(res.body.name).toBe('New Room')
      expect(res.body.status).toBe('active')
    })

    it('returns 400 when name is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/spaces')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ description: 'No name' })
        .expect(400)

      expect(res.body).toHaveProperty('message')
    })
  })

  describe('PATCH /api/v1/spaces/:id', () => {
    it('updates and returns the space', async () => {
      const space = await seedSpace({ name: 'Old Name' })

      const res = await request(app.getHttpServer())
        .patch(`/api/v1/spaces/${space.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'New Name' })
        .expect(200)

      expect(res.body.name).toBe('New Name')
    })

    it('returns 404 when space does not exist', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/spaces/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Ghost' })
        .expect(404)
    })
  })

  describe('DELETE /api/v1/spaces/:id', () => {
    it('deletes a space and returns 204', async () => {
      const space = await seedSpace()

      await request(app.getHttpServer())
        .delete(`/api/v1/spaces/${space.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204)

      const remaining = await db.select().from(spaces)
      expect(remaining).toHaveLength(0)
    })

    it('returns 404 when space does not exist', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/spaces/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404)
    })
  })
})
