/**
 * useGoogleFit — Google Fit REST API integration
 *
 * Flow:
 * 1. User clicks "Connect Google Fit"
 * 2. OAuth2 popup opens (Google Sign-in)
 * 3. Access token retrieved
 * 4. Fitness data fetched: steps, heart rate, sleep
 * 5. Data mapped to lifestyle score contribution
 *
 * Setup required (one-time):
 *   - Go to https://console.cloud.google.com
 *   - Create project → Enable "Fitness API"
 *   - Create OAuth2 credentials (Web app)
 *   - Add your domain to Authorized origins
 *   - Replace GOOGLE_CLIENT_ID below
 */

import { useState, useCallback, useRef } from "react";

// ── Replace with your Google Cloud OAuth2 Client ID ──
const GOOGLE_CLIENT_ID = "625608914764-2go9kob90h3gcgkp78v91bqpk0et9m6i.apps.googleusercontent.com";

const SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.heart_rate.read",
  "https://www.googleapis.com/auth/fitness.sleep.read",
].join(" ");

// Data type IDs for Google Fit REST API
const DATA_TYPES = {
  steps:     "com.google.step_count.delta",
  heartRate: "com.google.heart_rate.bpm",
  sleep:     "com.google.sleep.segment",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function nowMs()        { return Date.now(); }
function daysAgoMs(n)   { return nowMs() - n * 24 * 60 * 60 * 1000; }

function buildTimeRange(startMs, endMs) {
  return { startTimeMillis: String(startMs), endTimeMillis: String(endMs) };
}

function buildAggregateBody(dataTypeName, durationMs = 86400000) {
  const endMs   = nowMs();
  const startMs = daysAgoMs(7); // last 7 days
  return {
    aggregateBy: [{ dataTypeName }],
    bucketByTime: { durationMillis: String(durationMs) },
    ...buildTimeRange(startMs, endMs),
  };
}

// ── OAuth2 Token via Google Identity Services ────────────────────────────────

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.onload = resolve;
    s.onerror = () => reject(new Error("Failed to load Google Identity script"));
    document.head.appendChild(s);
  });
}

function getAccessToken(clientId, scope) {
  return new Promise((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope,
      callback: (response) => {
        if (response.error) reject(new Error(response.error));
        else resolve(response.access_token);
      },
    });
    client.requestAccessToken({ prompt: "consent" });
  });
}

// ── Google Fit API calls ─────────────────────────────────────────────────────

async function fetchFitAggregate(token, dataTypeName) {
  const body = buildAggregateBody(dataTypeName);
  const res = await fetch(
    "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`Fit API error: ${res.status}`);
  return res.json();
}

// ── Data parsers ─────────────────────────────────────────────────────────────

function parseSteps(data) {
  let total = 0;
  let days  = 0;
  data.bucket?.forEach((bucket) => {
    const val = bucket.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal;
    if (val) { total += val; days++; }
  });
  const avgPerDay = days > 0 ? Math.round(total / days) : 0;
  return { total, avgPerDay, days };
}

function parseHeartRate(data) {
  const readings = [];
  data.bucket?.forEach((bucket) => {
    bucket.dataset?.[0]?.point?.forEach((pt) => {
      const bpm = pt.value?.[0]?.fpVal;
      if (bpm) readings.push(bpm);
    });
  });
  if (!readings.length) return { avg: null, min: null, max: null };
  const avg = Math.round(readings.reduce((s, v) => s + v, 0) / readings.length);
  return {
    avg,
    min: Math.round(Math.min(...readings)),
    max: Math.round(Math.max(...readings)),
  };
}

function parseSleep(data) {
  // Sleep segment types: 1=awake, 2=sleep, 3=out-of-bed, 4=light, 5=deep, 6=REM
  let totalSleepMs = 0;
  let nights = 0;
  data.bucket?.forEach((bucket) => {
    let nightMs = 0;
    bucket.dataset?.[0]?.point?.forEach((pt) => {
      const type = pt.value?.[0]?.intVal;
      if ([2, 4, 5, 6].includes(type)) {
        const start = Number(pt.startTimeNanos) / 1e6;
        const end   = Number(pt.endTimeNanos)   / 1e6;
        nightMs += end - start;
      }
    });
    if (nightMs > 0) { totalSleepMs += nightMs; nights++; }
  });
  const avgHours = nights > 0 ? +(totalSleepMs / nights / 3600000).toFixed(1) : null;
  return { avgHours, nights };
}

// ── Score contribution (maps fitness data → 0-100 lifestyle sub-score) ────────

export function fitnessToLifestyleScore({ steps, heartRate, sleep }) {
  let score = 50; // baseline

  // Steps: 10,000/day = optimal
  if (steps?.avgPerDay != null) {
    const stepScore = Math.min(100, (steps.avgPerDay / 10000) * 100);
    score += (stepScore - 50) * 0.4; // 40% weight
  }

  // Heart rate: 60-80 resting = ideal
  if (heartRate?.avg != null) {
    const hr = heartRate.avg;
    const hrScore = hr >= 60 && hr <= 80 ? 100
      : hr < 60 ? Math.max(0, 100 - (60 - hr) * 3)
      : Math.max(0, 100 - (hr - 80) * 2);
    score += (hrScore - 50) * 0.3; // 30% weight
  }

  // Sleep: 7-9 hours = ideal
  if (sleep?.avgHours != null) {
    const h = sleep.avgHours;
    const sleepScore = h >= 7 && h <= 9 ? 100
      : h < 7 ? Math.max(0, (h / 7) * 100)
      : Math.max(0, 100 - (h - 9) * 15);
    score += (sleepScore - 50) * 0.3; // 30% weight
  }

  return Math.round(Math.min(100, Math.max(0, score)));
}

// ── DEMO DATA (used when no real device connected) ───────────────────────────

export function getDemoFitnessData() {
  return {
    steps:     { total: 47832, avgPerDay: 6833, days: 7 },
    heartRate: { avg: 72, min: 58, max: 134 },
    sleep:     { avgHours: 6.8, nights: 6 },
    source:    "demo",
    fetchedAt: new Date().toISOString(),
  };
}

// ── Main hook ────────────────────────────────────────────────────────────────

export default function useGoogleFit() {
  const [status, setStatus]       = useState("idle"); // idle | connecting | connected | error | demo
  const [data, setData]           = useState(null);
  const [error, setError]         = useState(null);
  const tokenRef                  = useRef(null);

  const connectReal = useCallback(async () => {
    setStatus("connecting");
    setError(null);
    try {
      await loadGoogleScript();
      const token = await getAccessToken(GOOGLE_CLIENT_ID, SCOPES);
      tokenRef.current = token;

      const [stepsRaw, hrRaw, sleepRaw] = await Promise.all([
        fetchFitAggregate(token, DATA_TYPES.steps),
        fetchFitAggregate(token, DATA_TYPES.heartRate),
        fetchFitAggregate(token, DATA_TYPES.sleep),
      ]);

      const fitness = {
        steps:     parseSteps(stepsRaw),
        heartRate: parseHeartRate(hrRaw),
        sleep:     parseSleep(sleepRaw),
        source:    "google_fit",
        fetchedAt: new Date().toISOString(),
      };

      setData(fitness);
      setStatus("connected");
    } catch (err) {
      console.error("Google Fit error:", err);
      setError(err.message);
      setStatus("error");
    }
  }, []);

  const connectDemo = useCallback(() => {
    setStatus("connecting");
    setTimeout(() => {
      setData(getDemoFitnessData());
      setStatus("demo");
    }, 1200);
  }, []);

  const disconnect = useCallback(() => {
    tokenRef.current = null;
    setData(null);
    setStatus("idle");
    setError(null);
  }, []);

  const refresh = useCallback(async () => {
    if (status === "demo") { connectDemo(); return; }
    if (tokenRef.current) await connectReal();
  }, [status, connectDemo, connectReal]);

  return { status, data, error, connectReal, connectDemo, disconnect, refresh };
}