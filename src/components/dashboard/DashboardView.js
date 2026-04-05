/**
 * DashboardView — main assessment tab.
 * Composes: ScoreHero, MetricCards, Charts, DimensionInputs, PredictionSimulator.
 */
import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import ScoreHero from "./ScoreHero";
import MetricCards from "./MetricCards";
import DimensionInputs from "./DimensionInputs";
import PredictionSimulator from "./PredictionSimulator";
import { RadarChartView, BarChartView } from "./Charts";
import DetailedReportPage from "../compare/DetailedReportPage";


export default function DashboardView() {
  const { state, actions } = useApp();
  const { values } = state;
  const [showDetailedReport, setShowDetailedReport] = useState(false);

  const handleApplyPrediction = (newValues) => {
    actions.setValues(newValues);
  };

  if (showDetailedReport) {
    return (
      <DetailedReportPage
        values={values}
        onBack={() => setShowDetailedReport(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Report Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text mb-1">🏠 Mental Health Dashboard</h1>
          <p className="text-slate-400">Track your resilience factors and get personalized insights</p>
        </div>
        <button
          onClick={() => setShowDetailedReport(true)}
          className="btn-glow"
        >
          📊 Detailed Report
        </button>
      </div>

      {/* Score ring + dimension bars */}
      <ScoreHero values={values} />

      {/* KPI cards */}
      <MetricCards values={values} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RadarChartView values={values} />
        <BarChartView   values={values} />
      </div>

      {/* Prediction Simulator */}
      <PredictionSimulator
        currentValues={values}
        onApplyPrediction={handleApplyPrediction}
      />

      {/* Sliders */}
      <div className="glass-premium p-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
          🎛 Adjust Your Factors
        </p>
        <DimensionInputs />
      </div>
    </div>
  );
}
