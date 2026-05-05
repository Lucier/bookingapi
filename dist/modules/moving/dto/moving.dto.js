"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementResponseDto = exports.UpdateMovementDto = exports.CreateMovementDto = void 0;
const openapi = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const moving_validator_1 = require("../validators/moving.validator");
class CreateMovementDto extends (0, nestjs_zod_1.createZodDto)(moving_validator_1.CreateMovementSchema) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.CreateMovementDto = CreateMovementDto;
class UpdateMovementDto extends (0, nestjs_zod_1.createZodDto)(moving_validator_1.UpdateMovementSchema) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateMovementDto = UpdateMovementDto;
class MovementResponseDto extends (0, nestjs_zod_1.createZodDto)(moving_validator_1.MovementResponseSchema) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.MovementResponseDto = MovementResponseDto;
//# sourceMappingURL=moving.dto.js.map