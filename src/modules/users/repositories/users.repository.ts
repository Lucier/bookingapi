import { Injectable, Inject } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { DRIZZLE } from '../../../database/drizzle.provider'
import * as dbSchema from '../../../database/schema/index'
import { users } from '../../../database/schema/index'

type DrizzleDB = PostgresJsDatabase<typeof dbSchema>
type UserUpdateData = Partial<Pick<typeof users.$inferInsert, 'name' | 'email'>>

@Injectable()
export class UsersRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  findAll(): Promise<(typeof users.$inferSelect)[]> {
    return this.db.select().from(users)
  }

  async findById(id: string): Promise<typeof users.$inferSelect | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id))
    return user
  }

  async update(id: string, data: UserUpdateData): Promise<typeof users.$inferSelect | undefined> {
    const [updated] = await this.db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning()
    return updated
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id))
  }
}
