"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeResponseDto = exports.AuthTokensDto = exports.RefreshDto = exports.LoginDto = exports.RegisterDto = void 0;
const openapi = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const auth_validator_1 = require("../validators/auth.validator");
class RegisterDto extends (0, nestjs_zod_1.createZodDto)(auth_validator_1.RegisterSchema) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.RegisterDto = RegisterDto;
class LoginDto extends (0, nestjs_zod_1.createZodDto)(auth_validator_1.LoginSchema) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.LoginDto = LoginDto;
class RefreshDto extends (0, nestjs_zod_1.createZodDto)(auth_validator_1.RefreshSchema) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.RefreshDto = RefreshDto;
class AuthTokensDto extends (0, nestjs_zod_1.createZodDto)(auth_validator_1.AuthTokensSchema) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.AuthTokensDto = AuthTokensDto;
class MeResponseDto extends (0, nestjs_zod_1.createZodDto)(auth_validator_1.MeResponseSchema) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.MeResponseDto = MeResponseDto;
//# sourceMappingURL=auth.dto.js.map