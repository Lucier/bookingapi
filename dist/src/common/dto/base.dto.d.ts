import { z } from 'zod';
export declare const zodDate: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodString>;
declare const BaseSchema: z.ZodObject<{
    id: z.ZodString;
    createdAt: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodString>;
    updatedAt: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodString>;
}, z.core.$strip>;
declare const BaseDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    id: z.ZodString;
    createdAt: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodString>;
    updatedAt: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodString>;
}, z.core.$strip>, false>;
export declare class BaseDto extends BaseDto_base {
}
export { BaseSchema };
