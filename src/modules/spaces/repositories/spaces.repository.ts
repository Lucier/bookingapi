import { Injectable, Inject } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { DRIZZLE } from '../../../database/drizzle.provider'
import * as dbSchema from '../../../database/schema/index'
import { spaces } from '../../../database/schema/index'

type DrizzleDB = PostgresJsDatabase<typeof dbSchema>
type SpaceRow = typeof spaces.$inferSelect
type SpaceInsertData = Pick<typeof spaces.$inferInsert, 'name' | 'description' | 'status'>
type SpaceUpdateData = Partial<SpaceInsertData>

@Injectable()
export class SpacesRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async create(data: SpaceInsertData): Promise<SpaceRow> {
    const [space] = await this.db.insert(spaces).values(data).returning()
    return space
  }

  findAll(): Promise<SpaceRow[]> {
    return this.db.select().from(spaces)
  }

  async findById(id: string): Promise<SpaceRow | undefined> {
    const [space] = await this.db.select().from(spaces).where(eq(spaces.id, id))
    return space
  }

  async update(id: string, data: SpaceUpdateData): Promise<SpaceRow | undefined> {
    const [updated] = await this.db
      .update(spaces)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(spaces.id, id))
      .returning()
    return updated
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(spaces).where(eq(spaces.id, id))
  }
}
