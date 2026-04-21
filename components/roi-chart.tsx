"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatVolume } from "@/lib/utils";

interface DataPoint {
  date: string;
  volume: number;
  rewards: number;
  participants: number;
}

interface ROIChartProps {
  data: DataPoint[];
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) => {
  if (!active || !payload) return null;
  return (
    <div className="glass rounded-lg p-3 text-xs border border-white/10">
      <p className="text-muted-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex justify-between gap-4">
          <span style={{ color: entry.color }}>{entry.name}</span>
          <span className="font-medium text-slate-200 mono">
            {formatVolume(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export function ROIChart({ data, className }: ROIChartProps) {
  return (
    <div className={className} style={{ height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradRewards" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatVolume(v)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="volume"
            name="Volume"
            stroke="#7C3AED"
            strokeWidth={1.5}
            fill="url(#gradVolume)"
          />
          <Area
            type="monotone"
            dataKey="rewards"
            name="Rewards"
            stroke="#06B6D4"
            strokeWidth={1.5}
            fill="url(#gradRewards)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
