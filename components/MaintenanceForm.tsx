'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { maintenanceSchema, type MaintenanceInput } from '@/lib/validations/maintenance'
import { createMaintenance, updateMaintenance } from '@/app/maintenance/actions'

type Machine = { id: string; machine_id: string; name: string }

export default function MaintenanceForm({
  machines,
  recordId,
  defaultValues,
}: {
  machines: Machine[]
  recordId?: string
  defaultValues?: MaintenanceInput
}) {
  const router = useRouter()
  const [serverError, setServerError] = useState('')
  const [pending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MaintenanceInput>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: defaultValues ?? { machine_id: '', description: '' },
  })

  const onSubmit = (values: MaintenanceInput) => {
    setServerError('')
    startTransition(async () => {
      const res = recordId
        ? await updateMaintenance(recordId, values)
        : await createMaintenance(values)
      if (res.error) setServerError(res.error)
      else router.push('/maintenance')
    })
  }

  const input = 'w-full border rounded px-3 py-2 bg-transparent'
  const err = 'text-sm text-red-500'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-1">เครื่องจักร</label>
        <select {...register('machine_id')} className={input}>
          <option value="" disabled>เลือกเครื่องจักร</option>
          {machines.map((m) => (
            <option key={m.id} value={m.id}>{m.machine_id} - {m.name}</option>
          ))}
        </select>
        {errors.machine_id && <p className={err}>{errors.machine_id.message}</p>}
      </div>
      <div>
        <label className="block mb-1">รายละเอียดการซ่อมบำรุง</label>
        <textarea {...register('description')} rows={4} className={input} />
        {errors.description && <p className={err}>{errors.description.message}</p>}
      </div>
      {serverError && <p className={err}>{serverError}</p>}
      <button disabled={pending} className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50">
        {pending ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>
    </form>
  )
}