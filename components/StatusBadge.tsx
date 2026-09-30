const STYLES: Record<string, string> = {
  Running: 'bg-emerald-500/15 text-emerald-400',
  Stopped: 'bg-red-500/15 text-red-400',
  Alarm: 'bg-amber-500/15 text-amber-400',
  Maintenance: 'bg-sky-500/15 text-sky-400',
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[status] ?? 'bg-slate-700 text-slate-300'}`}>
      {status}
    </span>
  )
}