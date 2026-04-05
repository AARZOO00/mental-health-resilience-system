/**
 * India State-Level Mental Health Resilience Dataset
 * 20 Indian states with 8 Social Determinants of Health indicators.
 *
 * Columns:
 *   avgIncomeIndex      — 0–1 normalized per-capita income index
 *   educationIndex      — 0–1 literacy + enrollment composite
 *   healthcareIndex     — 0–1 healthcare access composite
 *   urbanizationPct     — % urban population
 *   unemploymentRate    — % unemployment
 *   stressIndex         — 1–10 (higher = more stress)
 *   socialSupportIndex  — 1–10 (higher = better support)
 *   resilienceScore     — 0–100 Mental Health Resilience Score
 */

export const INDIA_STATES = [
  {
    state: "Andhra Pradesh",
    abbr: "AP",
    region: "South",
    avgIncomeIndex: 0.62,
    educationIndex: 0.68,
    healthcareIndex: 0.65,
    urbanizationPct: 49,
    unemploymentRate: 7.2,
    stressIndex: 5.8,
    socialSupportIndex: 6.5,
    resilienceScore: 69,
  },
  {
    state: "Bihar",
    abbr: "BR",
    region: "East",
    avgIncomeIndex: 0.38,
    educationIndex: 0.45,
    healthcareIndex: 0.40,
    urbanizationPct: 12,
    unemploymentRate: 9.5,
    stressIndex: 7.8,
    socialSupportIndex: 5.2,
    resilienceScore: 52,
  },
  {
    state: "Delhi",
    abbr: "DL",
    region: "North",
    avgIncomeIndex: 0.78,
    educationIndex: 0.82,
    healthcareIndex: 0.85,
    urbanizationPct: 97,
    unemploymentRate: 6.1,
    stressIndex: 6.5,
    socialSupportIndex: 6.8,
    resilienceScore: 75,
  },
  {
    state: "Gujarat",
    abbr: "GJ",
    region: "West",
    avgIncomeIndex: 0.70,
    educationIndex: 0.72,
    healthcareIndex: 0.68,
    urbanizationPct: 43,
    unemploymentRate: 5.9,
    stressIndex: 5.5,
    socialSupportIndex: 6.9,
    resilienceScore: 74,
  },
  {
    state: "Karnataka",
    abbr: "KA",
    region: "South",
    avgIncomeIndex: 0.73,
    educationIndex: 0.76,
    healthcareIndex: 0.74,
    urbanizationPct: 52,
    unemploymentRate: 6.3,
    stressIndex: 5.7,
    socialSupportIndex: 7.2,
    resilienceScore: 76,
  },
  {
    state: "Kerala",
    abbr: "KL",
    region: "South",
    avgIncomeIndex: 0.75,
    educationIndex: 0.90,
    healthcareIndex: 0.88,
    urbanizationPct: 48,
    unemploymentRate: 7.0,
    stressIndex: 5.2,
    socialSupportIndex: 8.5,
    resilienceScore: 82,
  },
  {
    state: "Madhya Pradesh",
    abbr: "MP",
    region: "Central",
    avgIncomeIndex: 0.52,
    educationIndex: 0.58,
    healthcareIndex: 0.55,
    urbanizationPct: 28,
    unemploymentRate: 8.2,
    stressIndex: 6.9,
    socialSupportIndex: 5.8,
    resilienceScore: 61,
  },
  {
    state: "Maharashtra",
    abbr: "MH",
    region: "West",
    avgIncomeIndex: 0.77,
    educationIndex: 0.78,
    healthcareIndex: 0.80,
    urbanizationPct: 55,
    unemploymentRate: 6.5,
    stressIndex: 5.9,
    socialSupportIndex: 7.0,
    resilienceScore: 78,
  },
  {
    state: "Rajasthan",
    abbr: "RJ",
    region: "North",
    avgIncomeIndex: 0.55,
    educationIndex: 0.60,
    healthcareIndex: 0.58,
    urbanizationPct: 25,
    unemploymentRate: 8.0,
    stressIndex: 6.8,
    socialSupportIndex: 5.9,
    resilienceScore: 63,
  },
  {
    state: "Tamil Nadu",
    abbr: "TN",
    region: "South",
    avgIncomeIndex: 0.74,
    educationIndex: 0.79,
    healthcareIndex: 0.82,
    urbanizationPct: 48,
    unemploymentRate: 6.0,
    stressIndex: 5.4,
    socialSupportIndex: 7.5,
    resilienceScore: 80,
  },
  {
    state: "Uttar Pradesh",
    abbr: "UP",
    region: "North",
    avgIncomeIndex: 0.50,
    educationIndex: 0.55,
    healthcareIndex: 0.52,
    urbanizationPct: 23,
    unemploymentRate: 9.0,
    stressIndex: 7.2,
    socialSupportIndex: 5.6,
    resilienceScore: 58,
  },
  {
    state: "West Bengal",
    abbr: "WB",
    region: "East",
    avgIncomeIndex: 0.65,
    educationIndex: 0.70,
    healthcareIndex: 0.68,
    urbanizationPct: 32,
    unemploymentRate: 7.1,
    stressIndex: 6.2,
    socialSupportIndex: 6.7,
    resilienceScore: 71,
  },
  {
    state: "Punjab",
    abbr: "PB",
    region: "North",
    avgIncomeIndex: 0.72,
    educationIndex: 0.75,
    healthcareIndex: 0.70,
    urbanizationPct: 37,
    unemploymentRate: 6.8,
    stressIndex: 5.9,
    socialSupportIndex: 7.1,
    resilienceScore: 75,
  },
  {
    state: "Haryana",
    abbr: "HR",
    region: "North",
    avgIncomeIndex: 0.71,
    educationIndex: 0.73,
    healthcareIndex: 0.69,
    urbanizationPct: 35,
    unemploymentRate: 6.9,
    stressIndex: 6.1,
    socialSupportIndex: 6.8,
    resilienceScore: 73,
  },
  {
    state: "Odisha",
    abbr: "OD",
    region: "East",
    avgIncomeIndex: 0.54,
    educationIndex: 0.62,
    healthcareIndex: 0.60,
    urbanizationPct: 17,
    unemploymentRate: 7.8,
    stressIndex: 6.6,
    socialSupportIndex: 6.2,
    resilienceScore: 66,
  },
  {
    state: "Jharkhand",
    abbr: "JH",
    region: "East",
    avgIncomeIndex: 0.48,
    educationIndex: 0.52,
    healthcareIndex: 0.50,
    urbanizationPct: 14,
    unemploymentRate: 8.7,
    stressIndex: 7.0,
    socialSupportIndex: 5.7,
    resilienceScore: 60,
  },
  {
    state: "Assam",
    abbr: "AS",
    region: "Northeast",
    avgIncomeIndex: 0.51,
    educationIndex: 0.60,
    healthcareIndex: 0.58,
    urbanizationPct: 14,
    unemploymentRate: 8.3,
    stressIndex: 6.7,
    socialSupportIndex: 6.0,
    resilienceScore: 64,
  },
  {
    state: "Chhattisgarh",
    abbr: "CG",
    region: "Central",
    avgIncomeIndex: 0.50,
    educationIndex: 0.55,
    healthcareIndex: 0.53,
    urbanizationPct: 23,
    unemploymentRate: 8.5,
    stressIndex: 6.9,
    socialSupportIndex: 5.9,
    resilienceScore: 62,
  },
  {
    state: "Uttarakhand",
    abbr: "UK",
    region: "North",
    avgIncomeIndex: 0.68,
    educationIndex: 0.74,
    healthcareIndex: 0.72,
    urbanizationPct: 30,
    unemploymentRate: 6.5,
    stressIndex: 5.8,
    socialSupportIndex: 7.0,
    resilienceScore: 74,
  },
  {
    state: "Himachal Pradesh",
    abbr: "HP",
    region: "North",
    avgIncomeIndex: 0.69,
    educationIndex: 0.80,
    healthcareIndex: 0.78,
    urbanizationPct: 10,
    unemploymentRate: 6.2,
    stressIndex: 5.3,
    socialSupportIndex: 7.8,
    resilienceScore: 79,
  },
];

/* ── Derived helpers ─────────────────────────────────────────────── */

/** National average across all states */
export const NATIONAL_AVERAGES = {
  avgIncomeIndex:    parseFloat((INDIA_STATES.reduce((s, d) => s + d.avgIncomeIndex, 0)    / INDIA_STATES.length).toFixed(3)),
  educationIndex:    parseFloat((INDIA_STATES.reduce((s, d) => s + d.educationIndex, 0)    / INDIA_STATES.length).toFixed(3)),
  healthcareIndex:   parseFloat((INDIA_STATES.reduce((s, d) => s + d.healthcareIndex, 0)   / INDIA_STATES.length).toFixed(3)),
  urbanizationPct:   parseFloat((INDIA_STATES.reduce((s, d) => s + d.urbanizationPct, 0)   / INDIA_STATES.length).toFixed(1)),
  unemploymentRate:  parseFloat((INDIA_STATES.reduce((s, d) => s + d.unemploymentRate, 0)  / INDIA_STATES.length).toFixed(2)),
  stressIndex:       parseFloat((INDIA_STATES.reduce((s, d) => s + d.stressIndex, 0)       / INDIA_STATES.length).toFixed(2)),
  socialSupportIndex:parseFloat((INDIA_STATES.reduce((s, d) => s + d.socialSupportIndex, 0)/ INDIA_STATES.length).toFixed(2)),
  resilienceScore:   parseFloat((INDIA_STATES.reduce((s, d) => s + d.resilienceScore, 0)   / INDIA_STATES.length).toFixed(1)),
};

/** All unique regions */
export const REGIONS = [...new Set(INDIA_STATES.map((s) => s.region))].sort();

/** Sort states by any field */
export function sortStates(field = "resilienceScore", order = "desc") {
  return [...INDIA_STATES].sort((a, b) =>
    order === "desc" ? b[field] - a[field] : a[field] - b[field]
  );
}

/** Filter by region */
export function filterByRegion(region) {
  if (!region || region === "All") return INDIA_STATES;
  return INDIA_STATES.filter((s) => s.region === region);
}

/** Get band label for resilience score */
export function getScoreBand(score) {
  if (score >= 80) return { label: "Excellent", color: "#38bdf8", emoji: "🔵" };
  if (score >= 70) return { label: "Good",      color: "#22c55e", emoji: "🟢" };
  if (score >= 60) return { label: "Moderate",  color: "#eab308", emoji: "🟡" };
  if (score >= 50) return { label: "Low",       color: "#f97316", emoji: "🟠" };
  return                   { label: "Critical", color: "#ef4444", emoji: "🔴" };
}

/** Column metadata for table rendering */
export const COLUMNS = [
  { key: "state",              label: "State",             format: (v) => v,                          sortable: true },
  { key: "region",             label: "Region",            format: (v) => v,                          sortable: true },
  { key: "resilienceScore",    label: "Resilience Score",  format: (v) => `${v}/100`,                 sortable: true, highlight: true },
  { key: "avgIncomeIndex",     label: "Income Index",      format: (v) => v.toFixed(2),               sortable: true },
  { key: "educationIndex",     label: "Education",         format: (v) => v.toFixed(2),               sortable: true },
  { key: "healthcareIndex",    label: "Healthcare",        format: (v) => v.toFixed(2),               sortable: true },
  { key: "urbanizationPct",    label: "Urban %",           format: (v) => `${v}%`,                    sortable: true },
  { key: "unemploymentRate",   label: "Unemployment",      format: (v) => `${v}%`,                    sortable: true },
  { key: "stressIndex",        label: "Stress Index",      format: (v) => `${v}/10`,                  sortable: true },
  { key: "socialSupportIndex", label: "Social Support",    format: (v) => `${v}/10`,                  sortable: true },
];
