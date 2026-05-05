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
exports.EquipmentsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const equipments_service_1 = require("../services/equipments.service");
const equipments_dto_1 = require("../dto/equipments.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
let EquipmentsController = class EquipmentsController {
    constructor(equipmentsService) {
        this.equipmentsService = equipmentsService;
    }
    create(dto) {
        return this.equipmentsService.create(dto);
    }
    findAll() {
        return this.equipmentsService.findAll();
    }
    findOne(id) {
        return this.equipmentsService.findOne(id);
    }
    update(id, dto) {
        return this.equipmentsService.update(id, dto);
    }
    remove(id) {
        return this.equipmentsService.remove(id);
    }
};
exports.EquipmentsController = EquipmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create an equipment' }),
    (0, swagger_1.ApiCreatedResponse)({ type: equipments_dto_1.EquipmentResponseDto }),
    (0, nestjs_zod_1.ZodSerializerDto)(equipments_dto_1.EquipmentResponseDto),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [equipments_dto_1.CreateEquipmentDto]),
    __metadata("design:returntype", void 0)
], EquipmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all equipments' }),
    (0, swagger_1.ApiOkResponse)({ type: equipments_dto_1.EquipmentResponseDto, isArray: true }),
    (0, nestjs_zod_1.ZodSerializerDto)([equipments_dto_1.EquipmentResponseDto]),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EquipmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an equipment by ID' }),
    (0, swagger_1.ApiOkResponse)({ type: equipments_dto_1.EquipmentResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Equipment not found' }),
    (0, nestjs_zod_1.ZodSerializerDto)(equipments_dto_1.EquipmentResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EquipmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an equipment' }),
    (0, swagger_1.ApiOkResponse)({ type: equipments_dto_1.EquipmentResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Equipment not found' }),
    (0, nestjs_zod_1.ZodSerializerDto)(equipments_dto_1.EquipmentResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, equipments_dto_1.UpdateEquipmentDto]),
    __metadata("design:returntype", void 0)
], EquipmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an equipment' }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Equipment deleted' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Equipment not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EquipmentsController.prototype, "remove", null);
exports.EquipmentsController = EquipmentsController = __decorate([
    (0, swagger_1.ApiTags)('Equipments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('equipments'),
    __metadata("design:paramtypes", [equipments_service_1.EquipmentsService])
], EquipmentsController);
//# sourceMappingURL=equipments.controller.js.map