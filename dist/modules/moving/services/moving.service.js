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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovingService = void 0;
const common_1 = require("@nestjs/common");
const moving_repository_1 = require("../repositories/moving.repository");
let MovingService = class MovingService {
    constructor(movingRepository) {
        this.movingRepository = movingRepository;
    }
    async create(dto, userId) {
        const exists = await this.movingRepository.equipmentExists(dto.equipmentId);
        if (!exists)
            throw new common_1.NotFoundException(`Equipment ${dto.equipmentId} not found`);
        if (dto.movementType === 'transfer' && !dto.destinationSpaceId) {
            throw new common_1.BadRequestException('destinationSpaceId is required for transfer movements');
        }
        const row = await this.movingRepository.create({ ...dto, userId });
        return this.movingRepository.findById(row.id);
    }
    findAll() {
        return this.movingRepository.findAll();
    }
    async findOne(id) {
        const movement = await this.movingRepository.findById(id);
        if (!movement)
            throw new common_1.NotFoundException(`Movement ${id} not found`);
        return movement;
    }
    async update(id, dto) {
        await this.findOne(id);
        await this.movingRepository.update(id, dto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.findOne(id);
        await this.movingRepository.delete(id);
    }
};
exports.MovingService = MovingService;
exports.MovingService = MovingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [moving_repository_1.MovingRepository])
], MovingService);
//# sourceMappingURL=moving.service.js.map