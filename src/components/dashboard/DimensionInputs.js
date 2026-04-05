/**
 * DimensionInputs — 7 slider cards, one per SDOH dimension.
 * Each card shows icon, label, tooltip, examples, score, and progress bar.
 */
import React from "react";
import { DIMENSIONS, DEMO_PROFILES } from "../../data/dimensions";
import { getScoreColor } from "../../utils/scoring";
import { InfoIcon } from "../shared/Tooltip";
import { useApp } from "../../context/AppContext";

function SliderCard({ dim, value, onChange }) {
  const color   = getScoreColor(value);
  const pct     = value;
  const exIndex = Math.min(3, Math.floor(value / 25));

  return (
    <div className="card p-5 hover:border-slate-600/60 transition-all duration-200 animate-fade-in">
      {/* Header row */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-2xl flex-shrink-0">{dim.icon}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="text-sm font-bold text-slate-200 leading-tight">{dim.label}</h3>
              <InfoIcon tooltip={dim.tooltip} />
            </div>
            <p className="text-xs text-slate-500 leading-tight mt-0.5 line-clamp-1">{dim.description}</p>
          </div>
        </div>
        {/* Score badge */}
        <div
          className="flex-shrink-0 ml-3 px-2.5 py-1 rounded-lg text-sm font-extrabold border"
          style={{ color, borderColor: `${color}40`, background: `${color}15` }}
        >
          {value}
        </div>
      </div>

      {/* Example tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {dim.examples.map((ex, i) => (
          <span
            key={ex}
            className={`text-[10px] px-2 py-0.5 rounded-full border transition-all duration-300 ${
              i === exIndex
                ? "border-current font-semibold"
                : "border-slate-700 text-slate-600"
            }`}
            style={i === exIndex ? { color, borderColor: `${color}60`, background: `${color}15` } : {}}
          >
            {ex}
          </span>
        ))}
      </div>

      {/* Slider */}
      <input
        type="range" min="0" max="100" step="1"
        value={value}
        onChange={(e) => onChange(dim.key, e.target.value)}
        aria-label={dim.label}
        className="w-full"
      />
      <div className="flex justify-between text-[10px] text-slate-700 mt-1.5">
        <span>0 — Low</span>
        <span className="font-semibold" style={{ color }}>
          Weight: {Math.round(dim.weight * 100)}%
        </span>
        <span>100 — High</span>
      </div>

      {/* Progress fill bar */}
      <div className="h-1 rounded-full bg-slate-700/60 mt-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg,${dim.gradientFrom},${dim.gradientTo})` }}
        />
      </div>

      {/* Research note */}
      <p className="text-[10px] text-slate-700 mt-2 leading-relaxed italic">{dim.researchNote}</p>
    </div>
  );
}

export default function DimensionInputs() {
  const { state, actions } = useApp();
  const { values, activeProfileId } = state;

  return (
    <div>
      {/* Profile quick-load */}
      <div className="mb-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          📋 Load Demo Profile
        </p>
        <div className="flex flex-wrap gap-2">
          {DEMO_PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => actions.loadProfile(p)}
              title={p.story}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                activeProfileId === p.id
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/30"
                  : "border-slate-700 text-slate-400 hover:border-indigo-600/60 hover:text-indigo-400 bg-slate-800/40"
              }`}
            >
              <span className="text-base">{p.avatar}</span>
              <div className="text-left">
                <div>{p.name}</div>
                <div className={`text-[10px] font-normal ${activeProfileId === p.id ? "text-indigo-200" : "text-slate-600"}`}>
                  {p.tag}
                </div>
              </div>
            </button>
          ))}
        </div>
        {activeProfileId && (
          <p className="text-xs text-slate-600 mt-2 italic">
            {DEMO_PROFILES.find((p) => p.id === activeProfileId)?.story}
          </p>
        )}
      </div>

      {/* Sliders grid */}
      <p className="text-sm text-slate-500 mb-4">
        Adjust each slider to reflect your current situation. Scores update in real time.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DIMENSIONS.map((dim) => (
          <SliderCard
            key={dim.key}
            dim={dim}
            value={values[dim.key] ?? 50}
            onChange={actions.updateDimension}
          />
        ))}
      </div>
    </div>
  );
}
