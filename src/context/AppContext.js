/**
 * AppContext
 * Global state management using React Context + useReducer.
 * Handles: authentication, current assessment values, saved reports, UI state.
 */

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { loadUser, saveUser, clearUser, loadReports, saveReport, loadCurrentValues, saveCurrentValues } from "../utils/storage";
import { DEMO_PROFILES } from "../data/dimensions";

// ─── Default Values ───────────────────────────────────────────────────────────

const DEFAULT_VALUES = DEMO_PROFILES[1].values; // James — moderate profile

const initialState = {
  // Auth
  user: null,
  isAuthenticated: false,

  // Assessment
  values: DEFAULT_VALUES,
  activeProfileId: null,

  // Reports
  reports: [],

  // UI
  isLoading: true,
  toast: null, // { message, type: 'success'|'error'|'info' }
};

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return { ...state, ...action.payload, isLoading: false };

    case "LOGIN":
      return { ...state, user: action.payload, isAuthenticated: true };

    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false, reports: [] };

    case "SET_VALUES":
      return { ...state, values: action.payload, activeProfileId: null };

    case "LOAD_PROFILE":
      return { ...state, values: action.payload.values, activeProfileId: action.payload.id };

    case "SAVE_REPORT":
      return { ...state, reports: [action.payload, ...state.reports].slice(0, 20) };

    case "DELETE_REPORT":
      return { ...state, reports: state.reports.filter((r) => r.id !== action.payload) };

    case "SET_REPORTS":
      return { ...state, reports: action.payload };

    case "SHOW_TOAST":
      return { ...state, toast: action.payload };

    case "CLEAR_TOAST":
      return { ...state, toast: null };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Initialize from localStorage on mount
  useEffect(() => {
    const user = loadUser();
    const savedValues = loadCurrentValues();
    const reports = loadReports();

    dispatch({
      type: "INIT",
      payload: {
        user,
        isAuthenticated: !!user,
        values: savedValues || DEFAULT_VALUES,
        reports,
      },
    });
  }, []);

  // Auto-save current values when they change
  useEffect(() => {
    if (!state.isLoading) {
      saveCurrentValues(state.values);
    }
  }, [state.values, state.isLoading]);

  // ── Action Creators ────────────────────────────────────────────────────────

  const actions = {
    login: (userData) => {
      saveUser(userData);
      dispatch({ type: "LOGIN", payload: userData });
    },

    logout: () => {
      clearUser();
      dispatch({ type: "LOGOUT" });
    },

    setValues: (values) => {
      dispatch({ type: "SET_VALUES", payload: values });
    },

    updateDimension: (key, value) => {
      dispatch({
        type: "SET_VALUES",
        payload: { ...state.values, [key]: Number(value) },
      });
    },

    loadProfile: (profile) => {
      dispatch({ type: "LOAD_PROFILE", payload: profile });
    },

    saveReport: (note = "") => {
      const report = saveReport({
        values: state.values,
        note,
        userName: state.user?.name || "Anonymous",
      });
      if (report) {
        dispatch({ type: "SAVE_REPORT", payload: report });
        actions.showToast("Report saved successfully!", "success");
      } else {
        actions.showToast("Failed to save report.", "error");
      }
    },

    deleteReport: (id) => {
      dispatch({ type: "DELETE_REPORT", payload: id });
      actions.showToast("Report deleted.", "info");
    },

    showToast: (message, type = "info") => {
      dispatch({ type: "SHOW_TOAST", payload: { message, type } });
      setTimeout(() => dispatch({ type: "CLEAR_TOAST" }), 3500);
    },
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

/** Hook to consume AppContext */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
