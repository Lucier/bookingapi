"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const vitest_1 = require("vitest");
const testing_1 = require("@nestjs/testing");
const supertest_1 = require("supertest");
const app_module_1 = require("../../../app.module");
const zod_validation_pipe_1 = require("../../../common/pipes/zod-validation.pipe");
const drizzle_provider_1 = require("../../../database/drizzle.provider");
const index_1 = require("../../../database/schema/index");
(0, vitest_1.describe)('Users (e2e)', () => {
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
    });
    (0, vitest_1.afterAll)(async () => {
        await app.close();
    });
    (0, vitest_1.beforeEach)(async () => {
        await db.delete(index_1.users);
    });
    const seedUser = async (overrides = {}) => {
        const [user] = await db
            .insert(index_1.users)
            .values({
            name: 'Test User',
            email: `test-${Math.random().toString(36).slice(2)}@example.com`,
            passwordHash: 'hashed_password',
            ...overrides,
        })
            .returning();
        return user;
    };
    (0, vitest_1.describe)('GET /api/v1/users', () => {
        (0, vitest_1.it)('returns empty array when no users exist', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer()).get('/api/v1/users').expect(200);
            (0, vitest_1.expect)(res.body).toEqual([]);
        });
        (0, vitest_1.it)('returns all users without passwordHash', async () => {
            await seedUser({ name: 'Alice', email: 'alice@example.com' });
            await seedUser({ name: 'Bob', email: 'bob@example.com' });
            const res = await (0, supertest_1.default)(app.getHttpServer()).get('/api/v1/users').expect(200);
            (0, vitest_1.expect)(res.body).toHaveLength(2);
            (0, vitest_1.expect)(res.body[0]).not.toHaveProperty('passwordHash');
            (0, vitest_1.expect)(res.body[0]).toHaveProperty('id');
            (0, vitest_1.expect)(res.body[0]).toHaveProperty('name');
            (0, vitest_1.expect)(res.body[0]).toHaveProperty('email');
            (0, vitest_1.expect)(res.body[0]).toHaveProperty('createdAt');
            (0, vitest_1.expect)(res.body[0]).toHaveProperty('updatedAt');
        });
    });
    (0, vitest_1.describe)('GET /api/v1/users/:id', () => {
        (0, vitest_1.it)('returns a user by ID without passwordHash', async () => {
            const user = await seedUser({ name: 'Alice', email: 'alice@example.com' });
            const res = await (0, supertest_1.default)(app.getHttpServer()).get(`/api/v1/users/${user.id}`).expect(200);
            (0, vitest_1.expect)(res.body.id).toBe(user.id);
            (0, vitest_1.expect)(res.body.name).toBe('Alice');
            (0, vitest_1.expect)(res.body.email).toBe('alice@example.com');
            (0, vitest_1.expect)(res.body).not.toHaveProperty('passwordHash');
        });
        (0, vitest_1.it)('returns 404 when user does not exist', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/api/v1/users/00000000-0000-0000-0000-000000000000')
                .expect(404);
            (0, vitest_1.expect)(res.body.message).toContain('not found');
        });
    });
    (0, vitest_1.describe)('PATCH /api/v1/users/:id', () => {
        (0, vitest_1.it)('updates and returns the user without passwordHash', async () => {
            const user = await seedUser({ name: 'Alice', email: 'alice@example.com' });
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .patch(`/api/v1/users/${user.id}`)
                .send({ name: 'Alice Updated' })
                .expect(200);
            (0, vitest_1.expect)(res.body.name).toBe('Alice Updated');
            (0, vitest_1.expect)(res.body.email).toBe('alice@example.com');
            (0, vitest_1.expect)(res.body).not.toHaveProperty('passwordHash');
        });
        (0, vitest_1.it)('returns 400 when Zod blocks an invalid email', async () => {
            const user = await seedUser();
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .patch(`/api/v1/users/${user.id}`)
                .send({ email: 'not-a-valid-email' })
                .expect(400);
            (0, vitest_1.expect)(res.body).toHaveProperty('message');
        });
        (0, vitest_1.it)('returns 404 when user does not exist', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .patch('/api/v1/users/00000000-0000-0000-0000-000000000000')
                .send({ name: 'Ghost' })
                .expect(404);
        });
    });
    (0, vitest_1.describe)('DELETE /api/v1/users/:id', () => {
        (0, vitest_1.it)('deletes a user and returns 204', async () => {
            const user = await seedUser();
            await (0, supertest_1.default)(app.getHttpServer()).delete(`/api/v1/users/${user.id}`).expect(204);
            const remaining = await db.select().from(index_1.users);
            (0, vitest_1.expect)(remaining).toHaveLength(0);
        });
        (0, vitest_1.it)('returns 404 when user does not exist', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .delete('/api/v1/users/00000000-0000-0000-0000-000000000000')
                .expect(404);
        });
    });
});
//# sourceMappingURL=users.e2e-spec.js.map