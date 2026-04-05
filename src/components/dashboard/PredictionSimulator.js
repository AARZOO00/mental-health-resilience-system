/**
 * PredictionSimulator — Interactive tool for predicting score changes
 * Shows real-time score prediction as user adjusts dimension sliders
 */
import React, { useState, useEffect } from "react";
import { DIMENSIONS } from "../../data/dimensions";
import { calcScore, getBand, getScoreColor } from "../../utils/scoring";

export default function PredictionSimulator({ currentValues, onApplyPrediction }) {
  const [predictedValues, setPredictedValues] = useState({ ...currentValues });
  const [isAnimating, setIsAnimating] = useState(false);

  const currentScore = calcScore(currentValues);
  const predictedScore = calcScore(predictedValues);
  const currentBand = getBand(currentScore);
  const predictedBand = getBand(predictedScore);
  const scoreDelta = predictedScore - currentScore;

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [predictedScore]);

  const handleSliderChange = (dimensionKey, value) => {
    setPredictedValues(prev => ({ ...prev, [dimensionKey]: value }));
  };

  const resetPrediction = () => {
    setPredictedValues({ ...currentValues });
  };

  const applyPrediction = () => {
    onApplyPrediction(predictedValues);
    setPredictedValues({ ...predictedValues });
  };

  return (
    <div className="glass-premium p-8 animate-slide-in-right">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold gradient-text-purple mb-2">🎯 Prediction Simulator</h3>
          <p className="text-sm text-slate-400">Adjust factors to see predicted score changes</p>
        </div>
        <div className="flex gap-3">
          <button onClick={resetPrediction} className="btn-ghost text-xs">
            🔄 Reset
          </button>
          <button onClick={applyPrediction} className="btn-glow text-xs">
            ✨ Apply Changes
          </button>
        </div>
      </div>

      {/* Score Comparison */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="text-center">
          <div className="text-3xl font-extrabold text-slate-400 mb-2">Current</div>
          <div className="text-5xl font-black mb-2" style={{ color: currentBand.color }}>
            {currentScore}
          </div>
          <div className="text-sm font-semibold" style={{ color: currentBand.color }}>
            {currentBand.emoji} {currentBand.label}
          </div>
        </div>
        <div className="text-center relative">
          <div className="text-3xl font-extrabold gradient-text-purple mb-2">Predicted</div>
          <div className={`text-5xl font-black mb-2 transition-all duration-1000 ${isAnimating ? 'animate-bounce-gentle' : ''}`}
               style={{ color: predictedBand.color }}>
            {predictedScore}
          </div>
          <div className="text-sm font-semibold" style={{ color: predictedBand.color }}>
            {predictedBand.emoji} {predictedBand.label}
          </div>
          {scoreDelta !== 0 && (
            <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold border animate-float
                           ${scoreDelta > 0 ? 'bg-green-500/20 border-green-400 text-green-300' : 'bg-red-500/20 border-red-400 text-red-300'}`}>
              {scoreDelta > 0 ? '+' : ''}{scoreDelta}
            </div>
          )}
        </div>
      </div>

      {/* Change Indicator */}
      {scoreDelta !== 0 && (
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border backdrop-blur-sm
                         ${scoreDelta > 0 ? 'bg-green-500/10 border-green-400/30 text-green-300' : 'bg-red-500/10 border-red-400/30 text-red-300'}`}>
            <span className="text-lg">{scoreDelta > 0 ? '📈' : '📉'}</span>
            <span className="font-semibold">
              {scoreDelta > 0 ? 'Improvement' : 'Decline'} of {Math.abs(scoreDelta)} points
            </span>
          </div>
        </div>
      )}

      {/* Dimension Sliders */}
      <div className="space-y-4">
        {DIMENSIONS.map((dim) => {
          const currentVal = currentValues[dim.key] ?? 0;
          const predictedVal = predictedValues[dim.key] ?? 0;
          const change = predictedVal - currentVal;
          const barColor = getScoreColor(predictedVal);

          return (
            <div key={dim.key} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{dim.icon}</span>
                  <span className="text-sm font-semibold text-slate-300">{dim.label}</span>
                  {change !== 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full border
                                    ${change > 0 ? 'bg-green-500/20 border-green-400/30 text-green-300' : 'bg-red-500/20 border-red-400/30 text-red-300'}`}>
                      {change > 0 ? '+' : ''}{change}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{currentVal}</span>
                  <span className="text-sm font-bold" style={{ color: barColor }}>{predictedVal}</span>
                </div>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={predictedVal}
                  onChange={(e) => handleSliderChange(dim.key, Number(e.target.value))}
                  className="w-full"
                />
                {/* Current value indicator */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white/50 rounded-full pointer-events-none"
                  style={{ left: `${currentVal}%` }}
                />
              </div>

              {/* Progress bar with gradient */}
              <div className="progress-bar mt-2">
                <div
                  className="progress-fill"
                  style={{
                    width: `${predictedVal}%`,
                    background: `linear-gradient(90deg, ${dim.gradientFrom || barColor}, ${dim.gradientTo || barColor})`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button onClick={resetPrediction} className="btn-secondary flex-1">
          🔄 Reset to Current
        </button>
        <button onClick={applyPrediction} className="btn-primary flex-1">
          ✨ Apply Prediction
        </button>
      </div>
    </div>
  );
}