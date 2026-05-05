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
exports.MovingRepository = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_provider_1 = require("../../../database/drizzle.provider");
const index_1 = require("../../../database/schema/index");
const buildJoinedSelect = () => {
    const originSpace = (0, pg_core_1.alias)(index_1.spaces, 'origin_space');
    const destinationSpace = (0, pg_core_1.alias)(index_1.spaces, 'destination_space');
    return { originSpace, destinationSpace };
};
let MovingRepository = class MovingRepository {
    constructor(db) {
        this.db = db;
    }
    async create(data) {
        const [movement] = await this.db.insert(index_1.movingEquipment).values(data).returning();
        return movement;
    }
    async findAll() {
        const { originSpace, destinationSpace } = buildJoinedSelect();
        return this.db
            .select({
            id: index_1.movingEquipment.id,
            equipmentId: index_1.movingEquipment.equipmentId,
            userId: index_1.movingEquipment.userId,
            originSpaceId: index_1.movingEquipment.originSpaceId,
            destinationSpaceId: index_1.movingEquipment.destinationSpaceId,
            movementType: index_1.movingEquipment.movementType,
            description: index_1.movingEquipment.description,
            movementDate: index_1.movingEquipment.movementDate,
            createdAt: index_1.movingEquipment.createdAt,
            equipmentName: index_1.equipments.name,
            originSpaceName: originSpace.name,
            destinationSpaceName: destinationSpace.name,
        })
            .from(index_1.movingEquipment)
            .leftJoin(index_1.equipments, (0, drizzle_orm_1.eq)(index_1.movingEquipment.equipmentId, index_1.equipments.id))
            .leftJoin(originSpace, (0, drizzle_orm_1.eq)(index_1.movingEquipment.originSpaceId, originSpace.id))
            .leftJoin(destinationSpace, (0, drizzle_orm_1.eq)(index_1.movingEquipment.destinationSpaceId, destinationSpace.id));
    }
    async findById(id) {
        const { originSpace, destinationSpace } = buildJoinedSelect();
        const [movement] = await this.db
            .select({
            id: index_1.movingEquipment.id,
            equipmentId: index_1.movingEquipment.equipmentId,
            userId: index_1.movingEquipment.userId,
            originSpaceId: index_1.movingEquipment.originSpaceId,
            destinationSpaceId: index_1.movingEquipment.destinationSpaceId,
            movementType: index_1.movingEquipment.movementType,
            description: index_1.movingEquipment.description,
            movementDate: index_1.movingEquipment.movementDate,
            createdAt: index_1.movingEquipment.createdAt,
            equipmentName: index_1.equipments.name,
            originSpaceName: originSpace.name,
            destinationSpaceName: destinationSpace.name,
        })
            .from(index_1.movingEquipment)
            .leftJoin(index_1.equipments, (0, drizzle_orm_1.eq)(index_1.movingEquipment.equipmentId, index_1.equipments.id))
            .leftJoin(originSpace, (0, drizzle_orm_1.eq)(index_1.movingEquipment.originSpaceId, originSpace.id))
            .leftJoin(destinationSpace, (0, drizzle_orm_1.eq)(index_1.movingEquipment.destinationSpaceId, destinationSpace.id))
            .where((0, drizzle_orm_1.eq)(index_1.movingEquipment.id, id));
        return movement;
    }
    async update(id, data) {
        const [updated] = await this.db
            .update(index_1.movingEquipment)
            .set(data)
            .where((0, drizzle_orm_1.eq)(index_1.movingEquipment.id, id))
            .returning();
        return updated;
    }
    async delete(id) {
        await this.db.delete(index_1.movingEquipment).where((0, drizzle_orm_1.eq)(index_1.movingEquipment.id, id));
    }
    async equipmentExists(equipmentId) {
        const [row] = await this.db
            .select({ id: index_1.equipments.id })
            .from(index_1.equipments)
            .where((0, drizzle_orm_1.eq)(index_1.equipments.id, equipmentId));
        return !!row;
    }
};
exports.MovingRepository = MovingRepository;
exports.MovingRepository = MovingRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], MovingRepository);
//# sourceMappingURL=moving.repository.js.map