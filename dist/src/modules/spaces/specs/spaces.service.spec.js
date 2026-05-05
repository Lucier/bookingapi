"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const vitest_1 = require("vitest");
const common_1 = require("@nestjs/common");
const spaces_service_1 = require("../services/spaces.service");
const mockSpace = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Conference Room A',
    description: 'Main conference room',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
};
const mockRepo = {
    create: vitest_1.vi.fn(),
    findAll: vitest_1.vi.fn(),
    findById: vitest_1.vi.fn(),
    update: vitest_1.vi.fn(),
    delete: vitest_1.vi.fn(),
};
(0, vitest_1.describe)('SpacesService', () => {
    let service;
    (0, vitest_1.beforeEach)(() => {
        service = new spaces_service_1.SpacesService(mockRepo);
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('create', () => {
        (0, vitest_1.it)('creates and returns a space', async () => {
            mockRepo.create.mockResolvedValue(mockSpace);
            const result = await service.create({ name: 'Conference Room A' });
            (0, vitest_1.expect)(result).toEqual(mockSpace);
            (0, vitest_1.expect)(mockRepo.create).toHaveBeenCalledOnce();
        });
    });
    (0, vitest_1.describe)('findAll', () => {
        (0, vitest_1.it)('returns all spaces', async () => {
            mockRepo.findAll.mockResolvedValue([mockSpace]);
            const result = await service.findAll();
            (0, vitest_1.expect)(result).toHaveLength(1);
            (0, vitest_1.expect)(result[0].name).toBe(mockSpace.name);
        });
    });
    (0, vitest_1.describe)('findOne', () => {
        (0, vitest_1.it)('returns a space by id', async () => {
            mockRepo.findById.mockResolvedValue(mockSpace);
            const result = await service.findOne(mockSpace.id);
            (0, vitest_1.expect)(result).toEqual(mockSpace);
        });
        (0, vitest_1.it)('throws NotFoundException when space does not exist', async () => {
            mockRepo.findById.mockResolvedValue(undefined);
            await (0, vitest_1.expect)(service.findOne('nonexistent-id')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    (0, vitest_1.describe)('update', () => {
        (0, vitest_1.it)('updates and returns the space', async () => {
            const updated = { ...mockSpace, name: 'Updated Room' };
            mockRepo.findById.mockResolvedValue(mockSpace);
            mockRepo.update.mockResolvedValue(updated);
            const result = await service.update(mockSpace.id, { name: 'Updated Room' });
            (0, vitest_1.expect)(result.name).toBe('Updated Room');
        });
        (0, vitest_1.it)('throws NotFoundException when space does not exist', async () => {
            mockRepo.findById.mockResolvedValue(undefined);
            await (0, vitest_1.expect)(service.update('nonexistent-id', {})).rejects.toThrow(common_1.NotFoundException);
        });
    });
    (0, vitest_1.describe)('remove', () => {
        (0, vitest_1.it)('calls delete after confirming space exists', async () => {
            mockRepo.findById.mockResolvedValue(mockSpace);
            mockRepo.delete.mockResolvedValue(undefined);
            await service.remove(mockSpace.id);
            (0, vitest_1.expect)(mockRepo.delete).toHaveBeenCalledWith(mockSpace.id);
        });
        (0, vitest_1.it)('throws NotFoundException when space does not exist', async () => {
            mockRepo.findById.mockResolvedValue(undefined);
            await (0, vitest_1.expect)(service.remove('nonexistent-id')).rejects.toThrow(common_1.NotFoundException);
        });
    });
});
//# sourceMappingURL=spaces.service.spec.js.map