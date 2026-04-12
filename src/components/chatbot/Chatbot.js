/**
 * Chatbot — AI-powered mental health assistant.
 * Uses the Anthropic API (claude-sonnet-4-20250514) to answer questions
 * about the user's resilience score and SDOH factors.
 * Falls back to smart rule-based replies if API is unavailable.
 */
import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import { calcScore, getBand, generateInsights } from "../../utils/scoring";
import { DIMENSIONS } from "../../data/dimensions";

/* ── Rule-based fallback responses ──────────────────────────────── */
function getRuleBasedReply(message, values, score, band) {
  const msg = message.toLowerCase();
  const insights = generateInsights(values);
  const weakest  = insights.weakest[0];
  const strongest = insights.strongest;

  if (msg.includes("score") || msg.includes("kitna") || msg.includes("how much")) {
    return `Your current Mental Health Resilience Score is **${score}/100** — rated as **${band.label}**. ${band.description}`;
  }
  if (msg.includes("improve") || msg.includes("better") || msg.includes("kaise")) {
    return `To improve your score, focus on **${weakest?.label}** (currently ${values[weakest?.key] ?? 0}/100). ${
      insights.recommendations[0]?.intro || "Small consistent steps create compounding positive change."
    }`;
  }
  if (msg.includes("strong") || msg.includes("best") || msg.includes("achha")) {
    return `Your strongest dimension is **${strongest.label}** with a score of **${values[strongest.key] ?? 0}/100**. This is your most powerful protective factor — maintain it!`;
  }
  if (msg.includes("weak") || msg.includes("worst") || msg.includes("bura")) {
    return `Your weakest area is **${weakest?.label}** (${values[weakest?.key] ?? 0}/100). ${insights.recommendations[0]?.intro || "This needs your focused attention."}`;
  }
  if (msg.includes("stress") || msg.includes("tension") || msg.includes("anxious")) {
    return `Stress management is key to mental resilience. Try:\n• **Box breathing**: 4 counts in → 4 hold → 4 out → 4 hold\n• 20-min daily walks reduce cortisol by 16%\n• Consistent sleep schedule — same wake time every day\n\nYour current lifestyle score: ${values.lifestyle ?? 0}/100`;
  }
  if (msg.includes("sleep") || msg.includes("neend") || msg.includes("rest")) {
    return `Sleep is your #1 mental health lever. Set ONE consistent wake time (not bedtime) and stick to it 7 days/week — your circadian rhythm adjusts within 2 weeks. Aim for 7–9 hours. Your lifestyle score: **${values.lifestyle ?? 0}/100**.`;
  }
  if (msg.includes("social") || msg.includes("friend") || msg.includes("alone") || msg.includes("lonely")) {
    return `Social connection is the 2nd most powerful resilience factor (weight: 20%). Your social support score: **${values.social ?? 0}/100**.\n\nEven 10 minutes of positive social contact significantly reduces cortisol. Try scheduling one social commitment per week.`;
  }
  if (msg.includes("money") || msg.includes("income") || msg.includes("paisa") || msg.includes("financial")) {
    return `Economic stability has the highest weight (22%) in your resilience score. Your income index: **${values.economic ?? 0}/100**.\n\nKey steps: build even a ₹5,000 emergency buffer, explore free skill development (Google Career Certs), and check government benefit eligibility.`;
  }
  if (msg.includes("help") || msg.includes("kya kar") || msg.includes("suggest")) {
    const recs = insights.recommendations.slice(0, 2);
    return recs.map((r) => `**${r.dim.label}** (${values[r.dim.key] ?? 0}/100)\n${r.intro}`).join("\n\n");
  }
  if (msg.includes("india") || msg.includes("state") || msg.includes("kerala") || msg.includes("bihar")) {
    return `In the India SDOH data:\n• **Kerala** leads with 82/100 — highest education (0.90) and social support (8.5)\n• **Bihar** needs most support — 52/100, low income (0.38) and healthcare (0.40)\n• National Average: ~69/100\n\nCheck the 🇮🇳 India Data tab for the full interactive breakdown!`;
  }
  if (msg.includes("pdf") || msg.includes("report") || msg.includes("download")) {
    return `You can download a full 2-page PDF report from the **Navbar** (top right) or from the **Reports** tab. It includes your score, dimension breakdown, and personalized action plan!`;
  }

  // Default
  return `I'm your AI Mental Health assistant! Your current score is **${score}/100** (${band.label}).\n\nYou can ask me about:\n• Your score & what it means\n• How to improve specific dimensions\n• Stress, sleep, social support tips\n• India state comparison data\n• PDF report & saving assessments`;
}

/* ── Format message with basic markdown ─────────────────────────── */
function FormatMessage({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i} className="font-bold text-white">{p.slice(2, -2)}</strong>
          : p.split("\n").map((line, j) => (
              <span key={j}>{line}{j < p.split("\n").length - 1 && <br />}</span>
            ))
      )}
    </span>
  );
}

/* ── Single Message Bubble ───────────────────────────────────────── */
function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-slide-up`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-base flex-shrink-0 mt-0.5">
          🧠
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-indigo-600 text-white rounded-tr-sm"
            : "bg-slate-800 border border-slate-700/50 text-slate-300 rounded-tl-sm"
        }`}
      >
        {isUser ? msg.content : <FormatMessage text={msg.content} />}
        {msg.typing && (
          <span className="inline-flex gap-1 ml-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </span>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center text-base flex-shrink-0 mt-0.5">
          👤
        </div>
      )}
    </div>
  );
}

/* ── Quick Prompt Buttons ────────────────────────────────────────── */
const QUICK_PROMPTS = [
  "What's my score?",
  "How can I improve?",
  "My weakest area?",
  "Tips for stress?",
  "India data insights",
];

/* ── Main Chatbot ────────────────────────────────────────────────── */
export default function Chatbot() {
  const { state } = useApp();
  const { t }     = useTheme();
  const { values } = state;

  const score   = calcScore(values);
  const band    = getBand(score);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: `Hello! 👋 I'm your AI Mental Health Assistant.\n\nYour current score is **${score}/100** — **${band.label}**.\n\nAsk me anything about your resilience score, how to improve, or mental health tips!`,
    },
  ]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;

    const userMsg = { id: Date.now(), role: "user", content: userText };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    // Add typing indicator
    const typingId = Date.now() + 1;
    setMessages((m) => [...m, { id: typingId, role: "assistant", content: "", typing: true }]);

    try {
      // Build context about current assessment
      const contextStr = DIMENSIONS.map(
        (d) => `${d.label}: ${values[d.key] ?? 0}/100 (weight: ${Math.round(d.weight * 100)}%)`
      ).join(", ");

      const systemPrompt = `You are a compassionate AI mental health assistant for a Mental Health Resilience Scoring System.
The user's current assessment:
- Overall Score: ${score}/100 (${band.label})
- ${contextStr}

Guidelines:
- Be warm, supportive, and evidence-based
- Keep responses concise (2–4 sentences or bullet points)
- Always relate answers to the user's actual scores when relevant
- Use **bold** for emphasis
- Mention specific dimension scores when relevant
- Never diagnose — always recommend professional help for serious concerns
- If asked in Hindi, respond in Hindi`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          system: systemPrompt,
          messages: [
            ...messages
              .filter((m) => !m.typing)
              .slice(-6) // last 6 messages for context
              .map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: userText },
          ],
        }),
      });

      let reply;
      if (response.ok) {
        const data = await response.json();
        reply = data.content?.[0]?.text || getRuleBasedReply(userText, values, score, band);
      } else {
        reply = getRuleBasedReply(userText, values, score, band);
      }

      setMessages((m) => m.map((msg) =>
        msg.id === typingId ? { ...msg, content: reply, typing: false } : msg
      ));
    } catch {
      const reply = getRuleBasedReply(userText, values, score, band);
      setMessages((m) => m.map((msg) =>
        msg.id === typingId ? { ...msg, content: reply, typing: false } : msg
      ));
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] min-h-[500px] animate-fade-in">

      {/* Header */}
      <div className="card p-4 mb-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xl">
            🧠
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-200">{t.chatTitle}</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <p className="text-[10px] text-slate-500">Online · Powered by Claude AI</p>
            </div>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-full text-xs font-bold border flex-shrink-0"
          style={{ color: band.color, borderColor: `${band.color}40`, background: `${band.color}15` }}>
          {band.emoji} {score}/100
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        {messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="flex flex-wrap gap-2 mb-3 flex-shrink-0">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => sendMessage(p)}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-400
              hover:border-indigo-500/60 hover:text-indigo-400 transition-all duration-200 bg-slate-800/40"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex gap-2 flex-shrink-0">
        <input
          className="input flex-1 text-sm"
          placeholder={t.chatPlaceholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="btn-primary px-4 py-2.5 flex-shrink-0"
        >
          {loading
            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : "→"}
        </button>
      </div>

      <p className="text-[10px] text-slate-700 text-center mt-2">
        {t.disclaimer}
      </p>
    </div>
  );
}
