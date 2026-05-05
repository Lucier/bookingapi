import { pgTable, text, uuid, timestamp, date, time } from 'drizzle-orm/pg-core'
import { users } from './users.schema'
import { spaces } from './spaces.schema'

export const scheduling = pgTable('scheduling', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  spaceId: uuid('space_id')
    .references(() => spaces.id)
    .notNull(),
  activityDescription: text('activity_description').notNull(),
  schedulingDate: date('scheduling_date').notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
