/**
 * App.js — Root component.
 * Handles: auth gating, tab routing, global providers.
 *
 * Architecture:
 *   AppProvider (context) → App → AuthPage | MainApp
 *   MainApp → Navbar + tab content
 */

import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import LoadingScreen from "./components/shared/LoadingScreen";
import Toast from "./components/shared/Toast";
import AuthPage from "./components/auth/AuthPage";
import Navbar from "./components/shared/Navbar";
import DashboardView from "./components/dashboard/DashboardView";
import AIInsights from "./components/dashboard/AIInsights";
import CompareView from "./components/compare/CompareView";
import ReportsPanel from "./components/compare/ReportsPanel";
import IndiaDashboard from "./components/india/IndiaDashboard";
import { useTheme } from "./context/ThemeContext";

const ThemeToggle = () => {
  const { dark, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="btn-primary">
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};

/* ─── Main authenticated app ──────────────────────────────────────── */
function MainApp() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const TAB_CONTENT = {
    dashboard: <DashboardView />,
    insights:  <AIInsights />,
    compare:   <CompareView />,
    reports:   <ReportsPanel />,
    india:     <IndiaDashboard />,
  };

  return (
    <div className="min-h-screen">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div key={activeTab} className="page-enter">
          {TAB_CONTENT[activeTab] || <DashboardView />}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-slate-800 space-y-1 border-t border-slate-900 mt-8">
        <p>
          MH Resilience Pro v2.0 · Built with React + Tailwind CSS + Recharts
        </p>
        <p>
          Based on WHO SDOH Framework · For educational use only ·
          Not a clinical diagnostic tool
        </p>
      </footer>
    </div>
  );
}

/* ─── Auth gate ───────────────────────────────────────────────────── */
function AppGate() {
  const { state } = useApp();

  if (state.isLoading) return <LoadingScreen />;
  if (!state.isAuthenticated) return <AuthPage />;
  return <MainApp />;
}

/* ─── Root with providers ─────────────────────────────────────────── */
export default function App() {
  return (
    <AppProvider>
      <AppGate />
      <Toast />
    </AppProvider>
  );
}
