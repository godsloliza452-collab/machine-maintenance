import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getRole } from '@/lib/getRole'
import { ALARM_STATUSES } from '@/lib/validations/alarm'
import { updateAlarmStatus } from './actions'

export default async function AlarmsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; machine?: string }>
}) {
  const { q, status, machine } = await searchParams
  const role = await getRole()
  const supabase = await createClient()

  const { data: machines } = await supabase
    .from('machines')
    .select('id, machine_id, name')
    .order('machine_id')

  let query = supabase
    .from('alarms')
    .select('*, machines(machine_id, name)')
    .order('occurred_at', { ascending: false })
  if (q) {
    const safe = q.replace(/[,()%]/g, '')
    query = query.ilike('alarm_code', `%${safe}%`)
  }
  if (status) query = query.eq('status', status)
  if (machine) query = query.eq('machine_id', machine)

  const { data: alarms } = await query

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Alarm</h1>
        <div className="flex gap-4">
          <Link href="/dashboard" className="underline">Dashboard</Link>
          {role === 'admin' && (
            <Link href="/alarms/new" className="text-blue-600 underline">เพิ่ม Alarm</Link>
          )}
        </div>
      </div>

      <form className="flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="ค้นหารหัส Alarm"
          className="border rounded px-3 py-2 bg-transparent" />
        <select name="machine" defaultValue={machine ?? ''}
          className="border rounded px-3 py-2 bg-transparent">
          <option value="">ทุกเครื่อง</option>
          {machines?.map((m) => (
            <option key={m.id} value={m.id}>{m.machine_id}</option>
          ))}
        </select>
        <select name="status" defaultValue={status ?? ''}
          className="border rounded px-3 py-2 bg-transparent">
          <option value="">ทุกสถานะ</option>
          {ALARM_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="bg-blue-600 text-white rounded px-4">ค้นหา</button>
      </form>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2">เครื่อง</th>
            <th>รหัส</th>
            <th>รายละเอียด</th>
            <th>เวลา</th>
            <th>สาเหตุ</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {alarms?.map((a) => (
            <tr key={a.id} className="border-b">
              <td className="py-2">{a.machines?.machine_id}</td>
              <td>{a.alarm_code}</td>
              <td>{a.description}</td>
              <td>{new Date(a.occurred_at).toLocaleString('th-TH')}</td>
              <td>{a.cause}</td>
              <td>
                <form action={updateAlarmStatus} className="flex gap-2">
                  <input type="hidden" name="id" value={a.id} />
                  <select name="status" defaultValue={a.status}
                    className="border rounded px-2 py-1 bg-transparent">
                    {ALARM_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button className="text-blue-600 underline">บันทึก</button>
                </form>
              </td>
            </tr>
          ))}
          {alarms?.length === 0 && (
            <tr><td colSpan={6} className="py-4 text-center">ไม่พบข้อมูล</td></tr>
          )}
        </tbody>
      </table>
    </main>
  )
}