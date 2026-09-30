'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { alarmSchema, type AlarmInput } from '@/lib/validations/alarm'
import { createAlarm } from '@/app/alarms/actions'

type Machine = { id: string; machine_id: string; name: string }

export default function AlarmForm({ machines }: { machines: Machine[] }) {
  const router = useRouter()
  const [serverError, setServerError] = useState('')
  const [pending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AlarmInput>({ resolver: zodResolver(alarmSchema) })

  const onSubmit = (values: AlarmInput) => {
    setServerError('')
    startTransition(async () => {
      const res = await createAlarm(values)
      if (res.error) setServerError(res.error)
      else router.push('/alarms')
    })
  }

  const input = 'w-full border rounded px-3 py-2 bg-transparent'
  const err = 'text-sm text-red-500'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-1">เครื่องจักร</label>
        <select {...register('machine_id')} className={input} defaultValue="">
          <option value="" disabled>เลือกเครื่องจักร</option>
          {machines.map((m) => (
            <option key={m.id} value={m.id}>{m.machine_id} - {m.name}</option>
          ))}
        </select>
        {errors.machine_id && <p className={err}>{errors.machine_id.message}</p>}
      </div>
      <div>
        <label className="block mb-1">รหัส Alarm</label>
        <input {...register('alarm_code')} className={input} />
        {errors.alarm_code && <p className={err}>{errors.alarm_code.message}</p>}
      </div>
      <div>
        <label className="block mb-1">รายละเอียด</label>
        <input {...register('description')} className={input} />
        {errors.description && <p className={err}>{errors.description.message}</p>}
      </div>
      <div>
        <label className="block mb-1">สาเหตุ</label>
        <input {...register('cause')} className={input} />
        {errors.cause && <p className={err}>{errors.cause.message}</p>}
      </div>
      {serverError && <p className={err}>{serverError}</p>}
      <button disabled={pending} className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50">
        {pending ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>
    </form>
  )
}