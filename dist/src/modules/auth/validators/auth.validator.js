"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeResponseSchema = exports.AuthTokensSchema = exports.RefreshSchema = exports.LoginSchema = exports.RegisterSchema = void 0;
const zod_1 = require("zod");
const base_dto_1 = require("../../../common/dto/base.dto");
exports.RegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.RefreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1),
});
exports.AuthTokensSchema = zod_1.z.object({
    accessToken: zod_1.z.string(),
    refreshToken: zod_1.z.string(),
});
exports.MeResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    role: zod_1.z.enum(['ADMIN', 'USER']),
    createdAt: base_dto_1.zodDate,
    updatedAt: base_dto_1.zodDate,
});
//# sourceMappingURL=auth.validator.js.map