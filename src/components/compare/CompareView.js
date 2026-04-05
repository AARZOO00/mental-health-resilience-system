/**
 * CompareView — Compare two SDOH profiles side-by-side.
 * Profiles A and B are independently configurable via sliders or demo presets.
 */
import React, { useState } from "react";
import { DIMENSIONS, DEMO_PROFILES } from "../../data/dimensions";
import { compareProfiles, getScoreColor, calcScore, getBand } from "../../utils/scoring";
import { DualRadarChartView } from "../dashboard/Charts";
import { useApp } from "../../context/AppContext";


const DEFAULT_A = DEMO_PROFILES[0].values; // Maria
const DEFAULT_B = DEMO_PROFILES[1].values; // James

function ProfilePicker({ label, color, selectedId, onSelect, values, onSliderChange }) {
  const band = getBand(calcScore(values));
  return (
    <div className="card p-5 flex-1">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
        <h3 className="text-sm font-bold text-slate-300">{label}</h3>
        <div className="ml-auto px-3 py-1 rounded-full text-xs font-bold border"
          style={{ color: band.color, background: band.bg, borderColor: band.border }}>
          {calcScore(values)}/100
        </div>
      </div>

      {/* Demo profile selector */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {DEMO_PROFILES.map((p) => (
          <button key={p.id} onClick={() => onSelect(p)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
              selectedId === p.id
                ? "border-current text-white font-semibold"
                : "border-slate-700 text-slate-500 hover:border-slate-500"
            }`}
            style={selectedId === p.id ? { background: color, borderColor: color } : {}}
          >
            {p.avatar} {p.name.split(",")[0]}
          </button>
        ))}
        <button onClick={() => onSelect(null)}
          className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all border-slate-700 text-slate-500 hover:border-slate-500 ${!selectedId ? "border-indigo-600 text-indigo-400" : ""}`}>
          ✏️ Custom
        </button>
      </div>

      {/* Mini sliders */}
      <div className="space-y-2.5">
        {DIMENSIONS.map((dim) => {
          const val = values[dim.key] ?? 0;
          const c   = getScoreColor(val);
          return (
            <div key={dim.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">{dim.icon} {dim.label.split(" ")[0]}</span>
                <span className="text-xs font-bold" style={{ color: c }}>{val}</span>
              </div>
              <input type="range" min="0" max="100" step="1" value={val}
                onChange={(e) => onSliderChange(dim.key, Number(e.target.value))}
                className="w-full" style={{ accentColor: color }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DimensionRow({ row, labelA, labelB }) {
  const { dim, a, b, winner } = row;
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-2 border-b border-slate-800/60">
      {/* Bar A (right-aligned) */}
      <div className="flex items-center gap-2 justify-end">
        <span className="text-xs font-bold" style={{ color: getScoreColor(a) }}>{a}</span>
        <div className="w-28 h-2 rounded-full bg-slate-800 overflow-hidden flex justify-end">
          <div className="h-full rounded-full bg-indigo-500 transition-all duration-700"
            style={{ width: `${a}%` }} />
        </div>
      </div>

      {/* Dimension label */}
      <div className="text-center flex-shrink-0 min-w-[90px]">
        <div className="text-xs font-semibold text-slate-400">{dim.icon}</div>
        <div className="text-[10px] text-slate-600 leading-tight">{dim.label.split(" ")[0]}</div>
        <div className={`text-[10px] font-bold mt-0.5 ${
          winner === "tie" ? "text-slate-600" :
          winner === "A" ? "text-indigo-400" : "text-pink-400"
        }`}>
          {winner === "tie" ? "tie" : `+${Math.abs(b - a)} ${winner}`}
        </div>
      </div>

      {/* Bar B (left-aligned) */}
      <div className="flex items-center gap-2">
        <div className="w-28 h-2 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full rounded-full bg-pink-500 transition-all duration-700"
            style={{ width: `${b}%` }} />
        </div>
        <span className="text-xs font-bold" style={{ color: getScoreColor(b) }}>{b}</span>
      </div>
    </div>
  );
}

export default function CompareView() {
  const { state } = useApp();

  const [valuesA, setValuesA]   = useState(DEFAULT_A);
  const [valuesB, setValuesB]   = useState(DEFAULT_B);
  const [selectedA, setSelectedA] = useState("maria");
  const [selectedB, setSelectedB] = useState("james");

  const handleSelectA = (profile) => {
    if (profile) { setValuesA(profile.values); setSelectedA(profile.id); }
    else { setSelectedA(null); }
  };
  const handleSelectB = (profile) => {
    if (profile) { setValuesB(profile.values); setSelectedB(profile.id); }
    else { setSelectedB(null); }
  };

  const labelA = DEMO_PROFILES.find((p) => p.id === selectedA)?.name || "Profile A";
  const labelB = DEMO_PROFILES.find((p) => p.id === selectedB)?.name || "Profile B";
  const comp   = compareProfiles(valuesA, valuesB, labelA, labelB);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero comparison */}
      <div className="card p-5">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">⚖️ Profile Comparison</h2>
        <div className="grid grid-cols-3 items-center gap-4">
          {/* Score A */}
          <div className="text-center">
            <div className="text-4xl font-extrabold" style={{ color: comp.bandA.color }}>{comp.scoreA}</div>
            <div className="text-xs text-slate-500 mt-1">{labelA.split(",")[0]}</div>
            <div className="text-xs font-semibold mt-0.5" style={{ color: comp.bandA.color }}>
              {comp.bandA.emoji} {comp.bandA.label}
            </div>
            <div className="text-xs text-indigo-400 mt-1">{comp.aWins} dim wins</div>
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="text-2xl font-black text-slate-600">VS</div>
            {comp.overallWinner !== "tie" && (
              <div className={`text-xs font-bold mt-2 ${comp.overallWinner === "A" ? "text-indigo-400" : "text-pink-400"}`}>
                {comp.overallWinner === "A" ? labelA : labelB} leads<br />
                by {Math.abs(comp.scoreDelta)} pts
              </div>
            )}
            {comp.overallWinner === "tie" && <div className="text-xs text-slate-600 mt-2">Tied!</div>}
          </div>

          {/* Score B */}
          <div className="text-center">
            <div className="text-4xl font-extrabold" style={{ color: comp.bandB.color }}>{comp.scoreB}</div>
            <div className="text-xs text-slate-500 mt-1">{labelB.split(",")[0]}</div>
            <div className="text-xs font-semibold mt-0.5" style={{ color: comp.bandB.color }}>
              {comp.bandB.emoji} {comp.bandB.label}
            </div>
            <div className="text-xs text-pink-400 mt-1">{comp.bWins} dim wins</div>
          </div>
        </div>
      </div>

      {/* Pickers */}
      <div className="flex flex-col lg:flex-row gap-4">
        <ProfilePicker
          label="Profile A" color="#6366f1"
          selectedId={selectedA} onSelect={handleSelectA}
          values={valuesA}
          onSliderChange={(k, v) => { setValuesA((prev) => ({ ...prev, [k]: v })); setSelectedA(null); }}
        />
        <ProfilePicker
          label="Profile B" color="#f472b6"
          selectedId={selectedB} onSelect={handleSelectB}
          values={valuesB}
          onSliderChange={(k, v) => { setValuesB((prev) => ({ ...prev, [k]: v })); setSelectedB(null); }}
        />
      </div>

      {/* Dual radar */}
      <div className="card p-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">📡 Radar Overlay</p>
        <DualRadarChartView valuesA={valuesA} valuesB={valuesB} labelA={labelA.split(",")[0]} labelB={labelB.split(",")[0]} />
      </div>

      {/* Dimension-by-dimension table */}
      <div className="card p-5">
        <div className="grid grid-cols-3 text-center mb-3">
          <div className="text-xs font-bold text-indigo-400">{labelA.split(",")[0]}</div>
          <div className="text-xs font-bold text-slate-500">Dimension</div>
          <div className="text-xs font-bold text-pink-400">{labelB.split(",")[0]}</div>
        </div>
        {comp.dimensionComparison.map((row) => (
          <DimensionRow key={row.dim.key} row={row} labelA={labelA} labelB={labelB} />
        ))}
      </div>
    </div>
  );
}
