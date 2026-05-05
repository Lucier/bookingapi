import { createZodDto } from 'nestjs-zod'
import {
  RegisterSchema,
  LoginSchema,
  RefreshSchema,
  AuthTokensSchema,
  MeResponseSchema,
} from '../validators/auth.validator'

export class RegisterDto extends createZodDto(RegisterSchema) {}
export class LoginDto extends createZodDto(LoginSchema) {}
export class RefreshDto extends createZodDto(RefreshSchema) {}
export class AuthTokensDto extends createZodDto(AuthTokensSchema) {}
export class MeResponseDto extends createZodDto(MeResponseSchema) {}
