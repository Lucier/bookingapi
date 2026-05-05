"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceResponseSchema = exports.UpdateSpaceSchema = exports.CreateSpaceSchema = void 0;
const zod_1 = require("zod");
const base_dto_1 = require("../../../common/dto/base.dto");
exports.CreateSpaceSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(['active', 'maintenance', 'inactive']).optional(),
});
exports.UpdateSpaceSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(['active', 'maintenance', 'inactive']).optional(),
});
exports.SpaceResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    description: zod_1.z.string().nullable(),
    status: zod_1.z.enum(['active', 'maintenance', 'inactive']),
    createdAt: base_dto_1.zodDate,
    updatedAt: base_dto_1.zodDate,
});
//# sourceMappingURL=spaces.validator.js.map