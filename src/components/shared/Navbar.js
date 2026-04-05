/**
 * Navbar — top navigation bar with user info and action buttons.
 * Shows current user, save-report, and logout actions.
 */
import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { calcScore, getBand } from "../../utils/scoring";
import { generatePDF } from "../../utils/pdf";

export default function Navbar({ activeTab, setActiveTab }) {
  const { state, actions } = useApp();
  const { user, values, reports } = state;
  const score = calcScore(values);
  const band = getBand(score);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSaveReport = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    actions.saveReport("");
    setSaving(false);
  };

  const handleExportPDF = async () => {
    setExporting(true);
    await new Promise((r) => setTimeout(r, 300));
    try {
      await generatePDF(values, user?.name || "User");
      actions.showToast("PDF downloaded successfully! 📄", "success");
    } catch (e) {
      actions.showToast("PDF export failed. Please try again.", "error");
    }
    setExporting(false);
  };

  const TABS = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "insights",  label: "AI Insights", icon: "🤖" },
    { id: "compare",   label: "Compare", icon: "⚖️" },
    { id: "reports",   label: `Reports (${reports.length})`, icon: "📁" },
    { id: "india",     label: "🇮🇳 India Data", icon: "" },
  ];

  return (
    <nav className="sticky top-0 z-40 glass border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top row */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl shadow-lg animate-float">
              🧠
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-black gradient-text-purple leading-none">MH Resilience Pro</h1>
              <p className="text-xs text-slate-400 leading-none mt-0.5">Premium SDOH Assessment</p>
            </div>
          </div>

          {/* Score pill */}
          <div
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl border backdrop-blur-sm text-sm font-semibold animate-glow"
            style={{
              background: `linear-gradient(135deg, ${band.bg}, rgba(255,255,255,0.05))`,
              borderColor: band.border,
              color: band.color,
              boxShadow: `0 0 20px ${band.color}30`
            }}
          >
            <span className="text-lg">{band.emoji}</span>
            <span>Score: {score}/100</span>
            <span className="text-slate-400 font-normal">· {band.label}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveReport}
              disabled={saving}
              className="btn-glow text-xs px-4 py-2 hidden sm:flex"
              title="Save current assessment as a report"
            >
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "💾"}
              <span className="hidden md:inline ml-2">{saving ? "Saving…" : "Save"}</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="btn-primary text-xs px-4 py-2 hidden sm:flex"
              title="Download PDF report"
            >
              {exporting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "📄"}
              <span className="hidden md:inline ml-2">{exporting ? "Exporting…" : "PDF"}</span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl px-4 py-2 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                  {(user?.name || "G")[0].toUpperCase()}
                </div>
                <span className="hidden md:block text-slate-200 text-sm font-medium max-w-[120px] truncate">{user?.name || "Guest"}</span>
                <span className="text-slate-400 text-sm transition-transform duration-300" style={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ▼
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 glass-premium border border-white/20 rounded-3xl shadow-2xl p-2 animate-scale-in">
                  <div className="px-4 py-3 border-b border-white/10 mb-2">
                    <p className="text-sm font-bold text-slate-200 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <button onClick={handleSaveReport} className="w-full text-left px-4 py-3 rounded-2xl text-sm text-slate-300 hover:bg-white/5 hover:text-slate-100 flex items-center gap-3 sm:hidden transition-all duration-200">
                    💾 Save Report
                  </button>
                  <button onClick={handleExportPDF} className="w-full text-left px-4 py-3 rounded-2xl text-sm text-slate-300 hover:bg-white/5 hover:text-slate-100 flex items-center gap-3 sm:hidden transition-all duration-200">
                    📄 Export PDF
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); actions.logout(); }}
                    className="w-full text-left px-4 py-3 rounded-2xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-all duration-200"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab row */}
        <div className="flex gap-2 pb-4 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setMenuOpen(false); }}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold whitespace-nowrap rounded-2xl border transition-all duration-300 hover:scale-105 ${
                activeTab === tab.id
                  ? "border-cyan-400 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-lg shadow-cyan-500/20"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
