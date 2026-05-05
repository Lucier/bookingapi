import { createZodDto } from 'nestjs-zod'
import { UpdateUserSchema, UserResponseSchema } from '../validators/users.validator'

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}

export class UserResponseDto extends createZodDto(UserResponseSchema) {}
