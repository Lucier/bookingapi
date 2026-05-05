"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingResponseSchema = exports.CreateSchedulingSchema = void 0;
const zod_1 = require("zod");
const base_dto_1 = require("../../../common/dto/base.dto");
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
exports.CreateSchedulingSchema = zod_1.z
    .object({
    spaceId: zod_1.z.string().uuid(),
    activityDescription: zod_1.z.string().min(1),
    schedulingDate: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format'),
    startTime: zod_1.z.string().regex(timeRegex, 'Must be HH:mm format'),
    endTime: zod_1.z.string().regex(timeRegex, 'Must be HH:mm format'),
})
    .refine((data) => data.startTime < data.endTime, {
    message: 'startTime must be before endTime',
    path: ['endTime'],
});
exports.SchedulingResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    spaceId: zod_1.z.string().uuid(),
    activityDescription: zod_1.z.string(),
    schedulingDate: zod_1.z.string(),
    startTime: zod_1.z.string(),
    endTime: zod_1.z.string(),
    createdAt: base_dto_1.zodDate,
    updatedAt: base_dto_1.zodDate,
    spaceName: zod_1.z.string().nullable().optional(),
    userName: zod_1.z.string().nullable().optional(),
});
//# sourceMappingURL=scheduling.validator.js.map