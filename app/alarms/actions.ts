'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { alarmSchema, ALARM_STATUSES, type AlarmInput } from '@/lib/validations/alarm'

export async function createAlarm(values: AlarmInput): Promise<{ error?: string }> {
  const parsed = alarmSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase.from('alarms').insert(parsed.data)
  if (error) return { error: 'ไม่สามารถบันทึกได้ (ต้องเป็น admin)' }

  revalidatePath('/alarms')
  return {}
}

export async function updateAlarmStatus(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const status = String(formData.get('status') ?? '')
  if (!id || !(ALARM_STATUSES as readonly string[]).includes(status)) return

  const supabase = await createClient()
  await supabase.from('alarms').update({ status }).eq('id', id)
  revalidatePath('/alarms')
}