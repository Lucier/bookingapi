"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const vitest_1 = require("vitest");
const common_1 = require("@nestjs/common");
const users_service_1 = require("../services/users.service");
const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    email: 'john@example.com',
    passwordHash: 'hashed_password',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
};
const mockRepo = {
    findAll: vitest_1.vi.fn(),
    findById: vitest_1.vi.fn(),
    update: vitest_1.vi.fn(),
    delete: vitest_1.vi.fn(),
};
(0, vitest_1.describe)('UsersService', () => {
    let service;
    (0, vitest_1.beforeEach)(() => {
        service = new users_service_1.UsersService(mockRepo);
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('findAll', () => {
        (0, vitest_1.it)('returns users without passwordHash', async () => {
            mockRepo.findAll.mockResolvedValue([mockUser]);
            const result = await service.findAll();
            (0, vitest_1.expect)(result).toHaveLength(1);
            (0, vitest_1.expect)(result[0]).not.toHaveProperty('passwordHash');
            (0, vitest_1.expect)(result[0].name).toBe(mockUser.name);
        });
    });
    (0, vitest_1.describe)('findOne', () => {
        (0, vitest_1.it)('returns user without passwordHash', async () => {
            mockRepo.findById.mockResolvedValue(mockUser);
            const result = await service.findOne(mockUser.id);
            (0, vitest_1.expect)(result).not.toHaveProperty('passwordHash');
            (0, vitest_1.expect)(result.email).toBe(mockUser.email);
        });
        (0, vitest_1.it)('throws NotFoundException when user does not exist', async () => {
            mockRepo.findById.mockResolvedValue(undefined);
            await (0, vitest_1.expect)(service.findOne('nonexistent-id')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    (0, vitest_1.describe)('update', () => {
        (0, vitest_1.it)('updates and returns user without passwordHash', async () => {
            const updated = { ...mockUser, name: 'Jane Doe' };
            mockRepo.findById.mockResolvedValue(mockUser);
            mockRepo.update.mockResolvedValue(updated);
            const result = await service.update(mockUser.id, { name: 'Jane Doe' });
            (0, vitest_1.expect)(result.name).toBe('Jane Doe');
            (0, vitest_1.expect)(result).not.toHaveProperty('passwordHash');
        });
        (0, vitest_1.it)('throws NotFoundException when user does not exist', async () => {
            mockRepo.findById.mockResolvedValue(undefined);
            await (0, vitest_1.expect)(service.update('nonexistent-id', {})).rejects.toThrow(common_1.NotFoundException);
        });
    });
    (0, vitest_1.describe)('remove', () => {
        (0, vitest_1.it)('calls delete after confirming user exists', async () => {
            mockRepo.findById.mockResolvedValue(mockUser);
            mockRepo.delete.mockResolvedValue(undefined);
            await service.remove(mockUser.id);
            (0, vitest_1.expect)(mockRepo.delete).toHaveBeenCalledWith(mockUser.id);
        });
        (0, vitest_1.it)('throws NotFoundException when user does not exist', async () => {
            mockRepo.findById.mockResolvedValue(undefined);
            await (0, vitest_1.expect)(service.remove('nonexistent-id')).rejects.toThrow(common_1.NotFoundException);
        });
    });
});
//# sourceMappingURL=users.service.spec.js.map