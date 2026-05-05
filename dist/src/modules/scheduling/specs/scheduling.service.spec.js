"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const vitest_1 = require("vitest");
const common_1 = require("@nestjs/common");
const scheduling_service_1 = require("../services/scheduling.service");
const mockSpace = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Room A',
    description: null,
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
};
const mockSchedulingRow = {
    id: '223e4567-e89b-12d3-a456-426614174001',
    userId: '323e4567-e89b-12d3-a456-426614174002',
    spaceId: mockSpace.id,
    activityDescription: 'Team meeting',
    schedulingDate: '2026-05-01',
    startTime: '09:00:00',
    endTime: '10:00:00',
    createdAt: new Date('2026-05-01'),
    updatedAt: new Date('2026-05-01'),
};
const mockDto = {
    spaceId: mockSpace.id,
    activityDescription: 'Team meeting',
    schedulingDate: '2026-05-01',
    startTime: '09:00',
    endTime: '10:00',
};
const userId = '323e4567-e89b-12d3-a456-426614174002';
const mockSchedulingRepo = {
    create: vitest_1.vi.fn(),
    findAll: vitest_1.vi.fn(),
    findById: vitest_1.vi.fn(),
    delete: vitest_1.vi.fn(),
    findOverlapping: vitest_1.vi.fn(),
};
const mockSpacesRepo = {
    findById: vitest_1.vi.fn(),
};
(0, vitest_1.describe)('SchedulingService', () => {
    let service;
    (0, vitest_1.beforeEach)(() => {
        service = new scheduling_service_1.SchedulingService(mockSchedulingRepo, mockSpacesRepo);
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('create', () => {
        (0, vitest_1.it)('creates and returns a scheduling when no overlap exists', async () => {
            mockSpacesRepo.findById.mockResolvedValue(mockSpace);
            mockSchedulingRepo.findOverlapping.mockResolvedValue([]);
            mockSchedulingRepo.create.mockResolvedValue(mockSchedulingRow);
            const result = await service.create(mockDto, userId);
            (0, vitest_1.expect)(result).toEqual(mockSchedulingRow);
            (0, vitest_1.expect)(mockSchedulingRepo.create).toHaveBeenCalledOnce();
            (0, vitest_1.expect)(mockSchedulingRepo.create).toHaveBeenCalledWith({
                ...mockDto,
                userId,
            });
        });
        (0, vitest_1.it)('throws ConflictException when time slot overlaps with existing booking', async () => {
            mockSpacesRepo.findById.mockResolvedValue(mockSpace);
            mockSchedulingRepo.findOverlapping.mockResolvedValue([mockSchedulingRow]);
            await (0, vitest_1.expect)(service.create(mockDto, userId)).rejects.toThrow(common_1.ConflictException);
            (0, vitest_1.expect)(mockSchedulingRepo.create).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)('throws NotFoundException when space does not exist', async () => {
            mockSpacesRepo.findById.mockResolvedValue(undefined);
            await (0, vitest_1.expect)(service.create(mockDto, userId)).rejects.toThrow(common_1.NotFoundException);
            (0, vitest_1.expect)(mockSchedulingRepo.findOverlapping).not.toHaveBeenCalled();
            (0, vitest_1.expect)(mockSchedulingRepo.create).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)('throws ConflictException when space is not active', async () => {
            mockSpacesRepo.findById.mockResolvedValue({
                ...mockSpace,
                status: 'maintenance',
            });
            await (0, vitest_1.expect)(service.create(mockDto, userId)).rejects.toThrow(common_1.ConflictException);
            (0, vitest_1.expect)(mockSchedulingRepo.findOverlapping).not.toHaveBeenCalled();
            (0, vitest_1.expect)(mockSchedulingRepo.create).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)('findAll', () => {
        (0, vitest_1.it)('returns all schedulings', async () => {
            mockSchedulingRepo.findAll.mockResolvedValue([mockSchedulingRow]);
            const result = await service.findAll();
            (0, vitest_1.expect)(result).toHaveLength(1);
            (0, vitest_1.expect)(mockSchedulingRepo.findAll).toHaveBeenCalledOnce();
        });
    });
    (0, vitest_1.describe)('findOne', () => {
        (0, vitest_1.it)('returns scheduling by id', async () => {
            mockSchedulingRepo.findById.mockResolvedValue(mockSchedulingRow);
            const result = await service.findOne(mockSchedulingRow.id);
            (0, vitest_1.expect)(result).toEqual(mockSchedulingRow);
        });
        (0, vitest_1.it)('throws NotFoundException when scheduling does not exist', async () => {
            mockSchedulingRepo.findById.mockResolvedValue(undefined);
            await (0, vitest_1.expect)(service.findOne('nonexistent-id')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    (0, vitest_1.describe)('remove', () => {
        (0, vitest_1.it)('deletes scheduling after confirming it exists', async () => {
            mockSchedulingRepo.findById.mockResolvedValue(mockSchedulingRow);
            mockSchedulingRepo.delete.mockResolvedValue(undefined);
            await service.remove(mockSchedulingRow.id);
            (0, vitest_1.expect)(mockSchedulingRepo.delete).toHaveBeenCalledWith(mockSchedulingRow.id);
        });
        (0, vitest_1.it)('throws NotFoundException when scheduling does not exist', async () => {
            mockSchedulingRepo.findById.mockResolvedValue(undefined);
            await (0, vitest_1.expect)(service.remove('nonexistent-id')).rejects.toThrow(common_1.NotFoundException);
        });
    });
});
//# sourceMappingURL=scheduling.service.spec.js.map