declare const CreateSpaceDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    name: import("zod").ZodString;
    description: import("zod").ZodOptional<import("zod").ZodString>;
    status: import("zod").ZodOptional<import("zod").ZodEnum<{
        active: "active";
        maintenance: "maintenance";
        inactive: "inactive";
    }>>;
}, import("zod/v4/core").$strip>, false>;
export declare class CreateSpaceDto extends CreateSpaceDto_base {
}
declare const UpdateSpaceDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    name: import("zod").ZodOptional<import("zod").ZodString>;
    description: import("zod").ZodOptional<import("zod").ZodString>;
    status: import("zod").ZodOptional<import("zod").ZodEnum<{
        active: "active";
        maintenance: "maintenance";
        inactive: "inactive";
    }>>;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateSpaceDto extends UpdateSpaceDto_base {
}
declare const SpaceResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    id: import("zod").ZodString;
    name: import("zod").ZodString;
    description: import("zod").ZodNullable<import("zod").ZodString>;
    status: import("zod").ZodEnum<{
        active: "active";
        maintenance: "maintenance";
        inactive: "inactive";
    }>;
    createdAt: import("zod").ZodPipe<import("zod").ZodTransform<unknown, unknown>, import("zod").ZodString>;
    updatedAt: import("zod").ZodPipe<import("zod").ZodTransform<unknown, unknown>, import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class SpaceResponseDto extends SpaceResponseDto_base {
}
export {};
