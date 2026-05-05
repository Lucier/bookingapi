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
exports.SchedulingController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const scheduling_service_1 = require("../services/scheduling.service");
const scheduling_dto_1 = require("../dto/scheduling.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
let SchedulingController = class SchedulingController {
    constructor(schedulingService) {
        this.schedulingService = schedulingService;
    }
    create(dto, user) {
        return this.schedulingService.create(dto, user.sub);
    }
    findAll() {
        return this.schedulingService.findAll();
    }
    findOne(id) {
        return this.schedulingService.findOne(id);
    }
    remove(id) {
        return this.schedulingService.remove(id);
    }
};
exports.SchedulingController = SchedulingController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a scheduling' }),
    (0, swagger_1.ApiCreatedResponse)({ type: scheduling_dto_1.SchedulingResponseDto }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'Time slot conflicts with an existing booking',
    }),
    (0, nestjs_zod_1.ZodSerializerDto)(scheduling_dto_1.SchedulingResponseDto),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [scheduling_dto_1.CreateSchedulingDto, Object]),
    __metadata("design:returntype", void 0)
], SchedulingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all schedulings' }),
    (0, swagger_1.ApiOkResponse)({ type: scheduling_dto_1.SchedulingResponseDto, isArray: true }),
    (0, nestjs_zod_1.ZodSerializerDto)([scheduling_dto_1.SchedulingResponseDto]),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SchedulingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get scheduling by ID' }),
    (0, swagger_1.ApiOkResponse)({ type: scheduling_dto_1.SchedulingResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Scheduling not found' }),
    (0, nestjs_zod_1.ZodSerializerDto)(scheduling_dto_1.SchedulingResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SchedulingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a scheduling' }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Scheduling deleted' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Scheduling not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SchedulingController.prototype, "remove", null);
exports.SchedulingController = SchedulingController = __decorate([
    (0, swagger_1.ApiTags)('Scheduling'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('scheduling'),
    __metadata("design:paramtypes", [scheduling_service_1.SchedulingService])
], SchedulingController);
//# sourceMappingURL=scheduling.controller.js.map