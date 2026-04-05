import React from "react";
import { DIMENSIONS } from "../../data/dimensions";
import {
  countProtectiveFactors, countRiskFlags,
  getStrongestDimension, getWeakestDimensions,
  calcScore,
} from "../../utils/scoring";

function KPI({ icon, label, value, sub, color }) {
  return (
    <div className="card p-4 flex flex-col items-center text-center group hover:scale-[1.03] transition-transform duration-200 cursor-default">
      <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">{icon}</span>
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-lg font-extrabold leading-tight" style={{ color: color || "#f1f5f9" }}>{value}</p>
      {sub && <p className="text-[10px] text-slate-600 mt-1">{sub}</p>}
    </div>
  );
}

export default function MetricCards({ values }) {
  const score     = calcScore(values);
  const protect   = countProtectiveFactors(values);
  const risks     = countRiskFlags(values);
  const strongest = getStrongestDimension(values);
  const [weakest] = getWeakestDimensions(values, 1);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in">
      <KPI icon="🏅" label="Resilience Score" value={`${score}/100`}
        sub="weighted composite" color="#818cf8" />
      <KPI icon="🛡" label="Protective Factors" value={`${protect}/${DIMENSIONS.length}`}
        sub="dimensions ≥ 60" color="#22c55e" />
      <KPI icon="⚠️" label="Risk Flags" value={risks}
        sub="dimensions < 40"
        color={risks === 0 ? "#22c55e" : risks <= 2 ? "#f97316" : "#ef4444"} />
      <KPI icon={strongest.icon} label="Top Strength" value={values[strongest.key]}
        sub={strongest.label} color={strongest.color} />
    </div>
  );
}
