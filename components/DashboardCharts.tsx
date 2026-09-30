'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'

type Item = { name: string; value: number }

const COLOR: Record<string, string> = {
  Running: '#22c55e',
  Stopped: '#ef4444',
  Alarm: '#f59e0b',
  Maintenance: '#38bdf8',
  Open: '#ef4444',
  'In Progress': '#f59e0b',
  Closed: '#22c55e',
}

const tooltipStyle = {
  background: '#0f172a',
  border: '1px solid #334155',
  borderRadius: 8,
  color: '#e2e8f0',
}

export default function DashboardCharts({
  machineData,
  alarmData,
}: {
  machineData: Item[]
  alarmData: Item[]
}) {
  const pieData = machineData.filter((d) => d.value > 0)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="mb-2 font-semibold">เครื่องจักรแยกตามสถานะ</h2>
        <div className="h-64">
          {pieData.length === 0 ? (
            <p className="pt-24 text-center text-slate-500">ยังไม่มีข้อมูล</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3} stroke="none">
                  {pieData.map((d) => (
                    <Cell key={d.name} fill={COLOR[d.name]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="mb-2 font-semibold">Alarm แยกตามสถานะ</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={alarmData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#1e293b' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {alarmData.map((d) => (
                  <Cell key={d.name} fill={COLOR[d.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}