import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { randomBytes, createHash } from 'crypto'
import * as bcrypt from 'bcrypt'
import { AuthRepository } from '../repositories/auth.repository'
import { RegisterDto, LoginDto } from '../dto/auth.dto'
import type { JwtPayload } from '../strategies/jwt.strategy'
import { users } from '../../../database/schema/index'

const BCRYPT_ROUNDS = 10
const REFRESH_EXPIRY_DAYS = 7

type UserRow = typeof users.$inferSelect

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: RegisterDto): Promise<{ accessToken: string; refreshToken: string }> {
    const existing = await this.authRepository.findUserByEmail(dto.email)
    if (existing) throw new ConflictException('Email already in use')

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS)
    const user = await this.authRepository.createUser({
      name: dto.name,
      email: dto.email,
      passwordHash,
    })

    return this.issueTokens(user)
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.authRepository.findUserByEmail(dto.email)
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    return this.issueTokens(user)
  }

  async refresh(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenHash = this.hashToken(token)
    const stored = await this.authRepository.findRefreshToken(tokenHash)

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    await this.authRepository.deleteRefreshToken(tokenHash)

    const user = await this.authRepository.findUserById(stored.userId)
    if (!user) throw new UnauthorizedException('User not found')

    return this.issueTokens(user)
  }

  async logout(token: string): Promise<void> {
    const tokenHash = this.hashToken(token)
    await this.authRepository.deleteRefreshToken(tokenHash)
  }

  async getMe(userId: string): Promise<Omit<UserRow, 'passwordHash'>> {
    const user = await this.authRepository.findUserById(userId)
    if (!user) throw new UnauthorizedException('User not found')
    const { passwordHash: _omit, ...rest } = user
    return rest
  }

  private async issueTokens(
    user: UserRow
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = this.jwtService.sign(payload)

    const refreshToken = randomBytes(64).toString('hex')
    const tokenHash = this.hashToken(refreshToken)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + REFRESH_EXPIRY_DAYS)

    await this.authRepository.saveRefreshToken({ userId: user.id, tokenHash, expiresAt })

    return { accessToken, refreshToken }
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
  }
}
