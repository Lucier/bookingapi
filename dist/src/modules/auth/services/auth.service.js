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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const bcrypt = require("bcrypt");
const auth_repository_1 = require("../repositories/auth.repository");
const BCRYPT_ROUNDS = 10;
const REFRESH_EXPIRY_DAYS = 7;
let AuthService = class AuthService {
    constructor(authRepository, jwtService) {
        this.authRepository = authRepository;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existing = await this.authRepository.findUserByEmail(dto.email);
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
        const user = await this.authRepository.createUser({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        return this.issueTokens(user);
    }
    async login(dto) {
        const user = await this.authRepository.findUserByEmail(dto.email);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return this.issueTokens(user);
    }
    async refresh(token) {
        const tokenHash = this.hashToken(token);
        const stored = await this.authRepository.findRefreshToken(tokenHash);
        if (!stored || stored.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        await this.authRepository.deleteRefreshToken(tokenHash);
        const user = await this.authRepository.findUserById(stored.userId);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        return this.issueTokens(user);
    }
    async logout(token) {
        const tokenHash = this.hashToken(token);
        await this.authRepository.deleteRefreshToken(tokenHash);
    }
    async getMe(userId) {
        const user = await this.authRepository.findUserById(userId);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const { passwordHash: _omit, ...rest } = user;
        return rest;
    }
    async issueTokens(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = (0, crypto_1.randomBytes)(64).toString('hex');
        const tokenHash = this.hashToken(refreshToken);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + REFRESH_EXPIRY_DAYS);
        await this.authRepository.saveRefreshToken({ userId: user.id, tokenHash, expiresAt });
        return { accessToken, refreshToken };
    }
    hashToken(token) {
        return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_repository_1.AuthRepository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map