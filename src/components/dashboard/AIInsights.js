/**
 * AIInsights — Full AI-powered recommendation system.
 * Reads the generateInsights() output and renders personalized action plans
 * for the 3 weakest dimensions, tiered by severity.
 */
import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { generateInsights, getBand, calcScore } from "../../utils/scoring";
import { SCORE_BANDS } from "../../data/dimensions";

/* ── Urgency badge ─────────────────────────────────────────────────── */
function UrgencyBadge({ level }) {
  const map = {
    high:   { label: "High Priority", color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.35)" },
    medium: { label: "Action Needed", color: "#f97316", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.35)" },
    low:    { label: "Optimize",      color: "#22c55e", bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.35)" },
  };
  const s = map[level] || map.low;
  return (
    <span className="text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-sm animate-float"
      style={{ color: s.color, background: s.bg, borderColor: s.border, boxShadow: `0 0 10px ${s.color}30` }}>
      {s.label}
    </span>
  );
}

/* ── Single action item ────────────────────────────────────────────── */
function ActionItem({ action, dimColor }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="glass p-4 rounded-2xl overflow-hidden cursor-pointer hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      onClick={() => setOpen((o) => !o)}
      style={{ border: `1px solid ${dimColor}20` }}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl flex-shrink-0 animate-bounce-gentle">{action.icon}</span>
        <span className="text-sm font-semibold text-slate-200 flex-1">{action.title}</span>
        <span className="text-slate-400 text-sm flex-shrink-0 transition-transform duration-300"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </div>
      {open && (
        <div className="mt-4 animate-slide-in">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-3" />
          <p className="text-sm text-slate-300 leading-relaxed">{action.detail}</p>
        </div>
      )}
    </div>
  );
}

/* ── Recommendation card per dimension ─────────────────────────────── */
function RecommendationCard({ rec }) {
  const { dim, urgency, headline, intro, actions: tips, resource, resourceLabel } = rec;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="glass-premium p-6 animate-slide-in-right relative overflow-hidden group">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br opacity-5"
           style={{ background: `linear-gradient(135deg, ${dim.color}20, transparent)` }} />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
               style={{ background: `${dim.color}20`, border: `2px solid ${dim.color}40` }}>
            <span className="text-2xl">{dim.icon}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold gradient-text" style={{ background: `linear-gradient(135deg, ${dim.color}, ${dim.color}80)` }}>
              {dim.label}
            </h3>
            <p className="text-sm text-slate-400">{headline}</p>
          </div>
        </div>
        <UrgencyBadge level={urgency} />
      </div>

      {/* Intro */}
      <div className="mb-6 relative z-10">
        <p className="text-sm text-slate-300 leading-relaxed p-4 rounded-2xl border-l-4 bg-white/5"
            style={{ borderColor: dim.color, background: `linear-gradient(90deg, ${dim.color}10, transparent)` }}>
          {intro}
        </p>
      </div>

      {/* Action list */}
      <div className="space-y-3 relative z-10">
        {tips.slice(0, isExpanded ? tips.length : 2).map((action, i) => (
          <ActionItem key={i} action={action} dimColor={dim.color} />
        ))}

        {tips.length > 2 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10
                       text-sm font-semibold text-slate-300 hover:text-white transition-all duration-300"
          >
            {isExpanded ? 'Show Less' : `Show ${tips.length - 2} More Actions`}
          </button>
        )}
      </div>

      {/* External resource link */}
      {resource && (
        <a
          href={resource} target="_blank" rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-2xl
                     bg-gradient-to-r hover:scale-105 transition-all duration-300 relative z-10"
          style={{
            background: `linear-gradient(135deg, ${dim.color}20, ${dim.color}10)`,
            border: `1px solid ${dim.color}30`,
            color: dim.color
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <span>🔗</span>
          <span className="underline underline-offset-2">{resourceLabel}</span>
        </a>
      )}
    </div>
  );
}

/* ── Score Bands reference ──────────────────────────────────────────── */
function ScoreBandsRef() {
  return (
    <div className="glass-premium p-6">
      <p className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-6">📏 Score Reference Guide</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SCORE_BANDS.map((b) => (
          <div key={b.label} className="p-4 rounded-2xl border backdrop-blur-sm hover:scale-105 transition-all duration-300 group"
               style={{
                 background: `linear-gradient(135deg, ${b.bg}, rgba(255,255,255,0.05))`,
                 borderColor: b.border,
                 boxShadow: `0 4px 20px ${b.color}20`
               }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{b.emoji}</span>
              <div className="text-sm font-bold" style={{ color: b.color }}>{b.min}–{b.max}</div>
            </div>
            <div className="text-base font-bold text-slate-200 mb-1">{b.label}</div>
            <div className="text-xs text-slate-400 leading-relaxed">{b.tagline}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main export ────────────────────────────────────────────────────── */
export default function AIInsights() {
  const { state } = useApp();
  const { values } = state;
  const score   = calcScore(values);
  const band    = getBand(score);
  const insights = generateInsights(values);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Status assessment banner */}
      <div className="glass-premium p-8 border-2 relative overflow-hidden"
           style={{ borderColor: band.border }}>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full animate-float"
             style={{ background: `radial-gradient(circle, ${band.color}20 0%, transparent 70%)` }} />

        <div className="flex items-start gap-6 relative z-10">
          {/* Score pill */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-3xl border-2 backdrop-blur-xl animate-pulse-ring"
            style={{
              background: `linear-gradient(135deg, ${band.bg}, rgba(255,255,255,0.1))`,
              borderColor: band.border,
              boxShadow: `0 0 30px ${band.color}40`
            }}>
            <span className="text-4xl font-black" style={{ color: band.color }}>{score}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h2 className="text-2xl font-black gradient-text" style={{ background: `linear-gradient(135deg, ${band.color}, ${band.color}80)` }}>
                {band.emoji} {band.label} Resilience
              </h2>
              <span className="text-sm text-slate-500">·</span>
              <span className="text-sm text-slate-400 font-medium">{band.tagline}</span>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">{insights.statusMessage}</p>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs text-slate-500 mb-1">Strongest Area</div>
                <div className="font-semibold flex items-center gap-2" style={{ color: insights.strongest.color }}>
                  <span>{insights.strongest.icon}</span>
                  <span className="text-sm">{insights.strongest.label}</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs text-slate-500 mb-1">Risk Flags</div>
                <div className={`font-bold text-lg ${insights.riskFlags === 0 ? "text-green-400" : "text-orange-400"}`}>
                  {insights.riskFlags}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs text-slate-500 mb-1">Protective Factors</div>
                <div className="font-bold text-lg text-green-400">{insights.protective}/7</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority action plan header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-xl">🎯</span>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold gradient-text-purple">
            Personalized Action Plan
          </h2>
          <p className="text-sm text-slate-400">
            {insights.recommendations.length} prioritized area{insights.recommendations.length !== 1 ? 's' : ''} for improvement
          </p>
        </div>
      </div>

      {/* Recommendation cards */}
      {insights.recommendations.length > 0 ? (
        <div className="space-y-6">
          {insights.recommendations.map((rec, i) => (
            <RecommendationCard key={i} rec={rec} />
          ))}
        </div>
      ) : (
        <div className="glass-premium p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center mx-auto mb-4 animate-float">
            <span className="text-3xl">🌟</span>
          </div>
          <h3 className="text-2xl font-bold gradient-text-blue mb-3">Excellent Profile!</h3>
          <p className="text-slate-300 leading-relaxed">
            All dimensions score 75+. Focus on maintenance, community contribution, and continuing to build on these strong foundations.
          </p>
        </div>
      )}

      {/* Score reference */}
      <ScoreBandsRef />

      {/* Disclaimer */}
      <div className="glass p-6 text-center">
        <p className="text-sm text-slate-400 leading-relaxed">
          ⚕️ <strong>Important:</strong> For educational purposes only. Not a clinical diagnostic tool.
          Please consult a qualified mental health professional for personalized clinical guidance.
        </p>
      </div>
    </div>
  );
}
