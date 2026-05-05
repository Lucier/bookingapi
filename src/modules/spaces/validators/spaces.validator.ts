import { z } from 'zod'
import { zodDate } from '../../../common/dto/base.dto'

export const CreateSpaceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['active', 'maintenance', 'inactive']).optional(),
})

export const UpdateSpaceSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'maintenance', 'inactive']).optional(),
})

export const SpaceResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  status: z.enum(['active', 'maintenance', 'inactive']),
  createdAt: zodDate,
  updatedAt: zodDate,
})
