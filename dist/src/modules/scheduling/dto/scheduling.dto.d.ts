declare const CreateSchedulingDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    spaceId: import("zod").ZodString;
    activityDescription: import("zod").ZodString;
    schedulingDate: import("zod").ZodString;
    startTime: import("zod").ZodString;
    endTime: import("zod").ZodString;
}, import("zod/v4/core").$strip>, false>;
export declare class CreateSchedulingDto extends CreateSchedulingDto_base {
}
declare const SchedulingResponseDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    id: import("zod").ZodString;
    userId: import("zod").ZodString;
    spaceId: import("zod").ZodString;
    activityDescription: import("zod").ZodString;
    schedulingDate: import("zod").ZodString;
    startTime: import("zod").ZodString;
    endTime: import("zod").ZodString;
    createdAt: import("zod").ZodPipe<import("zod").ZodTransform<unknown, unknown>, import("zod").ZodString>;
    updatedAt: import("zod").ZodPipe<import("zod").ZodTransform<unknown, unknown>, import("zod").ZodString>;
    spaceName: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
    userName: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
}, import("zod/v4/core").$strip>, false>;
export declare class SchedulingResponseDto extends SchedulingResponseDto_base {
}
export {};
