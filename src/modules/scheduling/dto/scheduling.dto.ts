import { createZodDto } from 'nestjs-zod'
import {
  CreateSchedulingSchema,
  SchedulingResponseSchema,
} from '../validators/scheduling.validator'

export class CreateSchedulingDto extends createZodDto(CreateSchedulingSchema) {}
export class SchedulingResponseDto extends createZodDto(SchedulingResponseSchema) {}
