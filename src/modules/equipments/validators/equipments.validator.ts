import { z } from 'zod'
import { zodDate } from '../../../common/dto/base.dto'

const conservationStatusEnum = z.enum(['new', 'good', 'regular', 'maintenance', 'downloaded'])

export const CreateEquipmentSchema = z.object({
  name: z.string().min(1).describe('Equipment name'),
  description: z.string().optional().describe('Optional description'),
  manufacturer: z.string().optional().describe('Manufacturer name'),
  model: z.string().optional().describe('Manufacturer model identifier'),
  serialNumber: z.string().min(1).describe('Unique serial number'),
  category: z.string().optional().describe('Equipment category (e.g. AV, IT, Furniture)'),
  conservationStatus: conservationStatusEnum
    .optional()
    .describe('Conservation status — defaults to "new"'),
  spaceId: z.string().uuid().optional().describe('ID of the space where the equipment is located'),
})

export const UpdateEquipmentSchema = z.object({
  name: z.string().min(1).optional().describe('Equipment name'),
  description: z.string().optional().describe('Optional description'),
  manufacturer: z.string().optional().describe('Manufacturer name'),
  model: z.string().optional().describe('Manufacturer model identifier'),
  serialNumber: z.string().min(1).optional().describe('Unique serial number'),
  category: z.string().optional().describe('Equipment category (e.g. AV, IT, Furniture)'),
  conservationStatus: conservationStatusEnum
    .optional()
    .describe('Conservation status'),
  spaceId: z
    .string()
    .uuid()
    .nullable()
    .optional()
    .describe('ID of the space — set null to unassign'),
})

export const EquipmentResponseSchema = z.object({
  id: z.string().uuid().describe('Equipment UUID'),
  name: z.string().describe('Equipment name'),
  description: z.string().nullable().describe('Optional description'),
  manufacturer: z.string().nullable().describe('Manufacturer name'),
  model: z.string().nullable().describe('Manufacturer model identifier'),
  serialNumber: z.string().describe('Unique serial number'),
  category: z.string().nullable().describe('Equipment category'),
  conservationStatus: conservationStatusEnum.describe('Current conservation status'),
  spaceId: z.string().uuid().nullable().describe('ID of the assigned space, or null'),
  createdAt: zodDate.describe('Creation timestamp'),
  updatedAt: zodDate.describe('Last update timestamp'),
})
