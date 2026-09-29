'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { machineSchema, STATUSES, type MachineInput } from '@/lib/validations/machine'
import { createMachine, updateMachine } from '@/app/machines/actions'

const fields = [
  { name: 'machine_id', placeholder: 'รหัสเครื่อง เช่น M-001' },
  { name: 'name', placeholder: 'ชื่อเครื่อง' },
  { name: 'type', placeholder: 'ประเภท' },
  { name: 'location', placeholder: 'ที่ตั้ง' },
] as const

export default function MachineForm({
  machineUuid,
  defaultValues,
}: {
  machineUuid?: string
  defaultValues?: MachineInput
}) {
  const router = useRouter()
  const [serverError, setServerError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MachineInput>({
    resolver: zodResolver(machineSchema),
    defaultValues: defaultValues ?? {
      machine_id: '', name: '', type: '', location: '', status: 'Running',
    },
  })

  async function onSubmit(values: MachineInput) {
    setServerError('')
    const result = machineUuid
      ? await updateMachine(machineUuid, values)
      : await createMachine(values)
    if (result.error) return setServerError(result.error)
    router.push('/machines')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {fields.map((f) => (
        <div key={f.name}>
          <input
            {...register(f.name)}
            placeholder={f.placeholder}
            className="w-full border rounded px-3 py-2 bg-transparent"
          />
          {errors[f.name] && (
            <p className="text-red-600 text-sm mt-1">{errors[f.name]?.message}</p>
          )}
        </div>
      ))}
      <select
        {...register('status')}
        className="w-full border rounded px-3 py-2 bg-transparent"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      {serverError && <p className="text-red-600 text-sm">{serverError}</p>}
      <button
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white rounded py-2 disabled:opacity-50"
      >
        {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>
    </form>
  )
}