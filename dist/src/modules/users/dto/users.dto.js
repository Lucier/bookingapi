"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseDto = exports.UpdateUserDto = void 0;
const openapi = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const users_validator_1 = require("../validators/users.validator");
class UpdateUserDto extends (0, nestjs_zod_1.createZodDto)(users_validator_1.UpdateUserSchema) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateUserDto = UpdateUserDto;
class UserResponseDto extends (0, nestjs_zod_1.createZodDto)(users_validator_1.UserResponseSchema) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UserResponseDto = UserResponseDto;
//# sourceMappingURL=users.dto.js.map