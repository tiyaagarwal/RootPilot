import {
  AreaChart, Area, BarChart, Bar, CartesianGrid, Cell, Legend, PieChart, Pie,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { EmptyState } from '../feedback/EmptyState';

type Row = Record<string, unknown>;

function NoDataChart() {
  return <EmptyState compact title="Insufficient Operational Data" />;
}

// ─── Trend Line ───────────────────────────────────────────────────────────────

export function TrendLine({ data }: { data: Row[] }) {
  if (!data || data.length === 0) return <NoDataChart />;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <defs>
          <linearGradient id="countGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="8%" stopColor="#2563EB" stopOpacity={0.16} />
            <stop offset="92%" stopColor="#2563EB" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="hour"
          tick={{ fill: '#6B7280', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 6,
            fontSize: 12,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}
          labelStyle={{ color: '#111827', fontWeight: 600 }}
          itemStyle={{ color: '#2563EB' }}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Area
          type="monotone"
          dataKey="count"
          name="Incidents"
          stroke="#2563EB"
          strokeWidth={2.0}
          fill="url(#countGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#2563EB' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Volume Bar ───────────────────────────────────────────────────────────────

export function VolumeBar({ data }: { data: Row[] }) {
  if (!data || data.length === 0) return <NoDataChart />;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="hour"
          tick={{ fill: '#6B7280', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 6,
            fontSize: 12,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}
          labelStyle={{ color: '#111827', fontWeight: 600 }}
          cursor={{ fill: 'rgba(37,99,235,.04)' }}
        />
        <Bar dataKey="count" name="Incidents" fill="#2563EB" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Pie / Severity Distribution ──────────────────────────────────────────────

interface PieEntry { name: string; value: number }
export function SeverityPie({ data }: { data: PieEntry[] }) {
  if (!data || data.length === 0) return <NoDataChart />;
  const COLORS = ['#059669', '#D97706', '#DC2626', '#B91C1C'];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="48%"
          innerRadius="48%"
          outerRadius="72%"
          dataKey="value"
          nameKey="name"
          paddingAngle={4}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((_entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 6,
            fontSize: 12,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Risk Score Bar ───────────────────────────────────────────────────────────

interface RiskEntry { name: string; value: number; color?: string }
export function RiskBar({ data }: { data: RiskEntry[] }) {
  if (!data || data.length === 0) return <NoDataChart />;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fill: '#111827', fontSize: 12, fontWeight: 600 }} tickLine={false} axisLine={false} width={120} />
        <Tooltip
          contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: 12, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
          cursor={{ fill: 'rgba(37,99,235,.04)' }}
        />
        <Bar dataKey="value" name="Risk Score" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color ?? '#2563EB'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
