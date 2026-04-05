/**
 * DetailedReportPage — Comprehensive assessment report with full breakdown
 * Shows detailed analysis, suggestions, and visual insights
 */
import React from "react";
import { DIMENSIONS, SCORE_BANDS } from "../../data/dimensions";
import { RECOMMENDATIONS } from "../../data/recommendations";
import { calcScore, getBand, getScoreColor } from "../../utils/scoring";

export default function DetailedReportPage({ values, onBack }) {
  const score = calcScore(values);
  const band = getBand(score);

  // Calculate dimension rankings
  const dimensionScores = DIMENSIONS.map(dim => ({
    ...dim,
    value: values[dim.key] ?? 0,
    weightedScore: (values[dim.key] ?? 0) * dim.weight,
    color: getScoreColor(values[dim.key] ?? 0)
  })).sort((a, b) => b.weightedScore - a.weightedScore);

  const strengths = dimensionScores.filter(d => d.value >= 75);
  const weaknesses = dimensionScores.filter(d => d.value < 50);
  const improvements = dimensionScores.filter(d => d.value >= 50 && d.value < 75);

  // Get recommendations for weakest areas
  const getRecommendations = (dimensionKey, score) => {
    const recs = RECOMMENDATIONS[dimensionKey];
    if (!recs) return null;

    if (score >= 75) return recs.moderate || null;
    if (score >= 31) return recs.low || recs.moderate || null;
    return recs.critical || recs.low || null;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">📊 Detailed Assessment Report</h1>
          <p className="text-slate-400">Comprehensive analysis of your mental health resilience factors</p>
        </div>
        <button onClick={onBack} className="btn-secondary">
          ← Back to Dashboard
        </button>
      </div>

      {/* Executive Summary */}
      <div className="glass-premium p-8">
        <h2 className="text-2xl font-bold gradient-text-purple mb-6">📋 Executive Summary</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-6xl font-black mb-2" style={{ color: band.color }}>{score}</div>
            <div className="text-lg font-semibold mb-1" style={{ color: band.color }}>
              {band.emoji} {band.label}
            </div>
            <div className="text-sm text-slate-400">Overall Score</div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold gradient-text-blue mb-2">{strengths.length}</div>
            <div className="text-sm text-slate-400">Strength Areas</div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-orange-400 mb-2">{weaknesses.length}</div>
            <div className="text-sm text-slate-400">Priority Areas</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border backdrop-blur-sm"
             style={{ background: band.bg, borderColor: band.border }}>
          <p className="text-slate-200 leading-relaxed">{band.description}</p>
        </div>
      </div>

      {/* Strengths Section */}
      {strengths.length > 0 && (
        <div className="glass-premium p-8">
          <h2 className="text-2xl font-bold gradient-text-blue mb-6">💪 Your Strengths</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strengths.map((dim) => (
              <div key={dim.key} className="p-4 rounded-2xl bg-green-500/10 border border-green-400/20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{dim.icon}</span>
                  <div>
                    <h3 className="font-semibold text-green-300">{dim.label}</h3>
                    <div className="text-sm text-green-400">{dim.value}/100</div>
                  </div>
                </div>
                <p className="text-sm text-slate-300">{dim.tooltip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority Areas */}
      {weaknesses.length > 0 && (
        <div className="glass-premium p-8">
          <h2 className="text-2xl font-bold text-orange-400 mb-6">🚨 Priority Areas for Improvement</h2>
          <div className="space-y-6">
            {weaknesses.map((dim) => {
              const rec = getRecommendations(dim.key, dim.value);
              return (
                <div key={dim.key} className="p-6 rounded-2xl bg-red-500/10 border border-red-400/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{dim.icon}</span>
                      <h3 className="text-xl font-semibold text-red-300">{dim.label}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-400">{dim.value}/100</div>
                      <div className="text-sm text-slate-400">Current Score</div>
                    </div>
                  </div>

                  <div className="progress-bar mb-4">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${dim.value}%`,
                        background: `linear-gradient(90deg, ${dim.gradientFrom}, ${dim.gradientTo})`
                      }}
                    />
                  </div>

                  {rec && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-orange-300 mb-3">{rec.headline}</h4>
                      <p className="text-slate-300 mb-4">{rec.intro}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {rec.actions.slice(0, 4).map((action, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-start gap-2">
                              <span className="text-lg">{action.icon}</span>
                              <div>
                                <h5 className="font-semibold text-sm text-slate-200">{action.title}</h5>
                                <p className="text-xs text-slate-400 mt-1">{action.detail}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {rec.resource && (
                        <a href={rec.resource} target="_blank" rel="noopener noreferrer"
                           className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30 transition-colors">
                          🔗 {rec.resourceLabel}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Improvement Opportunities */}
      {improvements.length > 0 && (
        <div className="glass-premium p-8">
          <h2 className="text-2xl font-bold gradient-text-purple mb-6">📈 Improvement Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {improvements.map((dim) => {
              const rec = getRecommendations(dim.key, dim.value);
              return (
                <div key={dim.key} className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-400/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{dim.icon}</span>
                    <div>
                      <h3 className="font-semibold text-yellow-300">{dim.label}</h3>
                      <div className="text-sm text-yellow-400">{dim.value}/100</div>
                    </div>
                  </div>
                  <div className="progress-bar mb-3">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${dim.value}%`,
                        background: `linear-gradient(90deg, ${dim.gradientFrom}, ${dim.gradientTo})`
                      }}
                    />
                  </div>
                  <p className="text-sm text-slate-300">{dim.tooltip}</p>
                  {rec && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-xs text-slate-400">{rec.intro}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Dimension Breakdown */}
      <div className="glass-premium p-8">
        <h2 className="text-2xl font-bold gradient-text mb-6">📊 Complete Factor Analysis</h2>
        <div className="space-y-4">
          {DIMENSIONS.map((dim) => {
            const value = values[dim.key] ?? 0;
            const weightedScore = value * dim.weight;
            const color = getScoreColor(value);

            return (
              <div key={dim.key} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{dim.icon}</span>
                    <div>
                      <h3 className="font-semibold text-slate-200">{dim.label}</h3>
                      <p className="text-sm text-slate-400">{dim.tooltip}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold" style={{ color }}>{value}/100</div>
                    <div className="text-sm text-slate-400">
                      Weighted: {(weightedScore).toFixed(1)} pts
                    </div>
                  </div>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${value}%`,
                      background: `linear-gradient(90deg, ${dim.gradientFrom}, ${dim.gradientTo})`
                    }}
                  />
                </div>

                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>Weight: {Math.round(dim.weight * 100)}%</span>
                  <span>Contribution: {weightedScore.toFixed(1)} points</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Plan */}
      <div className="glass-premium p-8">
        <h2 className="text-2xl font-bold gradient-text-purple mb-6">🎯 Action Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-2xl bg-blue-500/10 border border-blue-400/20">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-blue-300 mb-2">Focus Areas</h3>
            <p className="text-sm text-slate-300">
              Prioritize the {weaknesses.length} weakest dimensions for maximum impact
            </p>
          </div>

          <div className="text-center p-4 rounded-2xl bg-green-500/10 border border-green-400/20">
            <div className="text-3xl mb-2">⏰</div>
            <h3 className="font-semibold text-green-300 mb-2">Timeline</h3>
            <p className="text-sm text-slate-300">
              Set small, achievable goals for the next 30-90 days
            </p>
          </div>

          <div className="text-center p-4 rounded-2xl bg-purple-500/10 border border-purple-400/20">
            <div className="text-3xl mb-2">📞</div>
            <h3 className="font-semibold text-purple-300 mb-2">Support</h3>
            <p className="text-sm text-slate-300">
              Don't hesitate to seek professional help when needed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}