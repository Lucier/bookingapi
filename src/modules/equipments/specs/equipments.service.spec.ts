import 'reflect-metadata'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { NotFoundException } from '@nestjs/common'
import { EquipmentsService } from '../services/equipments.service'
import { EquipmentsRepository } from '../repositories/equipments.repository'

const mockEquipment = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Projector X1',
  description: 'Main hall projector',
  manufacturer: 'Epson',
  model: 'EB-X41',
  serialNumber: 'SN-001',
  category: 'AV',
  conservationStatus: 'good' as const,
  spaceId: null,
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

describe('EquipmentsService', () => {
  let service: EquipmentsService

  beforeEach(() => {
    service = new EquipmentsService(mockRepo as unknown as EquipmentsRepository)
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('creates and returns an equipment', async () => {
      mockRepo.create.mockResolvedValue(mockEquipment)
      const result = await service.create({ name: 'Projector X1', serialNumber: 'SN-001' } as never)
      expect(result).toEqual(mockEquipment)
      expect(mockRepo.create).toHaveBeenCalledOnce()
    })
  })

  describe('findAll', () => {
    it('returns all equipments', async () => {
      mockRepo.findAll.mockResolvedValue([mockEquipment])
      const result = await service.findAll()
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe(mockEquipment.name)
    })
  })

  describe('findOne', () => {
    it('returns an equipment by id', async () => {
      mockRepo.findById.mockResolvedValue(mockEquipment)
      const result = await service.findOne(mockEquipment.id)
      expect(result).toEqual(mockEquipment)
    })

    it('throws NotFoundException when equipment does not exist', async () => {
      mockRepo.findById.mockResolvedValue(undefined)
      await expect(service.findOne('nonexistent-id')).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    it('updates and returns the equipment', async () => {
      const updated = { ...mockEquipment, name: 'Projector X2' }
      mockRepo.findById.mockResolvedValue(mockEquipment)
      mockRepo.update.mockResolvedValue(updated)
      const result = await service.update(mockEquipment.id, { name: 'Projector X2' } as never)
      expect(result.name).toBe('Projector X2')
    })

    it('throws NotFoundException when equipment does not exist', async () => {
      mockRepo.findById.mockResolvedValue(undefined)
      await expect(service.update('nonexistent-id', {} as never)).rejects.toThrow(NotFoundException)
    })
  })

  describe('remove', () => {
    it('calls delete after confirming equipment exists', async () => {
      mockRepo.findById.mockResolvedValue(mockEquipment)
      mockRepo.delete.mockResolvedValue(undefined)
      await service.remove(mockEquipment.id)
      expect(mockRepo.delete).toHaveBeenCalledWith(mockEquipment.id)
    })

    it('throws NotFoundException when equipment does not exist', async () => {
      mockRepo.findById.mockResolvedValue(undefined)
      await expect(service.remove('nonexistent-id')).rejects.toThrow(NotFoundException)
    })
  })
})
