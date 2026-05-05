declare const CreateMovementDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    equipmentId: import("zod").ZodString;
    originSpaceId: import("zod").ZodOptional<import("zod").ZodString>;
    destinationSpaceId: import("zod").ZodOptional<import("zod").ZodString>;
    movementType: import("zod").ZodEnum<{
        maintenance: "maintenance";
        transfer: "transfer";
        loan: "loan";
        "write-off": "write-off";
    }>;
    description: import("zod").ZodOptional<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class CreateMovementDto extends CreateMovementDto_base {
}
declare const UpdateMovementDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    originSpaceId: import("zod").ZodOptional<import("zod").ZodString>;
    destinationSpaceId: import("zod").ZodOptional<import("zod").ZodString>;
    movementType: import("zod").ZodOptional<import("zod").ZodEnum<{
        maintenance: "maintenance";
        transfer: "transfer";
        loan: "loan";
        "write-off": "write-off";
    }>>;
    description: import("zod").ZodOptional<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateMovementDto extends UpdateMovementDto_base {
}
declare const MovementResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    id: import("zod").ZodString;
    equipmentId: import("zod").ZodString;
    userId: import("zod").ZodString;
    originSpaceId: import("zod").ZodNullable<import("zod").ZodString>;
    destinationSpaceId: import("zod").ZodNullable<import("zod").ZodString>;
    movementType: import("zod").ZodEnum<{
        maintenance: "maintenance";
        transfer: "transfer";
        loan: "loan";
        "write-off": "write-off";
    }>;
    description: import("zod").ZodNullable<import("zod").ZodString>;
    movementDate: import("zod").ZodPipe<import("zod").ZodTransform<unknown, unknown>, import("zod").ZodString>;
    createdAt: import("zod").ZodPipe<import("zod").ZodTransform<unknown, unknown>, import("zod").ZodString>;
    equipmentName: import("zod").ZodNullable<import("zod").ZodString>;
    originSpaceName: import("zod").ZodNullable<import("zod").ZodString>;
    destinationSpaceName: import("zod").ZodNullable<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class MovementResponseDto extends MovementResponseDto_base {
}
export {};
