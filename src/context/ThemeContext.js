/**
 * ThemeContext — manages dark/light mode and Hindi/English language.
 * Persisted to localStorage so preference survives page refresh.
 */
import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

/* ── All UI strings in both languages ──────────────────────────── */
export const STRINGS = {
  en: {
    appName:         "MH Resilience Pro",
    dashboard:       "Dashboard",
    aiInsights:      "AI Insights",
    compare:         "Compare",
    reports:         "Reports",
    indiaData:       "India Data",
    chatbot:         "AI Chat",
    history:         "My History",
    save:            "Save",
    exportPdf:       "PDF",
    signOut:         "Sign Out",
    score:           "Score",
    resilienceScore: "Resilience Score",
    protectiveFactor:"Protective Factors",
    riskFlags:       "Risk Flags",
    topStrength:     "Top Strength",
    adjustFactors:   "Adjust Factors",
    loadProfile:     "Load Demo Profile",
    national:        "National",
    selectState:     "Click any row to see radar profile",
    darkMode:        "Dark Mode",
    lightMode:       "Light Mode",
    hindi:           "हिंदी",
    english:         "English",
    disclaimer:      "For educational purposes only · Not a clinical tool",
    saveReport:      "Save Report",
    noReports:       "No saved reports yet",
    chatPlaceholder: "Ask me about your mental health score...",
    sendBtn:         "Send",
    chatTitle:       "AI Health Assistant",
    historyTitle:    "Score History",
    noHistory:       "No history yet. Save assessments to track progress.",
  },
  hi: {
    appName:         "MH रेज़िलियेंस प्रो",
    dashboard:       "डैशबोर्ड",
    aiInsights:      "AI सुझाव",
    compare:         "तुलना",
    reports:         "रिपोर्ट",
    indiaData:       "भारत डेटा",
    chatbot:         "AI चैट",
    history:         "मेरा इतिहास",
    save:            "सेव करें",
    exportPdf:       "PDF",
    signOut:         "साइन आउट",
    score:           "स्कोर",
    resilienceScore: "रेज़िलियेंस स्कोर",
    protectiveFactor:"सुरक्षात्मक कारक",
    riskFlags:       "जोखिम संकेत",
    topStrength:     "सबसे मज़बूत",
    adjustFactors:   "कारक बदलें",
    loadProfile:     "डेमो प्रोफाइल लोड करें",
    national:        "राष्ट्रीय",
    selectState:     "राडार प्रोफाइल देखने के लिए कोई पंक्ति क्लिक करें",
    darkMode:        "डार्क मोड",
    lightMode:       "लाइट मोड",
    hindi:           "हिंदी",
    english:         "English",
    disclaimer:      "केवल शैक्षिक उद्देश्यों के लिए · नैदानिक उपकरण नहीं",
    saveReport:      "रिपोर्ट सेव करें",
    noReports:       "अभी तक कोई रिपोर्ट सेव नहीं",
    chatPlaceholder: "अपने मानसिक स्वास्थ्य स्कोर के बारे में पूछें...",
    sendBtn:         "भेजें",
    chatTitle:       "AI स्वास्थ्य सहायक",
    historyTitle:    "स्कोर इतिहास",
    noHistory:       "अभी कोई इतिहास नहीं। प्रगति ट्रैक करने के लिए असेसमेंट सेव करें।",
  },
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark]   = useState(() => localStorage.getItem("mhrs_theme") !== "light");
  const [lang, setLang]       = useState(() => localStorage.getItem("mhrs_lang") || "en");

  /* Apply dark/light class to <html> */
  useEffect(() => {
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.classList.toggle("light", !isDark);
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  localStorage.setItem("mhrs_theme", isDark ? "dark" : "light");
}, [isDark]);

  useEffect(() => {
    localStorage.setItem("mhrs_lang", lang);
  }, [lang]);

  const t = STRINGS[lang]; // current language strings

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, lang, setLang, t }}>
      <div className={isDark ? "dark-app" : "light-app"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}
