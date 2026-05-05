import 'reflect-metadata'
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { AppModule } from '../../../app.module'
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe'
import { DRIZZLE } from '../../../database/drizzle.provider'
import { users } from '../../../database/schema/index'
import type * as dbSchema from '../../../database/schema/index'

type DrizzleDB = PostgresJsDatabase<typeof dbSchema>

describe('Users (e2e)', () => {
  let app: INestApplication
  let db: DrizzleDB

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.setGlobalPrefix('api/v1')
    app.useGlobalPipes(new ZodValidationPipe())
    await app.init()

    db = moduleFixture.get<DrizzleDB>(DRIZZLE)
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await db.delete(users)
  })

  const seedUser = async (overrides: Partial<typeof users.$inferInsert> = {}) => {
    const [user] = await db
      .insert(users)
      .values({
        name: 'Test User',
        email: `test-${Math.random().toString(36).slice(2)}@example.com`,
        passwordHash: 'hashed_password',
        ...overrides,
      })
      .returning()
    return user
  }

  describe('GET /api/v1/users', () => {
    it('returns empty array when no users exist', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/users').expect(200)
      expect(res.body).toEqual([])
    })

    it('returns all users without passwordHash', async () => {
      await seedUser({ name: 'Alice', email: 'alice@example.com' })
      await seedUser({ name: 'Bob', email: 'bob@example.com' })

      const res = await request(app.getHttpServer()).get('/api/v1/users').expect(200)

      expect(res.body).toHaveLength(2)
      expect(res.body[0]).not.toHaveProperty('passwordHash')
      expect(res.body[0]).toHaveProperty('id')
      expect(res.body[0]).toHaveProperty('name')
      expect(res.body[0]).toHaveProperty('email')
      expect(res.body[0]).toHaveProperty('createdAt')
      expect(res.body[0]).toHaveProperty('updatedAt')
    })
  })

  describe('GET /api/v1/users/:id', () => {
    it('returns a user by ID without passwordHash', async () => {
      const user = await seedUser({ name: 'Alice', email: 'alice@example.com' })

      const res = await request(app.getHttpServer()).get(`/api/v1/users/${user.id}`).expect(200)

      expect(res.body.id).toBe(user.id)
      expect(res.body.name).toBe('Alice')
      expect(res.body.email).toBe('alice@example.com')
      expect(res.body).not.toHaveProperty('passwordHash')
    })

    it('returns 404 when user does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/users/00000000-0000-0000-0000-000000000000')
        .expect(404)

      expect(res.body.message).toContain('not found')
    })
  })

  describe('PATCH /api/v1/users/:id', () => {
    it('updates and returns the user without passwordHash', async () => {
      const user = await seedUser({ name: 'Alice', email: 'alice@example.com' })

      const res = await request(app.getHttpServer())
        .patch(`/api/v1/users/${user.id}`)
        .send({ name: 'Alice Updated' })
        .expect(200)

      expect(res.body.name).toBe('Alice Updated')
      expect(res.body.email).toBe('alice@example.com')
      expect(res.body).not.toHaveProperty('passwordHash')
    })

    it('returns 400 when Zod blocks an invalid email', async () => {
      const user = await seedUser()

      const res = await request(app.getHttpServer())
        .patch(`/api/v1/users/${user.id}`)
        .send({ email: 'not-a-valid-email' })
        .expect(400)

      expect(res.body).toHaveProperty('message')
    })

    it('returns 404 when user does not exist', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/users/00000000-0000-0000-0000-000000000000')
        .send({ name: 'Ghost' })
        .expect(404)
    })
  })

  describe('DELETE /api/v1/users/:id', () => {
    it('deletes a user and returns 204', async () => {
      const user = await seedUser()

      await request(app.getHttpServer()).delete(`/api/v1/users/${user.id}`).expect(204)

      const remaining = await db.select().from(users)
      expect(remaining).toHaveLength(0)
    })

    it('returns 404 when user does not exist', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/users/00000000-0000-0000-0000-000000000000')
        .expect(404)
    })
  })
})
