import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const zodDate = z.preprocess(
  v => v instanceof Date ? v.toISOString() : v,
  z.string()
)

const BaseSchema = z.object({
  id: z.string().uuid(),
  createdAt: zodDate,
  updatedAt: zodDate,
})

export class BaseDto extends createZodDto(BaseSchema) {}

export { BaseSchema }
