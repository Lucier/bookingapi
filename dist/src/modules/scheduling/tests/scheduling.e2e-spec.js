"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const vitest_1 = require("vitest");
const testing_1 = require("@nestjs/testing");
const supertest_1 = require("supertest");
const bcrypt = require("bcrypt");
const app_module_1 = require("../../../app.module");
const zod_validation_pipe_1 = require("../../../common/pipes/zod-validation.pipe");
const drizzle_provider_1 = require("../../../database/drizzle.provider");
const index_1 = require("../../../database/schema/index");
(0, vitest_1.describe)('Scheduling (e2e)', () => {
    let app;
    let db;
    let userToken;
    let spaceId;
    (0, vitest_1.beforeAll)(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api/v1');
        app.useGlobalPipes(new zod_validation_pipe_1.ZodValidationPipe());
        await app.init();
        db = moduleFixture.get(drizzle_provider_1.DRIZZLE);
        await db.delete(index_1.scheduling);
        await db.delete(index_1.movingEquipment);
        await db.delete(index_1.refreshTokens);
        await db.delete(index_1.equipments);
        await db.delete(index_1.spaces);
        await db.delete(index_1.users);
        const passwordHash = await bcrypt.hash('pass123', 10);
        await db.insert(index_1.users).values({
            name: 'Test User',
            email: 'user@example.com',
            passwordHash,
            role: 'USER',
        });
        const loginRes = await (0, supertest_1.default)(app.getHttpServer())
            .post('/api/v1/auth/login')
            .send({ email: 'user@example.com', password: 'pass123' });
        userToken = loginRes.body.accessToken;
        const [space] = await db
            .insert(index_1.spaces)
            .values({ name: 'Room A', status: 'active' })
            .returning();
        spaceId = space.id;
    });
    (0, vitest_1.afterAll)(async () => {
        await app.close();
    });
    (0, vitest_1.beforeEach)(async () => {
        await db.delete(index_1.scheduling);
    });
    const baseDto = () => ({
        spaceId,
        activityDescription: 'Team meeting',
        schedulingDate: '2026-05-01',
        startTime: '09:00',
        endTime: '10:00',
    });
    (0, vitest_1.describe)('POST /api/v1/scheduling', () => {
        (0, vitest_1.it)('creates a scheduling and returns 201', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/scheduling')
                .set('Authorization', `Bearer ${userToken}`)
                .send(baseDto())
                .expect(201);
            (0, vitest_1.expect)(res.body).toHaveProperty('id');
            (0, vitest_1.expect)(res.body.spaceId).toBe(spaceId);
            (0, vitest_1.expect)(res.body.activityDescription).toBe('Team meeting');
            (0, vitest_1.expect)(res.body.schedulingDate).toBe('2026-05-01');
        });
        (0, vitest_1.it)('returns 409 when booking the exact same time slot twice', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/scheduling')
                .set('Authorization', `Bearer ${userToken}`)
                .send(baseDto())
                .expect(201);
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/scheduling')
                .set('Authorization', `Bearer ${userToken}`)
                .send(baseDto())
                .expect(409);
            (0, vitest_1.expect)(res.body.message).toContain('conflicts');
        });
        (0, vitest_1.it)('returns 409 for partial time overlap (right side)', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/scheduling')
                .set('Authorization', `Bearer ${userToken}`)
                .send(baseDto())
                .expect(201);
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/scheduling')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ ...baseDto(), startTime: '09:30', endTime: '10:30' })
                .expect(409);
        });
        (0, vitest_1.it)('returns 409 for partial time overlap (left side)', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/scheduling')
                .set('Authorization', `Bearer ${userToken}`)
                .send(baseDto())
                .expect(201);
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/scheduling')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ ...baseDto(), startTime: '08:30', endTime: '09:30' })
                .expect(409);
        });
        (0, vitest_1.it)('allows adjacent time slots (no overlap)', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/scheduling')
                .set('Authorization', `Bearer ${userToken}`)
                .send(baseDto())
                .expect(201);
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/scheduling')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ ...baseDto(), startTime: '10:00', endTime: '11:00' })
                .expect(201);
        });
        (0, vitest_1.it)('returns 400 when startTime is not before endTime', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/scheduling')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ ...baseDto(), startTime: '10:00', endTime: '09:00' })
                .expect(400);
            (0, vitest_1.expect)(res.body).toHaveProperty('message');
        });
        (0, vitest_1.it)('returns 401 without auth token', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/scheduling')
                .send(baseDto())
                .expect(401);
        });
    });
    (0, vitest_1.describe)('GET /api/v1/scheduling', () => {
        (0, vitest_1.it)('returns all schedulings with space and user info', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/scheduling')
                .set('Authorization', `Bearer ${userToken}`)
                .send(baseDto())
                .expect(201);
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/api/v1/scheduling')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);
            (0, vitest_1.expect)(res.body).toHaveLength(1);
            (0, vitest_1.expect)(res.body[0]).toHaveProperty('spaceName', 'Room A');
            (0, vitest_1.expect)(res.body[0]).toHaveProperty('userName', 'Test User');
        });
        (0, vitest_1.it)('returns empty array when no schedulings exist', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/api/v1/scheduling')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);
            (0, vitest_1.expect)(res.body).toEqual([]);
        });
    });
    (0, vitest_1.describe)('GET /api/v1/scheduling/:id', () => {
        (0, vitest_1.it)('returns scheduling by ID with space and user info', async () => {
            const createRes = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/scheduling')
                .set('Authorization', `Bearer ${userToken}`)
                .send(baseDto())
                .expect(201);
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get(`/api/v1/scheduling/${createRes.body.id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);
            (0, vitest_1.expect)(res.body.id).toBe(createRes.body.id);
            (0, vitest_1.expect)(res.body).toHaveProperty('spaceName', 'Room A');
            (0, vitest_1.expect)(res.body).toHaveProperty('userName', 'Test User');
        });
        (0, vitest_1.it)('returns 404 when scheduling does not exist', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/api/v1/scheduling/00000000-0000-0000-0000-000000000000')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(404);
            (0, vitest_1.expect)(res.body.message).toContain('not found');
        });
    });
    (0, vitest_1.describe)('DELETE /api/v1/scheduling/:id', () => {
        (0, vitest_1.it)('deletes a scheduling and returns 204', async () => {
            const createRes = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/scheduling')
                .set('Authorization', `Bearer ${userToken}`)
                .send(baseDto())
                .expect(201);
            await (0, supertest_1.default)(app.getHttpServer())
                .delete(`/api/v1/scheduling/${createRes.body.id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(204);
            const remaining = await db.select().from(index_1.scheduling);
            (0, vitest_1.expect)(remaining).toHaveLength(0);
        });
        (0, vitest_1.it)('returns 404 when scheduling does not exist', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .delete('/api/v1/scheduling/00000000-0000-0000-0000-000000000000')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(404);
        });
    });
});
//# sourceMappingURL=scheduling.e2e-spec.js.map