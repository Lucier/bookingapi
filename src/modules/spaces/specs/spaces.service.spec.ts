import 'reflect-metadata'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { NotFoundException } from '@nestjs/common'
import { SpacesService } from '../services/spaces.service'
import { SpacesRepository } from '../repositories/spaces.repository'

const mockSpace = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Conference Room A',
  description: 'Main conference room',
  status: 'active' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

const mockRepo = {
  create: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

describe('SpacesService', () => {
  let service: SpacesService

  beforeEach(() => {
    service = new SpacesService(mockRepo as unknown as SpacesRepository)
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('creates and returns a space', async () => {
      mockRepo.create.mockResolvedValue(mockSpace)
      const result = await service.create({ name: 'Conference Room A' } as never)
      expect(result).toEqual(mockSpace)
      expect(mockRepo.create).toHaveBeenCalledOnce()
    })
  })

  describe('findAll', () => {
    it('returns all spaces', async () => {
      mockRepo.findAll.mockResolvedValue([mockSpace])
      const result = await service.findAll()
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe(mockSpace.name)
    })
  })

  describe('findOne', () => {
    it('returns a space by id', async () => {
      mockRepo.findById.mockResolvedValue(mockSpace)
      const result = await service.findOne(mockSpace.id)
      expect(result).toEqual(mockSpace)
    })

    it('throws NotFoundException when space does not exist', async () => {
      mockRepo.findById.mockResolvedValue(undefined)
      await expect(service.findOne('nonexistent-id')).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    it('updates and returns the space', async () => {
      const updated = { ...mockSpace, name: 'Updated Room' }
      mockRepo.findById.mockResolvedValue(mockSpace)
      mockRepo.update.mockResolvedValue(updated)
      const result = await service.update(mockSpace.id, { name: 'Updated Room' } as never)
      expect(result.name).toBe('Updated Room')
    })

    it('throws NotFoundException when space does not exist', async () => {
      mockRepo.findById.mockResolvedValue(undefined)
      await expect(service.update('nonexistent-id', {} as never)).rejects.toThrow(NotFoundException)
    })
  })

  describe('remove', () => {
    it('calls delete after confirming space exists', async () => {
      mockRepo.findById.mockResolvedValue(mockSpace)
      mockRepo.delete.mockResolvedValue(undefined)
      await service.remove(mockSpace.id)
      expect(mockRepo.delete).toHaveBeenCalledWith(mockSpace.id)
    })

    it('throws NotFoundException when space does not exist', async () => {
      mockRepo.findById.mockResolvedValue(undefined)
      await expect(service.remove('nonexistent-id')).rejects.toThrow(NotFoundException)
    })
  })
})
