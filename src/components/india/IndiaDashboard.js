/**
 * IndiaDashboard — India State-Level Mental Health Resilience Analytics
 *
 * Features:
 *  - KPI summary cards (national averages + top/bottom state)
 *  - Interactive sortable & filterable data table
 *  - Bar chart: Resilience Score by State
 *  - Scatter plot: Income Index vs Resilience Score
 *  - Radar chart: multi-index profile for selected state
 *  - Region filter + column sort
 *  - Color-coded resilience bands
 */

import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ScatterChart, Scatter,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ReferenceLine, Legend,
} from "recharts";
import {
  INDIA_STATES, NATIONAL_AVERAGES, REGIONS,
  sortStates, filterByRegion, getScoreBand, COLUMNS,
} from "../../data/indiaStates";

/* ── Color helpers ────────────────────────────────────────────────── */
const scoreColor = (score) => {
  if (score >= 80) return "#38bdf8";
  if (score >= 70) return "#22c55e";
  if (score >= 60) return "#eab308";
  if (score >= 50) return "#f97316";
  return "#ef4444";
};

/* ── Custom Tooltip for charts ────────────────────────────────────── */
const ChartTip = ({ active, payload, label, xKey, yKey }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs shadow-2xl">
      <p className="font-bold text-white mb-1">{d?.state || label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill || "#94a3b8" }}>
          {p.name}: <span className="font-bold">{
            typeof p.value === "number" && p.value < 2
              ? p.value.toFixed(2)
              : p.value
          }</span>
        </p>
      ))}
      {d?.region && <p className="text-slate-500 mt-1">Region: {d.region}</p>}
    </div>
  );
};

/* ── KPI Card ─────────────────────────────────────────────────────── */
function KPICard({ icon, label, value, sub, color = "#818cf8" }) {
  return (
    <div className="card p-4 flex flex-col items-center text-center hover:scale-[1.02] transition-transform duration-200">
      <span className="text-2xl mb-2">{icon}</span>
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl font-extrabold" style={{ color }}>{value}</p>
      {sub && <p className="text-[10px] text-slate-600 mt-1">{sub}</p>}
    </div>
  );
}

/* ── Resilience Score Bar Chart ───────────────────────────────────── */
function ScoreBarChart({ data }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
        📊 Resilience Score by State
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 8, right: 16, bottom: 60, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" vertical={false} />
          <XAxis
            dataKey="abbr"
            tick={{ fill: "#64748b", fontSize: 10 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis domain={[40, 90]} tick={{ fill: "#64748b", fontSize: 10 }} />
          <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(148,163,184,0.04)" }} />
          <ReferenceLine
            y={NATIONAL_AVERAGES.resilienceScore}
            stroke="rgba(99,102,241,0.5)"
            strokeDasharray="5 5"
            label={{ value: `Avg: ${NATIONAL_AVERAGES.resilienceScore}`, fill: "#818cf8", fontSize: 10, position: "insideTopLeft" }}
          />
          <Bar dataKey="resilienceScore" name="Score" radius={[4, 4, 0, 0]} maxBarSize={36}>
            {data.map((entry, i) => (
              <Cell key={i} fill={scoreColor(entry.resilienceScore)} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Scatter: Income vs Resilience ───────────────────────────────── */
function IncomeScatterChart({ data }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
        💰 Income Index vs Resilience Score
      </p>
      <p className="text-xs text-slate-600 mb-4">Each dot = one state. Dot color shows resilience band.</p>
      <ResponsiveContainer width="100%" height={260}>
        <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" />
          <XAxis
            dataKey="avgIncomeIndex"
            name="Income Index"
            type="number"
            domain={[0.3, 0.9]}
            tick={{ fill: "#64748b", fontSize: 10 }}
            label={{ value: "Income Index", fill: "#475569", fontSize: 10, position: "insideBottom", offset: -4 }}
          />
          <YAxis
            dataKey="resilienceScore"
            name="Resilience Score"
            domain={[45, 90]}
            tick={{ fill: "#64748b", fontSize: 10 }}
          />
          <Tooltip content={<ChartTip />} cursor={{ strokeDasharray: "3 3" }} />
          <Scatter
            name="States"
            data={data}
            shape={(props) => {
              const { cx, cy, payload } = props;
              return (
                <circle
                  cx={cx} cy={cy} r={7}
                  fill={scoreColor(payload.resilienceScore)}
                  fillOpacity={0.85}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth={1}
                />
              );
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Radar for selected state ─────────────────────────────────────── */
function StateRadar({ state }) {
  if (!state) return null;

  const avg = NATIONAL_AVERAGES;
  const radarData = [
    { subject: "Income",      state: state.avgIncomeIndex * 100,     national: avg.avgIncomeIndex * 100 },
    { subject: "Education",   state: state.educationIndex * 100,     national: avg.educationIndex * 100 },
    { subject: "Healthcare",  state: state.healthcareIndex * 100,    national: avg.healthcareIndex * 100 },
    { subject: "Urban %",     state: state.urbanizationPct,          national: avg.urbanizationPct },
    { subject: "Low Stress",  state: (10 - state.stressIndex) * 10,  national: (10 - avg.stressIndex) * 10 },
    { subject: "Social",      state: state.socialSupportIndex * 10,  national: avg.socialSupportIndex * 10 },
    { subject: "Employment",  state: (10 - state.unemploymentRate) * 10, national: (10 - avg.unemploymentRate) * 10 },
  ];

  const band = getScoreBand(state.resilienceScore);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          📡 {state.state} — Multi-Index Profile
        </p>
        <span className="text-xs font-bold px-3 py-1 rounded-full border"
          style={{ color: band.color, borderColor: `${band.color}40`, background: `${band.color}15` }}>
          {band.emoji} {state.resilienceScore}/100 · {band.label}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="rgba(148,163,184,0.12)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 10 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#334155", fontSize: 8 }} />
          <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 10, fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
          <Radar name={state.abbr} dataKey="state"    stroke={band.color} fill={band.color} fillOpacity={0.2} strokeWidth={2} />
          <Radar name="National Avg" dataKey="national" stroke="#818cf8" fill="#818cf8" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 4" />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Data Table ───────────────────────────────────────────────────── */
function DataTable({ data, onSelectState, selectedState }) {
  const [sortCol, setSortCol] = useState("resilienceScore");
  const [sortDir, setSortDir] = useState("desc");

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const av = a[sortCol], bv = b[sortCol];
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [data, sortCol, sortDir]);

  const handleSort = (key) => {
    if (sortCol === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(key); setSortDir("desc"); }
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-700/60">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-3 py-3 text-left font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap
                    ${col.sortable ? "cursor-pointer hover:text-slate-200 select-none" : ""}
                    ${col.highlight ? "text-indigo-400" : ""}`}
                >
                  {col.label}
                  {col.sortable && sortCol === col.key && (
                    <span className="ml-1">{sortDir === "asc" ? "▲" : "▼"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const band = getScoreBand(row.resilienceScore);
              const isSelected = selectedState?.state === row.state;
              return (
                <tr
                  key={row.state}
                  onClick={() => onSelectState(isSelected ? null : row)}
                  className={`border-b border-slate-800/60 cursor-pointer transition-colors duration-150
                    ${isSelected ? "bg-indigo-900/20" : i % 2 === 0 ? "bg-slate-800/20" : ""}
                    hover:bg-slate-700/30`}
                >
                  {COLUMNS.map((col) => {
                    const val = row[col.key];
                    if (col.key === "resilienceScore") {
                      return (
                        <td key={col.key} className="px-3 py-2.5">
                          <span className="font-bold" style={{ color: band.color }}>
                            {band.emoji} {val}
                          </span>
                          <div className="w-20 h-1.5 rounded-full bg-slate-700 mt-1 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${val}%`, background: band.color }} />
                          </div>
                        </td>
                      );
                    }
                    if (col.key === "state") {
                      return (
                        <td key={col.key} className="px-3 py-2.5 font-semibold text-slate-300 whitespace-nowrap">
                          {val}
                          {isSelected && <span className="ml-1 text-indigo-400">←</span>}
                        </td>
                      );
                    }
                    return (
                      <td key={col.key} className="px-3 py-2.5 text-slate-400 whitespace-nowrap">
                        {col.format(val)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Region compare bar ───────────────────────────────────────────── */
function RegionSummary() {
  const regionData = REGIONS.map((region) => {
    const states = INDIA_STATES.filter((s) => s.region === region);
    const avg = Math.round(states.reduce((s, d) => s + d.resilienceScore, 0) / states.length);
    return { region, avg, count: states.length };
  }).sort((a, b) => b.avg - a.avg);

  return (
    <div className="card p-5">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
        🗺️ Average Score by Region
      </p>
      <div className="space-y-3">
        {regionData.map((r) => {
          const band = getScoreBand(r.avg);
          return (
            <div key={r.region}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-300 font-medium">{r.region}</span>
                <span className="text-xs font-bold" style={{ color: band.color }}>{r.avg}/100</span>
              </div>
              <div className="h-2 rounded-full bg-slate-700/60 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${r.avg}%`, background: band.color }} />
              </div>
              <p className="text-[10px] text-slate-600 mt-0.5">{r.count} state{r.count > 1 ? "s" : ""}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main Dashboard ───────────────────────────────────────────────── */
export default function IndiaDashboard() {
  const [regionFilter, setRegionFilter] = useState("All");
  const [selectedState, setSelectedState] = useState(null);

  const filtered = useMemo(() => filterByRegion(regionFilter), [regionFilter]);
  const sorted   = useMemo(() => sortStates("resilienceScore", "desc"), []);
  const topState = sorted[0];
  const botState = sorted[sorted.length - 1];

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold gradient-text">🇮🇳 India SDOH Analytics</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mental Health Resilience across 20 Indian states · Based on 8 Social Determinants
            </p>
          </div>
          {/* Region filter */}
          <div className="flex flex-wrap gap-2">
            {["All", ...REGIONS].map((r) => (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all duration-200 ${
                  regionFilter === r
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "border-slate-700 text-slate-400 hover:border-indigo-600/60 hover:text-indigo-400"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPICard icon="🏅" label="National Avg Score"
          value={`${NATIONAL_AVERAGES.resilienceScore}/100`}
          sub="across 20 states" color="#818cf8" />
        <KPICard icon="🥇" label="Top State"
          value={topState.abbr}
          sub={`${topState.state} · ${topState.resilienceScore}/100`} color="#22c55e" />
        <KPICard icon="⚠️" label="Needs Attention"
          value={botState.abbr}
          sub={`${botState.state} · ${botState.resilienceScore}/100`} color="#ef4444" />
        <KPICard icon="📈" label="Avg Income Index"
          value={NATIONAL_AVERAGES.avgIncomeIndex.toFixed(2)}
          sub={`Stress: ${NATIONAL_AVERAGES.stressIndex}/10`} color="#fbbf24" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ScoreBarChart data={filtered} />
        <IncomeScatterChart data={filtered} />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          {selectedState
            ? <StateRadar state={selectedState} />
            : (
              <div className="card p-8 flex flex-col items-center justify-center h-full min-h-[280px] text-center">
                <span className="text-4xl mb-3">👆</span>
                <p className="text-sm font-semibold text-slate-400">Click any row in the table below</p>
                <p className="text-xs text-slate-600 mt-1">to see that state's multi-index radar profile vs national average</p>
              </div>
            )
          }
        </div>
        <RegionSummary />
      </div>

      {/* Table */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          📋 Full State Data Table
          <span className="ml-2 font-normal normal-case text-slate-600">
            — click a column header to sort · click a row to see radar profile
          </span>
        </p>
        <DataTable data={filtered} onSelectState={setSelectedState} selectedState={selectedState} />
      </div>

      {/* Legend */}
      <div className="card p-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">📏 Score Band Reference</p>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Excellent (80–100)", color: "#38bdf8", emoji: "🔵" },
            { label: "Good (70–79)",       color: "#22c55e", emoji: "🟢" },
            { label: "Moderate (60–69)",   color: "#eab308", emoji: "🟡" },
            { label: "Low (50–59)",        color: "#f97316", emoji: "🟠" },
            { label: "Critical (<50)",     color: "#ef4444", emoji: "🔴" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-3 h-3 rounded-full" style={{ background: b.color }} />
              {b.emoji} {b.label}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-700 mt-3 leading-relaxed">
          Data source: Simulated state-level SDOH indices for 20 Indian states.
          Resilience Score = weighted composite of income, education, healthcare, urbanization,
          employment, stress, and social support indicators.
        </p>
      </div>
    </div>
  );
}
