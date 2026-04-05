/**
 * Storage Layer
 * Abstracts localStorage with JSON serialization and error handling.
 * In production, replace these functions with API calls to your backend.
 */

const KEYS = {
  USER:    "mhrs_user",
  REPORTS: "mhrs_reports",
  CURRENT: "mhrs_current_values",
};

// ─── User Auth (mock) ─────────────────────────────────────────────────────────

export function saveUser(user) {
  try {
    localStorage.setItem(KEYS.USER, JSON.stringify({
      ...user,
      password: undefined, // Never store passwords in localStorage
      createdAt: user.createdAt || new Date().toISOString(),
    }));
    return true;
  } catch (e) {
    console.error("Storage: failed to save user", e);
    return false;
  }
}

export function loadUser() {
  try {
    const raw = localStorage.getItem(KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function clearUser() {
  localStorage.removeItem(KEYS.USER);
}

// ─── Reports ──────────────────────────────────────────────────────────────────

/**
 * Saves a new assessment report snapshot.
 * @param {Object} report - { values, score, note? }
 */
export function saveReport(report) {
  try {
    const existing = loadReports();
    const newReport = {
      id: `report_${Date.now()}`,
      ...report,
      savedAt: new Date().toISOString(),
    };
    const updated = [newReport, ...existing].slice(0, 20); // Keep last 20
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(updated));
    return newReport;
  } catch (e) {
    console.error("Storage: failed to save report", e);
    return null;
  }
}

export function loadReports() {
  try {
    const raw = localStorage.getItem(KEYS.REPORTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function deleteReport(id) {
  try {
    const reports = loadReports().filter((r) => r.id !== id);
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
    return true;
  } catch (e) {
    return false;
  }
}

export function clearAllReports() {
  localStorage.removeItem(KEYS.REPORTS);
}

// ─── Current Session Values ───────────────────────────────────────────────────

export function saveCurrentValues(values) {
  try {
    localStorage.setItem(KEYS.CURRENT, JSON.stringify(values));
  } catch (e) {
    // Silent fail — non-critical
  }
}

export function loadCurrentValues() {
  try {
    const raw = localStorage.getItem(KEYS.CURRENT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// ─── Full Data Clear ──────────────────────────────────────────────────────────

export function clearAllData() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}
