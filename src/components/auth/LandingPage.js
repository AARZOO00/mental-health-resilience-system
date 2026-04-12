/**
 * LandingPage — Hero landing page shown before authentication
 * Cinematic, editorial design with animated elements
 */
import React, { useState, useEffect } from "react";

const STATS = [
  { value: "10+", label: "SDOH Dimensions" },
  { value: "28", label: "Indian States" },
  { value: "AI", label: "Powered Insights" },
  { value: "100%", label: "Free to Use" },
];

const FEATURES = [
  {
    icon: "🧠",
    title: "Resilience Scoring",
    desc: "WHO-framework based score across 10 social determinants of health. Know where you stand.",
  },
  {
    icon: "🗺️",
    title: "India State Data",
    desc: "Compare your score against 28 Indian states. Real regional benchmarks, not generic data.",
  },
  {
    icon: "🤖",
    title: "AI Health Assistant",
    desc: "Ask Claude AI anything about your mental health score. Personalized, contextual guidance.",
  },
  {
    icon: "📊",
    title: "Track Progress",
    desc: "Save assessments over time. Watch your resilience grow with visual history charts.",
  },
  {
    icon: "⚖️",
    title: "Compare Profiles",
    desc: "Benchmark against national averages and different demographic profiles.",
  },
  {
    icon: "📄",
    title: "PDF Reports",
    desc: "Export detailed reports for healthcare providers, researchers, or personal records.",
  },
];

const TESTIMONIALS = [
  {
    name: "Dr. Priya Sharma",
    role: "Public Health Researcher, AIIMS",
    text: "Finally a tool that captures the social determinants properly. The India state data is invaluable for my research.",
    avatar: "👩‍⚕️",
  },
  {
    name: "Rohit Mehta",
    role: "Mental Health Advocate, Mumbai",
    text: "Eye-opening to see how housing stability and community safety affect mental resilience. Changed how I think about wellbeing.",
    avatar: "👨‍💼",
  },
  {
    name: "Sunita Krishnan",
    role: "Social Worker, Bangalore",
    text: "I use this with clients to start conversations about their life circumstances. The AI chat is surprisingly helpful.",
    avatar: "👩‍💻",
  },
];

export default function LandingPage({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % FEATURES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-root">
      {/* ── Animated background ── */}
      <div className="landing-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />
      </div>

      {/* ── Navbar ── */}
      <nav className={`landing-nav ${scrolled ? "landing-nav-scrolled" : ""}`}>
        <div className="landing-nav-inner">
          <div className="brand">
            <span className="brand-icon">🧠</span>
            <span className="brand-name">MH Resilience Pro</span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#about" className="nav-link">About</a>
            <button className="nav-cta" onClick={onGetStarted}>
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-badge">
          <span className="badge-dot" />
          Based on WHO SDOH Framework
        </div>

        <h1 className="hero-title">
          Understand Your
          <br />
          <span className="hero-gradient">Mental Resilience</span>
          <br />
          Like Never Before
        </h1>

        <p className="hero-subtitle">
          India's first Social Determinants of Health assessment tool.
          <br />
          Score yourself across 10 dimensions, compare with 28 states, and get
          <br />
          AI-powered insights for a healthier life.
        </p>

        <div className="hero-actions">
          <button className="hero-btn-primary" onClick={onGetStarted}>
            <span>Start Free Assessment</span>
            <span className="btn-arrow">→</span>
          </button>
          <button className="hero-btn-secondary" onClick={onGetStarted}>
            View Demo
          </button>
        </div>

        <div className="hero-stats">
          {STATS.map((s) => (
            <div key={s.label} className="stat-item">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Dashboard preview card */}
        <div className="hero-preview">
          <div className="preview-card">
            <div className="preview-header">
              <div className="preview-dots">
                <span /><span /><span />
              </div>
              <span className="preview-title">MH Resilience Pro · Dashboard</span>
            </div>
            <div className="preview-body">
              <div className="preview-score-ring">
                <svg viewBox="0 0 120 120" className="ring-svg">
                  <circle cx="60" cy="60" r="50" className="ring-bg" />
                  <circle cx="60" cy="60" r="50" className="ring-fill" strokeDasharray="220 314" />
                </svg>
                <div className="ring-text">
                  <span className="ring-num">67</span>
                  <span className="ring-sub">Good</span>
                </div>
              </div>
              <div className="preview-bars">
                {[
                  { label: "Economic", val: 70, color: "#38bdf8" },
                  { label: "Social", val: 65, color: "#818cf8" },
                  { label: "Housing", val: 75, color: "#fb7185" },
                  { label: "Healthcare", val: 72, color: "#fbbf24" },
                  { label: "Education", val: 78, color: "#34d399" },
                ].map((b) => (
                  <div key={b.label} className="prev-bar-row">
                    <span className="prev-bar-label">{b.label}</span>
                    <div className="prev-bar-track">
                      <div
                        className="prev-bar-fill"
                        style={{ width: `${b.val}%`, background: b.color }}
                      />
                    </div>
                    <span className="prev-bar-val">{b.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="features-section">
        <div className="section-label">WHAT YOU GET</div>
        <h2 className="section-title">Everything you need to<br />understand your wellbeing</h2>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`feature-card ${activeFeature === i ? "feature-card-active" : ""}`}
              onMouseEnter={() => setActiveFeature(i)}
            >
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About / SDOH ── */}
      <section id="about" className="about-section">
        <div className="about-content">
          <div className="section-label">THE SCIENCE</div>
          <h2 className="section-title" style={{ textAlign: "left" }}>
            Social Determinants<br />Shape Mental Health
          </h2>
          <p className="about-text">
            The World Health Organization identifies social, economic, and environmental
            conditions as the primary drivers of mental wellbeing. MH Resilience Pro
            translates this science into an actionable personal assessment.
          </p>
          <div className="sdoh-pills">
            {["Economic Stability", "Social Support", "Housing", "Healthcare Access",
              "Education", "Community Safety", "Lifestyle", "Digital Access",
              "Environmental Quality", "Civic Engagement"].map((d) => (
              <span key={d} className="sdoh-pill">{d}</span>
            ))}
          </div>
          <button className="hero-btn-primary" style={{ marginTop: "2rem" }} onClick={onGetStarted}>
            Take the Assessment →
          </button>
        </div>
        <div className="about-visual">
          <div className="about-rings">
            {["WHO Framework", "28 States", "AI Insights", "10 Dimensions"].map((t, i) => (
              <div key={t} className="about-ring" style={{ animationDelay: `${i * 0.5}s` }}>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="testimonials-section">
        <div className="section-label">VOICES</div>
        <h2 className="section-title">What people are saying</h2>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="testimonial-card">
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <span className="testimonial-avatar">{t.avatar}</span>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-glow" />
        <h2 className="cta-title">Start your resilience<br />journey today</h2>
        <p className="cta-sub">Free forever. No clinical data required. Takes 3 minutes.</p>
        <button className="hero-btn-primary cta-btn" onClick={onGetStarted}>
          Get Started Free →
        </button>
        <p className="cta-disclaimer">For educational purposes only · Not a clinical tool</p>
      </section>

      <style>{`
        .landing-root {
          min-height: 100vh;
          background: #040b14;
          color: #e2e8f0;
          font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* ── Background ── */
        .landing-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
          animation: orbFloat 10s ease-in-out infinite;
        }
        .orb-1 { width: 600px; height: 600px; background: radial-gradient(#4f46e5, #0ea5e9); top: -10%; left: -10%; animation-duration: 12s; }
        .orb-2 { width: 500px; height: 500px; background: radial-gradient(#7c3aed, #db2777); bottom: 20%; right: -10%; animation-duration: 15s; animation-delay: -5s; }
        .orb-3 { width: 400px; height: 400px; background: radial-gradient(#0891b2, #10b981); top: 50%; left: 40%; animation-duration: 18s; animation-delay: -8s; }
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 30px) scale(0.95); }
        }

        /* ── Nav ── */
        .landing-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 1.25rem 2rem;
          transition: all 0.3s ease;
        }
        .landing-nav-scrolled {
          background: rgba(4, 11, 20, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .landing-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand { display: flex; align-items: center; gap: 0.6rem; }
        .brand-icon { font-size: 1.5rem; }
        .brand-name { font-size: 1.1rem; font-weight: 700; color: #f1f5f9; letter-spacing: -0.01em; }
        .nav-links { display: flex; align-items: center; gap: 2rem; }
        .nav-link { color: #94a3b8; text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
        .nav-link:hover { color: #e2e8f0; }
        .nav-cta {
          background: linear-gradient(135deg, #4f46e5, #0ea5e9);
          color: white;
          border: none;
          padding: 0.55rem 1.4rem;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
        }
        .nav-cta:hover { opacity: 0.9; transform: translateY(-1px); }

        /* ── Hero ── */
        .hero-section {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 8rem 1.5rem 4rem;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(79, 70, 229, 0.15);
          border: 1px solid rgba(79, 70, 229, 0.35);
          color: #a5b4fc;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.4rem 1rem;
          border-radius: 999px;
          margin-bottom: 2rem;
          animation: fadeUp 0.6s ease-out both;
        }
        .badge-dot {
          width: 6px; height: 6px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #f8fafc;
          margin-bottom: 1.5rem;
          animation: fadeUp 0.6s 0.1s ease-out both;
        }
        .hero-gradient {
          background: linear-gradient(135deg, #38bdf8 0%, #818cf8 45%, #fb7185 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          font-size: 1.15rem;
          color: #94a3b8;
          line-height: 1.7;
          max-width: 620px;
          margin: 0 auto 2.5rem;
          animation: fadeUp 0.6s 0.2s ease-out both;
        }
        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 3.5rem;
          animation: fadeUp 0.6s 0.3s ease-out both;
        }
        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #4f46e5, #0ea5e9);
          color: white;
          border: none;
          padding: 0.85rem 2rem;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 8px 32px rgba(79,70,229,0.4);
        }
        .hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(79,70,229,0.5); }
        .btn-arrow { transition: transform 0.2s; }
        .hero-btn-primary:hover .btn-arrow { transform: translateX(4px); }
        .hero-btn-secondary {
          background: rgba(255,255,255,0.06);
          color: #cbd5e1;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.85rem 2rem;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
        }
        .hero-btn-secondary:hover { background: rgba(255,255,255,0.1); color: #f1f5f9; }

        /* Stats */
        .hero-stats {
          display: flex;
          gap: 3rem;
          margin-bottom: 4rem;
          animation: fadeUp 0.6s 0.4s ease-out both;
        }
        .stat-item { text-align: center; }
        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #38bdf8, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }
        .stat-label { font-size: 0.7rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; }

        /* Preview card */
        .hero-preview {
          animation: fadeUp 0.8s 0.5s ease-out both;
          width: 100%;
          max-width: 700px;
        }
        .preview-card {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: blur(20px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.6);
        }
        .preview-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
        }
        .preview-dots { display: flex; gap: 6px; }
        .preview-dots span { width: 10px; height: 10px; border-radius: 50%; background: #334155; }
        .preview-dots span:nth-child(1) { background: #ef4444; }
        .preview-dots span:nth-child(2) { background: #f59e0b; }
        .preview-dots span:nth-child(3) { background: #22c55e; }
        .preview-title { font-size: 0.75rem; color: #475569; font-family: monospace; }
        .preview-body {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 1.5rem 2rem;
        }
        .preview-score-ring { position: relative; width: 120px; height: 120px; flex-shrink: 0; }
        .ring-svg { width: 100%; height: 100%; transform: rotate(-90deg); }
        .ring-bg { fill: none; stroke: #1e293b; stroke-width: 8; }
        .ring-fill { fill: none; stroke: #22c55e; stroke-width: 8; stroke-linecap: round; }
        .ring-text {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .ring-num { font-size: 1.75rem; font-weight: 800; color: #f1f5f9; line-height: 1; }
        .ring-sub { font-size: 0.7rem; color: #22c55e; font-weight: 600; }
        .preview-bars { flex: 1; display: flex; flex-direction: column; gap: 0.6rem; }
        .prev-bar-row { display: flex; align-items: center; gap: 0.75rem; }
        .prev-bar-label { font-size: 0.7rem; color: #64748b; width: 70px; text-align: right; flex-shrink: 0; }
        .prev-bar-track { flex: 1; height: 5px; background: #1e293b; border-radius: 999px; overflow: hidden; }
        .prev-bar-fill { height: 100%; border-radius: 999px; }
        .prev-bar-val { font-size: 0.7rem; color: #94a3b8; font-weight: 600; width: 24px; }

        /* ── Sections shared ── */
        .section-label {
          font-size: 0.7rem;
          color: #4f46e5;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 1rem;
          text-align: center;
        }
        .section-title {
          font-size: clamp(1.75rem, 3.5vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #f1f5f9;
          text-align: center;
          margin-bottom: 3rem;
          line-height: 1.15;
        }

        /* ── Features ── */
        .features-section {
          position: relative; z-index: 1;
          padding: 6rem 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        .feature-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 18px;
          padding: 2rem;
          transition: all 0.3s ease;
          cursor: default;
        }
        .feature-card-active, .feature-card:hover {
          background: rgba(79, 70, 229, 0.08);
          border-color: rgba(79, 70, 229, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(79,70,229,0.15);
        }
        .feature-icon { font-size: 2rem; display: block; margin-bottom: 1rem; }
        .feature-title { font-size: 1.05rem; font-weight: 700; color: #f1f5f9; margin-bottom: 0.5rem; }
        .feature-desc { font-size: 0.875rem; color: #64748b; line-height: 1.6; }

        /* ── About ── */
        .about-section {
          position: relative; z-index: 1;
          padding: 6rem 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .about-content .section-label, .about-content .section-title { text-align: left; }
        .about-text { color: #94a3b8; line-height: 1.8; margin-bottom: 2rem; font-size: 1rem; }
        .sdoh-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .sdoh-pill {
          background: rgba(79,70,229,0.12);
          border: 1px solid rgba(79,70,229,0.25);
          color: #a5b4fc;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
        }
        .about-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          height: 320px;
        }
        .about-rings {
          position: relative;
          width: 280px;
          height: 280px;
        }
        .about-ring {
          position: absolute;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: ringRotate 8s linear infinite;
          font-size: 0.7rem;
          font-weight: 700;
          color: #a5b4fc;
          letter-spacing: 0.05em;
        }
        .about-ring:nth-child(1) { width: 280px; height: 280px; border: 1px dashed rgba(79,70,229,0.3); top: 0; left: 0; }
        .about-ring:nth-child(2) { width: 200px; height: 200px; border: 1px dashed rgba(14,165,233,0.3); top: 40px; left: 40px; animation-direction: reverse; animation-duration: 11s; }
        .about-ring:nth-child(3) { width: 130px; height: 130px; border: 1px dashed rgba(251,113,133,0.3); top: 75px; left: 75px; animation-duration: 14s; }
        .about-ring:nth-child(4) { width: 70px; height: 70px; background: rgba(79,70,229,0.2); top: 105px; left: 105px; border: 1px solid rgba(79,70,229,0.4); animation-duration: 6s; animation-direction: reverse; }
        @keyframes ringRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* ── Testimonials ── */
        .testimonials-section {
          position: relative; z-index: 1;
          padding: 6rem 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .testimonial-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px;
          padding: 2rem;
        }
        .testimonial-text { font-size: 0.95rem; color: #94a3b8; line-height: 1.7; margin-bottom: 1.5rem; font-style: italic; }
        .testimonial-author { display: flex; align-items: center; gap: 0.75rem; }
        .testimonial-avatar { font-size: 2rem; }
        .testimonial-name { font-size: 0.875rem; font-weight: 700; color: #e2e8f0; }
        .testimonial-role { font-size: 0.75rem; color: #475569; }

        /* ── CTA ── */
        .cta-section {
          position: relative; z-index: 1;
          text-align: center;
          padding: 8rem 1.5rem;
        }
        .cta-glow {
          position: absolute;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%);
          left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .cta-title {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #f8fafc;
          margin-bottom: 1rem;
          line-height: 1.1;
        }
        .cta-sub { color: #64748b; margin-bottom: 2.5rem; font-size: 1.05rem; }
        .cta-btn { font-size: 1.1rem; padding: 1rem 2.5rem; }
        .cta-disclaimer { margin-top: 1.5rem; font-size: 0.75rem; color: #334155; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .hero-stats { gap: 1.5rem; flex-wrap: wrap; justify-content: center; }
          .hero-actions { flex-direction: column; align-items: center; }
          .about-section { grid-template-columns: 1fr; }
          .about-visual { display: none; }
          .preview-body { flex-direction: column; }
          .nav-links .nav-link { display: none; }
        }
      `}</style>
    </div>
  );
}