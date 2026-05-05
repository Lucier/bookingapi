import { Injectable, Inject } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { DRIZZLE } from '../../../database/drizzle.provider'
import * as dbSchema from '../../../database/schema/index'
import { equipments } from '../../../database/schema/index'

type DrizzleDB = PostgresJsDatabase<typeof dbSchema>
type EquipmentRow = typeof equipments.$inferSelect
type EquipmentInsertData = Pick<
  typeof equipments.$inferInsert,
  | 'name'
  | 'description'
  | 'manufacturer'
  | 'model'
  | 'serialNumber'
  | 'category'
  | 'conservationStatus'
  | 'spaceId'
>
type EquipmentUpdateData = Partial<EquipmentInsertData>

@Injectable()
export class EquipmentsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async create(data: EquipmentInsertData): Promise<EquipmentRow> {
    const [equipment] = await this.db.insert(equipments).values(data).returning()
    return equipment
  }

  findAll(): Promise<EquipmentRow[]> {
    return this.db.select().from(equipments)
  }

  async findById(id: string): Promise<EquipmentRow | undefined> {
    const [equipment] = await this.db
      .select()
      .from(equipments)
      .where(eq(equipments.id, id))
    return equipment
  }

  async update(id: string, data: EquipmentUpdateData): Promise<EquipmentRow | undefined> {
    const [updated] = await this.db
      .update(equipments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(equipments.id, id))
      .returning()
    return updated
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(equipments).where(eq(equipments.id, id))
  }
}
