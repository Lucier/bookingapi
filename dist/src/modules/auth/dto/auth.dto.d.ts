declare const RegisterDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    name: import("zod").ZodString;
    email: import("zod").ZodString;
    password: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class RegisterDto extends RegisterDto_base {
}
declare const LoginDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    email: import("zod").ZodString;
    password: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class LoginDto extends LoginDto_base {
}
declare const RefreshDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    refreshToken: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class RefreshDto extends RefreshDto_base {
}
declare const AuthTokensDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    accessToken: import("zod").ZodString;
    refreshToken: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class AuthTokensDto extends AuthTokensDto_base {
}
declare const MeResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    id: import("zod").ZodString;
    name: import("zod").ZodString;
    email: import("zod").ZodString;
    role: import("zod").ZodEnum<{
        ADMIN: "ADMIN";
        USER: "USER";
    }>;
    createdAt: import("zod").ZodPipe<import("zod").ZodTransform<unknown, unknown>, import("zod").ZodString>;
    updatedAt: import("zod").ZodPipe<import("zod").ZodTransform<unknown, unknown>, import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class MeResponseDto extends MeResponseDto_base {
}
export {};
