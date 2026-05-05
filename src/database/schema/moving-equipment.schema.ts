import { pgTable, text, uuid, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users.schema'
import { equipments } from './equipments.schema'
import { spaces } from './spaces.schema'

export const movementTypeEnum = pgEnum('movement_type', [
  'transfer',
  'maintenance',
  'loan',
  'write-off',
])

export const movingEquipment = pgTable('moving_equipment', {
  id: uuid('id').defaultRandom().primaryKey(),
  equipmentId: uuid('equipment_id')
    .references(() => equipments.id)
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  originSpaceId: uuid('origin_space_id').references(() => spaces.id),
  destinationSpaceId: uuid('destination_space_id').references(() => spaces.id),
  movementType: movementTypeEnum('movement_type').notNull(),
  description: text('description'),
  movementDate: timestamp('movement_date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
