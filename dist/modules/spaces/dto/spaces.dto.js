"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceResponseDto = exports.UpdateSpaceDto = exports.CreateSpaceDto = void 0;
const openapi = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const spaces_validator_1 = require("../validators/spaces.validator");
class CreateSpaceDto extends (0, nestjs_zod_1.createZodDto)(spaces_validator_1.CreateSpaceSchema) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.CreateSpaceDto = CreateSpaceDto;
class UpdateSpaceDto extends (0, nestjs_zod_1.createZodDto)(spaces_validator_1.UpdateSpaceSchema) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateSpaceDto = UpdateSpaceDto;
class SpaceResponseDto extends (0, nestjs_zod_1.createZodDto)(spaces_validator_1.SpaceResponseSchema) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.SpaceResponseDto = SpaceResponseDto;
//# sourceMappingURL=spaces.dto.js.map