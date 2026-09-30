import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getRole } from '@/lib/getRole'
import MachineForm from '@/components/MachineForm'

export default async function NewMachinePage() {
  const role = await getRole()
  if (role !== 'admin') redirect('/machines')

  return (
    <main className="mx-auto max-w-xl p-6">
      <Link href="/machines" className="text-sm text-blue-600 hover:underline">
        &larr; กลับไปรายการเครื่องจักร
      </Link>
      <h1 className="mb-4 mt-2 text-2xl font-bold">เพิ่มเครื่องจักร</h1>
      <MachineForm />
    </main>
  )
}