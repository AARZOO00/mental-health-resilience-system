/**
 * SDOH Dimension Configuration
 * Weights derived from WHO Social Determinants of Health Framework (2008)
 * and Wilkinson & Marmot meta-analysis on mental health outcomes.
 *
 * Each dimension includes:
 * - key:         unique identifier
 * - label:       display name
 * - icon:        emoji for visual identification
 * - description: detailed explanation
 * - tooltip:     beginner-friendly 1-sentence explanation shown in UI
 * - weight:      contribution to overall score (must sum to 1.0)
 * - color:       chart/UI color
 * - subFactors:  3-4 specific sub-components this dimension encompasses
 * - examples:    concrete examples for the slider labels
 */
export const DIMENSIONS = [
  {
    key: "economic",
    label: "Economic Stability",
    icon: "💰",
    color: "#38bdf8",
    gradientFrom: "#0ea5e9",
    gradientTo: "#38bdf8",
    weight: 0.22,
    description:
      "Income security, employment status, and the ability to afford basic necessities without financial stress.",
    tooltip:
      "How stable is your income and financial situation? Financial stress is the #1 predictor of anxiety and depression.",
    subFactors: ["Employment status", "Income adequacy", "Financial stress", "Debt load"],
    examples: ["No income / severe debt", "Unstable income", "Adequate income", "Financially secure"],
    researchNote:
      "Research shows individuals in the lowest income quartile are 3× more likely to experience mental illness (WHO, 2014).",
  },
  {
    key: "social",
    label: "Social Support",
    icon: "🤝",
    color: "#818cf8",
    gradientFrom: "#6366f1",
    gradientTo: "#818cf8",
    weight: 0.20,
    description:
      "Quality and depth of personal relationships, social networks, and sense of belonging in a community.",
    tooltip:
      "Do you have people you can rely on? Strong social connections are one of the most powerful mental health protectors.",
    subFactors: ["Close relationships", "Community belonging", "Social participation", "Emotional support"],
    examples: ["Severe isolation", "Occasional contact", "Regular support network", "Strong, rich relationships"],
    researchNote:
      "Loneliness has the same mortality risk as smoking 15 cigarettes a day (Holt-Lunstad, 2015).",
  },
  {
    key: "housing",
    label: "Housing Stability",
    icon: "🏠",
    color: "#fb7185",
    gradientFrom: "#f43f5e",
    gradientTo: "#fb7185",
    weight: 0.16,
    description:
      "Safety, affordability, and permanence of living situation — the foundational layer of Maslow's hierarchy.",
    tooltip:
      "Is your home safe, stable, and affordable? Housing instability creates chronic stress that undermines all other wellbeing.",
    subFactors: ["Housing security", "Neighborhood safety", "Affordability", "Overcrowding"],
    examples: ["Unhoused / at risk", "Unstable/unsafe housing", "Stable but stressed", "Safe and secure home"],
    researchNote:
      "Eviction increases depression rates by 40% and creates trauma lasting 2–5 years (Desmond, 2016).",
  },
  {
    key: "healthcare",
    label: "Healthcare Access",
    icon: "🏥",
    color: "#fbbf24",
    gradientFrom: "#f59e0b",
    gradientTo: "#fbbf24",
    weight: 0.16,
    description:
      "Ability to access quality physical and mental health services, including insurance coverage and geographic availability.",
    tooltip:
      "Can you see a doctor or therapist when you need to? Lack of healthcare access means problems go untreated and worsen.",
    subFactors: ["Insurance coverage", "Mental health access", "Preventive care", "Medication access"],
    examples: ["No access / uninsured", "Inconsistent access", "Basic access", "Comprehensive care"],
    researchNote:
      "Only 43% of people with mental illness receive treatment due to access barriers (NAMI, 2023).",
  },
  {
    key: "education",
    label: "Education & Literacy",
    icon: "📚",
    color: "#34d399",
    gradientFrom: "#10b981",
    gradientTo: "#34d399",
    weight: 0.10,
    description:
      "Educational attainment, health literacy, and continued access to knowledge that enables informed self-care decisions.",
    tooltip:
      "Education builds your ability to understand health information, navigate systems, and make better choices for yourself.",
    subFactors: ["Educational level", "Health literacy", "Digital literacy", "Skill development"],
    examples: ["< 8th grade", "High school level", "Some college/trade", "College degree+"],
    researchNote:
      "Each additional year of education is associated with a 7–8% improvement in mental health outcomes (Lund, 2010).",
  },
  {
    key: "community",
    label: "Community & Safety",
    icon: "🌍",
    color: "#c084fc",
    gradientFrom: "#a855f7",
    gradientTo: "#c084fc",
    weight: 0.08,
    description:
      "Exposure to violence, discrimination, and the richness of local community resources and social cohesion.",
    tooltip:
      "Do you feel safe where you live? Community violence and discrimination cause chronic stress and trauma.",
    subFactors: ["Physical safety", "Discrimination exposure", "Community resources", "Civic participation"],
    examples: ["High violence / discrimination", "Unsafe community", "Moderate safety", "Safe, inclusive community"],
    researchNote:
      "Living in a high-violence neighborhood doubles the risk of PTSD (Fowler et al., 2009).",
  },
  {
    key: "lifestyle",
    label: "Lifestyle & Habits",
    icon: "⚡",
    color: "#f472b6",
    gradientFrom: "#ec4899",
    gradientTo: "#f472b6",
    weight: 0.08,
    description:
      "Quality of sleep, physical activity, nutrition, and stress management practices in daily life.",
    tooltip:
      "Daily habits like sleep, exercise, and diet directly regulate mood, stress hormones, and cognitive function.",
    subFactors: ["Sleep quality", "Physical activity", "Nutrition", "Stress management"],
    examples: ["Very poor habits", "Inconsistent routines", "Moderate healthy habits", "Excellent self-care"],
    researchNote:
      "30 minutes of exercise 3×/week is as effective as antidepressants for mild-moderate depression (Blumenthal, 1999).",
  },
];

/* ─────────────────────────────────────────────────────────
   Score Band Definitions
   Based on population health distribution percentiles
───────────────────────────────────────────────────────── */
export const SCORE_BANDS = [
  {
    min: 0,  max: 24,  label: "Critical",
    color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.35)",
    emoji: "🔴", ring: "ring-critical",
    tagline: "Immediate support recommended",
    description: "Severe vulnerability across multiple determinants. Professional mental health support and social services are strongly recommended.",
  },
  {
    min: 25, max: 44,  label: "Low",
    color: "#f97316", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.35)",
    emoji: "🟠", ring: "ring-low",
    tagline: "Significant barriers present",
    description: "Multiple risk factors are affecting your resilience. Connecting with community resources and counseling can provide meaningful relief.",
  },
  {
    min: 45, max: 64,  label: "Moderate",
    color: "#eab308", bg: "rgba(234,179,8,0.12)", border: "rgba(234,179,8,0.35)",
    emoji: "🟡", ring: "ring-moderate",
    tagline: "Mixed profile — targeted focus needed",
    description: "You have real strengths alongside areas needing attention. Targeted improvements in weak dimensions can compound positively over time.",
  },
  {
    min: 65, max: 79,  label: "Good",
    color: "#22c55e", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.35)",
    emoji: "🟢", ring: "ring-good",
    tagline: "Solid foundations in place",
    description: "You demonstrate strong resilience with good protective factors. A few focused improvements can elevate your overall wellbeing further.",
  },
  {
    min: 80, max: 100, label: "Excellent",
    color: "#38bdf8", bg: "rgba(56,189,248,0.12)", border: "rgba(56,189,248,0.35)",
    emoji: "🔵", ring: "ring-excellent",
    tagline: "High resilience — sustain and share",
    description: "Outstanding resilience profile with strong protective factors. Maintain these foundations and consider how you can support others.",
  },
];

/* ─────────────────────────────────────────────────────────
   Demo Profiles — realistic fictional personas
───────────────────────────────────────────────────────── */
export const DEMO_PROFILES = [
  {
    id: "maria",
    name: "Maria, 34",
    role: "Single Parent",
    story: "Works two minimum-wage jobs, limited childcare, social isolation, no insurance.",
    avatar: "👩",
    tag: "🔴 Critical",
    values: { economic: 18, social: 22, housing: 15, healthcare: 30, education: 38, community: 20, lifestyle: 22 },
  },
  {
    id: "james",
    name: "James, 28",
    role: "Urban Professional",
    story: "Stable income, moderate social life, high work stress, good healthcare.",
    avatar: "👨‍💼",
    tag: "🟡 Moderate",
    values: { economic: 70, social: 65, housing: 75, healthcare: 72, education: 78, community: 52, lifestyle: 40 },
  },
  {
    id: "priya",
    name: "Priya, 42",
    role: "Community Leader",
    story: "Strong networks, excellent healthcare, financial security, active lifestyle.",
    avatar: "👩‍🏫",
    tag: "🔵 Excellent",
    values: { economic: 88, social: 92, housing: 90, healthcare: 87, education: 88, community: 91, lifestyle: 83 },
  },
  {
    id: "david",
    name: "David, 55",
    role: "Recently Unemployed",
    story: "Lost job 3 months ago, good savings buffer, strained family ties, high stress.",
    avatar: "👨‍🦳",
    tag: "🟠 Low",
    values: { economic: 32, social: 45, housing: 60, healthcare: 35, education: 58, community: 40, lifestyle: 28 },
  },
  {
    id: "aisha",
    name: "Aisha, 22",
    role: "First-Gen College Student",
    story: "Limited finances, strong peer support, no insurance, excellent education trajectory.",
    avatar: "👩‍🎓",
    tag: "🟡 Moderate",
    values: { economic: 25, social: 68, housing: 38, healthcare: 28, education: 75, community: 52, lifestyle: 55 },
  },
];
