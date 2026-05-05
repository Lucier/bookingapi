import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto, RefreshDto } from '../dto/auth.dto';
import type { JwtPayload } from '../strategies/jwt.strategy';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(dto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(dto: RefreshDto): Promise<void>;
    me(user: JwtPayload): Promise<Omit<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        passwordHash: string;
        role: "ADMIN" | "USER";
    }, "passwordHash">>;
}
