/**
 * Navbar v3 — adds theme toggle, language toggle, and new tabs.
 */
import React, { useState } from "react";
import { useApp }   from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import { calcScore, getBand } from "../../utils/scoring";
import { generatePDF }        from "../../utils/pdf";

export default function Navbar({ activeTab, setActiveTab }) {
  const { state, actions }        = useApp();
  const { isDark, setIsDark, lang, setLang, t } = useTheme();
  const { user, values, reports } = state;
  const score = calcScore(values);
  const band  = getBand(score);
  const [saving,   setSaving]   = useState(false);
  const [exporting,setExporting]= useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    actions.saveReport("");
    setSaving(false);
  };
  const handlePDF = async () => {
    setExporting(true);
    await new Promise(r => setTimeout(r, 300));
    try { await generatePDF(values, user?.name || "User"); actions.showToast("PDF downloaded! 📄","success"); }
    catch { actions.showToast("PDF export failed.","error"); }
    setExporting(false);
  };

  const TABS = [
    { id:"dashboard", label: t.dashboard,    icon:"📊" },
    { id:"insights",  label: t.aiInsights,   icon:"🤖" },
    { id:"compare",   label: t.compare,      icon:"⚖️"  },
    { id:"reports",   label:`${t.reports} (${reports.length})`, icon:"📁" },
    { id:"india",     label: t.indiaData,    icon:"🇮🇳" },
    { id:"history",   label: t.history,      icon:"📈" },
    { id:"chatbot",   label: t.chatbot,      icon:"💬" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top row */}
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xl">🧠</div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold gradient-text-indigo leading-none">{t.appName}</h1>
              <p className="text-xs text-slate-600 leading-none mt-0.5">SDOH Assessment</p>
            </div>
          </div>

          {/* Score pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold"
            style={{background:band.bg, borderColor:band.border, color:band.color}}>
            {band.emoji} {score}/100 · {band.label}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {/* Theme toggle */}
            <button onClick={() => setIsDark(d => !d)}
              className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm hover:bg-slate-700 transition-colors"
              title={isDark ? t.lightMode : t.darkMode}>
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* Language toggle */}
            <button onClick={() => setLang(l => l === "en" ? "hi" : "en")}
              className="px-2 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-colors flex-shrink-0"
              title="Toggle Language">
              {lang === "en" ? t.hindi : t.english}
            </button>

            <button onClick={handleSave} disabled={saving}
              className="btn-secondary text-xs px-3 py-2 hidden sm:flex">
              {saving ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"/> : "💾"}
              <span className="hidden md:inline ml-1">{saving ? "..." : t.save}</span>
            </button>

            <button onClick={handlePDF} disabled={exporting}
              className="btn-primary text-xs px-3 py-2 hidden sm:flex">
              {exporting ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"/> : "📄"}
              <span className="hidden md:inline ml-1">{t.exportPdf}</span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-2.5 py-2 transition-colors">
                <div className="w-6 h-6 rounded-full bg-indigo-600/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                  {(user?.name||"G")[0].toUpperCase()}
                </div>
                <span className="hidden md:block text-slate-300 text-xs max-w-[80px] truncate">{user?.name||"Guest"}</span>
                <span className="text-slate-500 text-xs">{menuOpen?"▲":"▼"}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-1 animate-scale-in">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="text-xs font-semibold text-slate-300 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-600 truncate">{user?.email}</p>
                  </div>
                  <button onClick={handleSave} className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 flex items-center gap-2 sm:hidden">
                    💾 {t.save}
                  </button>
                  <button onClick={handlePDF} className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 flex items-center gap-2 sm:hidden">
                    📄 {t.exportPdf}
                  </button>
                  <button onClick={() => setIsDark(d=>!d)} className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 flex items-center gap-2">
                    {isDark?"☀️":"🌙"} {isDark ? t.lightMode : t.darkMode}
                  </button>
                  <button onClick={() => { setMenuOpen(false); actions.logout(); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-900/20 flex items-center gap-2">
                    🚪 {t.signOut}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab row */}
        <div className="flex gap-0 pb-0 overflow-x-auto scrollbar-hide -mx-1">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMenuOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all duration-200 flex-shrink-0 ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600"
              }`}>
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
