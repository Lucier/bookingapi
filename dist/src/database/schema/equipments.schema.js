"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipments = exports.conservationStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const spaces_schema_1 = require("./spaces.schema");
exports.conservationStatusEnum = (0, pg_core_1.pgEnum)('conservation_status', [
    'new',
    'good',
    'regular',
    'maintenance',
    'downloaded',
]);
exports.equipments = (0, pg_core_1.pgTable)('equipments', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    manufacturer: (0, pg_core_1.varchar)('manufacturer', { length: 100 }),
    model: (0, pg_core_1.varchar)('model', { length: 100 }),
    serialNumber: (0, pg_core_1.varchar)('serial_number', { length: 100 }).unique().notNull(),
    category: (0, pg_core_1.varchar)('category', { length: 100 }),
    conservationStatus: (0, exports.conservationStatusEnum)('conservation_status')
        .default('new')
        .notNull(),
    spaceId: (0, pg_core_1.uuid)('space_id').references(() => spaces_schema_1.spaces.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
//# sourceMappingURL=equipments.schema.js.map