import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { MovingRepository, MovementWithDetails } from '../repositories/moving.repository'
import { CreateMovementDto, UpdateMovementDto } from '../dto/moving.dto'

@Injectable()
export class MovingService {
  constructor(private readonly movingRepository: MovingRepository) {}

  async create(dto: CreateMovementDto, userId: string): Promise<MovementWithDetails> {
    const exists = await this.movingRepository.equipmentExists(dto.equipmentId)
    if (!exists) throw new NotFoundException(`Equipment ${dto.equipmentId} not found`)

    if (dto.movementType === 'transfer' && !dto.destinationSpaceId) {
      throw new BadRequestException('destinationSpaceId is required for transfer movements')
    }

    const row = await this.movingRepository.create({ ...dto, userId })
    return this.movingRepository.findById(row.id) as Promise<MovementWithDetails>
  }

  findAll(): Promise<MovementWithDetails[]> {
    return this.movingRepository.findAll()
  }

  async findOne(id: string): Promise<MovementWithDetails> {
    const movement = await this.movingRepository.findById(id)
    if (!movement) throw new NotFoundException(`Movement ${id} not found`)
    return movement
  }

  async update(id: string, dto: UpdateMovementDto): Promise<MovementWithDetails> {
    await this.findOne(id)
    await this.movingRepository.update(id, dto)
    return this.findOne(id)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.movingRepository.delete(id)
  }
}
