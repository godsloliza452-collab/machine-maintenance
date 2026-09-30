import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getRole } from '@/lib/getRole'
import MachineForm from '@/components/MachineForm'
import type { MachineInput } from '@/lib/validations/machine'

export default async function EditMachinePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const role = await getRole()
  if (role !== 'admin') redirect('/machines')

  const { id } = await params
  const supabase = await createClient()
  const { data: machine } = await supabase
    .from('machines')
    .select('machine_id, name, type, location, status')
    .eq('id', id)
    .maybeSingle()
  if (!machine) notFound()

  return (
    <main className="mx-auto max-w-xl p-6">
      <Link href="/machines" className="text-sm text-blue-600 hover:underline">
        &larr; กลับไปรายการเครื่องจักร
      </Link>
      <h1 className="mb-4 mt-2 text-2xl font-bold">แก้ไขเครื่องจักร</h1>
      <MachineForm machineUuid={id} defaultValues={machine as MachineInput} />
    </main>
  )
}