import { Injectable, Inject } from '@nestjs/common'
import { and, eq, lt, gt } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { DRIZZLE } from '../../../database/drizzle.provider'
import * as dbSchema from '../../../database/schema/index'
import { scheduling, spaces, users } from '../../../database/schema/index'

type DrizzleDB = PostgresJsDatabase<typeof dbSchema>
type SchedulingRow = typeof scheduling.$inferSelect
type SchedulingInsertData = typeof scheduling.$inferInsert

const schedulingWithJoinFields = {
  id: scheduling.id,
  userId: scheduling.userId,
  spaceId: scheduling.spaceId,
  activityDescription: scheduling.activityDescription,
  schedulingDate: scheduling.schedulingDate,
  startTime: scheduling.startTime,
  endTime: scheduling.endTime,
  createdAt: scheduling.createdAt,
  updatedAt: scheduling.updatedAt,
  spaceName: spaces.name,
  userName: users.name,
}

@Injectable()
export class SchedulingRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async create(data: SchedulingInsertData): Promise<SchedulingRow> {
    const [row] = await this.db.insert(scheduling).values(data).returning()
    return row
  }

  findAll() {
    return this.db
      .select(schedulingWithJoinFields)
      .from(scheduling)
      .leftJoin(spaces, eq(scheduling.spaceId, spaces.id))
      .leftJoin(users, eq(scheduling.userId, users.id))
  }

  async findById(id: string) {
    const [row] = await this.db
      .select(schedulingWithJoinFields)
      .from(scheduling)
      .leftJoin(spaces, eq(scheduling.spaceId, spaces.id))
      .leftJoin(users, eq(scheduling.userId, users.id))
      .where(eq(scheduling.id, id))
    return row
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(scheduling).where(eq(scheduling.id, id))
  }

  findOverlapping(
    spaceId: string,
    schedulingDate: string,
    startTime: string,
    endTime: string,
  ): Promise<SchedulingRow[]> {
    return this.db
      .select()
      .from(scheduling)
      .where(
        and(
          eq(scheduling.spaceId, spaceId),
          eq(scheduling.schedulingDate, schedulingDate),
          lt(scheduling.startTime, endTime),
          gt(scheduling.endTime, startTime),
        ),
      )
  }
}
