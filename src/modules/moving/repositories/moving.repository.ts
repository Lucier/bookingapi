import { Injectable, Inject } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { DRIZZLE } from '../../../database/drizzle.provider'
import * as dbSchema from '../../../database/schema/index'
import { movingEquipment, equipments, spaces } from '../../../database/schema/index'

type DrizzleDB = PostgresJsDatabase<typeof dbSchema>
type MovementRow = typeof movingEquipment.$inferSelect
type MovementInsertData = Omit<typeof movingEquipment.$inferInsert, 'id' | 'movementDate' | 'createdAt'>
type MovementUpdateData = Partial<
  Pick<typeof movingEquipment.$inferInsert, 'originSpaceId' | 'destinationSpaceId' | 'movementType' | 'description'>
>

export type MovementWithDetails = MovementRow & {
  equipmentName: string | null
  originSpaceName: string | null
  destinationSpaceName: string | null
}

const buildJoinedSelect = () => {
  const originSpace = alias(spaces, 'origin_space')
  const destinationSpace = alias(spaces, 'destination_space')
  return { originSpace, destinationSpace }
}

@Injectable()
export class MovingRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async create(data: MovementInsertData): Promise<MovementRow> {
    const [movement] = await this.db.insert(movingEquipment).values(data).returning()
    return movement
  }

  async findAll(): Promise<MovementWithDetails[]> {
    const { originSpace, destinationSpace } = buildJoinedSelect()
    return this.db
      .select({
        id: movingEquipment.id,
        equipmentId: movingEquipment.equipmentId,
        userId: movingEquipment.userId,
        originSpaceId: movingEquipment.originSpaceId,
        destinationSpaceId: movingEquipment.destinationSpaceId,
        movementType: movingEquipment.movementType,
        description: movingEquipment.description,
        movementDate: movingEquipment.movementDate,
        createdAt: movingEquipment.createdAt,
        equipmentName: equipments.name,
        originSpaceName: originSpace.name,
        destinationSpaceName: destinationSpace.name,
      })
      .from(movingEquipment)
      .leftJoin(equipments, eq(movingEquipment.equipmentId, equipments.id))
      .leftJoin(originSpace, eq(movingEquipment.originSpaceId, originSpace.id))
      .leftJoin(destinationSpace, eq(movingEquipment.destinationSpaceId, destinationSpace.id))
  }

  async findById(id: string): Promise<MovementWithDetails | undefined> {
    const { originSpace, destinationSpace } = buildJoinedSelect()
    const [movement] = await this.db
      .select({
        id: movingEquipment.id,
        equipmentId: movingEquipment.equipmentId,
        userId: movingEquipment.userId,
        originSpaceId: movingEquipment.originSpaceId,
        destinationSpaceId: movingEquipment.destinationSpaceId,
        movementType: movingEquipment.movementType,
        description: movingEquipment.description,
        movementDate: movingEquipment.movementDate,
        createdAt: movingEquipment.createdAt,
        equipmentName: equipments.name,
        originSpaceName: originSpace.name,
        destinationSpaceName: destinationSpace.name,
      })
      .from(movingEquipment)
      .leftJoin(equipments, eq(movingEquipment.equipmentId, equipments.id))
      .leftJoin(originSpace, eq(movingEquipment.originSpaceId, originSpace.id))
      .leftJoin(destinationSpace, eq(movingEquipment.destinationSpaceId, destinationSpace.id))
      .where(eq(movingEquipment.id, id))
    return movement
  }

  async update(id: string, data: MovementUpdateData): Promise<MovementRow | undefined> {
    const [updated] = await this.db
      .update(movingEquipment)
      .set(data)
      .where(eq(movingEquipment.id, id))
      .returning()
    return updated
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(movingEquipment).where(eq(movingEquipment.id, id))
  }

  async equipmentExists(equipmentId: string): Promise<boolean> {
    const [row] = await this.db
      .select({ id: equipments.id })
      .from(equipments)
      .where(eq(equipments.id, equipmentId))
    return !!row
  }
}
