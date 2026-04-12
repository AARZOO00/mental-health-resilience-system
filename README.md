
# 🧠 Mental Health Resilience Scoring System

A modern, interactive web application that evaluates mental health resilience using Social Determinants of Health (SDOH).
It provides real-time scoring, AI-based insights, and predictive analysis through a visually rich dashboard.

---

## 🚀 Live Demo

🔗 mental-health-resilience-system.vercel.app

---



## ✨ Features

* 📊 **Real-time Resilience Score (0–100)**
* 🧠 **AI-Based Insights & Recommendations**
* 🔮 **Prediction Simulator (Future Score)**
* 📈 **Interactive Charts (Recharts)**
* 🆚 **Compare Multiple Profiles**
* 📄 **Detailed Report Generation (PDF)**
* 🌍 **India-Specific Insights**
* 🌗 **Dark / Light Mode Toggle**
* 🎨 **Premium UI (Glassmorphism + Gradients + Animations)**

---

## 🛠 Tech Stack

* ⚛️ React.js
* 🎨 Tailwind CSS
* 📊 Recharts
* 🎬 Framer Motion
* 📄 jsPDF (for reports)

---

## 📂 Project Structure

```bash
mh-v2/
├── package.json               
├── tailwind.config.js         
├── postcss.config.js
├── public/index.html
└── src/
    ├── App.js                
    ├── index.js / index.css   
    ├── context/
    │   └── AppContext.js      
    ├── data/
    │   ├── dimensions.js     
    │   └── recommendations.js 
    ├── utils/
    │   ├── scoring.js         
    │   ├── storage.js         
    │   └── pdf.js             
    ├── components/
    │   ├── auth/AuthPage.js   
    │   ├── shared/
    │   │   ├── Navbar.js      
    │   │   ├── Toast.js       
    │   │   ├── Tooltip.js     
    │   │   └── LoadingScreen.js
    │   ├── dashboard/
    │   │   ├── DashboardView.js   
    │   │   ├── ScoreHero.js      
    │   │   ├── MetricCards.js    
    │   │   ├── Charts.js          
    │   │   ├── DimensionInputs.js
    │   │   └── AIInsights.js     
    │   └── compare/
    │       ├── CompareView.js    
    │       └── ReportsPanel.js   

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/AARZOO00/mental-health-resilience-system.git

# Go to project folder
cd mental-health-resilience-system

# Install dependencies
npm install

# Start development server
npm start
=======
# 🧠 Mental Health Resilience Pro — v3.0

> A full-featured Mental Health Resilience Scoring System based on the WHO Social Determinants of Health (SDOH) framework.

---

## 🚀 Quick Start

### Frontend (React)
```bash
cd mh-v2
npm install
npm start
# Opens at http://localhost:3000
```

**Demo Login:** `demo@example.com` / `demo123`

### Backend (Python FastAPI) — Optional
```bash
cd mh-v2/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# API docs at http://localhost:8000/docs

```


## 🎯 How It Works

* User inputs data (income, education, lifestyle, etc.)
* System calculates a **Resilience Score**
* Displays:

  * 📊 Visual breakdown
  * 🧠 AI insights
  * 🔮 Future prediction
* Helps users understand and improve mental well-being

---

## 💼 Use Case

This project demonstrates:

* Data visualization
* Real-world problem solving
* User-centric design
* Frontend development skills


## 👨‍💻 Author

**Aarzoo**
📧 [admin@demo.com](mailto:admin@demo.com)
🔗 https://github.com/AARZOO00

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!
=======
## 📁 Project Structure

```
mh-v2/
├── public/
│   ├── index.html
│   └── manifest.json          ← PWA support
├── backend/
│   ├── main.py                ← FastAPI backend (Python)
│   └── requirements.txt
└── src/
    ├── App.js                 ← Root with ThemeProvider + AppProvider
    ├── index.js / index.css
    ├── context/
    │   ├── AppContext.js      ← Auth, values, reports state
    │   └── ThemeContext.js    ← Dark/light + Hindi/English
    ├── data/
    │   ├── dimensions.js      ← 7 SDOH dimensions + tooltips
    │   ├── recommendations.js ← AI engine (21 action plans)
    │   └── indiaStates.js     ← 20 Indian states dataset
    ├── utils/
    │   ├── scoring.js         ← Weighted formula + insights
    │   ├── storage.js         ← localStorage abstraction
    │   └── pdf.js             ← jsPDF report generator
    └── components/
        ├── auth/AuthPage.js
        ├── dashboard/         ← ScoreHero, Charts, DimensionInputs, AIInsights
        ├── compare/           ← CompareView, ReportsPanel
        ├── india/             ← IndiaDashboard (20 states analytics)
        ├── history/           ← ScoreHistory (line chart + snapshots)
        ├── chatbot/           ← AI Chatbot (Claude API + fallback)
        └── shared/            ← Navbar, Toast, Tooltip, LoadingScreen
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎯 Resilience Score | Weighted formula across 7 SDOH dimensions (0–100) |
| 🤖 AI Recommendations | 21 personalized action plans (3 tiers × 7 dimensions) |
| 🔐 Authentication | Login/Signup UI with demo credentials |
| 💾 Save Reports | localStorage persistence with history tracking |
| 📄 PDF Export | 2-page professional report via jsPDF |
| ⚖️ Compare | Side-by-side profile comparison with dual radar |
| 🇮🇳 India Dashboard | 20 states · bar chart · scatter · radar · table |
| 📈 Score History | Line chart tracking resilience over time |
| 💬 AI Chatbot | Claude API powered mental health assistant |
| 🌙 Dark/Light Mode | Toggle with localStorage persistence |
| 🌐 Hindi/English | Full UI language toggle |
| 📱 PWA Ready | manifest.json for mobile install |

---

## 🐍 Python FastAPI Endpoints

```
GET  /api/health                → Health check
POST /api/score                 → Calculate resilience score
POST /api/compare               → Compare two profiles
GET  /api/india-states          → All 20 states (filterable, sortable)
GET  /api/india-states/{abbr}   → Single state detail + rank
GET  /api/analytics/summary     → National correlations + band distribution
```

Interactive API docs: `http://localhost:8000/docs`

---

## 📐 Scoring Formula

```
Score = Σ (dimension_value × weight)

Economic Stability   × 0.22  (WHO: lowest quartile = 3× mental illness risk)
Social Support       × 0.20  (Holt-Lunstad: loneliness = 15 cigarettes/day)
Housing Stability    × 0.16  (Desmond: eviction = 40% depression increase)
Healthcare Access    × 0.16  (NAMI: 43% with mental illness get no treatment)
Education            × 0.10  (Lund: each year education = 7% better MH)
Community Safety     × 0.08  (Fowler: high-violence area = 2× PTSD risk)
Lifestyle Factors    × 0.08  (Blumenthal: exercise = antidepressant equivalent)
```

---

## 🎤 Interview Points

- **Why Context not Redux?** — State shape is clear, no middleware needed, zero extra dependency
- **Why jsPDF not html2canvas?** — Programmatic = reliable, fast, same output in all browsers
- **AI Engine logic?** — 7 dims × 3 tiers = 21 unique recommendation sets, all WHO-cited
- **India insight?** — Kerala scores 82/100 despite 7% unemployment because social support (8.5/10) is the strongest protective factor
- **Python backend adds?** — Pandas correlation analysis, Scikit-learn ML predictions, production-grade REST API

---

*Built with React.js · Tailwind CSS · Recharts · jsPDF · FastAPI · Claude AI*
*Based on WHO SDOH Framework · For educational purposes only*
