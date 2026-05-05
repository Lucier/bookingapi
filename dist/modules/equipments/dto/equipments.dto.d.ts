declare const CreateEquipmentDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    name: import("zod").ZodString;
    description: import("zod").ZodOptional<import("zod").ZodString>;
    manufacturer: import("zod").ZodOptional<import("zod").ZodString>;
    model: import("zod").ZodOptional<import("zod").ZodString>;
    serialNumber: import("zod").ZodString;
    category: import("zod").ZodOptional<import("zod").ZodString>;
    conservationStatus: import("zod").ZodOptional<import("zod").ZodEnum<{
        new: "new";
        good: "good";
        regular: "regular";
        maintenance: "maintenance";
        downloaded: "downloaded";
    }>>;
    spaceId: import("zod").ZodOptional<import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class CreateEquipmentDto extends CreateEquipmentDto_base {
}
declare const UpdateEquipmentDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    name: import("zod").ZodOptional<import("zod").ZodString>;
    description: import("zod").ZodOptional<import("zod").ZodString>;
    manufacturer: import("zod").ZodOptional<import("zod").ZodString>;
    model: import("zod").ZodOptional<import("zod").ZodString>;
    serialNumber: import("zod").ZodOptional<import("zod").ZodString>;
    category: import("zod").ZodOptional<import("zod").ZodString>;
    conservationStatus: import("zod").ZodOptional<import("zod").ZodEnum<{
        new: "new";
        good: "good";
        regular: "regular";
        maintenance: "maintenance";
        downloaded: "downloaded";
    }>>;
    spaceId: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
}, import("zod/v4/core").$strip>, false>;
export declare class UpdateEquipmentDto extends UpdateEquipmentDto_base {
}
declare const EquipmentResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    id: import("zod").ZodString;
    name: import("zod").ZodString;
    description: import("zod").ZodNullable<import("zod").ZodString>;
    manufacturer: import("zod").ZodNullable<import("zod").ZodString>;
    model: import("zod").ZodNullable<import("zod").ZodString>;
    serialNumber: import("zod").ZodString;
    category: import("zod").ZodNullable<import("zod").ZodString>;
    conservationStatus: import("zod").ZodEnum<{
        new: "new";
        good: "good";
        regular: "regular";
        maintenance: "maintenance";
        downloaded: "downloaded";
    }>;
    spaceId: import("zod").ZodNullable<import("zod").ZodString>;
    createdAt: import("zod").ZodPipe<import("zod").ZodTransform<unknown, unknown>, import("zod").ZodString>;
    updatedAt: import("zod").ZodPipe<import("zod").ZodTransform<unknown, unknown>, import("zod").ZodString>;
}, import("zod/v4/core").$strip>, false>;
export declare class EquipmentResponseDto extends EquipmentResponseDto_base {
}
export {};
