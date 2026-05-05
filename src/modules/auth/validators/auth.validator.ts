import { z } from 'zod'
import { zodDate } from '../../../common/dto/base.dto'

export const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const RefreshSchema = z.object({
  refreshToken: z.string().min(1),
})

export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export const MeResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'USER']),
  createdAt: zodDate,
  updatedAt: zodDate,
})
