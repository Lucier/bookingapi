import 'reflect-metadata'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { NotFoundException } from '@nestjs/common'
import { UsersService } from '../services/users.service'
import { UsersRepository } from '../repositories/users.repository'

const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'John Doe',
  email: 'john@example.com',
  passwordHash: 'hashed_password',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

const mockRepo = {
  findAll: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

describe('UsersService', () => {
  let service: UsersService

  beforeEach(() => {
    service = new UsersService(mockRepo as unknown as UsersRepository)
    vi.clearAllMocks()
  })

  describe('findAll', () => {
    it('returns users without passwordHash', async () => {
      mockRepo.findAll.mockResolvedValue([mockUser])
      const result = await service.findAll()
      expect(result).toHaveLength(1)
      expect(result[0]).not.toHaveProperty('passwordHash')
      expect(result[0].name).toBe(mockUser.name)
    })
  })

  describe('findOne', () => {
    it('returns user without passwordHash', async () => {
      mockRepo.findById.mockResolvedValue(mockUser)
      const result = await service.findOne(mockUser.id)
      expect(result).not.toHaveProperty('passwordHash')
      expect(result.email).toBe(mockUser.email)
    })

    it('throws NotFoundException when user does not exist', async () => {
      mockRepo.findById.mockResolvedValue(undefined)
      await expect(service.findOne('nonexistent-id')).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    it('updates and returns user without passwordHash', async () => {
      const updated = { ...mockUser, name: 'Jane Doe' }
      mockRepo.findById.mockResolvedValue(mockUser)
      mockRepo.update.mockResolvedValue(updated)
      const result = await service.update(mockUser.id, { name: 'Jane Doe' } as never)
      expect(result.name).toBe('Jane Doe')
      expect(result).not.toHaveProperty('passwordHash')
    })

    it('throws NotFoundException when user does not exist', async () => {
      mockRepo.findById.mockResolvedValue(undefined)
      await expect(service.update('nonexistent-id', {} as never)).rejects.toThrow(NotFoundException)
    })
  })

  describe('remove', () => {
    it('calls delete after confirming user exists', async () => {
      mockRepo.findById.mockResolvedValue(mockUser)
      mockRepo.delete.mockResolvedValue(undefined)
      await service.remove(mockUser.id)
      expect(mockRepo.delete).toHaveBeenCalledWith(mockUser.id)
    })

    it('throws NotFoundException when user does not exist', async () => {
      mockRepo.findById.mockResolvedValue(undefined)
      await expect(service.remove('nonexistent-id')).rejects.toThrow(NotFoundException)
    })
  })
})
