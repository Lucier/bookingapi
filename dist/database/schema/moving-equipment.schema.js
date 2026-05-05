"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movingEquipment = exports.movementTypeEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_schema_1 = require("./users.schema");
const equipments_schema_1 = require("./equipments.schema");
const spaces_schema_1 = require("./spaces.schema");
exports.movementTypeEnum = (0, pg_core_1.pgEnum)('movement_type', [
    'transfer',
    'maintenance',
    'loan',
    'write-off',
]);
exports.movingEquipment = (0, pg_core_1.pgTable)('moving_equipment', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    equipmentId: (0, pg_core_1.uuid)('equipment_id')
        .references(() => equipments_schema_1.equipments.id)
        .notNull(),
    userId: (0, pg_core_1.uuid)('user_id')
        .references(() => users_schema_1.users.id)
        .notNull(),
    originSpaceId: (0, pg_core_1.uuid)('origin_space_id').references(() => spaces_schema_1.spaces.id),
    destinationSpaceId: (0, pg_core_1.uuid)('destination_space_id').references(() => spaces_schema_1.spaces.id),
    movementType: (0, exports.movementTypeEnum)('movement_type').notNull(),
    description: (0, pg_core_1.text)('description'),
    movementDate: (0, pg_core_1.timestamp)('movement_date').defaultNow().notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
//# sourceMappingURL=moving-equipment.schema.js.map