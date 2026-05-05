declare const UpdateUserDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    name: import("zod").ZodOptional<import("zod").ZodString>;
    email: import("zod").ZodOptional<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
declare const UserResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
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
export declare class UserResponseDto extends UserResponseDto_base {
}
export {};
