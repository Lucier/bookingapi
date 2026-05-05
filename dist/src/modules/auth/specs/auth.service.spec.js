"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const vitest_1 = require("vitest");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../services/auth.service");
const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test User',
    email: 'test@example.com',
    passwordHash: '$2b$10$hashedpassword',
    role: 'USER',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
};
const mockRepo = {
    findUserByEmail: vitest_1.vi.fn(),
    findUserById: vitest_1.vi.fn(),
    createUser: vitest_1.vi.fn(),
    saveRefreshToken: vitest_1.vi.fn(),
    findRefreshToken: vitest_1.vi.fn(),
    deleteRefreshToken: vitest_1.vi.fn(),
    deleteUserRefreshTokens: vitest_1.vi.fn(),
};
const mockJwt = {
    sign: vitest_1.vi.fn().mockReturnValue('signed-access-token'),
};
(0, vitest_1.describe)('AuthService', () => {
    let service;
    (0, vitest_1.beforeEach)(() => {
        service = new auth_service_1.AuthService(mockRepo, mockJwt);
        vitest_1.vi.clearAllMocks();
        mockJwt.sign.mockReturnValue('signed-access-token');
        mockRepo.saveRefreshToken.mockResolvedValue(undefined);
    });
    (0, vitest_1.describe)('register', () => {
        (0, vitest_1.it)('creates user without passing role — role is enforced by the repository', async () => {
            mockRepo.findUserByEmail.mockResolvedValue(undefined);
            mockRepo.createUser.mockResolvedValue(mockUser);
            await service.register({ name: 'Test', email: 'test@example.com', password: 'password123' });
            (0, vitest_1.expect)(mockRepo.createUser).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                name: 'Test',
                email: 'test@example.com',
                passwordHash: vitest_1.expect.any(String),
            }));
            (0, vitest_1.expect)(mockRepo.createUser).not.toHaveBeenCalledWith(vitest_1.expect.objectContaining({ role: vitest_1.expect.anything() }));
        });
        (0, vitest_1.it)('hashes the password before storing', async () => {
            mockRepo.findUserByEmail.mockResolvedValue(undefined);
            mockRepo.createUser.mockResolvedValue(mockUser);
            await service.register({ name: 'Test', email: 'test@example.com', password: 'plaintext' });
            const { passwordHash } = mockRepo.createUser.mock.calls[0][0];
            (0, vitest_1.expect)(passwordHash).not.toBe('plaintext');
            (0, vitest_1.expect)(passwordHash).toMatch(/^\$2b\$/);
        });
        (0, vitest_1.it)('throws ConflictException when email is already taken', async () => {
            mockRepo.findUserByEmail.mockResolvedValue(mockUser);
            await (0, vitest_1.expect)(service.register({ name: 'Test', email: 'test@example.com', password: 'password123' })).rejects.toThrow(common_1.ConflictException);
        });
        (0, vitest_1.it)('returns accessToken and refreshToken', async () => {
            mockRepo.findUserByEmail.mockResolvedValue(undefined);
            mockRepo.createUser.mockResolvedValue(mockUser);
            const result = await service.register({
                name: 'Test',
                email: 'test@example.com',
                password: 'password123',
            });
            (0, vitest_1.expect)(result).toHaveProperty('accessToken');
            (0, vitest_1.expect)(result).toHaveProperty('refreshToken');
        });
    });
    (0, vitest_1.describe)('login', () => {
        (0, vitest_1.it)('throws UnauthorizedException when user is not found', async () => {
            mockRepo.findUserByEmail.mockResolvedValue(undefined);
            await (0, vitest_1.expect)(service.login({ email: 'unknown@example.com', password: 'pass' })).rejects.toThrow(common_1.UnauthorizedException);
        });
        (0, vitest_1.it)('throws UnauthorizedException when password is incorrect', async () => {
            mockRepo.findUserByEmail.mockResolvedValue(mockUser);
            await (0, vitest_1.expect)(service.login({ email: 'test@example.com', password: 'wrong-password' })).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
    (0, vitest_1.describe)('refresh', () => {
        (0, vitest_1.it)('throws UnauthorizedException for unknown token', async () => {
            mockRepo.findRefreshToken.mockResolvedValue(undefined);
            await (0, vitest_1.expect)(service.refresh('nonexistent-token')).rejects.toThrow(common_1.UnauthorizedException);
        });
        (0, vitest_1.it)('throws UnauthorizedException for expired token', async () => {
            mockRepo.findRefreshToken.mockResolvedValue({
                id: 'token-id',
                userId: mockUser.id,
                tokenHash: 'hash',
                expiresAt: new Date('2000-01-01'),
                createdAt: new Date(),
            });
            await (0, vitest_1.expect)(service.refresh('expired-token')).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map