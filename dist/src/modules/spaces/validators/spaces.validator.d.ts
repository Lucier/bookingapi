import { z } from 'zod';
export declare const CreateSpaceSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        active: "active";
        maintenance: "maintenance";
        inactive: "inactive";
    }>>;
}, z.core.$strip>;
export declare const UpdateSpaceSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        active: "active";
        maintenance: "maintenance";
        inactive: "inactive";
    }>>;
}, z.core.$strip>;
export declare const SpaceResponseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<{
        active: "active";
        maintenance: "maintenance";
        inactive: "inactive";
    }>;
    createdAt: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodString>;
    updatedAt: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodString>;
}, z.core.$strip>;
