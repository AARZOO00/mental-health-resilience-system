/**
 * AuthPage — Login & Sign-up UI
 * Mock authentication (no real backend) — demonstrates production-quality auth UX.
 * In production: replace handleSubmit with API calls to your auth service.
 */

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";

const DEMO_USERS = [
  { name: "Demo User", email: "demo@example.com", password: "demo123" },
  { name: "Dr. Priya Sharma", email: "priya@example.com", password: "health2024" },
];

export default function AuthPage() {
  const { actions } = useApp();
  const [mode, setMode]         = useState("login"); // 'login' | 'signup'
  const [form, setForm]         = useState({ name: "", email: "", password: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate network latency
    await new Promise((r) => setTimeout(r, 900));

    if (mode === "login") {
      const match = DEMO_USERS.find(
        (u) => u.email === form.email && u.password === form.password
      );
      if (match) {
        actions.login({ name: match.name, email: match.email });
        actions.showToast(`Welcome back, ${match.name}! 👋`, "success");
      } else {
        setError("Invalid credentials. Try demo@example.com / demo123");
      }
    } else {
      // Sign-up: basic validation
      if (!form.name.trim()) { setError("Name is required."); setLoading(false); return; }
      if (!/\S+@\S+\.\S+/.test(form.email)) { setError("Enter a valid email."); setLoading(false); return; }
      if (form.password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }
      actions.login({ name: form.name.trim(), email: form.email });
      actions.showToast(`Account created! Welcome, ${form.name.trim()} 🎉`, "success");
    }
    setLoading(false);
  };

  const handleGuestLogin = () => {
    actions.login({ name: "Guest User", email: "guest@example.com" });
    actions.showToast("Signed in as Guest. Reports won't persist.", "info");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-scale-in">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-4xl mb-4 animate-pulse-ring">
            🧠
          </div>
          <h1 className="text-2xl font-extrabold gradient-text">MH Resilience Pro</h1>
          <p className="text-slate-500 text-sm mt-1">Social Determinants of Health Assessment</p>
        </div>

        {/* Card */}
        <div className="card-elevated p-8">
          {/* Tab switcher */}
          <div className="flex bg-slate-900 rounded-xl p-1 mb-6">
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); setForm({ name: "", email: "", password: "" }); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (signup only) */}
            {mode === "signup" && (
              <div className="animate-slide-up">
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  className="input"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Dr. Jane Smith"
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                className="input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  className="input pr-12"
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={mode === "login" ? "Your password" : "Min. 6 characters"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2 bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3 animate-slide-up">
                <span className="text-red-400 text-sm">⚠️ {error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                mode === "login" ? "Sign In →" : "Create Account →"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-slate-600">or</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* Guest access */}
          <button onClick={handleGuestLogin} className="btn-secondary w-full justify-center">
            Continue as Guest
          </button>

          {/* Demo credentials hint */}
          {mode === "login" && (
            <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs text-slate-500 font-medium mb-1">🎯 Demo credentials:</p>
              <p className="text-xs text-slate-400 font-mono">demo@example.com / demo123</p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-700 mt-6">
          For educational purposes only · Not a clinical tool
        </p>
      </div>
    </div>
  );
}