import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getRole } from '@/lib/getRole'
import { createClient } from '@/lib/supabase/server'
import AlarmForm from '@/components/AlarmForm'

export default async function NewAlarmPage() {
  const role = await getRole()
  if (role !== 'admin') redirect('/alarms')

  const supabase = await createClient()
  const { data: machines } = await supabase
    .from('machines')
    .select('id, machine_id, name')
    .order('machine_id')

  return (
    <main className="mx-auto max-w-xl p-6">
      <Link href="/alarms" className="text-sm text-blue-600 hover:underline">
        &larr; กลับไปรายการ Alarm
      </Link>
      <h1 className="mb-4 mt-2 text-2xl font-bold">เพิ่ม Alarm</h1>
      <AlarmForm machines={machines ?? []} />
    </main>
  )
}