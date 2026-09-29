'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { machineSchema, type MachineInput } from '@/lib/validations/machine'

type Result = { error?: string }

function toMessage(error: { code?: string }) {
  return error.code === '23505'
    ? 'รหัสเครื่องจักรนี้มีอยู่แล้ว'
    : 'บันทึกไม่สำเร็จ (สิทธิ์ไม่พอหรือข้อมูลไม่ถูกต้อง)'
}

export async function createMachine(values: MachineInput): Promise<Result> {
  const parsed = machineSchema.safeParse(values)
  if (!parsed.success) return { error: 'ข้อมูลไม่ถูกต้อง' }

  const supabase = await createClient()
  const { error } = await supabase.from('machines').insert(parsed.data)
  if (error) return { error: toMessage(error) }

  revalidatePath('/machines')
  return {}
}

export async function updateMachine(id: string, values: MachineInput): Promise<Result> {
  const parsed = machineSchema.safeParse(values)
  if (!parsed.success) return { error: 'ข้อมูลไม่ถูกต้อง' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('machines')
    .update(parsed.data)
    .eq('id', id)
    .select('id')
  if (error) return { error: toMessage(error) }
  // RLS ที่ปฏิเสธการแก้ไขจะไม่ส่ง error แต่ไม่มีแถวถูกแก้
  if (!data || data.length === 0) return { error: 'ไม่มีสิทธิ์แก้ไขหรือไม่พบเครื่องจักร' }

  revalidatePath('/machines')
  return {}
}

export async function deleteMachine(formData: FormData) {
  const supabase = await createClient()
  await supabase.from('machines').delete().eq('id', String(formData.get('id')))
  revalidatePath('/machines')
}