import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getRole } from '@/lib/getRole'
import StatusBadge from '@/components/StatusBadge'
import { deleteMachine } from './actions'

export default async function MachinesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const { q, status } = await searchParams
  const role = await getRole()
  const supabase = await createClient()

  let query = supabase.from('machines').select('*').order('machine_id')
  if (q) {
    const safe = q.replace(/[,()%]/g, '')
    query = query.or(`machine_id.ilike.%${safe}%,name.ilike.%${safe}%`)
  }
  if (status) query = query.eq('status', status)

  const { data: machines } = await query

  return (
    <main className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">เครื่องจักร</h1>
        {role === 'admin' && (
          <Link
            href="/machines/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500"
          >
            + เพิ่มเครื่องจักร
          </Link>
        )}
      </div>

      <form className="flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="ค้นหารหัสหรือชื่อเครื่อง"
          className="px-3 py-2"
        />
        <select name="status" defaultValue={status ?? ''} className="px-3 py-2">
          <option value="">ทุกสถานะ</option>
          <option value="Running">Running</option>
          <option value="Stopped">Stopped</option>
          <option value="Alarm">Alarm</option>
          <option value="Maintenance">Maintenance</option>
        </select>
        <button className="rounded-lg bg-blue-600 px-4 text-white hover:bg-blue-500">
          ค้นหา
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="text-left">
          <thead>
            <tr>
              <th>รหัส</th>
              <th>ชื่อ</th>
              <th>ประเภท</th>
              <th>ที่ตั้ง</th>
              <th>สถานะ</th>
              {role === 'admin' && <th></th>}
            </tr>
          </thead>
          <tbody>
            {machines?.map((m) => (
              <tr key={m.id}>
                <td>{m.machine_id}</td>
                <td>{m.name}</td>
                <td>{m.type}</td>
                <td>{m.location}</td>
                <td>
                  <StatusBadge status={m.status} />
                </td>
                {role === 'admin' && (
                  <td>
                    <div className="flex gap-3">
                      <Link href={`/machines/${m.id}/edit`} className="text-blue-400 hover:underline">
                        แก้ไข
                      </Link>
                      <form action={deleteMachine}>
                        <input type="hidden" name="id" value={m.id} />
                        <button className="text-red-400 hover:underline">ลบ</button>
                      </form>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {machines?.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-500">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}