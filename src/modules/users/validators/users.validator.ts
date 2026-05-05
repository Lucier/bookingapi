import { z } from 'zod'
import { zodDate } from '../../../common/dto/base.dto'

export const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
})

export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'USER']),
  createdAt: zodDate,
  updatedAt: zodDate,
})
