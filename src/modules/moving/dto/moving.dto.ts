import { createZodDto } from 'nestjs-zod'
import {
  CreateMovementSchema,
  UpdateMovementSchema,
  MovementResponseSchema,
} from '../validators/moving.validator'

export class CreateMovementDto extends createZodDto(CreateMovementSchema) {}
export class UpdateMovementDto extends createZodDto(UpdateMovementSchema) {}
export class MovementResponseDto extends createZodDto(MovementResponseSchema) {}
