"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSchema = exports.BaseDto = exports.zodDate = void 0;
const openapi = require("@nestjs/swagger");
const zod_1 = require("zod");
const nestjs_zod_1 = require("nestjs-zod");
exports.zodDate = zod_1.z.preprocess(v => v instanceof Date ? v.toISOString() : v, zod_1.z.string());
const BaseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    createdAt: exports.zodDate,
    updatedAt: exports.zodDate,
});
exports.BaseSchema = BaseSchema;
class BaseDto extends (0, nestjs_zod_1.createZodDto)(BaseSchema) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.BaseDto = BaseDto;
//# sourceMappingURL=base.dto.js.map