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
exports.EquipmentsRepository = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_provider_1 = require("../../../database/drizzle.provider");
const index_1 = require("../../../database/schema/index");
let EquipmentsRepository = class EquipmentsRepository {
    constructor(db) {
        this.db = db;
    }
    async create(data) {
        const [equipment] = await this.db.insert(index_1.equipments).values(data).returning();
        return equipment;
    }
    findAll() {
        return this.db.select().from(index_1.equipments);
    }
    async findById(id) {
        const [equipment] = await this.db
            .select()
            .from(index_1.equipments)
            .where((0, drizzle_orm_1.eq)(index_1.equipments.id, id));
        return equipment;
    }
    async update(id, data) {
        const [updated] = await this.db
            .update(index_1.equipments)
            .set({ ...data, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(index_1.equipments.id, id))
            .returning();
        return updated;
    }
    async delete(id) {
        await this.db.delete(index_1.equipments).where((0, drizzle_orm_1.eq)(index_1.equipments.id, id));
    }
};
exports.EquipmentsRepository = EquipmentsRepository;
exports.EquipmentsRepository = EquipmentsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], EquipmentsRepository);
//# sourceMappingURL=equipments.repository.js.map