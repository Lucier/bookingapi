import 'reflect-metadata'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { NotFoundException, BadRequestException } from '@nestjs/common'
import { MovingService } from '../services/moving.service'
import { MovingRepository } from '../repositories/moving.repository'

const baseMovement = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  equipmentId: 'aaa00000-0000-0000-0000-000000000001',
  userId: 'bbb00000-0000-0000-0000-000000000001',
  originSpaceId: null,
  destinationSpaceId: null,
  movementType: 'maintenance' as const,
  description: null,
  movementDate: new Date('2024-01-01'),
  createdAt: new Date('2024-01-01'),
  equipmentName: 'Projector',
  originSpaceName: null,
  destinationSpaceName: null,
}

const mockRepo = {
  create: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  equipmentExists: vi.fn(),
}

describe('MovingService', () => {
  let service: MovingService

  beforeEach(() => {
    service = new MovingService(mockRepo as unknown as MovingRepository)
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('throws NotFoundException when equipment does not exist', async () => {
      mockRepo.equipmentExists.mockResolvedValue(false)

      await expect(
        service.create(
          { equipmentId: baseMovement.equipmentId, movementType: 'maintenance' } as never,
          'user-id'
        )
      ).rejects.toThrow(NotFoundException)
    })

    it('throws BadRequestException for transfer without destinationSpaceId', async () => {
      mockRepo.equipmentExists.mockResolvedValue(true)

      await expect(
        service.create(
          { equipmentId: baseMovement.equipmentId, movementType: 'transfer' } as never,
          'user-id'
        )
      ).rejects.toThrow(BadRequestException)
    })

    it('binds userId to the created movement', async () => {
      mockRepo.equipmentExists.mockResolvedValue(true)
      mockRepo.create.mockResolvedValue(baseMovement)
      mockRepo.findById.mockResolvedValue(baseMovement)

      await service.create(
        { equipmentId: baseMovement.equipmentId, movementType: 'maintenance' } as never,
        baseMovement.userId
      )

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: baseMovement.userId })
      )
    })

    it('creates a transfer movement when destinationSpaceId is provided', async () => {
      const transferMovement = {
        ...baseMovement,
        movementType: 'transfer' as const,
        destinationSpaceId: 'ccc00000-0000-0000-0000-000000000001',
      }
      mockRepo.equipmentExists.mockResolvedValue(true)
      mockRepo.create.mockResolvedValue(transferMovement)
      mockRepo.findById.mockResolvedValue(transferMovement)

      const result = await service.create(
        {
          equipmentId: baseMovement.equipmentId,
          movementType: 'transfer',
          destinationSpaceId: 'ccc00000-0000-0000-0000-000000000001',
        } as never,
        baseMovement.userId
      )

      expect(result.movementType).toBe('transfer')
    })
  })

  describe('findAll', () => {
    it('returns all movements', async () => {
      mockRepo.findAll.mockResolvedValue([baseMovement])
      const result = await service.findAll()
      expect(result).toHaveLength(1)
    })
  })

  describe('findOne', () => {
    it('returns a movement by id', async () => {
      mockRepo.findById.mockResolvedValue(baseMovement)
      const result = await service.findOne(baseMovement.id)
      expect(result.id).toBe(baseMovement.id)
    })

    it('throws NotFoundException when movement does not exist', async () => {
      mockRepo.findById.mockResolvedValue(undefined)
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    it('updates and returns the enriched movement', async () => {
      const updated = { ...baseMovement, description: 'Fixed' }
      mockRepo.findById.mockResolvedValueOnce(baseMovement).mockResolvedValueOnce(updated)
      mockRepo.update.mockResolvedValue(baseMovement)

      const result = await service.update(baseMovement.id, { description: 'Fixed' } as never)
      expect(result.description).toBe('Fixed')
    })

    it('throws NotFoundException when movement does not exist', async () => {
      mockRepo.findById.mockResolvedValue(undefined)
      await expect(service.update('nonexistent', {} as never)).rejects.toThrow(NotFoundException)
    })
  })

  describe('remove', () => {
    it('calls delete after confirming movement exists', async () => {
      mockRepo.findById.mockResolvedValue(baseMovement)
      mockRepo.delete.mockResolvedValue(undefined)
      await service.remove(baseMovement.id)
      expect(mockRepo.delete).toHaveBeenCalledWith(baseMovement.id)
    })

    it('throws NotFoundException when movement does not exist', async () => {
      mockRepo.findById.mockResolvedValue(undefined)
      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException)
    })
  })
})
