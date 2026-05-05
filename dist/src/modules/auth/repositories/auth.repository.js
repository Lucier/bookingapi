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
exports.AuthRepository = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_provider_1 = require("../../../database/drizzle.provider");
const index_1 = require("../../../database/schema/index");
let AuthRepository = class AuthRepository {
    constructor(db) {
        this.db = db;
    }
    async findUserByEmail(email) {
        const [user] = await this.db.select().from(index_1.users).where((0, drizzle_orm_1.eq)(index_1.users.email, email));
        return user;
    }
    async findUserById(id) {
        const [user] = await this.db.select().from(index_1.users).where((0, drizzle_orm_1.eq)(index_1.users.id, id));
        return user;
    }
    async createUser(data) {
        const [user] = await this.db
            .insert(index_1.users)
            .values({ ...data, role: 'USER' })
            .returning();
        return user;
    }
    async saveRefreshToken(data) {
        await this.db.insert(index_1.refreshTokens).values(data);
    }
    async findRefreshToken(tokenHash) {
        const [token] = await this.db
            .select()
            .from(index_1.refreshTokens)
            .where((0, drizzle_orm_1.eq)(index_1.refreshTokens.tokenHash, tokenHash));
        return token;
    }
    async deleteRefreshToken(tokenHash) {
        await this.db.delete(index_1.refreshTokens).where((0, drizzle_orm_1.eq)(index_1.refreshTokens.tokenHash, tokenHash));
    }
    async deleteUserRefreshTokens(userId) {
        await this.db.delete(index_1.refreshTokens).where((0, drizzle_orm_1.eq)(index_1.refreshTokens.userId, userId));
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], AuthRepository);
//# sourceMappingURL=auth.repository.js.map