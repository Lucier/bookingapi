import { z } from 'zod';
export declare const CreateEquipmentSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    manufacturer: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    serialNumber: z.ZodString;
    category: z.ZodOptional<z.ZodString>;
    conservationStatus: z.ZodOptional<z.ZodEnum<{
        new: "new";
        good: "good";
        regular: "regular";
        maintenance: "maintenance";
        downloaded: "downloaded";
    }>>;
    spaceId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateEquipmentSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    manufacturer: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    serialNumber: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    conservationStatus: z.ZodOptional<z.ZodEnum<{
        new: "new";
        good: "good";
        regular: "regular";
        maintenance: "maintenance";
        downloaded: "downloaded";
    }>>;
    spaceId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const EquipmentResponseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    manufacturer: z.ZodNullable<z.ZodString>;
    model: z.ZodNullable<z.ZodString>;
    serialNumber: z.ZodString;
    category: z.ZodNullable<z.ZodString>;
    conservationStatus: z.ZodEnum<{
        new: "new";
        good: "good";
        regular: "regular";
        maintenance: "maintenance";
        downloaded: "downloaded";
    }>;
    spaceId: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodString>;
    updatedAt: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodString>;
}, z.core.$strip>;
