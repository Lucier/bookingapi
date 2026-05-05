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
exports.EquipmentsService = void 0;
const common_1 = require("@nestjs/common");
const equipments_repository_1 = require("../repositories/equipments.repository");
let EquipmentsService = class EquipmentsService {
    constructor(equipmentsRepository) {
        this.equipmentsRepository = equipmentsRepository;
    }
    async create(dto) {
        return this.equipmentsRepository.create(dto);
    }
    findAll() {
        return this.equipmentsRepository.findAll();
    }
    async findOne(id) {
        const equipment = await this.equipmentsRepository.findById(id);
        if (!equipment)
            throw new common_1.NotFoundException(`Equipment ${id} not found`);
        return equipment;
    }
    async update(id, dto) {
        await this.findOne(id);
        const updated = await this.equipmentsRepository.update(id, dto);
        if (!updated)
            throw new common_1.NotFoundException(`Equipment ${id} not found`);
        return updated;
    }
    async remove(id) {
        await this.findOne(id);
        await this.equipmentsRepository.delete(id);
    }
};
exports.EquipmentsService = EquipmentsService;
exports.EquipmentsService = EquipmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [equipments_repository_1.EquipmentsRepository])
], EquipmentsService);
//# sourceMappingURL=equipments.service.js.map