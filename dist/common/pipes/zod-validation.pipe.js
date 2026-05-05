"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodValidationPipe = exports.CustomZodValidationPipe = void 0;
const nestjs_zod_1 = require("nestjs-zod");
Object.defineProperty(exports, "ZodValidationPipe", { enumerable: true, get: function () { return nestjs_zod_1.ZodValidationPipe; } });
class CustomZodValidationPipe extends nestjs_zod_1.ZodValidationPipe {
}
exports.CustomZodValidationPipe = CustomZodValidationPipe;
//# sourceMappingURL=zod-validation.pipe.js.map