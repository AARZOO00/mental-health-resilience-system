import React, { useState } from "react";
import { AppProvider, useApp }       from "./context/AppContext";
import { ThemeProvider }             from "./context/ThemeContext";
import LoadingScreen                 from "./components/shared/LoadingScreen";
import Toast                         from "./components/shared/Toast";
import LandingPage                   from "./components/auth/LandingPage";
import AuthPage                      from "./components/auth/AuthPage";
import Navbar                        from "./components/shared/Navbar";
import DashboardView                 from "./components/dashboard/DashboardView";
import AIInsights                    from "./components/dashboard/AIInsights";
import CompareView                   from "./components/compare/CompareView";
import ReportsPanel                  from "./components/compare/ReportsPanel";
import IndiaDashboard                from "./components/india/IndiaDashboard";
import ScoreHistory                  from "./components/history/ScoreHistory";
import Chatbot                       from "./components/chatbot/Chatbot";

function MainApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const TAB_CONTENT = {
    dashboard: <DashboardView />,
    insights:  <AIInsights />,
    compare:   <CompareView />,
    reports:   <ReportsPanel />,
    india:     <IndiaDashboard />,
    history:   <ScoreHistory />,
    chatbot:   <Chatbot />,
  };
  return (
    <div className="min-h-screen">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div key={activeTab} className="page-enter">
          {TAB_CONTENT[activeTab] || <DashboardView />}
        </div>
      </main>
      <footer className="text-center py-8 text-xs text-slate-800 space-y-1 border-t border-slate-900 mt-8">
        <p>MH Resilience Pro v3.0 · React + Tailwind + Recharts + FastAPI + Claude AI</p>
        <p>Based on WHO SDOH Framework · For educational use only · Not a clinical tool</p>
      </footer>
    </div>
  );
}

function AppGate() {
  const { state } = useApp();
  const [showAuth, setShowAuth] = useState(false);

  if (state.isLoading)        return <LoadingScreen />;
  if (state.isAuthenticated)  return <MainApp />;

  if (!showAuth) {
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }
  return <AuthPage />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppGate />
        <Toast />
      </AppProvider>
    </ThemeProvider>
  );
}