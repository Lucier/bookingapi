"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentResponseSchema = exports.UpdateEquipmentSchema = exports.CreateEquipmentSchema = void 0;
const zod_1 = require("zod");
const base_dto_1 = require("../../../common/dto/base.dto");
const conservationStatusEnum = zod_1.z.enum(['new', 'good', 'regular', 'maintenance', 'downloaded']);
exports.CreateEquipmentSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).describe('Equipment name'),
    description: zod_1.z.string().optional().describe('Optional description'),
    manufacturer: zod_1.z.string().optional().describe('Manufacturer name'),
    model: zod_1.z.string().optional().describe('Manufacturer model identifier'),
    serialNumber: zod_1.z.string().min(1).describe('Unique serial number'),
    category: zod_1.z.string().optional().describe('Equipment category (e.g. AV, IT, Furniture)'),
    conservationStatus: conservationStatusEnum
        .optional()
        .describe('Conservation status — defaults to "new"'),
    spaceId: zod_1.z.string().uuid().optional().describe('ID of the space where the equipment is located'),
});
exports.UpdateEquipmentSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional().describe('Equipment name'),
    description: zod_1.z.string().optional().describe('Optional description'),
    manufacturer: zod_1.z.string().optional().describe('Manufacturer name'),
    model: zod_1.z.string().optional().describe('Manufacturer model identifier'),
    serialNumber: zod_1.z.string().min(1).optional().describe('Unique serial number'),
    category: zod_1.z.string().optional().describe('Equipment category (e.g. AV, IT, Furniture)'),
    conservationStatus: conservationStatusEnum
        .optional()
        .describe('Conservation status'),
    spaceId: zod_1.z
        .string()
        .uuid()
        .nullable()
        .optional()
        .describe('ID of the space — set null to unassign'),
});
exports.EquipmentResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().describe('Equipment UUID'),
    name: zod_1.z.string().describe('Equipment name'),
    description: zod_1.z.string().nullable().describe('Optional description'),
    manufacturer: zod_1.z.string().nullable().describe('Manufacturer name'),
    model: zod_1.z.string().nullable().describe('Manufacturer model identifier'),
    serialNumber: zod_1.z.string().describe('Unique serial number'),
    category: zod_1.z.string().nullable().describe('Equipment category'),
    conservationStatus: conservationStatusEnum.describe('Current conservation status'),
    spaceId: zod_1.z.string().uuid().nullable().describe('ID of the assigned space, or null'),
    createdAt: base_dto_1.zodDate.describe('Creation timestamp'),
    updatedAt: base_dto_1.zodDate.describe('Last update timestamp'),
});
//# sourceMappingURL=equipments.validator.js.map