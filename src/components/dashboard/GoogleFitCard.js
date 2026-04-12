/**
 * GoogleFitCard — Wearable health data card for Dashboard
 * Shows: Steps, Heart Rate, Sleep + lifestyle score contribution
 */
import React, { useState } from "react";
import useGoogleFit, { fitnessToLifestyleScore } from "../../hooks/useGoogleFit";

// ── Mini stat cell ────────────────────────────────────────────────────────────
function StatCell({ icon, label, value, unit, sub, color, trend }) {
  return (
    <div className="gf-stat">
      <div className="gf-stat-icon" style={{ background: color + "18", color }}>
        {icon}
      </div>
      <div className="gf-stat-body">
        <p className="gf-stat-label">{label}</p>
        <p className="gf-stat-value" style={{ color }}>
          {value ?? "—"}
          {value != null && <span className="gf-stat-unit">{unit}</span>}
        </p>
        {sub && <p className="gf-stat-sub">{sub}</p>}
      </div>
      {trend && (
        <span className={"gf-trend " + (trend === "up" ? "gf-trend-up" : "gf-trend-down")}>
          {trend === "up" ? "↑" : "↓"}
        </span>
      )}
    </div>
  );
}

// ── Circular mini progress ────────────────────────────────────────────────────
function MiniRing({ value, color, size = 56 }) {
  const r   = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const fill = ((value ?? 0) / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth="4" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
        strokeLinecap="round" strokeDasharray={`${fill} ${circ}`}
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }} />
    </svg>
  );
}

// ── Steps quality helper ──────────────────────────────────────────────────────
function stepsLabel(avg) {
  if (!avg) return null;
  if (avg >= 10000) return { txt: "Excellent", color: "#22c55e" };
  if (avg >= 7500)  return { txt: "Good",      color: "#38bdf8" };
  if (avg >= 5000)  return { txt: "Fair",      color: "#f59e0b" };
  return               { txt: "Low",       color: "#ef4444" };
}
function hrLabel(avg) {
  if (!avg) return null;
  if (avg < 60)            return { txt: "Athletic", color: "#38bdf8" };
  if (avg <= 80)           return { txt: "Normal",   color: "#22c55e" };
  if (avg <= 100)          return { txt: "Elevated", color: "#f59e0b" };
  return                          { txt: "High",     color: "#ef4444" };
}
function sleepLabel(h) {
  if (!h) return null;
  if (h >= 7 && h <= 9) return { txt: "Optimal", color: "#22c55e" };
  if (h >= 6)           return { txt: "Fair",    color: "#f59e0b" };
  return                       { txt: "Low",     color: "#ef4444" };
}

// ── Main card ─────────────────────────────────────────────────────────────────
export default function GoogleFitCard({ onScoreUpdate }) {
  const { status, data, error, connectReal, connectDemo, disconnect, refresh } = useGoogleFit();
  const [lastRefresh, setLastRefresh] = useState(null);

  const connected  = status === "connected" || status === "demo";
  const connecting = status === "connecting";

  const lifestyleScore = data ? fitnessToLifestyleScore(data) : null;

  // Notify parent when score is available
  React.useEffect(() => {
    if (lifestyleScore != null && onScoreUpdate) {
      onScoreUpdate(lifestyleScore);
    }
  }, [lifestyleScore, onScoreUpdate]);

  const handleRefresh = async () => {
    await refresh();
    setLastRefresh(new Date());
  };

  // ── Not connected state ──
  if (!connected) {
    return (
      <div className="card p-5 gf-card">
        <div className="gf-header">
          <div className="gf-title-row">
            <span className="gf-icon-wrap">❤️</span>
            <div>
              <h3 className="gf-title">Google Fit</h3>
              <p className="gf-subtitle">Wearable Health Data</p>
            </div>
          </div>
        </div>

        <div className="gf-connect-area">
          <div className="gf-connect-visual">
            <div className="gf-pulse-ring" />
            <span className="gf-connect-emoji">⌚</span>
          </div>
          <p className="gf-connect-desc">
            Connect your Google Fit to automatically factor your <strong>steps, heart rate & sleep</strong> into your resilience score.
          </p>

          {error && (
            <div className="gf-error">⚠️ {error}</div>
          )}

          <div className="gf-btn-row">
            <button className="gf-btn-primary" onClick={connectReal} disabled={connecting}>
              {connecting ? (
                <><span className="gf-spinner" /> Connecting...</>
              ) : (
                <><span>🔗</span> Connect Google Fit</>
              )}
            </button>
            <button className="gf-btn-demo" onClick={connectDemo} disabled={connecting}>
              {connecting ? "Loading..." : "Try Demo Data"}
            </button>
          </div>

          <p className="gf-connect-note">
            🔒 Read-only access · Data never stored on servers
          </p>
        </div>

        <style>{GF_STYLES}</style>
      </div>
    );
  }

  // ── Connected state ──
  const sl = stepsLabel(data.steps?.avgPerDay);
  const hl = hrLabel(data.heartRate?.avg);
  const sl2 = sleepLabel(data.sleep?.avgHours);

  return (
    <div className="card p-5 gf-card">
      {/* Header */}
      <div className="gf-header">
        <div className="gf-title-row">
          <span className="gf-icon-wrap">❤️</span>
          <div>
            <h3 className="gf-title">
              Google Fit
              <span className={"gf-badge " + (status === "demo" ? "gf-badge-demo" : "gf-badge-live")}>
                {status === "demo" ? "Demo" : "● Live"}
              </span>
            </h3>
            <p className="gf-subtitle">Last 7 days · {data.fetchedAt ? new Date(data.fetchedAt).toLocaleDateString("en-IN") : ""}</p>
          </div>
        </div>
        <div className="gf-header-actions">
          <button className="gf-icon-btn" onClick={handleRefresh} title="Refresh">🔄</button>
          <button className="gf-icon-btn" onClick={disconnect} title="Disconnect">✕</button>
        </div>
      </div>

      {/* Lifestyle score ring */}
      <div className="gf-score-row">
        <div className="gf-score-ring-wrap">
          <MiniRing value={lifestyleScore} color="#22c55e" size={72} />
          <div className="gf-score-overlay">
            <span className="gf-score-num">{lifestyleScore}</span>
          </div>
        </div>
        <div className="gf-score-text">
          <p className="gf-score-label">Lifestyle Score</p>
          <p className="gf-score-sub">Auto-applied to your resilience score</p>
          <div className="gf-score-bar-wrap">
            <div className="gf-score-bar" style={{ width: lifestyleScore + "%" }} />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="gf-stats-grid">
        <StatCell
          icon="👟" label="Avg Daily Steps" color="#38bdf8"
          value={data.steps?.avgPerDay?.toLocaleString("en-IN")}
          sub={sl ? sl.txt : null}
          unit=""
        />
        <StatCell
          icon="💓" label="Resting Heart Rate" color="#fb7185"
          value={data.heartRate?.avg}
          unit=" bpm"
          sub={hl ? hl.txt : null}
        />
        <StatCell
          icon="😴" label="Avg Sleep" color="#818cf8"
          value={data.sleep?.avgHours}
          unit=" hrs"
          sub={sl2 ? sl2.txt : null}
        />
        <StatCell
          icon="🔥" label="Weekly Steps" color="#f59e0b"
          value={data.steps?.total?.toLocaleString("en-IN")}
          unit=""
          sub={`${data.steps?.days ?? 0} active days`}
        />
      </div>

      {/* HR range bar */}
      {data.heartRate?.min != null && (
        <div className="gf-hr-range">
          <p className="gf-hr-range-label">
            Heart Rate Range
            <span style={{ float: "right", color: "var(--text-muted)", fontSize: "0.7rem" }}>
              {data.heartRate.min}–{data.heartRate.max} bpm
            </span>
          </p>
          <div className="gf-hr-track">
            <div className="gf-hr-zone gf-hr-zone-low"  title="Low (<60)" />
            <div className="gf-hr-zone gf-hr-zone-norm" title="Normal (60-80)" />
            <div className="gf-hr-zone gf-hr-zone-high" title="High (>80)" />
            <div
              className="gf-hr-marker"
              style={{ left: `${Math.min(99, ((data.heartRate.avg - 40) / 120) * 100)}%` }}
              title={`Avg: ${data.heartRate.avg} bpm`}
            />
          </div>
          <div className="gf-hr-range-labels">
            <span>40</span><span>60</span><span>80</span><span>100</span><span>160+</span>
          </div>
        </div>
      )}

      {lastRefresh && (
        <p className="gf-last-refresh">
          Updated {lastRefresh.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </p>
      )}

      <style>{GF_STYLES}</style>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const GF_STYLES = `
  .gf-card { position: relative; overflow: hidden; }

  .gf-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1rem; }
  .gf-title-row { display: flex; align-items: center; gap: 0.65rem; }
  .gf-icon-wrap { font-size: 1.4rem; width: 2.2rem; height: 2.2rem; display: flex; align-items: center; justify-content: center; background: rgba(251,113,133,0.12); border-radius: 10px; }
  .gf-title { font-size: 0.95rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem; }
  .gf-subtitle { font-size: 0.7rem; color: var(--text-muted); margin-top: 1px; }
  .gf-badge { font-size: 0.62rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 999px; letter-spacing: 0.04em; }
  .gf-badge-live { background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid rgba(34,197,94,0.25); }
  .gf-badge-demo { background: rgba(251,191,36,0.15); color: #f59e0b; border: 1px solid rgba(251,191,36,0.25); }
  .gf-header-actions { display: flex; gap: 0.4rem; }
  .gf-icon-btn { background: var(--bg-card-hover, rgba(255,255,255,0.05)); border: 1px solid var(--border); color: var(--text-muted); width: 28px; height: 28px; border-radius: 8px; cursor: pointer; font-size: 0.75rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .gf-icon-btn:hover { color: var(--text-primary); border-color: var(--border-strong); }

  /* Connect state */
  .gf-connect-area { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 0.5rem 0; }
  .gf-connect-visual { position: relative; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; }
  .gf-pulse-ring { position: absolute; inset: -8px; border-radius: 50%; border: 2px solid rgba(99,102,241,0.3); animation: gfPulse 2s ease-in-out infinite; }
  .gf-connect-emoji { font-size: 2rem; }
  @keyframes gfPulse { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.15);opacity:1} }
  .gf-connect-desc { font-size: 0.82rem; color: var(--text-secondary); text-align: center; line-height: 1.6; max-width: 260px; }
  .gf-connect-desc strong { color: var(--text-primary); }
  .gf-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5; font-size: 0.75rem; padding: 0.5rem 0.75rem; border-radius: 8px; width: 100%; text-align: center; }
  .gf-btn-row { display: flex; flex-direction: column; gap: 0.5rem; width: 100%; }
  .gf-btn-primary { display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: linear-gradient(135deg, #4f46e5, #0ea5e9); color: white; border: none; padding: 0.7rem; border-radius: 10px; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .gf-btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .gf-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .gf-btn-demo { background: var(--bg-card-hover, rgba(255,255,255,0.05)); border: 1px solid var(--border); color: var(--text-secondary); padding: 0.6rem; border-radius: 10px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .gf-btn-demo:hover:not(:disabled) { color: var(--text-primary); border-color: var(--border-strong); }
  .gf-connect-note { font-size: 0.68rem; color: var(--text-muted); text-align: center; }
  .gf-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: gfSpin 0.6s linear infinite; display: inline-block; }
  @keyframes gfSpin { to { transform: rotate(360deg); } }

  /* Score row */
  .gf-score-row { display: flex; align-items: center; gap: 1rem; background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.15); border-radius: 12px; padding: 0.85rem; margin-bottom: 0.85rem; }
  .gf-score-ring-wrap { position: relative; flex-shrink: 0; }
  .gf-score-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
  .gf-score-num { font-size: 1.1rem; font-weight: 900; color: #22c55e; }
  .gf-score-label { font-size: 0.8rem; font-weight: 700; color: var(--text-primary); }
  .gf-score-sub { font-size: 0.68rem; color: var(--text-muted); margin: 2px 0 6px; }
  .gf-score-bar-wrap { height: 4px; background: var(--border); border-radius: 999px; overflow: hidden; }
  .gf-score-bar { height: 100%; background: linear-gradient(90deg, #22c55e, #38bdf8); border-radius: 999px; transition: width 0.8s ease; }

  /* Stats grid */
  .gf-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-bottom: 0.85rem; }
  .gf-stat { display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 0.75rem; background: var(--bg-surface, rgba(255,255,255,0.03)); border: 1px solid var(--border); border-radius: 10px; }
  .gf-stat-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
  .gf-stat-label { font-size: 0.62rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
  .gf-stat-value { font-size: 0.95rem; font-weight: 800; line-height: 1.1; }
  .gf-stat-unit { font-size: 0.65rem; font-weight: 500; opacity: 0.7; }
  .gf-stat-sub { font-size: 0.62rem; color: var(--text-muted); }
  .gf-trend { font-size: 0.75rem; margin-left: auto; font-weight: 700; }
  .gf-trend-up { color: #22c55e; }
  .gf-trend-down { color: #ef4444; }

  /* HR range */
  .gf-hr-range { margin-bottom: 0.75rem; }
  .gf-hr-range-label { font-size: 0.72rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.4rem; }
  .gf-hr-track { position: relative; display: flex; height: 8px; border-radius: 999px; overflow: visible; margin-bottom: 0.25rem; }
  .gf-hr-zone { height: 100%; }
  .gf-hr-zone-low  { flex: 20; background: #38bdf8; border-radius: 999px 0 0 999px; opacity: 0.6; }
  .gf-hr-zone-norm { flex: 20; background: #22c55e; opacity: 0.6; }
  .gf-hr-zone-high { flex: 60; background: linear-gradient(90deg, #f59e0b, #ef4444); border-radius: 0 999px 999px 0; opacity: 0.6; }
  .gf-hr-marker { position: absolute; top: -3px; width: 14px; height: 14px; background: white; border: 2px solid #fb7185; border-radius: 50%; transform: translateX(-50%); box-shadow: 0 0 8px rgba(251,113,133,0.6); }
  .gf-hr-range-labels { display: flex; justify-content: space-between; font-size: 0.6rem; color: var(--text-muted); }

  .gf-last-refresh { font-size: 0.65rem; color: var(--text-muted); text-align: right; margin-top: 0.25rem; }
`;