import { z } from 'zod'

export const STATUSES = ['Running', 'Stopped', 'Alarm', 'Maintenance'] as const

export const machineSchema = z.object({
  machine_id: z
    .string()
    .trim()
    .min(1, 'กรุณากรอกรหัสเครื่อง')
    .max(30, 'รหัสเครื่องยาวเกิน 30 ตัวอักษร')
    .regex(/^[A-Za-z0-9_-]+$/, 'ใช้ได้เฉพาะ A-Z, 0-9, - และ _'),
  name: z.string().trim().min(1, 'กรุณากรอกชื่อเครื่อง').max(100, 'ชื่อยาวเกินไป'),
  type: z.string().trim().min(1, 'กรุณากรอกประเภท').max(100, 'ประเภทยาวเกินไป'),
  location: z.string().trim().min(1, 'กรุณากรอกที่ตั้ง').max(100, 'ที่ตั้งยาวเกินไป'),
  status: z.enum(STATUSES),
})

export type MachineInput = z.infer<typeof machineSchema>