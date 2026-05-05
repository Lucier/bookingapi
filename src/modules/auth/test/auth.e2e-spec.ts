import 'reflect-metadata'
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { eq } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { AppModule } from '../../../app.module'
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe'
import { DRIZZLE } from '../../../database/drizzle.provider'
import { users, refreshTokens } from '../../../database/schema/index'
import type * as dbSchema from '../../../database/schema/index'

type DrizzleDB = PostgresJsDatabase<typeof dbSchema>

describe('Auth (e2e)', () => {
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

    await db.delete(refreshTokens)
    await db.delete(users)
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await db.delete(refreshTokens)
    await db.delete(users)
  })

  const registerPayload = {
    name: 'Alice',
    email: 'alice@example.com',
    password: 'password123',
  }

  describe('POST /api/v1/auth/register', () => {
    it('returns 201 with accessToken and refreshToken', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(registerPayload)
        .expect(201)

      expect(res.body).toHaveProperty('accessToken')
      expect(res.body).toHaveProperty('refreshToken')
    })

    it('saves the user with role USER in the database', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(registerPayload)
        .expect(201)

      const [user] = await db.select().from(users).where(eq(users.email, registerPayload.email))
      expect(user).toBeDefined()
      expect(user.role).toBe('USER')
      expect(user.passwordHash).not.toBe(registerPayload.password)
    })

    it('returns 409 when email is already registered', async () => {
      await request(app.getHttpServer()).post('/api/v1/auth/register').send(registerPayload)

      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(registerPayload)
        .expect(409)
    })

    it('returns 400 when password is too short', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ ...registerPayload, password: 'short' })
        .expect(400)
    })
  })

  describe('POST /api/v1/auth/login', () => {
    it('returns 200 with tokens for valid credentials', async () => {
      await request(app.getHttpServer()).post('/api/v1/auth/register').send(registerPayload)

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: registerPayload.email, password: registerPayload.password })
        .expect(200)

      expect(res.body).toHaveProperty('accessToken')
      expect(res.body).toHaveProperty('refreshToken')
    })

    it('returns 401 for wrong password', async () => {
      await request(app.getHttpServer()).post('/api/v1/auth/register').send(registerPayload)

      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: registerPayload.email, password: 'wrong' })
        .expect(401)
    })
  })

  describe('GET /api/v1/auth/me', () => {
    it('returns current user info without passwordHash', async () => {
      const { body: tokens } = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(registerPayload)

      const res = await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .expect(200)

      expect(res.body.email).toBe(registerPayload.email)
      expect(res.body.role).toBe('USER')
      expect(res.body).not.toHaveProperty('passwordHash')
    })

    it('returns 401 without a token', async () => {
      await request(app.getHttpServer()).get('/api/v1/auth/me').expect(401)
    })
  })

  describe('POST /api/v1/auth/refresh', () => {
    it('returns new tokens and invalidates the old refresh token', async () => {
      const { body: first } = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(registerPayload)

      const { body: second } = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: first.refreshToken })
        .expect(200)

      expect(second).toHaveProperty('accessToken')
      expect(second.refreshToken).not.toBe(first.refreshToken)

      // Old refresh token must be rejected
      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: first.refreshToken })
        .expect(401)
    })
  })

  describe('POST /api/v1/auth/logout', () => {
    it('returns 204 and invalidates the refresh token', async () => {
      const { body: tokens } = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(registerPayload)

      await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .send({ refreshToken: tokens.refreshToken })
        .expect(204)

      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: tokens.refreshToken })
        .expect(401)
    })
  })
})
