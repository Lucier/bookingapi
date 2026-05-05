import { z } from 'zod';
export declare const UpdateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UserResponseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        USER: "USER";
    }>;
    createdAt: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodString>;
    updatedAt: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodString>;
}, z.core.$strip>;
