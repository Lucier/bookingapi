import { z } from 'zod';
export declare const CreateSchedulingSchema: z.ZodObject<{
    spaceId: z.ZodString;
    activityDescription: z.ZodString;
    schedulingDate: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
}, z.core.$strip>;
export declare const SchedulingResponseSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    spaceId: z.ZodString;
    activityDescription: z.ZodString;
    schedulingDate: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    createdAt: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodString>;
    updatedAt: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodString>;
    spaceName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    userName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
