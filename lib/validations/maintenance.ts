import { z } from 'zod'

export const maintenanceSchema = z.object({
  machine_id: z.string().uuid('กรุณาเลือกเครื่องจักร'),
  description: z.string().trim().min(1, 'กรุณากรอกรายละเอียด').max(500, 'ยาวเกิน 500 ตัวอักษร'),
})

export type MaintenanceInput = z.infer<typeof maintenanceSchema>