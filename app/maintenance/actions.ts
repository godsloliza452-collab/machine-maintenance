'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { maintenanceSchema, type MaintenanceInput } from '@/lib/validations/maintenance'

export async function createMaintenance(values: MaintenanceInput): Promise<{ error?: string }> {
  const parsed = maintenanceSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'กรุณาเข้าสู่ระบบ' }

  const { error } = await supabase
    .from('maintenance_records')
    .insert({ ...parsed.data, technician_id: user.id })
  if (error) return { error: 'ไม่สามารถบันทึกได้' }

  revalidatePath('/maintenance')
  return {}
}

export async function updateMaintenance(
  id: string,
  values: MaintenanceInput
): Promise<{ error?: string }> {
  const parsed = maintenanceSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('maintenance_records')
    .update(parsed.data)
    .eq('id', id)
    .select('id')
  if (error || !data || data.length === 0) return { error: 'ไม่สามารถแก้ไขได้' }

  revalidatePath('/maintenance')
  return {}
}

export async function deleteMaintenance(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('maintenance_records').delete().eq('id', id)
  revalidatePath('/maintenance')
}