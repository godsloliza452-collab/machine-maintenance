import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getRole } from '@/lib/getRole'
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
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">เครื่องจักร</h1>
        <div className="flex gap-4">
          <Link href="/dashboard" className="underline">Dashboard</Link>
          {role === 'admin' && (
            <Link href="/machines/new" className="text-blue-600 underline">
              เพิ่มเครื่องจักร
            </Link>
          )}
        </div>
      </div>

      <form className="flex gap-2">
        <input name="q" defaultValue={q} placeholder="ค้นหารหัสหรือชื่อเครื่อง"
          className="border rounded px-3 py-2 bg-transparent" />
        <select name="status" defaultValue={status ?? ''}
          className="border rounded px-3 py-2 bg-transparent">
          <option value="">ทุกสถานะ</option>
          <option value="Running">Running</option>
          <option value="Stopped">Stopped</option>
          <option value="Maintenance">Maintenance</option>
        </select>
        <button className="bg-blue-600 text-white rounded px-4">ค้นหา</button>
      </form>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2">รหัส</th>
            <th>ชื่อ</th>
            <th>ประเภท</th>
            <th>ที่ตั้ง</th>
            <th>สถานะ</th>
            {role === 'admin' && <th></th>}
          </tr>
        </thead>
        <tbody>
          {machines?.map((m) => (
            <tr key={m.id} className="border-b">
              <td className="py-2">{m.machine_id}</td>
              <td>{m.name}</td>
              <td>{m.type}</td>
              <td>{m.location}</td>
              <td>{m.status}</td>
              {role === 'admin' && (
                <td>
                  <div className="flex gap-3">
                    <Link href={`/machines/${m.id}/edit`} className="text-blue-600 underline">
                      แก้ไข
                    </Link>
                    <form action={deleteMachine}>
                      <input type="hidden" name="id" value={m.id} />
                      <button className="text-red-600 underline">ลบ</button>
                    </form>
                  </div>
                </td>
              )}
            </tr>
          ))}
          {machines?.length === 0 && (
            <tr><td colSpan={6} className="py-4 text-center">ไม่พบข้อมูล</td></tr>
          )}
        </tbody>
      </table>
    </main>
  )
}