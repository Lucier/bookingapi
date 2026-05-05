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
import {
  scheduling,
  spaces,
  users,
  refreshTokens,
  movingEquipment,
  equipments,
} from '../../../database/schema/index'
import type * as dbSchema from '../../../database/schema/index'

type DrizzleDB = PostgresJsDatabase<typeof dbSchema>

describe('Scheduling (e2e)', () => {
  let app: INestApplication
  let db: DrizzleDB
  let userToken: string
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

    await db.delete(scheduling)
    await db.delete(movingEquipment)
    await db.delete(refreshTokens)
    await db.delete(equipments)
    await db.delete(spaces)
    await db.delete(users)

    const passwordHash = await bcrypt.hash('pass123', 10)
    await db.insert(users).values({
      name: 'Test User',
      email: 'user@example.com',
      passwordHash,
      role: 'USER',
    })

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'user@example.com', password: 'pass123' })

    userToken = loginRes.body.accessToken

    const [space] = await db
      .insert(spaces)
      .values({ name: 'Room A', status: 'active' })
      .returning()

    spaceId = space.id
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await db.delete(scheduling)
  })

  const baseDto = () => ({
    spaceId,
    activityDescription: 'Team meeting',
    schedulingDate: '2026-05-01',
    startTime: '09:00',
    endTime: '10:00',
  })

  describe('POST /api/v1/scheduling', () => {
    it('creates a scheduling and returns 201', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/scheduling')
        .set('Authorization', `Bearer ${userToken}`)
        .send(baseDto())
        .expect(201)

      expect(res.body).toHaveProperty('id')
      expect(res.body.spaceId).toBe(spaceId)
      expect(res.body.activityDescription).toBe('Team meeting')
      expect(res.body.schedulingDate).toBe('2026-05-01')
    })

    it('returns 409 when booking the exact same time slot twice', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/scheduling')
        .set('Authorization', `Bearer ${userToken}`)
        .send(baseDto())
        .expect(201)

      const res = await request(app.getHttpServer())
        .post('/api/v1/scheduling')
        .set('Authorization', `Bearer ${userToken}`)
        .send(baseDto())
        .expect(409)

      expect(res.body.message).toContain('conflicts')
    })

    it('returns 409 for partial time overlap (right side)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/scheduling')
        .set('Authorization', `Bearer ${userToken}`)
        .send(baseDto())
        .expect(201)

      // existing: 09:00-10:00 / new: 09:30-10:30 → overlaps
      await request(app.getHttpServer())
        .post('/api/v1/scheduling')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ...baseDto(), startTime: '09:30', endTime: '10:30' })
        .expect(409)
    })

    it('returns 409 for partial time overlap (left side)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/scheduling')
        .set('Authorization', `Bearer ${userToken}`)
        .send(baseDto())
        .expect(201)

      // existing: 09:00-10:00 / new: 08:30-09:30 → overlaps
      await request(app.getHttpServer())
        .post('/api/v1/scheduling')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ...baseDto(), startTime: '08:30', endTime: '09:30' })
        .expect(409)
    })

    it('allows adjacent time slots (no overlap)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/scheduling')
        .set('Authorization', `Bearer ${userToken}`)
        .send(baseDto())
        .expect(201)

      // 10:00-11:00 is adjacent to 09:00-10:00 — must succeed
      await request(app.getHttpServer())
        .post('/api/v1/scheduling')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ...baseDto(), startTime: '10:00', endTime: '11:00' })
        .expect(201)
    })

    it('returns 400 when startTime is not before endTime', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/scheduling')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ...baseDto(), startTime: '10:00', endTime: '09:00' })
        .expect(400)

      expect(res.body).toHaveProperty('message')
    })

    it('returns 401 without auth token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/scheduling')
        .send(baseDto())
        .expect(401)
    })
  })

  describe('GET /api/v1/scheduling', () => {
    it('returns all schedulings with space and user info', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/scheduling')
        .set('Authorization', `Bearer ${userToken}`)
        .send(baseDto())
        .expect(201)

      const res = await request(app.getHttpServer())
        .get('/api/v1/scheduling')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)

      expect(res.body).toHaveLength(1)
      expect(res.body[0]).toHaveProperty('spaceName', 'Room A')
      expect(res.body[0]).toHaveProperty('userName', 'Test User')
    })

    it('returns empty array when no schedulings exist', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/scheduling')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)

      expect(res.body).toEqual([])
    })
  })

  describe('GET /api/v1/scheduling/:id', () => {
    it('returns scheduling by ID with space and user info', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/v1/scheduling')
        .set('Authorization', `Bearer ${userToken}`)
        .send(baseDto())
        .expect(201)

      const res = await request(app.getHttpServer())
        .get(`/api/v1/scheduling/${createRes.body.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)

      expect(res.body.id).toBe(createRes.body.id)
      expect(res.body).toHaveProperty('spaceName', 'Room A')
      expect(res.body).toHaveProperty('userName', 'Test User')
    })

    it('returns 404 when scheduling does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/scheduling/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404)

      expect(res.body.message).toContain('not found')
    })
  })

  describe('DELETE /api/v1/scheduling/:id', () => {
    it('deletes a scheduling and returns 204', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/v1/scheduling')
        .set('Authorization', `Bearer ${userToken}`)
        .send(baseDto())
        .expect(201)

      await request(app.getHttpServer())
        .delete(`/api/v1/scheduling/${createRes.body.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(204)

      const remaining = await db.select().from(scheduling)
      expect(remaining).toHaveLength(0)
    })

    it('returns 404 when scheduling does not exist', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/scheduling/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404)
    })
  })
})
