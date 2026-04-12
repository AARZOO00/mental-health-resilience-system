"""
Mental Health Resilience Scoring System — Python FastAPI Backend
================================================================
Run with:  uvicorn main:app --reload --port 8000

Endpoints:
  POST /api/score           — Calculate resilience score
  POST /api/insights        — Get AI-generated insights
  GET  /api/india-states    — Return all India state data
  POST /api/compare         — Compare two profiles
  GET  /api/health          — Health check

Install dependencies:
  pip install fastapi uvicorn pandas scikit-learn pydantic
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
import pandas as pd
import json
from datetime import datetime

app = FastAPI(
    title="MH Resilience API",
    description="Mental Health Resilience Scoring System — Backend",
    version="2.0.0",
)

# Allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── SDOH Dimension Weights (WHO-based) ─────────────────────────────
WEIGHTS = {
    "economic":    0.22,
    "social":      0.20,
    "housing":     0.16,
    "healthcare":  0.16,
    "education":   0.10,
    "community":   0.08,
    "lifestyle":   0.08,
}

# ── Score Bands ─────────────────────────────────────────────────────
def get_band(score: float) -> dict:
    if score >= 80: return {"label": "Excellent", "color": "#38bdf8", "emoji": "🔵"}
    if score >= 65: return {"label": "Good",      "color": "#22c55e", "emoji": "🟢"}
    if score >= 50: return {"label": "Moderate",  "color": "#eab308", "emoji": "🟡"}
    if score >= 35: return {"label": "Low",       "color": "#f97316", "emoji": "🟠"}
    return              {"label": "Critical",  "color": "#ef4444", "emoji": "🔴"}

# ── India States Dataset ────────────────────────────────────────────
INDIA_DATA = [
    {"state":"Andhra Pradesh","abbr":"AP","region":"South","avg_income_index":0.62,"education_index":0.68,"healthcare_index":0.65,"urbanization_pct":49,"unemployment_rate":7.2,"stress_index":5.8,"social_support_index":6.5,"resilience_score":69},
    {"state":"Bihar","abbr":"BR","region":"East","avg_income_index":0.38,"education_index":0.45,"healthcare_index":0.40,"urbanization_pct":12,"unemployment_rate":9.5,"stress_index":7.8,"social_support_index":5.2,"resilience_score":52},
    {"state":"Delhi","abbr":"DL","region":"North","avg_income_index":0.78,"education_index":0.82,"healthcare_index":0.85,"urbanization_pct":97,"unemployment_rate":6.1,"stress_index":6.5,"social_support_index":6.8,"resilience_score":75},
    {"state":"Gujarat","abbr":"GJ","region":"West","avg_income_index":0.70,"education_index":0.72,"healthcare_index":0.68,"urbanization_pct":43,"unemployment_rate":5.9,"stress_index":5.5,"social_support_index":6.9,"resilience_score":74},
    {"state":"Karnataka","abbr":"KA","region":"South","avg_income_index":0.73,"education_index":0.76,"healthcare_index":0.74,"urbanization_pct":52,"unemployment_rate":6.3,"stress_index":5.7,"social_support_index":7.2,"resilience_score":76},
    {"state":"Kerala","abbr":"KL","region":"South","avg_income_index":0.75,"education_index":0.90,"healthcare_index":0.88,"urbanization_pct":48,"unemployment_rate":7.0,"stress_index":5.2,"social_support_index":8.5,"resilience_score":82},
    {"state":"Madhya Pradesh","abbr":"MP","region":"Central","avg_income_index":0.52,"education_index":0.58,"healthcare_index":0.55,"urbanization_pct":28,"unemployment_rate":8.2,"stress_index":6.9,"social_support_index":5.8,"resilience_score":61},
    {"state":"Maharashtra","abbr":"MH","region":"West","avg_income_index":0.77,"education_index":0.78,"healthcare_index":0.80,"urbanization_pct":55,"unemployment_rate":6.5,"stress_index":5.9,"social_support_index":7.0,"resilience_score":78},
    {"state":"Rajasthan","abbr":"RJ","region":"North","avg_income_index":0.55,"education_index":0.60,"healthcare_index":0.58,"urbanization_pct":25,"unemployment_rate":8.0,"stress_index":6.8,"social_support_index":5.9,"resilience_score":63},
    {"state":"Tamil Nadu","abbr":"TN","region":"South","avg_income_index":0.74,"education_index":0.79,"healthcare_index":0.82,"urbanization_pct":48,"unemployment_rate":6.0,"stress_index":5.4,"social_support_index":7.5,"resilience_score":80},
    {"state":"Uttar Pradesh","abbr":"UP","region":"North","avg_income_index":0.50,"education_index":0.55,"healthcare_index":0.52,"urbanization_pct":23,"unemployment_rate":9.0,"stress_index":7.2,"social_support_index":5.6,"resilience_score":58},
    {"state":"West Bengal","abbr":"WB","region":"East","avg_income_index":0.65,"education_index":0.70,"healthcare_index":0.68,"urbanization_pct":32,"unemployment_rate":7.1,"stress_index":6.2,"social_support_index":6.7,"resilience_score":71},
    {"state":"Punjab","abbr":"PB","region":"North","avg_income_index":0.72,"education_index":0.75,"healthcare_index":0.70,"urbanization_pct":37,"unemployment_rate":6.8,"stress_index":5.9,"social_support_index":7.1,"resilience_score":75},
    {"state":"Haryana","abbr":"HR","region":"North","avg_income_index":0.71,"education_index":0.73,"healthcare_index":0.69,"urbanization_pct":35,"unemployment_rate":6.9,"stress_index":6.1,"social_support_index":6.8,"resilience_score":73},
    {"state":"Odisha","abbr":"OD","region":"East","avg_income_index":0.54,"education_index":0.62,"healthcare_index":0.60,"urbanization_pct":17,"unemployment_rate":7.8,"stress_index":6.6,"social_support_index":6.2,"resilience_score":66},
    {"state":"Jharkhand","abbr":"JH","region":"East","avg_income_index":0.48,"education_index":0.52,"healthcare_index":0.50,"urbanization_pct":14,"unemployment_rate":8.7,"stress_index":7.0,"social_support_index":5.7,"resilience_score":60},
    {"state":"Assam","abbr":"AS","region":"Northeast","avg_income_index":0.51,"education_index":0.60,"healthcare_index":0.58,"urbanization_pct":14,"unemployment_rate":8.3,"stress_index":6.7,"social_support_index":6.0,"resilience_score":64},
    {"state":"Chhattisgarh","abbr":"CG","region":"Central","avg_income_index":0.50,"education_index":0.55,"healthcare_index":0.53,"urbanization_pct":23,"unemployment_rate":8.5,"stress_index":6.9,"social_support_index":5.9,"resilience_score":62},
    {"state":"Uttarakhand","abbr":"UK","region":"North","avg_income_index":0.68,"education_index":0.74,"healthcare_index":0.72,"urbanization_pct":30,"unemployment_rate":6.5,"stress_index":5.8,"social_support_index":7.0,"resilience_score":74},
    {"state":"Himachal Pradesh","abbr":"HP","region":"North","avg_income_index":0.69,"education_index":0.80,"healthcare_index":0.78,"urbanization_pct":10,"unemployment_rate":6.2,"stress_index":5.3,"social_support_index":7.8,"resilience_score":79},
]

df = pd.DataFrame(INDIA_DATA)

# ── Pydantic Models ─────────────────────────────────────────────────
class AssessmentValues(BaseModel):
    economic:   float = Field(ge=0, le=100)
    social:     float = Field(ge=0, le=100)
    housing:    float = Field(ge=0, le=100)
    healthcare: float = Field(ge=0, le=100)
    education:  float = Field(ge=0, le=100)
    community:  float = Field(ge=0, le=100)
    lifestyle:  float = Field(ge=0, le=100)

class CompareRequest(BaseModel):
    values_a: AssessmentValues
    values_b: AssessmentValues
    label_a:  Optional[str] = "Profile A"
    label_b:  Optional[str] = "Profile B"

# ── Helper: calculate score ─────────────────────────────────────────
def calculate_score(values: dict) -> int:
    raw = sum(values.get(dim, 0) * weight for dim, weight in WEIGHTS.items())
    return round(min(100, max(0, raw)))

# ── Endpoints ───────────────────────────────────────────────────────

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "MH Resilience API",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat(),
    }


@app.post("/api/score")
def get_score(values: AssessmentValues):
    """Calculate weighted resilience score from dimension values."""
    vals = values.dict()
    score = calculate_score(vals)
    band  = get_band(score)

    # Find weakest and strongest dimensions
    sorted_dims = sorted(vals.items(), key=lambda x: x[1])
    weakest     = sorted_dims[:2]
    strongest   = sorted_dims[-1]

    return {
        "score":      score,
        "band":       band,
        "values":     vals,
        "weights":    WEIGHTS,
        "weakest":    [{"dimension": d, "value": v} for d, v in weakest],
        "strongest":  {"dimension": strongest[0], "value": strongest[1]},
        "protective_factors": sum(1 for v in vals.values() if v >= 60),
        "risk_flags":         sum(1 for v in vals.values() if v < 40),
        "contributions": {
            dim: round(vals.get(dim, 0) * weight, 2)
            for dim, weight in WEIGHTS.items()
        },
    }


@app.post("/api/compare")
def compare_profiles(req: CompareRequest):
    """Compare two assessment profiles side by side."""
    vals_a = req.values_a.dict()
    vals_b = req.values_b.dict()

    score_a = calculate_score(vals_a)
    score_b = calculate_score(vals_b)

    dimension_comparison = []
    for dim in WEIGHTS:
        a, b = vals_a.get(dim, 0), vals_b.get(dim, 0)
        dimension_comparison.append({
            "dimension": dim,
            "value_a":   a,
            "value_b":   b,
            "delta":     round(b - a, 1),
            "winner":    "A" if a > b else "B" if b > a else "tie",
        })

    return {
        "label_a":              req.label_a,
        "label_b":              req.label_b,
        "score_a":              score_a,
        "score_b":              score_b,
        "band_a":               get_band(score_a),
        "band_b":               get_band(score_b),
        "score_delta":          score_b - score_a,
        "overall_winner":       "A" if score_a > score_b else "B" if score_b > score_a else "tie",
        "dimension_comparison": dimension_comparison,
        "a_wins":               sum(1 for d in dimension_comparison if d["winner"] == "A"),
        "b_wins":               sum(1 for d in dimension_comparison if d["winner"] == "B"),
    }


@app.get("/api/india-states")
def get_india_states(region: Optional[str] = None, sort_by: str = "resilience_score", order: str = "desc"):
    """Return India state SDOH data with optional filtering and sorting."""
    data = df.copy()

    if region and region != "All":
        data = data[data["region"] == region]

    if sort_by in data.columns:
        data = data.sort_values(sort_by, ascending=(order == "asc"))

    # Add band info
    records = data.to_dict("records")
    for r in records:
        r["band"] = get_band(r["resilience_score"])

    return {
        "states":           records,
        "total":            len(records),
        "national_average": round(df["resilience_score"].mean(), 1),
        "top_state":        df.loc[df["resilience_score"].idxmax(), "state"],
        "bottom_state":     df.loc[df["resilience_score"].idxmin(), "state"],
        "regions":          sorted(df["region"].unique().tolist()),
    }


@app.get("/api/india-states/{state_abbr}")
def get_state_detail(state_abbr: str):
    """Get detailed data for a single Indian state."""
    state = df[df["abbr"].str.upper() == state_abbr.upper()]
    if state.empty:
        raise HTTPException(status_code=404, detail=f"State '{state_abbr}' not found")

    record = state.iloc[0].to_dict()
    record["band"] = get_band(record["resilience_score"])

    # Rank among all states
    record["rank"] = int((df["resilience_score"] > record["resilience_score"]).sum()) + 1
    record["percentile"] = round(
        (df["resilience_score"] < record["resilience_score"]).sum() / len(df) * 100, 1
    )

    # Regional comparison
    region_df = df[df["region"] == record["region"]]
    record["region_rank"] = int((region_df["resilience_score"] > record["resilience_score"]).sum()) + 1
    record["region_avg"]  = round(region_df["resilience_score"].mean(), 1)

    return record


@app.get("/api/analytics/summary")
def get_analytics_summary():
    """Aggregate analytics across all states."""
    return {
        "total_states":     len(df),
        "national_avg":     round(df["resilience_score"].mean(), 1),
        "score_std":        round(df["resilience_score"].std(), 2),
        "correlations": {
            "income_vs_score":    round(df["avg_income_index"].corr(df["resilience_score"]), 3),
            "education_vs_score": round(df["education_index"].corr(df["resilience_score"]), 3),
            "stress_vs_score":    round(df["stress_index"].corr(df["resilience_score"]), 3),
            "social_vs_score":    round(df["social_support_index"].corr(df["resilience_score"]), 3),
        },
        "by_region": df.groupby("region")["resilience_score"].mean().round(1).to_dict(),
        "band_distribution": {
            "excellent": int((df["resilience_score"] >= 80).sum()),
            "good":      int(((df["resilience_score"] >= 65) & (df["resilience_score"] < 80)).sum()),
            "moderate":  int(((df["resilience_score"] >= 50) & (df["resilience_score"] < 65)).sum()),
            "low":       int(((df["resilience_score"] >= 35) & (df["resilience_score"] < 50)).sum()),
            "critical":  int((df["resilience_score"] < 35).sum()),
        },
    }
