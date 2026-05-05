import 'reflect-metadata'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { NotFoundException, ConflictException } from '@nestjs/common'
import { SchedulingService } from '../services/scheduling.service'
import { SchedulingRepository } from '../repositories/scheduling.repository'
import { SpacesRepository } from '../../spaces/repositories/spaces.repository'

const mockSpace = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Room A',
  description: null,
  status: 'active' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

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
}

const mockDto = {
  spaceId: mockSpace.id,
  activityDescription: 'Team meeting',
  schedulingDate: '2026-05-01',
  startTime: '09:00',
  endTime: '10:00',
}

const userId = '323e4567-e89b-12d3-a456-426614174002'

const mockSchedulingRepo = {
  create: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  delete: vi.fn(),
  findOverlapping: vi.fn(),
}

const mockSpacesRepo = {
  findById: vi.fn(),
}

describe('SchedulingService', () => {
  let service: SchedulingService

  beforeEach(() => {
    service = new SchedulingService(
      mockSchedulingRepo as unknown as SchedulingRepository,
      mockSpacesRepo as unknown as SpacesRepository,
    )
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('creates and returns a scheduling when no overlap exists', async () => {
      mockSpacesRepo.findById.mockResolvedValue(mockSpace)
      mockSchedulingRepo.findOverlapping.mockResolvedValue([])
      mockSchedulingRepo.create.mockResolvedValue(mockSchedulingRow)

      const result = await service.create(mockDto as never, userId)

      expect(result).toEqual(mockSchedulingRow)
      expect(mockSchedulingRepo.create).toHaveBeenCalledOnce()
      expect(mockSchedulingRepo.create).toHaveBeenCalledWith({
        ...mockDto,
        userId,
      })
    })

    it('throws ConflictException when time slot overlaps with existing booking', async () => {
      mockSpacesRepo.findById.mockResolvedValue(mockSpace)
      mockSchedulingRepo.findOverlapping.mockResolvedValue([mockSchedulingRow])

      await expect(service.create(mockDto as never, userId)).rejects.toThrow(
        ConflictException,
      )
      expect(mockSchedulingRepo.create).not.toHaveBeenCalled()
    })

    it('throws NotFoundException when space does not exist', async () => {
      mockSpacesRepo.findById.mockResolvedValue(undefined)

      await expect(service.create(mockDto as never, userId)).rejects.toThrow(
        NotFoundException,
      )
      expect(mockSchedulingRepo.findOverlapping).not.toHaveBeenCalled()
      expect(mockSchedulingRepo.create).not.toHaveBeenCalled()
    })

    it('throws ConflictException when space is not active', async () => {
      mockSpacesRepo.findById.mockResolvedValue({
        ...mockSpace,
        status: 'maintenance' as const,
      })

      await expect(service.create(mockDto as never, userId)).rejects.toThrow(
        ConflictException,
      )
      expect(mockSchedulingRepo.findOverlapping).not.toHaveBeenCalled()
      expect(mockSchedulingRepo.create).not.toHaveBeenCalled()
    })
  })

  describe('findAll', () => {
    it('returns all schedulings', async () => {
      mockSchedulingRepo.findAll.mockResolvedValue([mockSchedulingRow])
      const result = await service.findAll()
      expect(result).toHaveLength(1)
      expect(mockSchedulingRepo.findAll).toHaveBeenCalledOnce()
    })
  })

  describe('findOne', () => {
    it('returns scheduling by id', async () => {
      mockSchedulingRepo.findById.mockResolvedValue(mockSchedulingRow)
      const result = await service.findOne(mockSchedulingRow.id)
      expect(result).toEqual(mockSchedulingRow)
    })

    it('throws NotFoundException when scheduling does not exist', async () => {
      mockSchedulingRepo.findById.mockResolvedValue(undefined)
      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('remove', () => {
    it('deletes scheduling after confirming it exists', async () => {
      mockSchedulingRepo.findById.mockResolvedValue(mockSchedulingRow)
      mockSchedulingRepo.delete.mockResolvedValue(undefined)

      await service.remove(mockSchedulingRow.id)

      expect(mockSchedulingRepo.delete).toHaveBeenCalledWith(
        mockSchedulingRow.id,
      )
    })

    it('throws NotFoundException when scheduling does not exist', async () => {
      mockSchedulingRepo.findById.mockResolvedValue(undefined)
      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      )
    })
  })
})
