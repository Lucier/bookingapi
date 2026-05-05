"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduling = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_schema_1 = require("./users.schema");
const spaces_schema_1 = require("./spaces.schema");
exports.scheduling = (0, pg_core_1.pgTable)('scheduling', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id')
        .references(() => users_schema_1.users.id)
        .notNull(),
    spaceId: (0, pg_core_1.uuid)('space_id')
        .references(() => spaces_schema_1.spaces.id)
        .notNull(),
    activityDescription: (0, pg_core_1.text)('activity_description').notNull(),
    schedulingDate: (0, pg_core_1.date)('scheduling_date').notNull(),
    startTime: (0, pg_core_1.time)('start_time').notNull(),
    endTime: (0, pg_core_1.time)('end_time').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
//# sourceMappingURL=scheduling.schema.js.map