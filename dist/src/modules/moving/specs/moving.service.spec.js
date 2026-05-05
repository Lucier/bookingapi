"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const vitest_1 = require("vitest");
const common_1 = require("@nestjs/common");
const moving_service_1 = require("../services/moving.service");
const baseMovement = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    equipmentId: 'aaa00000-0000-0000-0000-000000000001',
    userId: 'bbb00000-0000-0000-0000-000000000001',
    originSpaceId: null,
    destinationSpaceId: null,
    movementType: 'maintenance',
    description: null,
    movementDate: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    equipmentName: 'Projector',
    originSpaceName: null,
    destinationSpaceName: null,
};
const mockRepo = {
    create: vitest_1.vi.fn(),
    findAll: vitest_1.vi.fn(),
    findById: vitest_1.vi.fn(),
    update: vitest_1.vi.fn(),
    delete: vitest_1.vi.fn(),
    equipmentExists: vitest_1.vi.fn(),
};
(0, vitest_1.describe)('MovingService', () => {
    let service;
    (0, vitest_1.beforeEach)(() => {
        service = new moving_service_1.MovingService(mockRepo);
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('create', () => {
        (0, vitest_1.it)('throws NotFoundException when equipment does not exist', async () => {
            mockRepo.equipmentExists.mockResolvedValue(false);
            await (0, vitest_1.expect)(service.create({ equipmentId: baseMovement.equipmentId, movementType: 'maintenance' }, 'user-id')).rejects.toThrow(common_1.NotFoundException);
        });
        (0, vitest_1.it)('throws BadRequestException for transfer without destinationSpaceId', async () => {
            mockRepo.equipmentExists.mockResolvedValue(true);
            await (0, vitest_1.expect)(service.create({ equipmentId: baseMovement.equipmentId, movementType: 'transfer' }, 'user-id')).rejects.toThrow(common_1.BadRequestException);
        });
        (0, vitest_1.it)('binds userId to the created movement', async () => {
            mockRepo.equipmentExists.mockResolvedValue(true);
            mockRepo.create.mockResolvedValue(baseMovement);
            mockRepo.findById.mockResolvedValue(baseMovement);
            await service.create({ equipmentId: baseMovement.equipmentId, movementType: 'maintenance' }, baseMovement.userId);
            (0, vitest_1.expect)(mockRepo.create).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ userId: baseMovement.userId }));
        });
        (0, vitest_1.it)('creates a transfer movement when destinationSpaceId is provided', async () => {
            const transferMovement = {
                ...baseMovement,
                movementType: 'transfer',
                destinationSpaceId: 'ccc00000-0000-0000-0000-000000000001',
            };
            mockRepo.equipmentExists.mockResolvedValue(true);
            mockRepo.create.mockResolvedValue(transferMovement);
            mockRepo.findById.mockResolvedValue(transferMovement);
            const result = await service.create({
                equipmentId: baseMovement.equipmentId,
                movementType: 'transfer',
                destinationSpaceId: 'ccc00000-0000-0000-0000-000000000001',
            }, baseMovement.userId);
            (0, vitest_1.expect)(result.movementType).toBe('transfer');
        });
    });
    (0, vitest_1.describe)('findAll', () => {
        (0, vitest_1.it)('returns all movements', async () => {
            mockRepo.findAll.mockResolvedValue([baseMovement]);
            const result = await service.findAll();
            (0, vitest_1.expect)(result).toHaveLength(1);
        });
    });
    (0, vitest_1.describe)('findOne', () => {
        (0, vitest_1.it)('returns a movement by id', async () => {
            mockRepo.findById.mockResolvedValue(baseMovement);
            const result = await service.findOne(baseMovement.id);
            (0, vitest_1.expect)(result.id).toBe(baseMovement.id);
        });
        (0, vitest_1.it)('throws NotFoundException when movement does not exist', async () => {
            mockRepo.findById.mockResolvedValue(undefined);
            await (0, vitest_1.expect)(service.findOne('nonexistent')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    (0, vitest_1.describe)('update', () => {
        (0, vitest_1.it)('updates and returns the enriched movement', async () => {
            const updated = { ...baseMovement, description: 'Fixed' };
            mockRepo.findById.mockResolvedValueOnce(baseMovement).mockResolvedValueOnce(updated);
            mockRepo.update.mockResolvedValue(baseMovement);
            const result = await service.update(baseMovement.id, { description: 'Fixed' });
            (0, vitest_1.expect)(result.description).toBe('Fixed');
        });
        (0, vitest_1.it)('throws NotFoundException when movement does not exist', async () => {
            mockRepo.findById.mockResolvedValue(undefined);
            await (0, vitest_1.expect)(service.update('nonexistent', {})).rejects.toThrow(common_1.NotFoundException);
        });
    });
    (0, vitest_1.describe)('remove', () => {
        (0, vitest_1.it)('calls delete after confirming movement exists', async () => {
            mockRepo.findById.mockResolvedValue(baseMovement);
            mockRepo.delete.mockResolvedValue(undefined);
            await service.remove(baseMovement.id);
            (0, vitest_1.expect)(mockRepo.delete).toHaveBeenCalledWith(baseMovement.id);
        });
        (0, vitest_1.it)('throws NotFoundException when movement does not exist', async () => {
            mockRepo.findById.mockResolvedValue(undefined);
            await (0, vitest_1.expect)(service.remove('nonexistent')).rejects.toThrow(common_1.NotFoundException);
        });
    });
});
//# sourceMappingURL=moving.service.spec.js.map