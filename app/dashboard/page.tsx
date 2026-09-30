import Link from 'next/link'
import { getRole } from '@/lib/getRole'
import { createClient } from '@/lib/supabase/server'
import DashboardCharts from '@/components/DashboardCharts'

const MACHINE_STATUSES = ['Running', 'Stopped', 'Alarm', 'Maintenance']
const ALARM_STATUSES = ['Open', 'In Progress', 'Closed']

const COLORS: Record<string, string> = {
  Running: 'text-emerald-400',
  Stopped: 'text-red-400',
  Alarm: 'text-amber-400',
  Maintenance: 'text-sky-400',
  Open: 'text-red-400',
  'In Progress': 'text-amber-400',
  Closed: 'text-emerald-400',
}

function Stat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${color ?? ''}`}>{value}</p>
    </div>
  )
}

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

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-400">ภาพรวมเครื่องจักร, Alarm และงานซ่อมบำรุง</p>
        </div>
        {role === 'admin' && (
          <div className="flex gap-2">
            <Link href="/machines/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500">
              + เพิ่มเครื่องจักร
            </Link>
            <Link href="/alarms/new" className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">
              + เพิ่ม Alarm
            </Link>
          </div>
        )}
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">เครื่องจักร</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <Stat label="ทั้งหมด" value={machines?.length ?? 0} />
          {machineData.map((d) => (
            <Stat key={d.name} label={d.name} value={d.value} color={COLORS[d.name]} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Alarm และงานซ่อมบำรุง</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {alarmData.map((d) => (
            <Stat key={d.name} label={`Alarm: ${d.name}`} value={d.value} color={COLORS[d.name]} />
          ))}
          <Stat label="งานซ่อมบำรุงทั้งหมด" value={maintenanceCount ?? 0} />
        </div>
      </section>

      <DashboardCharts machineData={machineData} alarmData={alarmData} />
    </main>
  )
}