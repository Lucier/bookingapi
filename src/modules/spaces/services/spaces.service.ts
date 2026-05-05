import { Injectable, NotFoundException } from '@nestjs/common'
import { SpacesRepository } from '../repositories/spaces.repository'
import { CreateSpaceDto, UpdateSpaceDto } from '../dto/spaces.dto'
import { spaces } from '../../../database/schema/index'

type SpaceRow = typeof spaces.$inferSelect

@Injectable()
export class SpacesService {
  constructor(private readonly spacesRepository: SpacesRepository) {}

  async create(dto: CreateSpaceDto): Promise<SpaceRow> {
    return this.spacesRepository.create(dto)
  }

  findAll(): Promise<SpaceRow[]> {
    return this.spacesRepository.findAll()
  }

  async findOne(id: string): Promise<SpaceRow> {
    const space = await this.spacesRepository.findById(id)
    if (!space) throw new NotFoundException(`Space ${id} not found`)
    return space
  }

  async update(id: string, dto: UpdateSpaceDto): Promise<SpaceRow> {
    await this.findOne(id)
    const updated = await this.spacesRepository.update(id, dto)
    if (!updated) throw new NotFoundException(`Space ${id} not found`)
    return updated
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.spacesRepository.delete(id)
  }
}
