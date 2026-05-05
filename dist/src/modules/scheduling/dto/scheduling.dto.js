"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingResponseDto = exports.CreateSchedulingDto = void 0;
const openapi = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const scheduling_validator_1 = require("../validators/scheduling.validator");
class CreateSchedulingDto extends (0, nestjs_zod_1.createZodDto)(scheduling_validator_1.CreateSchedulingSchema) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.CreateSchedulingDto = CreateSchedulingDto;
class SchedulingResponseDto extends (0, nestjs_zod_1.createZodDto)(scheduling_validator_1.SchedulingResponseSchema) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.SchedulingResponseDto = SchedulingResponseDto;
//# sourceMappingURL=scheduling.dto.js.map