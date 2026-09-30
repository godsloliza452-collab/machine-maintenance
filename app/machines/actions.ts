'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { machineSchema, type MachineInput } from '@/lib/validations/machine'

export async function createMachine(values: MachineInput): Promise<{ error?: string }> {
  const parsed = machineSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase.from('machines').insert(parsed.data)
  if (error) {
    if (error.code === '23505') return { error: 'รหัสเครื่องจักรนี้มีอยู่แล้ว' }
    return { error: 'ไม่สามารถบันทึกได้ (ต้องเป็น admin)' }
  }

  revalidatePath('/machines')
  return {}
}

export async function updateMachine(
  id: string,
  values: MachineInput
): Promise<{ error?: string }> {
  const parsed = machineSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('machines')
    .update(parsed.data)
    .eq('id', id)
    .select('id')
  if (error) {
    if (error.code === '23505') return { error: 'รหัสเครื่องจักรนี้มีอยู่แล้ว' }
    return { error: 'ไม่สามารถแก้ไขได้' }
  }
  if (!data || data.length === 0) return { error: 'ไม่สามารถแก้ไขได้ (ต้องเป็น admin)' }

  revalidatePath('/machines')
  return {}
}

export async function deleteMachine(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('machines').delete().eq('id', id)
  revalidatePath('/machines')
}