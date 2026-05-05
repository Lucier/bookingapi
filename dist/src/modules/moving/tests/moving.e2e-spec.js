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
(0, vitest_1.describe)('Moving (e2e)', () => {
    let app;
    let db;
    let adminToken;
    let equipmentId;
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
        await db.delete(index_1.movingEquipment);
        await db.delete(index_1.equipments);
        await db.delete(index_1.spaces);
        await db.delete(index_1.refreshTokens);
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
        const [space] = await db
            .insert(index_1.spaces)
            .values({ name: 'Storage Room', description: 'Storage', status: 'active' })
            .returning();
        spaceId = space.id;
        const [equipment] = await db
            .insert(index_1.equipments)
            .values({
            name: 'Projector X100',
            serialNumber: 'SN-TEST-001',
            conservationStatus: 'good',
        })
            .returning();
        equipmentId = equipment.id;
    });
    (0, vitest_1.afterAll)(async () => {
        await db.delete(index_1.movingEquipment);
        await db.delete(index_1.refreshTokens);
        await db.delete(index_1.equipments);
        await db.delete(index_1.spaces);
        await db.delete(index_1.users);
        await app.close();
    });
    (0, vitest_1.beforeEach)(async () => {
        await db.delete(index_1.movingEquipment);
    });
    (0, vitest_1.describe)('POST /api/v1/moving', () => {
        (0, vitest_1.it)('creates a maintenance movement and returns 201 with joined data', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/moving')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                equipmentId,
                movementType: 'maintenance',
                description: 'Scheduled maintenance',
            })
                .expect(201);
            (0, vitest_1.expect)(res.body).toHaveProperty('id');
            (0, vitest_1.expect)(res.body.equipmentId).toBe(equipmentId);
            (0, vitest_1.expect)(res.body.movementType).toBe('maintenance');
            (0, vitest_1.expect)(res.body.equipmentName).toBe('Projector X100');
        });
        (0, vitest_1.it)('creates a transfer movement with destinationSpaceId', async () => {
            const [destination] = await db
                .insert(index_1.spaces)
                .values({ name: 'Conference Room', status: 'active' })
                .returning();
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/moving')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                equipmentId,
                originSpaceId: spaceId,
                destinationSpaceId: destination.id,
                movementType: 'transfer',
            })
                .expect(201);
            (0, vitest_1.expect)(res.body.movementType).toBe('transfer');
            (0, vitest_1.expect)(res.body.destinationSpaceId).toBe(destination.id);
            (0, vitest_1.expect)(res.body.destinationSpaceName).toBe('Conference Room');
        });
        (0, vitest_1.it)('returns 400 when transfer is missing destinationSpaceId', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/moving')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ equipmentId, movementType: 'transfer' })
                .expect(400);
        });
        (0, vitest_1.it)('returns 404 when equipmentId does not exist', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/moving')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                equipmentId: '00000000-0000-0000-0000-000000000000',
                movementType: 'maintenance',
            })
                .expect(404);
        });
        (0, vitest_1.it)('returns 401 without a token', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/moving')
                .send({ equipmentId, movementType: 'maintenance' })
                .expect(401);
        });
        (0, vitest_1.it)('binds the authenticated userId to the movement', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/moving')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ equipmentId, movementType: 'loan' })
                .expect(201);
            const [record] = await db.select().from(index_1.movingEquipment);
            (0, vitest_1.expect)(record.userId).toBe(res.body.userId);
        });
    });
    (0, vitest_1.describe)('GET /api/v1/moving', () => {
        (0, vitest_1.it)('returns empty array when no movements exist', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/api/v1/moving')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            (0, vitest_1.expect)(res.body).toEqual([]);
        });
        (0, vitest_1.it)('returns all movements with equipment and space names', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/moving')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ equipmentId, movementType: 'maintenance' });
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/api/v1/moving')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            (0, vitest_1.expect)(res.body).toHaveLength(1);
            (0, vitest_1.expect)(res.body[0]).toHaveProperty('equipmentName');
            (0, vitest_1.expect)(res.body[0].equipmentName).toBe('Projector X100');
        });
    });
    (0, vitest_1.describe)('GET /api/v1/moving/:id', () => {
        (0, vitest_1.it)('returns a movement by ID', async () => {
            const created = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/moving')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ equipmentId, movementType: 'maintenance' });
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get(`/api/v1/moving/${created.body.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            (0, vitest_1.expect)(res.body.id).toBe(created.body.id);
        });
        (0, vitest_1.it)('returns 404 when movement does not exist', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .get('/api/v1/moving/00000000-0000-0000-0000-000000000000')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        });
    });
    (0, vitest_1.describe)('PATCH /api/v1/moving/:id', () => {
        (0, vitest_1.it)('updates the description of a movement', async () => {
            const created = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/moving')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ equipmentId, movementType: 'maintenance' });
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .patch(`/api/v1/moving/${created.body.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ description: 'Corrected description' })
                .expect(200);
            (0, vitest_1.expect)(res.body.description).toBe('Corrected description');
        });
        (0, vitest_1.it)('returns 404 when movement does not exist', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .patch('/api/v1/moving/00000000-0000-0000-0000-000000000000')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ description: 'Ghost' })
                .expect(404);
        });
    });
    (0, vitest_1.describe)('DELETE /api/v1/moving/:id', () => {
        (0, vitest_1.it)('deletes a movement and returns 204', async () => {
            const created = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/moving')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ equipmentId, movementType: 'write-off' });
            await (0, supertest_1.default)(app.getHttpServer())
                .delete(`/api/v1/moving/${created.body.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(204);
            const remaining = await db.select().from(index_1.movingEquipment);
            (0, vitest_1.expect)(remaining).toHaveLength(0);
        });
        (0, vitest_1.it)('returns 404 when movement does not exist', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .delete('/api/v1/moving/00000000-0000-0000-0000-000000000000')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        });
    });
});
//# sourceMappingURL=moving.e2e-spec.js.map