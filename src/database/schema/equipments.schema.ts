import {
  pgTable,
  text,
  uuid,
  varchar,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { spaces } from './spaces.schema'

export const conservationStatusEnum = pgEnum('conservation_status', [
  'new',
  'good',
  'regular',
  'maintenance',
  'downloaded',
])

export const equipments = pgTable('equipments', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  manufacturer: varchar('manufacturer', { length: 100 }),
  model: varchar('model', { length: 100 }),
  serialNumber: varchar('serial_number', { length: 100 }).unique().notNull(),
  category: varchar('category', { length: 100 }),
  conservationStatus: conservationStatusEnum('conservation_status')
    .default('new')
    .notNull(),
  spaceId: uuid('space_id').references(() => spaces.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
