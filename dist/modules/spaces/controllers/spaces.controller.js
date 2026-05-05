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
exports.SpacesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const spaces_service_1 = require("../services/spaces.service");
const spaces_dto_1 = require("../dto/spaces.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
let SpacesController = class SpacesController {
    constructor(spacesService) {
        this.spacesService = spacesService;
    }
    create(dto) {
        return this.spacesService.create(dto);
    }
    findAll() {
        return this.spacesService.findAll();
    }
    findOne(id) {
        return this.spacesService.findOne(id);
    }
    update(id, dto) {
        return this.spacesService.update(id, dto);
    }
    remove(id) {
        return this.spacesService.remove(id);
    }
};
exports.SpacesController = SpacesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a space' }),
    (0, swagger_1.ApiCreatedResponse)({ type: spaces_dto_1.SpaceResponseDto }),
    (0, nestjs_zod_1.ZodSerializerDto)(spaces_dto_1.SpaceResponseDto),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [spaces_dto_1.CreateSpaceDto]),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all spaces' }),
    (0, swagger_1.ApiOkResponse)({ type: spaces_dto_1.SpaceResponseDto, isArray: true }),
    (0, nestjs_zod_1.ZodSerializerDto)([spaces_dto_1.SpaceResponseDto]),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a space by ID' }),
    (0, swagger_1.ApiOkResponse)({ type: spaces_dto_1.SpaceResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Space not found' }),
    (0, nestjs_zod_1.ZodSerializerDto)(spaces_dto_1.SpaceResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a space' }),
    (0, swagger_1.ApiOkResponse)({ type: spaces_dto_1.SpaceResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Space not found' }),
    (0, nestjs_zod_1.ZodSerializerDto)(spaces_dto_1.SpaceResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, spaces_dto_1.UpdateSpaceDto]),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a space' }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Space deleted' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Space not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "remove", null);
exports.SpacesController = SpacesController = __decorate([
    (0, swagger_1.ApiTags)('Spaces'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('spaces'),
    __metadata("design:paramtypes", [spaces_service_1.SpacesService])
], SpacesController);
//# sourceMappingURL=spaces.controller.js.map