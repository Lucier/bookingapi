import { Injectable, NotFoundException } from '@nestjs/common'
import { EquipmentsRepository } from '../repositories/equipments.repository'
import { CreateEquipmentDto, UpdateEquipmentDto } from '../dto/equipments.dto'
import { equipments } from '../../../database/schema/index'

type EquipmentRow = typeof equipments.$inferSelect

@Injectable()
export class EquipmentsService {
  constructor(private readonly equipmentsRepository: EquipmentsRepository) {}

  async create(dto: CreateEquipmentDto): Promise<EquipmentRow> {
    return this.equipmentsRepository.create(dto)
  }

  findAll(): Promise<EquipmentRow[]> {
    return this.equipmentsRepository.findAll()
  }

  async findOne(id: string): Promise<EquipmentRow> {
    const equipment = await this.equipmentsRepository.findById(id)
    if (!equipment) throw new NotFoundException(`Equipment ${id} not found`)
    return equipment
  }

  async update(id: string, dto: UpdateEquipmentDto): Promise<EquipmentRow> {
    await this.findOne(id)
    const updated = await this.equipmentsRepository.update(id, dto)
    if (!updated) throw new NotFoundException(`Equipment ${id} not found`)
    return updated
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.equipmentsRepository.delete(id)
  }
}
