import { z } from 'zod'
import { zodDate } from '../../../common/dto/base.dto'

export const MovementTypeSchema = z.enum(['transfer', 'maintenance', 'loan', 'write-off'])

export const CreateMovementSchema = z.object({
  equipmentId: z.string().uuid(),
  originSpaceId: z.string().uuid().optional(),
  destinationSpaceId: z.string().uuid().optional(),
  movementType: MovementTypeSchema,
  description: z.string().optional(),
})

export const UpdateMovementSchema = z.object({
  originSpaceId: z.string().uuid().optional(),
  destinationSpaceId: z.string().uuid().optional(),
  movementType: MovementTypeSchema.optional(),
  description: z.string().optional(),
})

export const MovementResponseSchema = z.object({
  id: z.string().uuid(),
  equipmentId: z.string().uuid(),
  userId: z.string().uuid(),
  originSpaceId: z.string().uuid().nullable(),
  destinationSpaceId: z.string().uuid().nullable(),
  movementType: MovementTypeSchema,
  description: z.string().nullable(),
  movementDate: zodDate,
  createdAt: zodDate,
  equipmentName: z.string().nullable(),
  originSpaceName: z.string().nullable(),
  destinationSpaceName: z.string().nullable(),
})
