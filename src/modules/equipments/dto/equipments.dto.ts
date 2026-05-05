import { createZodDto } from 'nestjs-zod'
import {
  CreateEquipmentSchema,
  UpdateEquipmentSchema,
  EquipmentResponseSchema,
} from '../validators/equipments.validator'

export class CreateEquipmentDto extends createZodDto(CreateEquipmentSchema) {}
export class UpdateEquipmentDto extends createZodDto(UpdateEquipmentSchema) {}
export class EquipmentResponseDto extends createZodDto(EquipmentResponseSchema) {}
