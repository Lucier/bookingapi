"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const vitest_1 = require("vitest");
const testing_1 = require("@nestjs/testing");
const supertest_1 = require("supertest");
const drizzle_orm_1 = require("drizzle-orm");
const app_module_1 = require("../../../app.module");
const zod_validation_pipe_1 = require("../../../common/pipes/zod-validation.pipe");
const drizzle_provider_1 = require("../../../database/drizzle.provider");
const index_1 = require("../../../database/schema/index");
(0, vitest_1.describe)('Auth (e2e)', () => {
    let app;
    let db;
    (0, vitest_1.beforeAll)(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api/v1');
        app.useGlobalPipes(new zod_validation_pipe_1.ZodValidationPipe());
        await app.init();
        db = moduleFixture.get(drizzle_provider_1.DRIZZLE);
        await db.delete(index_1.refreshTokens);
        await db.delete(index_1.users);
    });
    (0, vitest_1.afterAll)(async () => {
        await app.close();
    });
    (0, vitest_1.beforeEach)(async () => {
        await db.delete(index_1.refreshTokens);
        await db.delete(index_1.users);
    });
    const registerPayload = {
        name: 'Alice',
        email: 'alice@example.com',
        password: 'password123',
    };
    (0, vitest_1.describe)('POST /api/v1/auth/register', () => {
        (0, vitest_1.it)('returns 201 with accessToken and refreshToken', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/auth/register')
                .send(registerPayload)
                .expect(201);
            (0, vitest_1.expect)(res.body).toHaveProperty('accessToken');
            (0, vitest_1.expect)(res.body).toHaveProperty('refreshToken');
        });
        (0, vitest_1.it)('saves the user with role USER in the database', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/auth/register')
                .send(registerPayload)
                .expect(201);
            const [user] = await db.select().from(index_1.users).where((0, drizzle_orm_1.eq)(index_1.users.email, registerPayload.email));
            (0, vitest_1.expect)(user).toBeDefined();
            (0, vitest_1.expect)(user.role).toBe('USER');
            (0, vitest_1.expect)(user.passwordHash).not.toBe(registerPayload.password);
        });
        (0, vitest_1.it)('returns 409 when email is already registered', async () => {
            await (0, supertest_1.default)(app.getHttpServer()).post('/api/v1/auth/register').send(registerPayload);
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/auth/register')
                .send(registerPayload)
                .expect(409);
        });
        (0, vitest_1.it)('returns 400 when password is too short', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/auth/register')
                .send({ ...registerPayload, password: 'short' })
                .expect(400);
        });
    });
    (0, vitest_1.describe)('POST /api/v1/auth/login', () => {
        (0, vitest_1.it)('returns 200 with tokens for valid credentials', async () => {
            await (0, supertest_1.default)(app.getHttpServer()).post('/api/v1/auth/register').send(registerPayload);
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/auth/login')
                .send({ email: registerPayload.email, password: registerPayload.password })
                .expect(200);
            (0, vitest_1.expect)(res.body).toHaveProperty('accessToken');
            (0, vitest_1.expect)(res.body).toHaveProperty('refreshToken');
        });
        (0, vitest_1.it)('returns 401 for wrong password', async () => {
            await (0, supertest_1.default)(app.getHttpServer()).post('/api/v1/auth/register').send(registerPayload);
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/auth/login')
                .send({ email: registerPayload.email, password: 'wrong' })
                .expect(401);
        });
    });
    (0, vitest_1.describe)('GET /api/v1/auth/me', () => {
        (0, vitest_1.it)('returns current user info without passwordHash', async () => {
            const { body: tokens } = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/auth/register')
                .send(registerPayload);
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${tokens.accessToken}`)
                .expect(200);
            (0, vitest_1.expect)(res.body.email).toBe(registerPayload.email);
            (0, vitest_1.expect)(res.body.role).toBe('USER');
            (0, vitest_1.expect)(res.body).not.toHaveProperty('passwordHash');
        });
        (0, vitest_1.it)('returns 401 without a token', async () => {
            await (0, supertest_1.default)(app.getHttpServer()).get('/api/v1/auth/me').expect(401);
        });
    });
    (0, vitest_1.describe)('POST /api/v1/auth/refresh', () => {
        (0, vitest_1.it)('returns new tokens and invalidates the old refresh token', async () => {
            const { body: first } = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/auth/register')
                .send(registerPayload);
            const { body: second } = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/auth/refresh')
                .send({ refreshToken: first.refreshToken })
                .expect(200);
            (0, vitest_1.expect)(second).toHaveProperty('accessToken');
            (0, vitest_1.expect)(second.refreshToken).not.toBe(first.refreshToken);
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/auth/refresh')
                .send({ refreshToken: first.refreshToken })
                .expect(401);
        });
    });
    (0, vitest_1.describe)('POST /api/v1/auth/logout', () => {
        (0, vitest_1.it)('returns 204 and invalidates the refresh token', async () => {
            const { body: tokens } = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/auth/register')
                .send(registerPayload);
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/auth/logout')
                .send({ refreshToken: tokens.refreshToken })
                .expect(204);
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/auth/refresh')
                .send({ refreshToken: tokens.refreshToken })
                .expect(401);
        });
    });
});
//# sourceMappingURL=auth.e2e-spec.js.map