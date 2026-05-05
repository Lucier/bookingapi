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
(0, vitest_1.describe)('Spaces (e2e)', () => {
    let app;
    let db;
    let adminToken;
    (0, vitest_1.beforeAll)(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api/v1');
        app.useGlobalPipes(new zod_validation_pipe_1.ZodValidationPipe());
        await app.init();
        db = moduleFixture.get(drizzle_provider_1.DRIZZLE);
        await db.delete(index_1.movingEquipment);
        await db.delete(index_1.refreshTokens);
        await db.delete(index_1.equipments);
        await db.delete(index_1.spaces);
        await db.delete(index_1.users);
        const passwordHash = await bcrypt.hash('admin123', 10);
        await db.insert(index_1.users).values({
            name: 'Admin',
            email: 'admin@example.com',
            passwordHash,
            role: 'ADMIN',
        });
        const res = await (0, supertest_1.default)(app.getHttpServer())
            .post('/api/v1/auth/login')
            .send({ email: 'admin@example.com', password: 'admin123' });
        adminToken = res.body.accessToken;
    });
    (0, vitest_1.afterAll)(async () => {
        await app.close();
    });
    (0, vitest_1.beforeEach)(async () => {
        await db.delete(index_1.spaces);
    });
    const seedSpace = async (overrides = {}) => {
        const [space] = await db
            .insert(index_1.spaces)
            .values({
            name: 'Test Space',
            description: 'A test space',
            status: 'active',
            ...overrides,
        })
            .returning();
        return space;
    };
    (0, vitest_1.describe)('GET /api/v1/spaces', () => {
        (0, vitest_1.it)('returns empty array when no spaces exist', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/api/v1/spaces')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            (0, vitest_1.expect)(res.body).toEqual([]);
        });
        (0, vitest_1.it)('returns all spaces', async () => {
            await seedSpace({ name: 'Room A' });
            await seedSpace({ name: 'Room B' });
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/api/v1/spaces')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            (0, vitest_1.expect)(res.body).toHaveLength(2);
            (0, vitest_1.expect)(res.body[0]).toHaveProperty('id');
            (0, vitest_1.expect)(res.body[0]).toHaveProperty('name');
            (0, vitest_1.expect)(res.body[0]).toHaveProperty('status');
            (0, vitest_1.expect)(res.body[0]).toHaveProperty('createdAt');
            (0, vitest_1.expect)(res.body[0]).toHaveProperty('updatedAt');
        });
    });
    (0, vitest_1.describe)('GET /api/v1/spaces/:id', () => {
        (0, vitest_1.it)('returns a space by ID', async () => {
            const space = await seedSpace({ name: 'Room A' });
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get(`/api/v1/spaces/${space.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            (0, vitest_1.expect)(res.body.id).toBe(space.id);
            (0, vitest_1.expect)(res.body.name).toBe('Room A');
        });
        (0, vitest_1.it)('returns 404 when space does not exist', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/api/v1/spaces/00000000-0000-0000-0000-000000000000')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
            (0, vitest_1.expect)(res.body.message).toContain('not found');
        });
    });
    (0, vitest_1.describe)('POST /api/v1/spaces', () => {
        (0, vitest_1.it)('creates a space', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/spaces')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'New Room', description: 'A new room' })
                .expect(201);
            (0, vitest_1.expect)(res.body).toHaveProperty('id');
            (0, vitest_1.expect)(res.body.name).toBe('New Room');
            (0, vitest_1.expect)(res.body.status).toBe('active');
        });
        (0, vitest_1.it)('returns 400 when name is missing', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/spaces')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ description: 'No name' })
                .expect(400);
            (0, vitest_1.expect)(res.body).toHaveProperty('message');
        });
    });
    (0, vitest_1.describe)('PATCH /api/v1/spaces/:id', () => {
        (0, vitest_1.it)('updates and returns the space', async () => {
            const space = await seedSpace({ name: 'Old Name' });
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .patch(`/api/v1/spaces/${space.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'New Name' })
                .expect(200);
            (0, vitest_1.expect)(res.body.name).toBe('New Name');
        });
        (0, vitest_1.it)('returns 404 when space does not exist', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .patch('/api/v1/spaces/00000000-0000-0000-0000-000000000000')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Ghost' })
                .expect(404);
        });
    });
    (0, vitest_1.describe)('DELETE /api/v1/spaces/:id', () => {
        (0, vitest_1.it)('deletes a space and returns 204', async () => {
            const space = await seedSpace();
            await (0, supertest_1.default)(app.getHttpServer())
                .delete(`/api/v1/spaces/${space.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(204);
            const remaining = await db.select().from(index_1.spaces);
            (0, vitest_1.expect)(remaining).toHaveLength(0);
        });
        (0, vitest_1.it)('returns 404 when space does not exist', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .delete('/api/v1/spaces/00000000-0000-0000-0000-000000000000')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        });
    });
});
//# sourceMappingURL=spaces.e2e-spec.js.map