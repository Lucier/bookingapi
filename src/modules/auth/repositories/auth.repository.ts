import { Injectable, Inject } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { DRIZZLE } from '../../../database/drizzle.provider'
import * as dbSchema from '../../../database/schema/index'
import { users, refreshTokens } from '../../../database/schema/index'

type DrizzleDB = PostgresJsDatabase<typeof dbSchema>

@Injectable()
export class AuthRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findUserByEmail(email: string): Promise<typeof users.$inferSelect | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.email, email))
    return user
  }

  async findUserById(id: string): Promise<typeof users.$inferSelect | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id))
    return user
  }

  async createUser(data: {
    name: string
    email: string
    passwordHash: string
  }): Promise<typeof users.$inferSelect> {
    const [user] = await this.db
      .insert(users)
      .values({ ...data, role: 'USER' })
      .returning()
    return user
  }

  async saveRefreshToken(data: {
    userId: string
    tokenHash: string
    expiresAt: Date
  }): Promise<void> {
    await this.db.insert(refreshTokens).values(data)
  }

  async findRefreshToken(
    tokenHash: string
  ): Promise<typeof refreshTokens.$inferSelect | undefined> {
    const [token] = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, tokenHash))
    return token
  }

  async deleteRefreshToken(tokenHash: string): Promise<void> {
    await this.db.delete(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash))
  }

  async deleteUserRefreshTokens(userId: string): Promise<void> {
    await this.db.delete(refreshTokens).where(eq(refreshTokens.userId, userId))
  }
}
