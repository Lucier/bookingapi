"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovingController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const moving_service_1 = require("../services/moving.service");
const moving_dto_1 = require("../dto/moving.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
let MovingController = class MovingController {
    constructor(movingService) {
        this.movingService = movingService;
    }
    create(dto, user) {
        return this.movingService.create(dto, user.sub);
    }
    findAll() {
        return this.movingService.findAll();
    }
    findOne(id) {
        return this.movingService.findOne(id);
    }
    update(id, dto) {
        return this.movingService.update(id, dto);
    }
    remove(id) {
        return this.movingService.remove(id);
    }
};
exports.MovingController = MovingController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register an equipment movement' }),
    (0, swagger_1.ApiCreatedResponse)({ type: moving_dto_1.MovementResponseDto }),
    (0, nestjs_zod_1.ZodSerializerDto)(moving_dto_1.MovementResponseDto),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [moving_dto_1.CreateMovementDto, Object]),
    __metadata("design:returntype", void 0)
], MovingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all movements' }),
    (0, swagger_1.ApiOkResponse)({ type: moving_dto_1.MovementResponseDto, isArray: true }),
    (0, nestjs_zod_1.ZodSerializerDto)([moving_dto_1.MovementResponseDto]),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MovingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a movement by ID' }),
    (0, swagger_1.ApiOkResponse)({ type: moving_dto_1.MovementResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Movement not found' }),
    (0, nestjs_zod_1.ZodSerializerDto)(moving_dto_1.MovementResponseDto),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MovingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Correct a movement log (admin only)' }),
    (0, swagger_1.ApiOkResponse)({ type: moving_dto_1.MovementResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Movement not found' }),
    (0, nestjs_zod_1.ZodSerializerDto)(moving_dto_1.MovementResponseDto),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, moving_dto_1.UpdateMovementDto]),
    __metadata("design:returntype", void 0)
], MovingController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a movement log (admin only)' }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Movement deleted' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Movement not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MovingController.prototype, "remove", null);
exports.MovingController = MovingController = __decorate([
    (0, swagger_1.ApiTags)('Moving'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('moving'),
    __metadata("design:paramtypes", [moving_service_1.MovingService])
], MovingController);
//# sourceMappingURL=moving.controller.js.map