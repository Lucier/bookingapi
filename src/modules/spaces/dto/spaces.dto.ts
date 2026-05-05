import { createZodDto } from 'nestjs-zod'
import {
  CreateSpaceSchema,
  UpdateSpaceSchema,
  SpaceResponseSchema,
} from '../validators/spaces.validator'

export class CreateSpaceDto extends createZodDto(CreateSpaceSchema) {}
export class UpdateSpaceDto extends createZodDto(UpdateSpaceSchema) {}
export class SpaceResponseDto extends createZodDto(SpaceResponseSchema) {}
