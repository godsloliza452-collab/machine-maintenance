import Link from 'next/link'
import { getRole } from '@/lib/getRole'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import DashboardCharts from '@/components/DashboardCharts'

const MACHINE_STATUSES = ['Running', 'Stopped', 'Alarm', 'Maintenance']
const ALARM_STATUSES = ['Open', 'In Progress', 'Closed']

export default async function DashboardPage() {
  const role = await getRole()
  const supabase = await createClient()

  const [{ data: machines }, { data: alarms }, { count: maintenanceCount }] =
    await Promise.all([
      supabase.from('machines').select('status'),
      supabase.from('alarms').select('status'),
      supabase.from('maintenance_records').select('*', { count: 'exact', head: true }),
    ])

  const machineData = MACHINE_STATUSES.map((s) => ({
    name: s,
    value: machines?.filter((m) => m.status === s).length ?? 0,
  }))
  const alarmData = ALARM_STATUSES.map((s) => ({
    name: s,
    value: alarms?.filter((a) => a.status === s).length ?? 0,
  }))

  const cards = [
    { label: 'เครื่องจักรทั้งหมด', value: machines?.length ?? 0 },
    ...machineData.map((d) => ({ label: d.name, value: d.value })),
    ...alarmData.map((d) => ({ label: `Alarm: ${d.name}`, value: d.value })),
    { label: 'งานซ่อมบำรุงทั้งหมด', value: maintenanceCount ?? 0 },
  ]

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>
      <p>บทบาทของคุณ: <b>{role ?? 'ไม่พบข้อมูล role'}</b></p>

      <div className="flex flex-wrap gap-4">
        <Link href="/machines" className="text-blue-600 underline">รายการเครื่องจักร</Link>
        <Link href="/alarms" className="text-blue-600 underline">รายการ Alarm</Link>
        <Link href="/maintenance" className="text-blue-600 underline">การซ่อมบำรุง</Link>
        {role === 'admin' && (
          <>
            <Link href="/machines/new" className="text-blue-600 underline">เพิ่มเครื่องจักร</Link>
            <Link href="/alarms/new" className="text-blue-600 underline">เพิ่ม Alarm</Link>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="border rounded p-4">
            <p className="text-sm opacity-70">{c.label}</p>
            <p className="text-3xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <DashboardCharts machineData={machineData} alarmData={alarmData} />
    </main>
  )
}