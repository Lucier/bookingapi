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
exports.SchedulingRepository = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_provider_1 = require("../../../database/drizzle.provider");
const index_1 = require("../../../database/schema/index");
const schedulingWithJoinFields = {
    id: index_1.scheduling.id,
    userId: index_1.scheduling.userId,
    spaceId: index_1.scheduling.spaceId,
    activityDescription: index_1.scheduling.activityDescription,
    schedulingDate: index_1.scheduling.schedulingDate,
    startTime: index_1.scheduling.startTime,
    endTime: index_1.scheduling.endTime,
    createdAt: index_1.scheduling.createdAt,
    updatedAt: index_1.scheduling.updatedAt,
    spaceName: index_1.spaces.name,
    userName: index_1.users.name,
};
let SchedulingRepository = class SchedulingRepository {
    constructor(db) {
        this.db = db;
    }
    async create(data) {
        const [row] = await this.db.insert(index_1.scheduling).values(data).returning();
        return row;
    }
    findAll() {
        return this.db
            .select(schedulingWithJoinFields)
            .from(index_1.scheduling)
            .leftJoin(index_1.spaces, (0, drizzle_orm_1.eq)(index_1.scheduling.spaceId, index_1.spaces.id))
            .leftJoin(index_1.users, (0, drizzle_orm_1.eq)(index_1.scheduling.userId, index_1.users.id));
    }
    async findById(id) {
        const [row] = await this.db
            .select(schedulingWithJoinFields)
            .from(index_1.scheduling)
            .leftJoin(index_1.spaces, (0, drizzle_orm_1.eq)(index_1.scheduling.spaceId, index_1.spaces.id))
            .leftJoin(index_1.users, (0, drizzle_orm_1.eq)(index_1.scheduling.userId, index_1.users.id))
            .where((0, drizzle_orm_1.eq)(index_1.scheduling.id, id));
        return row;
    }
    async delete(id) {
        await this.db.delete(index_1.scheduling).where((0, drizzle_orm_1.eq)(index_1.scheduling.id, id));
    }
    findOverlapping(spaceId, schedulingDate, startTime, endTime) {
        return this.db
            .select()
            .from(index_1.scheduling)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(index_1.scheduling.spaceId, spaceId), (0, drizzle_orm_1.eq)(index_1.scheduling.schedulingDate, schedulingDate), (0, drizzle_orm_1.lt)(index_1.scheduling.startTime, endTime), (0, drizzle_orm_1.gt)(index_1.scheduling.endTime, startTime)));
    }
};
exports.SchedulingRepository = SchedulingRepository;
exports.SchedulingRepository = SchedulingRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], SchedulingRepository);
//# sourceMappingURL=scheduling.repository.js.map