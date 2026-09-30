import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getRole } from '@/lib/getRole'
import { createClient } from '@/lib/supabase/server'
import MaintenanceForm from '@/components/MaintenanceForm'

export default async function NewMaintenancePage() {
  const role = await getRole()
  if (!role) redirect('/login')

  const supabase = await createClient()
  const { data: machines } = await supabase
    .from('machines')
    .select('id, machine_id, name')
    .order('machine_id')

  return (
    <main className="mx-auto max-w-xl p-6">
      <Link href="/maintenance" className="text-sm text-blue-600 hover:underline">
        &larr; กลับไปรายการซ่อมบำรุง
      </Link>
      <h1 className="mb-4 mt-2 text-2xl font-bold">บันทึกการซ่อมบำรุง</h1>
      <MaintenanceForm machines={machines ?? []} />
    </main>
  )
}