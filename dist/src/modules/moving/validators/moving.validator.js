"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementResponseSchema = exports.UpdateMovementSchema = exports.CreateMovementSchema = exports.MovementTypeSchema = void 0;
const zod_1 = require("zod");
const base_dto_1 = require("../../../common/dto/base.dto");
exports.MovementTypeSchema = zod_1.z.enum(['transfer', 'maintenance', 'loan', 'write-off']);
exports.CreateMovementSchema = zod_1.z.object({
    equipmentId: zod_1.z.string().uuid(),
    originSpaceId: zod_1.z.string().uuid().optional(),
    destinationSpaceId: zod_1.z.string().uuid().optional(),
    movementType: exports.MovementTypeSchema,
    description: zod_1.z.string().optional(),
});
exports.UpdateMovementSchema = zod_1.z.object({
    originSpaceId: zod_1.z.string().uuid().optional(),
    destinationSpaceId: zod_1.z.string().uuid().optional(),
    movementType: exports.MovementTypeSchema.optional(),
    description: zod_1.z.string().optional(),
});
exports.MovementResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    equipmentId: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    originSpaceId: zod_1.z.string().uuid().nullable(),
    destinationSpaceId: zod_1.z.string().uuid().nullable(),
    movementType: exports.MovementTypeSchema,
    description: zod_1.z.string().nullable(),
    movementDate: base_dto_1.zodDate,
    createdAt: base_dto_1.zodDate,
    equipmentName: zod_1.z.string().nullable(),
    originSpaceName: zod_1.z.string().nullable(),
    destinationSpaceName: zod_1.z.string().nullable(),
});
//# sourceMappingURL=moving.validator.js.map