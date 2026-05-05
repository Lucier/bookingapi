"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentResponseDto = exports.UpdateEquipmentDto = exports.CreateEquipmentDto = void 0;
const openapi = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const equipments_validator_1 = require("../validators/equipments.validator");
class CreateEquipmentDto extends (0, nestjs_zod_1.createZodDto)(equipments_validator_1.CreateEquipmentSchema) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.CreateEquipmentDto = CreateEquipmentDto;
class UpdateEquipmentDto extends (0, nestjs_zod_1.createZodDto)(equipments_validator_1.UpdateEquipmentSchema) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateEquipmentDto = UpdateEquipmentDto;
class EquipmentResponseDto extends (0, nestjs_zod_1.createZodDto)(equipments_validator_1.EquipmentResponseSchema) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.EquipmentResponseDto = EquipmentResponseDto;
//# sourceMappingURL=equipments.dto.js.map