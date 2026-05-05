import { z } from 'zod'
import { zodDate } from '../../../common/dto/base.dto'

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

export const CreateSchedulingSchema = z
  .object({
    spaceId: z.string().uuid(),
    activityDescription: z.string().min(1),
    schedulingDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format'),
    startTime: z.string().regex(timeRegex, 'Must be HH:mm format'),
    endTime: z.string().regex(timeRegex, 'Must be HH:mm format'),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'startTime must be before endTime',
    path: ['endTime'],
  })

export const SchedulingResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  spaceId: z.string().uuid(),
  activityDescription: z.string(),
  schedulingDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  createdAt: zodDate,
  updatedAt: zodDate,
  spaceName: z.string().nullable().optional(),
  userName: z.string().nullable().optional(),
})
