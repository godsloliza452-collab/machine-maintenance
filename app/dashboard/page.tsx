import Link from 'next/link'
import { getRole } from '@/lib/getRole'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  const role = await getRole()

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>
      <p>บทบาทของคุณ: <b>{role ?? 'ไม่พบข้อมูล role'}</b></p>
      {role === 'admin' && (
        <Link href="/machines/new" className="text-blue-600 underline">
          เพิ่มเครื่องจักร
        </Link>
      )}
    </main>
  )
}