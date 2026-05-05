import { z } from 'zod';
export declare const MovementTypeSchema: z.ZodEnum<{
    maintenance: "maintenance";
    transfer: "transfer";
    loan: "loan";
    "write-off": "write-off";
}>;
export declare const CreateMovementSchema: z.ZodObject<{
    equipmentId: z.ZodString;
    originSpaceId: z.ZodOptional<z.ZodString>;
    destinationSpaceId: z.ZodOptional<z.ZodString>;
    movementType: z.ZodEnum<{
        maintenance: "maintenance";
        transfer: "transfer";
        loan: "loan";
        "write-off": "write-off";
    }>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateMovementSchema: z.ZodObject<{
    originSpaceId: z.ZodOptional<z.ZodString>;
    destinationSpaceId: z.ZodOptional<z.ZodString>;
    movementType: z.ZodOptional<z.ZodEnum<{
        maintenance: "maintenance";
        transfer: "transfer";
        loan: "loan";
        "write-off": "write-off";
    }>>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const MovementResponseSchema: z.ZodObject<{
    id: z.ZodString;
    equipmentId: z.ZodString;
    userId: z.ZodString;
    originSpaceId: z.ZodNullable<z.ZodString>;
    destinationSpaceId: z.ZodNullable<z.ZodString>;
    movementType: z.ZodEnum<{
        maintenance: "maintenance";
        transfer: "transfer";
        loan: "loan";
        "write-off": "write-off";
    }>;
    description: z.ZodNullable<z.ZodString>;
    movementDate: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodString>;
    createdAt: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodString>;
    equipmentName: z.ZodNullable<z.ZodString>;
    originSpaceName: z.ZodNullable<z.ZodString>;
    destinationSpaceName: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
