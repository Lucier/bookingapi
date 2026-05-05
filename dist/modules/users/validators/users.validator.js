"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseSchema = exports.UpdateUserSchema = void 0;
const zod_1 = require("zod");
const base_dto_1 = require("../../../common/dto/base.dto");
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    email: zod_1.z.string().email().optional(),
});
exports.UserResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    role: zod_1.z.enum(['ADMIN', 'USER']),
    createdAt: base_dto_1.zodDate,
    updatedAt: base_dto_1.zodDate,
});
//# sourceMappingURL=users.validator.js.map