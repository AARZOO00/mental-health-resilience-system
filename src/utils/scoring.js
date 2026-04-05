/**
 * Scoring Engine
 * Implements a weighted composite scoring formula based on WHO SDOH Framework.
 *
 * Formula: Score = Σ (normalized_dimension_i × weight_i) × 100
 *
 * Weights reflect empirical evidence from:
 * - WHO Commission on Social Determinants of Health (2008)
 * - Marmot Review: Fair Society, Healthy Lives (2010)
 * - CDC Social Determinants of Health framework (2023)
 */

import { DIMENSIONS, SCORE_BANDS } from "../data/dimensions";
import { RECOMMENDATIONS, getRecommendationTier } from "../data/recommendations";

// ─── Core Score Calculation ───────────────────────────────────────────────────

/**
 * Calculates the overall resilience score from dimension values.
 * @param {Object} values - { [dimensionKey]: number (0-100) }
 * @returns {number} - integer score 0–100
 */
export function calcScore(values) {
  const raw = DIMENSIONS.reduce((sum, dim) => {
    const val = values[dim.key] ?? 0;
    return sum + val * dim.weight;
  }, 0);
  return Math.round(Math.min(100, Math.max(0, raw)));
}

/**
 * Calculates weighted contribution of each dimension to the final score.
 * Useful for showing "how much each factor matters".
 */
export function getDimensionContributions(values) {
  return DIMENSIONS.map((dim) => ({
    ...dim,
    value: values[dim.key] ?? 0,
    contribution: Math.round((values[dim.key] ?? 0) * dim.weight),
    percentage: Math.round(((values[dim.key] ?? 0) * dim.weight) / calcScore(values) * 100),
  }));
}

// ─── Band & Status Helpers ────────────────────────────────────────────────────

/**
 * Returns the score band object for a given score.
 * @param {number} score
 * @returns {Object} SCORE_BAND entry
 */
export function getBand(score) {
  return SCORE_BANDS.find((b) => score >= b.min && score <= b.max) || SCORE_BANDS[0];
}

/**
 * Returns a color for any score value.
 */
export function getScoreColor(value) {
  if (value < 30) return "#ef4444";
  if (value < 50) return "#f97316";
  if (value < 65) return "#eab308";
  if (value < 80) return "#22c55e";
  return "#38bdf8";
}

// ─── Dimension Analysis ───────────────────────────────────────────────────────

export function getWeakestDimensions(values, count = 2) {
  return DIMENSIONS.slice()
    .sort((a, b) => (values[a.key] ?? 0) - (values[b.key] ?? 0))
    .slice(0, count);
}

export function getStrongestDimension(values) {
  return DIMENSIONS.reduce((best, dim) =>
    (values[dim.key] ?? 0) > (values[best.key] ?? 0) ? dim : best
  );
}

export function countProtectiveFactors(values, threshold = 60) {
  return DIMENSIONS.filter((d) => (values[d.key] ?? 0) >= threshold).length;
}

export function countRiskFlags(values, threshold = 40) {
  return DIMENSIONS.filter((d) => (values[d.key] ?? 0) < threshold).length;
}

/**
 * Identifies dimensions that have improved between two snapshots.
 */
export function getImprovements(prevValues, currValues) {
  return DIMENSIONS.filter((d) =>
    (currValues[d.key] ?? 0) > (prevValues[d.key] ?? 0)
  ).map((d) => ({
    ...d,
    delta: (currValues[d.key] ?? 0) - (prevValues[d.key] ?? 0),
  }));
}

// ─── AI Insight Generator ─────────────────────────────────────────────────────

const STATUS_MESSAGES = {
  Critical: `Your resilience profile signals significant vulnerability across multiple social determinants. The data strongly suggests that professional mental health support and social services would provide meaningful relief. You are not alone — these circumstances are systemic, not personal failures.`,
  Low: `Several interconnected risk factors are placing real strain on your mental health. The good news: targeted action on even one dimension creates a positive ripple effect across the others. Small, consistent steps compound significantly over time.`,
  Moderate: `You have real strengths working in your favor alongside areas that need intentional attention. Your profile suggests high sensitivity to improvements in your weakest 1–2 dimensions — focus there for maximum impact on your overall resilience.`,
  Good: `You've built solid foundations across most determinants. To move from Good to Excellent, research suggests focusing on the dimensions below your personal average, as they act as 'rate limiters' on your overall wellbeing ceiling.`,
  Excellent: `Outstanding resilience profile. You've built strong protective factors across nearly all social determinants. Maintaining these systems and, where possible, extending your resources to your community will further strengthen your own resilience through the 'helper's effect'.`,
};

/**
 * Main AI insight generator — returns rich insight object for the current profile.
 * @param {Object} values
 * @returns {Object} comprehensive insight report
 */
export function generateInsights(values) {
  const score = calcScore(values);
  const band = getBand(score);
  const weakest = getWeakestDimensions(values, 3);
  const strongest = getStrongestDimension(values);
  const riskFlags = countRiskFlags(values);
  const protective = countProtectiveFactors(values);

  // Generate dynamic recommendations for each priority dimension
  const recommendations = weakest
    .filter((dim) => (values[dim.key] ?? 0) < 75) // Only dims that need help
    .map((dim) => {
      const tier = getRecommendationTier(values[dim.key] ?? 0);
      const rec = RECOMMENDATIONS[dim.key]?.[tier];
      return rec ? { dim, tier, ...rec } : null;
    })
    .filter(Boolean);

  // Score change analysis (if history exists)
  const scoreCategory = score >= 80 ? "High" : score >= 60 ? "Medium-High" : score >= 40 ? "Medium" : "Low";

  return {
    score,
    band,
    weakest,
    strongest,
    riskFlags,
    protective,
    statusMessage: STATUS_MESSAGES[band.label],
    recommendations,
    scoreCategory,
    summary: {
      headline: `${band.emoji} ${band.label} Resilience — ${score}/100`,
      topStrength: `${strongest.icon} ${strongest.label} (${values[strongest.key] ?? 0})`,
      topRisk: weakest[0] ? `${weakest[0].icon} ${weakest[0].label} (${values[weakest[0].key] ?? 0})` : "None identified",
      priorityAction: recommendations[0]?.actions?.[0]?.title ?? "Maintain current habits",
    },
  };
}

// ─── Comparison Engine ────────────────────────────────────────────────────────

/**
 * Compares two sets of values and returns a structured comparison.
 */
export function compareProfiles(valuesA, valuesB, labelA = "Profile A", labelB = "Profile B") {
  const scoreA = calcScore(valuesA);
  const scoreB = calcScore(valuesB);
  const bandA = getBand(scoreA);
  const bandB = getBand(scoreB);

  const dimensionComparison = DIMENSIONS.map((dim) => {
    const a = valuesA[dim.key] ?? 0;
    const b = valuesB[dim.key] ?? 0;
    return {
      dim,
      a,
      b,
      delta: b - a,
      winner: a > b ? "A" : b > a ? "B" : "tie",
    };
  });

  const aWins = dimensionComparison.filter((d) => d.winner === "A").length;
  const bWins = dimensionComparison.filter((d) => d.winner === "B").length;

  return {
    labelA,
    labelB,
    scoreA,
    scoreB,
    bandA,
    bandB,
    overallWinner: scoreA > scoreB ? "A" : scoreB > scoreA ? "B" : "tie",
    dimensionComparison,
    aWins,
    bWins,
    scoreDelta: scoreB - scoreA,
  };
}

// ─── PDF Report Generator ─────────────────────────────────────────────────────

/**
 * Generates a structured report object for PDF export.
 */
export function generateReportData(values, userName = "Anonymous") {
  const score = calcScore(values);
  const band = getBand(score);
  const insights = generateInsights(values);
  const contributions = getDimensionContributions(values);

  return {
    meta: {
      userName,
      generatedAt: new Date().toLocaleString(),
      version: "2.0",
    },
    score,
    band: { label: band.label, color: band.color },
    dimensions: contributions,
    insights: {
      statusMessage: insights.statusMessage,
      topStrength: insights.summary.topStrength,
      topRisk: insights.summary.topRisk,
    },
    recommendations: insights.recommendations.map((r) => ({
      dimension: r.dim.label,
      headline: r.headline,
      actions: r.actions.slice(0, 2).map((a) => a.title),
    })),
  };
}
