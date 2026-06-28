"use client";

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell,
} from "recharts";
import type { WeeklyTrendPoint, StatusSlice } from "@/lib/dashboard";

const PIE_COLORS = ["#0f172a", "#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

export function WeeklyTrendChart({ data }: { data: WeeklyTrendPoint[] }) {
  if (data.length === 0) return <Empty />;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <XAxis dataKey="week" fontSize={12} stroke="#94a3b8" />
        <YAxis fontSize={12} stroke="#94a3b8" />
        <Tooltip />
        <Legend />
        <Bar dataKey="planned" name="Planlanan" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="actual" name="Gerceklesen" fill="#0f172a" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StatusChart({ data }: { data: StatusSlice[] }) {
  if (data.length === 0) return <Empty />;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

function Empty() {
  return (
    <div className="flex h-[240px] items-center justify-center text-sm text-faint">
      Veri yok.
    </div>
  );
}
