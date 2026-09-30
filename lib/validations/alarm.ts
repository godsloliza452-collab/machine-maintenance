import { z } from 'zod'

export const ALARM_STATUSES = ['Open', 'In Progress', 'Closed'] as const

export const alarmSchema = z.object({
  machine_id: z.string().uuid('กรุณาเลือกเครื่องจักร'),
  alarm_code: z.string().trim().min(1, 'กรุณากรอกรหัส Alarm').max(30, 'ยาวเกิน 30 ตัวอักษร'),
  description: z.string().trim().min(1, 'กรุณากรอกรายละเอียด').max(300, 'ยาวเกิน 300 ตัวอักษร'),
  cause: z.string().trim().min(1, 'กรุณากรอกสาเหตุ').max(300, 'ยาวเกิน 300 ตัวอักษร'),
})

export type AlarmInput = z.infer<typeof alarmSchema>