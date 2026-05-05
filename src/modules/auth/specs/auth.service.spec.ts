import 'reflect-metadata'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { ConflictException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from '../services/auth.service'
import { AuthRepository } from '../repositories/auth.repository'

const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Test User',
  email: 'test@example.com',
  passwordHash: '$2b$10$hashedpassword',
  role: 'USER' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

const mockRepo = {
  findUserByEmail: vi.fn(),
  findUserById: vi.fn(),
  createUser: vi.fn(),
  saveRefreshToken: vi.fn(),
  findRefreshToken: vi.fn(),
  deleteRefreshToken: vi.fn(),
  deleteUserRefreshTokens: vi.fn(),
}

const mockJwt = {
  sign: vi.fn().mockReturnValue('signed-access-token'),
}

describe('AuthService', () => {
  let service: AuthService

  beforeEach(() => {
    service = new AuthService(
      mockRepo as unknown as AuthRepository,
      mockJwt as unknown as JwtService
    )
    vi.clearAllMocks()
    mockJwt.sign.mockReturnValue('signed-access-token')
    mockRepo.saveRefreshToken.mockResolvedValue(undefined)
  })

  describe('register', () => {
    it('creates user without passing role — role is enforced by the repository', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(undefined)
      mockRepo.createUser.mockResolvedValue(mockUser)

      await service.register({ name: 'Test', email: 'test@example.com', password: 'password123' })

      expect(mockRepo.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test',
          email: 'test@example.com',
          passwordHash: expect.any(String),
        })
      )
      expect(mockRepo.createUser).not.toHaveBeenCalledWith(
        expect.objectContaining({ role: expect.anything() })
      )
    })

    it('hashes the password before storing', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(undefined)
      mockRepo.createUser.mockResolvedValue(mockUser)

      await service.register({ name: 'Test', email: 'test@example.com', password: 'plaintext' })

      const { passwordHash } = mockRepo.createUser.mock.calls[0][0]
      expect(passwordHash).not.toBe('plaintext')
      expect(passwordHash).toMatch(/^\$2b\$/)
    })

    it('throws ConflictException when email is already taken', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(mockUser)

      await expect(
        service.register({ name: 'Test', email: 'test@example.com', password: 'password123' })
      ).rejects.toThrow(ConflictException)
    })

    it('returns accessToken and refreshToken', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(undefined)
      mockRepo.createUser.mockResolvedValue(mockUser)

      const result = await service.register({
        name: 'Test',
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
    })
  })

  describe('login', () => {
    it('throws UnauthorizedException when user is not found', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(undefined)

      await expect(
        service.login({ email: 'unknown@example.com', password: 'pass' })
      ).rejects.toThrow(UnauthorizedException)
    })

    it('throws UnauthorizedException when password is incorrect', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(mockUser)

      await expect(
        service.login({ email: 'test@example.com', password: 'wrong-password' })
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('refresh', () => {
    it('throws UnauthorizedException for unknown token', async () => {
      mockRepo.findRefreshToken.mockResolvedValue(undefined)

      await expect(service.refresh('nonexistent-token')).rejects.toThrow(UnauthorizedException)
    })

    it('throws UnauthorizedException for expired token', async () => {
      mockRepo.findRefreshToken.mockResolvedValue({
        id: 'token-id',
        userId: mockUser.id,
        tokenHash: 'hash',
        expiresAt: new Date('2000-01-01'),
        createdAt: new Date(),
      })

      await expect(service.refresh('expired-token')).rejects.toThrow(UnauthorizedException)
    })
  })
})
