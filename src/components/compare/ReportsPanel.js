/**
 * ReportsPanel — view, load, and delete saved assessment reports.
 * Reports are stored in localStorage and persist across sessions.
 */
import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { calcScore, getBand } from "../../utils/scoring";
import { DIMENSIONS } from "../../data/dimensions";
import { generatePDF } from "../../utils/pdf";

function ReportCard({ report, onLoad, onDelete, onExport }) {
  const score = calcScore(report.values);
  const band  = getBand(score);
  const date  = new Date(report.savedAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="card p-4 hover:border-slate-600/50 transition-all duration-200 animate-slide-up">
      <div className="flex items-start gap-4">
        {/* Score circle */}
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl border flex flex-col items-center justify-center"
          style={{ background: band.bg, borderColor: band.border }}>
          <span className="text-lg font-extrabold leading-none" style={{ color: band.color }}>{score}</span>
          <span className="text-[9px] leading-none mt-0.5" style={{ color: band.color }}>{band.label}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-bold text-slate-300">{report.userName || "User"}</span>
            <span className="text-xs text-slate-600">·</span>
            <span className="text-xs text-slate-600">{date}</span>
          </div>

          {/* Mini dimension bars */}
          <div className="grid grid-cols-7 gap-0.5 mt-2">
            {DIMENSIONS.map((dim) => {
              const v = report.values[dim.key] ?? 0;
              return (
                <div key={dim.key} title={`${dim.label}: ${v}`} className="flex flex-col items-center gap-0.5">
                  <div className="w-full bg-slate-700/60 rounded-sm overflow-hidden" style={{ height: 20 }}>
                    <div className="w-full rounded-sm" style={{ height: `${v}%`, background: dim.color, marginTop: `${100 - v}%` }} />
                  </div>
                  <span className="text-[8px] text-slate-700">{dim.label[0]}</span>
                </div>
              );
            })}
          </div>

          {report.note && (
            <p className="text-[10px] text-slate-600 mt-2 italic line-clamp-1">"{report.note}"</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          <button onClick={() => onLoad(report)}
            className="text-xs px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg border border-indigo-500/30 transition-colors font-medium">
            Load
          </button>
          <button onClick={() => onExport(report)}
            className="text-xs px-3 py-1.5 bg-slate-700/40 hover:bg-slate-700/60 text-slate-400 rounded-lg border border-slate-700 transition-colors font-medium">
            PDF
          </button>
          <button onClick={() => onDelete(report.id)}
            className="text-xs px-3 py-1.5 bg-red-900/10 hover:bg-red-900/20 text-red-500 rounded-lg border border-red-500/20 transition-colors font-medium">
            Del
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReportsPanel() {
  const { state, actions } = useApp();
  const { reports, user, values } = state;
  const [saving, setSaving]   = useState(false);
  const [note, setNote]       = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    actions.saveReport(note);
    setNote("");
    setShowNoteInput(false);
    setSaving(false);
  };

  const handleLoad = (report) => {
    actions.setValues(report.values);
    actions.showToast(`Report loaded! Adjusting to saved assessment.`, "info");
  };

  const handleExport = async (report) => {
    try {
      await generatePDF(report.values, report.userName || "User");
      actions.showToast("PDF downloaded! 📄", "success");
    } catch {
      actions.showToast("PDF export failed.", "error");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this report?")) actions.deleteReport(id);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Save current assessment */}
      <div className="card p-5">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">💾 Save Current Assessment</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            {showNoteInput ? (
              <input
                className="input text-sm"
                placeholder="Optional note (e.g. 'After 3 months of therapy')"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                autoFocus
              />
            ) : (
              <p className="text-sm text-slate-500">
                Score: <strong className="text-slate-300">{calcScore(values)}/100</strong> · {DIMENSIONS.length} dimensions captured
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowNoteInput((s) => !s)} className="btn-ghost text-xs">
              {showNoteInput ? "Cancel" : "✏️ Add note"}
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-xs">
              {saving ? (
                <><span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
              ) : "💾 Save Snapshot"}
            </button>
          </div>
        </div>
      </div>

      {/* Reports list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            📁 Saved Reports ({reports.length})
          </h2>
          {reports.length > 0 && (
            <button
              onClick={() => { if (window.confirm("Delete ALL reports?")) { reports.forEach((r) => actions.deleteReport(r.id)); } }}
              className="text-xs text-red-500 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {reports.length === 0 ? (
          <div className="card p-10 text-center">
            <span className="text-4xl mb-3 block">📂</span>
            <h3 className="text-sm font-semibold text-slate-400 mb-1">No saved reports yet</h3>
            <p className="text-xs text-slate-600">
              Save your current assessment above to track progress over time.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((r) => (
              <ReportCard key={r.id} report={r}
                onLoad={handleLoad} onDelete={handleDelete} onExport={handleExport} />
            ))}
          </div>
        )}
      </div>

      {/* Storage note */}
      <p className="text-xs text-slate-700 text-center">
        Reports are stored locally in your browser. Clearing browser data will remove them.
        Max 20 reports stored.
      </p>
    </div>
  );
}
