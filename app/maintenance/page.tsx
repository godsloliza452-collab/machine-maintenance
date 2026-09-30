import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getRole } from '@/lib/getRole'
import { deleteMaintenance } from './actions'

export default async function MaintenancePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; machine?: string }>
}) {
  const { q, machine } = await searchParams
  const role = await getRole()
  const supabase = await createClient()

  const { data: machines } = await supabase
    .from('machines')
    .select('id, machine_id, name')
    .order('machine_id')

  let query = supabase
    .from('maintenance_records')
    .select('*, machines(machine_id, name), profiles(full_name)')
    .order('maintained_at', { ascending: false })
  if (q) {
    const safe = q.replace(/[,()%]/g, '')
    query = query.ilike('description', `%${safe}%`)
  }
  if (machine) query = query.eq('machine_id', machine)

  const { data: records } = await query

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">การซ่อมบำรุง</h1>
        <div className="flex gap-4">
          <Link href="/dashboard" className="underline">Dashboard</Link>
          <Link href="/maintenance/new" className="text-blue-600 underline">
            บันทึกการซ่อมบำรุง
          </Link>
        </div>
      </div>

      <form className="flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="ค้นหารายละเอียด"
          className="border rounded px-3 py-2 bg-transparent" />
        <select name="machine" defaultValue={machine ?? ''}
          className="border rounded px-3 py-2 bg-transparent">
          <option value="">ทุกเครื่อง</option>
          {machines?.map((m) => (
            <option key={m.id} value={m.id}>{m.machine_id}</option>
          ))}
        </select>
        <button className="bg-blue-600 text-white rounded px-4">ค้นหา</button>
      </form>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2">เครื่อง</th>
            <th>รายละเอียด</th>
            <th>ผู้บันทึก</th>
            <th>วันที่</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {records?.map((r) => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.machines?.machine_id}</td>
              <td>{r.description}</td>
              <td>{r.profiles?.full_name ?? '-'}</td>
              <td>{new Date(r.maintained_at).toLocaleString('th-TH')}</td>
              <td>
                <div className="flex gap-3">
                  <Link href={`/maintenance/${r.id}/edit`} className="text-blue-600 underline">
                    แก้ไข
                  </Link>
                  {role === 'admin' && (
                    <form action={deleteMaintenance}>
                      <input type="hidden" name="id" value={r.id} />
                      <button className="text-red-600 underline">ลบ</button>
                    </form>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {records?.length === 0 && (
            <tr><td colSpan={5} className="py-4 text-center">ไม่พบข้อมูล</td></tr>
          )}
        </tbody>
      </table>
    </main>
  )
}