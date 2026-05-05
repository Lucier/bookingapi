"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovingModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../../database/database.module");
const auth_module_1 = require("../auth/auth.module");
const moving_controller_1 = require("./controllers/moving.controller");
const moving_service_1 = require("./services/moving.service");
const moving_repository_1 = require("./repositories/moving.repository");
let MovingModule = class MovingModule {
};
exports.MovingModule = MovingModule;
exports.MovingModule = MovingModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, auth_module_1.AuthModule],
        controllers: [moving_controller_1.MovingController],
        providers: [moving_service_1.MovingService, moving_repository_1.MovingRepository],
        exports: [moving_service_1.MovingService, moving_repository_1.MovingRepository],
    })
], MovingModule);
//# sourceMappingURL=moving.module.js.map