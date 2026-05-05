import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { SchedulingRepository } from '../repositories/scheduling.repository'
import { SpacesRepository } from '../../spaces/repositories/spaces.repository'
import { CreateSchedulingDto } from '../dto/scheduling.dto'

@Injectable()
export class SchedulingService {
  constructor(
    private readonly schedulingRepository: SchedulingRepository,
    private readonly spacesRepository: SpacesRepository,
  ) {}

  async create(dto: CreateSchedulingDto, userId: string) {
    const space = await this.spacesRepository.findById(dto.spaceId)
    if (!space) {
      throw new NotFoundException(`Space ${dto.spaceId} not found`)
    }
    if (space.status !== 'active') {
      throw new ConflictException(`Space ${dto.spaceId} is not active`)
    }

    const overlapping = await this.schedulingRepository.findOverlapping(
      dto.spaceId,
      dto.schedulingDate,
      dto.startTime,
      dto.endTime,
    )
    if (overlapping.length > 0) {
      throw new ConflictException(
        'Time slot conflicts with an existing booking for this space',
      )
    }

    return this.schedulingRepository.create({ ...dto, userId })
  }

  findAll() {
    return this.schedulingRepository.findAll()
  }

  async findOne(id: string) {
    const row = await this.schedulingRepository.findById(id)
    if (!row) throw new NotFoundException(`Scheduling ${id} not found`)
    return row
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.schedulingRepository.delete(id)
  }
}
