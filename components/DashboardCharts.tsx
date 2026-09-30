'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'

type Item = { name: string; value: number }

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6']

export default function DashboardCharts({
  machineData,
  alarmData,
}: {
  machineData: Item[]
  alarmData: Item[]
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="border rounded p-4">
        <h2 className="mb-2 font-semibold">เครื่องจักรแยกตามสถานะ</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={machineData} dataKey="value" nameKey="name" outerRadius={80} label>
                {machineData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="border rounded p-4">
        <h2 className="mb-2 font-semibold">Alarm แยกตามสถานะ</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={alarmData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}