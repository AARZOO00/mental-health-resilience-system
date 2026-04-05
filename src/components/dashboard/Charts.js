/**
 * Charts — RadarChart and BarChart, both using Recharts.
 * Exported as separate named components for flexibility.
 */
import React from "react";
import {
  RadarChart as ReRadar, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart as ReBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, Cell, ReferenceLine, Legend,
} from "recharts";
import { DIMENSIONS } from "../../data/dimensions";
import { getScoreColor } from "../../utils/scoring";

/* ─── Shared tooltip wrapper ─────────────────────────────────────────── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const dim = DIMENSIONS.find((d) => d.label.startsWith(label) || d.label === label);
  const val = payload[0]?.value;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 shadow-2xl text-sm">
      <p className="font-bold text-white mb-0.5">{dim?.label || label}</p>
      <p style={{ color: dim?.color || "#38bdf8" }}>
        Score: <span className="font-extrabold">{val}</span>/100
      </p>
      {dim && (
        <p className="text-slate-500 text-xs mt-1">Weight: {Math.round(dim.weight * 100)}%</p>
      )}
    </div>
  );
};

/* ─── Radar Chart ────────────────────────────────────────────────────── */
export function RadarChartView({ values, label = "You", color = "#6366f1" }) {
  const data = DIMENSIONS.map((d) => ({
    subject: d.label.split(" ")[0],
    fullLabel: d.label,
    A: values[d.key] ?? 0,
    fullMark: 100,
  }));

  return (
    <div className="card p-6">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
        📡 Resilience Radar
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <ReRadar data={data} margin={{ top: 8, right: 28, bottom: 8, left: 28 }}>
          <PolarGrid stroke="rgba(148,163,184,0.1)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#334155", fontSize: 9 }} />
          <ReTooltip content={<ChartTooltip />} />
          <Radar name={label} dataKey="A"
            stroke={color} fill={color} fillOpacity={0.18} strokeWidth={2.5}
            dot={{ fill: color, r: 4, strokeWidth: 0 }}
          />
        </ReRadar>
      </ResponsiveContainer>
    </div>
  );
}

/* Dual radar for compare view */
export function DualRadarChartView({ valuesA, valuesB, labelA, labelB }) {
  const data = DIMENSIONS.map((d) => ({
    subject: d.label.split(" ")[0],
    A: valuesA[d.key] ?? 0,
    B: valuesB[d.key] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ReRadar data={data} margin={{ top: 8, right: 28, bottom: 8, left: 28 }}>
        <PolarGrid stroke="rgba(148,163,184,0.1)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 10 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#334155", fontSize: 9 }} />
        <ReTooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
        <Radar name={labelA} dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
        <Radar name={labelB} dataKey="B" stroke="#f472b6" fill="#f472b6" fillOpacity={0.2} strokeWidth={2} />
      </ReRadar>
    </ResponsiveContainer>
  );
}

/* ─── Bar Chart ──────────────────────────────────────────────────────── */
export function BarChartView({ values }) {
  const data = DIMENSIONS.map((d) => ({
    name: d.label.split(" ")[0],
    fullLabel: d.label,
    value: values[d.key] ?? 0,
    color: d.color,
  }));

  return (
    <div className="card p-6">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
        📊 Score Breakdown
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <ReBar data={data} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 10 }} />
          <YAxis domain={[0, 100]} tick={{ fill: "#475569", fontSize: 10 }} />
          <ReTooltip content={<ChartTooltip />} cursor={{ fill: "rgba(148,163,184,0.04)" }} />
          <ReferenceLine y={60} stroke="rgba(34,197,94,0.25)"  strokeDasharray="4 4"
            label={{ value: "Good", fill: "#22c55e", fontSize: 9, position: "insideTopRight" }} />
          <ReferenceLine y={40} stroke="rgba(249,115,22,0.25)" strokeDasharray="4 4"
            label={{ value: "Risk", fill: "#f97316", fontSize: 9, position: "insideTopRight" }} />
          <Bar dataKey="value" radius={[5, 5, 0, 0]} maxBarSize={44}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </ReBar>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 justify-center">
        {DIMENSIONS.map((d) => (
          <div key={d.key} className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <div className="w-2 h-2 rounded-sm" style={{ background: d.color }} />
            {d.label.split(" ")[0]}
          </div>
        ))}
      </div>
    </div>
  );
}
