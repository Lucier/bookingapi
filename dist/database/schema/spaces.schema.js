"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spaces = exports.spaceStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.spaceStatusEnum = (0, pg_core_1.pgEnum)('space_status', [
    'active',
    'maintenance',
    'inactive',
]);
exports.spaces = (0, pg_core_1.pgTable)('spaces', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    status: (0, exports.spaceStatusEnum)('status').default('active').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
//# sourceMappingURL=spaces.schema.js.map