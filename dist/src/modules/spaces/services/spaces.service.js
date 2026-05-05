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
exports.SpacesService = void 0;
const common_1 = require("@nestjs/common");
const spaces_repository_1 = require("../repositories/spaces.repository");
let SpacesService = class SpacesService {
    constructor(spacesRepository) {
        this.spacesRepository = spacesRepository;
    }
    async create(dto) {
        return this.spacesRepository.create(dto);
    }
    findAll() {
        return this.spacesRepository.findAll();
    }
    async findOne(id) {
        const space = await this.spacesRepository.findById(id);
        if (!space)
            throw new common_1.NotFoundException(`Space ${id} not found`);
        return space;
    }
    async update(id, dto) {
        await this.findOne(id);
        const updated = await this.spacesRepository.update(id, dto);
        if (!updated)
            throw new common_1.NotFoundException(`Space ${id} not found`);
        return updated;
    }
    async remove(id) {
        await this.findOne(id);
        await this.spacesRepository.delete(id);
    }
};
exports.SpacesService = SpacesService;
exports.SpacesService = SpacesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [spaces_repository_1.SpacesRepository])
], SpacesService);
//# sourceMappingURL=spaces.service.js.map