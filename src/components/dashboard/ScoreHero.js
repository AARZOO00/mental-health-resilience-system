/**
 * ScoreHero — animated circular gauge + dimension progress bars.
 * The main visual centrepiece of the dashboard.
 */
import React from "react";
import { DIMENSIONS } from "../../data/dimensions";
import { calcScore, getBand, getScoreColor } from "../../utils/scoring";
import { InfoIcon } from "../shared/Tooltip";

/* Animated SVG ring gauge */
function CircularGauge({ score, band }) {
  const r = 82, cx = 100, cy = 100;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full animate-pulse-ring"
             style={{ background: `radial-gradient(circle, ${band.color}20 0%, transparent 70%)` }} />

        <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-2xl relative z-10">
          {/* Outer glow ring */}
          <circle cx={cx} cy={cy} r={r + 12} fill="none" stroke={band.color} strokeWidth="2" opacity="0.15" />
          <circle cx={cx} cy={cy} r={r + 8} fill="none" stroke={band.color} strokeWidth="1" opacity="0.25" />

          {/* Background track with gradient */}
          <defs>
            <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
            </linearGradient>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={band.color} />
              <stop offset="50%" stopColor={band.color} />
              <stop offset="100%" stopColor={band.color + '80'} />
            </linearGradient>
          </defs>

          {/* Track */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#trackGradient)" strokeWidth="16" />

          {/* Score arc */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circ - filled}`}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1), stroke 0.5s ease" }}
            filter="drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))"
          />

          {/* Inner shimmer tick marks */}
          {[0, 25, 50, 75, 100].map((v) => {
            const angle = (v / 100) * 2 * Math.PI - Math.PI / 2;
            const ix = cx + (r - 12) * Math.cos(angle);
            const iy = cy + (r - 12) * Math.sin(angle);
            return <circle key={v} cx={ix} cy={iy} r="3" fill="rgba(148,163,184,0.4)" />;
          })}

          {/* Score number with glow */}
          <text x={cx} y={cy - 8} textAnchor="middle" fill="#f1f5f9" fontSize="48" fontWeight="900" fontFamily="Inter, sans-serif"
                filter="drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))">
            {score}
          </text>
          <text x={cx} y={cy + 16} textAnchor="middle" fill="#64748b" fontSize="12" fontFamily="Inter, sans-serif">
            out of 100
          </text>
          <text x={cx} y={cy + 36} textAnchor="middle" fill={band.color} fontSize="14" fontWeight="800" fontFamily="Inter, sans-serif">
            {band.emoji} {band.label}
          </text>
        </svg>
      </div>

      {/* Band tagline badge */}
      <div
        className="mt-4 px-6 py-3 rounded-2xl text-sm font-bold border backdrop-blur-xl animate-float"
        style={{
          background: `linear-gradient(135deg, ${band.bg}, rgba(255,255,255,0.05))`,
          borderColor: band.border,
          color: band.color,
          boxShadow: `0 4px 20px ${band.color}30`
        }}
      >
        {band.tagline}
      </div>
    </div>
  );
}

export default function ScoreHero({ values }) {
  const score = calcScore(values);
  const band  = getBand(score);

  return (
    <div className="glass-premium p-8 animate-slide-up relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500/10 to-cyan-500/10 blur-xl" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">

        {/* Left: Gauge */}
        <CircularGauge score={score} band={band} />

        {/* Right: Progress bars */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">
              Dimension Breakdown
            </p>
            <span className="text-xs text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              Weight shown per factor
            </span>
          </div>

          <div className="space-y-4">
            {DIMENSIONS.map((dim) => {
              const val = values[dim.key] ?? 0;
              const barColor = getScoreColor(val);
              const gradientFrom = dim.gradientFrom || barColor;
              const gradientTo = dim.gradientTo || barColor;

              return (
                <div key={dim.key} className="group">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg group-hover:animate-bounce">{dim.icon}</span>
                    <span className="text-sm text-slate-300 flex-1">{dim.label}</span>
                    <InfoIcon tooltip={dim.tooltip} />
                    <span className="text-sm font-bold w-16 text-right" style={{ color: barColor }}>
                      {val}/100
                      <span className="text-slate-500 font-normal ml-1 text-xs">
                        ×{Math.round(dim.weight * 100)}%
                      </span>
                    </span>
                  </div>
                  <div className="progress-bar overflow-hidden rounded-full">
                    <div
                      className="progress-fill rounded-full"
                      style={{
                        width: `${val}%`,
                        background: `linear-gradient(90deg, ${gradientFrom}cc, ${gradientTo})`,
                        boxShadow: `0 0 10px ${barColor}60`,
                        transition: 'width 1s cubic-bezier(0.34,1.56,0.64,1)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Score description */}
          <div
            className="mt-6 p-4 rounded-2xl border backdrop-blur-sm text-sm text-slate-300 leading-relaxed"
            style={{
              background: `linear-gradient(135deg, ${band.bg}, rgba(255,255,255,0.05))`,
              borderColor: band.border
            }}
          >
            {band.description}
          </div>
        </div>
      </div>
    </div>
  );
}
