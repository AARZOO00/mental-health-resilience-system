/**
 * ScoreHistory — Line chart showing resilience score over time.
 * Data comes from saved reports in localStorage.
 * Users can see their progress, add notes, and compare snapshots.
 */
import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from "recharts";
import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import { calcScore, getBand } from "../../utils/scoring";
import { DIMENSIONS } from "../../data/dimensions";

/* ── Custom Tooltip ──────────────────────────────────────────────── */
const HistoryTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const band = getBand(d?.score || 0);
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs shadow-2xl">
      <p className="font-bold text-white mb-1">{label}</p>
      <p style={{ color: band.color }}>
        Score: <span className="font-extrabold text-sm">{d?.score}</span>/100
      </p>
      <p className="text-slate-500">{band.emoji} {band.label}</p>
      {d?.note && <p className="text-slate-400 mt-1 italic">"{d.note}"</p>}
    </div>
  );
};

/* ── Dimension Mini Trend ────────────────────────────────────────── */
function DimTrend({ reports }) {
  if (reports.length < 2) return null;

  const first = reports[reports.length - 1];
  const last  = reports[0];

  return (
    <div className="card p-5">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
        📈 Dimension Changes (First vs Latest)
      </p>
      <div className="space-y-2.5">
        {DIMENSIONS.map((dim) => {
          const prev = first.values?.[dim.key] ?? 0;
          const curr = last.values?.[dim.key]  ?? 0;
          const delta = curr - prev;
          return (
            <div key={dim.key} className="flex items-center gap-3">
              <span className="text-base w-5 flex-shrink-0">{dim.icon}</span>
              <span className="text-xs text-slate-400 w-28 flex-shrink-0">{dim.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${curr}%`, background: dim.color }} />
              </div>
              <span className="text-xs font-bold w-8 text-right" style={{ color: dim.color }}>{curr}</span>
              <span className={`text-xs font-bold w-10 text-right ${delta > 0 ? "text-green-400" : delta < 0 ? "text-red-400" : "text-slate-600"}`}>
                {delta > 0 ? `+${delta}` : delta === 0 ? "—" : delta}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main Export ─────────────────────────────────────────────────── */
export default function ScoreHistory() {
  const { state, actions } = useApp();
  const { t } = useTheme();
  const { reports } = state;
  const [saving, setSaving] = useState(false);
  const [note, setNote]     = useState("");

  /* Build chart data from saved reports (reverse so oldest first) */
  const chartData = [...reports]
    .reverse()
    .map((r, i) => ({
      label: `#${i + 1} — ${new Date(r.savedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
      score: calcScore(r.values),
      note:  r.note || "",
      ...r.values,
    }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    actions.saveReport(note);
    setNote("");
    setSaving(false);
  };

  /* Stats */
  const scores  = chartData.map((d) => d.score);
  const maxScore = scores.length ? Math.max(...scores) : 0;
  const minScore = scores.length ? Math.min(...scores) : 0;
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const trend    = scores.length >= 2 ? scores[scores.length - 1] - scores[0] : 0;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold gradient-text">{t.historyTitle}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Track your resilience over time · {reports.length} snapshot{reports.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <input
              className="input text-xs w-48"
              placeholder="Optional note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            <button onClick={handleSave} disabled={saving} className="btn-primary text-xs px-4 py-2">
              {saving
                ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                : "💾"} {t.saveReport}
            </button>
          </div>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="text-5xl block mb-4">📈</span>
          <h3 className="text-base font-bold text-slate-400 mb-2">{t.noHistory}</h3>
          <p className="text-xs text-slate-600">
            Adjust your scores above and click "Save Report" to start tracking your progress.
          </p>
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Assessments", value: reports.length, color: "#818cf8", icon: "📋" },
              { label: "Highest Score", value: `${maxScore}/100`, color: "#22c55e", icon: "🏆" },
              { label: "Lowest Score",  value: `${minScore}/100`, color: "#f97316", icon: "📉" },
              { label: "Overall Trend", value: trend >= 0 ? `+${trend}` : trend,
                color: trend >= 0 ? "#22c55e" : "#ef4444", icon: trend >= 0 ? "📈" : "📉" },
            ].map((s) => (
              <div key={s.label} className="card p-4 text-center">
                <span className="text-xl block mb-1">{s.icon}</span>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
                <p className="text-lg font-extrabold" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Line Chart */}
          <div className="card p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              📊 Resilience Score Over Time
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 8, right: 16, bottom: 40, left: -16 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  angle={-30}
                  textAnchor="end"
                  height={50}
                />
                <YAxis domain={[30, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip content={<HistoryTooltip />} />
                <ReferenceLine y={avgScore} stroke="rgba(99,102,241,0.4)" strokeDasharray="4 4"
                  label={{ value: `Avg: ${avgScore}`, fill: "#818cf8", fontSize: 10, position: "insideTopLeft" }} />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5}
                  fill="url(#scoreGrad)" dot={{ fill: "#6366f1", r: 5, strokeWidth: 0 }}
                  activeDot={{ r: 7, fill: "#818cf8" }} name="Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Dimension trend */}
          <DimTrend reports={reports} />

          {/* Report list */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-slate-700/40">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">All Snapshots</p>
            </div>
            <div className="divide-y divide-slate-800/60">
              {reports.map((r) => {
                const sc   = calcScore(r.values);
                const band = getBand(sc);
                const date = new Date(r.savedAt).toLocaleString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                });
                return (
                  <div key={r.id} className="flex items-center gap-4 px-4 py-3 hover:bg-slate-700/20 transition-colors">
                    <div className="w-12 h-12 rounded-xl border flex flex-col items-center justify-center flex-shrink-0"
                      style={{ background: band.bg, borderColor: band.border }}>
                      <span className="text-sm font-extrabold" style={{ color: band.color }}>{sc}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-300">{date}</p>
                      {r.note && <p className="text-[10px] text-slate-600 italic mt-0.5">"{r.note}"</p>}
                    </div>
                    <span className="text-xs font-bold" style={{ color: band.color }}>
                      {band.emoji} {band.label}
                    </span>
                    <button
                      onClick={() => { actions.setValues(r.values); actions.showToast("Report loaded!", "info"); }}
                      className="text-xs px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg border border-indigo-500/30 transition-colors flex-shrink-0"
                    >
                      Load
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
