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
exports.SchedulingService = void 0;
const common_1 = require("@nestjs/common");
const scheduling_repository_1 = require("../repositories/scheduling.repository");
const spaces_repository_1 = require("../../spaces/repositories/spaces.repository");
let SchedulingService = class SchedulingService {
    constructor(schedulingRepository, spacesRepository) {
        this.schedulingRepository = schedulingRepository;
        this.spacesRepository = spacesRepository;
    }
    async create(dto, userId) {
        const space = await this.spacesRepository.findById(dto.spaceId);
        if (!space) {
            throw new common_1.NotFoundException(`Space ${dto.spaceId} not found`);
        }
        if (space.status !== 'active') {
            throw new common_1.ConflictException(`Space ${dto.spaceId} is not active`);
        }
        const overlapping = await this.schedulingRepository.findOverlapping(dto.spaceId, dto.schedulingDate, dto.startTime, dto.endTime);
        if (overlapping.length > 0) {
            throw new common_1.ConflictException('Time slot conflicts with an existing booking for this space');
        }
        return this.schedulingRepository.create({ ...dto, userId });
    }
    findAll() {
        return this.schedulingRepository.findAll();
    }
    async findOne(id) {
        const row = await this.schedulingRepository.findById(id);
        if (!row)
            throw new common_1.NotFoundException(`Scheduling ${id} not found`);
        return row;
    }
    async remove(id) {
        await this.findOne(id);
        await this.schedulingRepository.delete(id);
    }
};
exports.SchedulingService = SchedulingService;
exports.SchedulingService = SchedulingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [scheduling_repository_1.SchedulingRepository,
        spaces_repository_1.SpacesRepository])
], SchedulingService);
//# sourceMappingURL=scheduling.service.js.map