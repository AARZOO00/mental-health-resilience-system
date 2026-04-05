import React from "react";
import { useApp } from "../../context/AppContext";

const ICONS = {
  success: "✅",
  error:   "❌",
  info:    "ℹ️",
  warning: "⚠️",
};
const COLORS = {
  success: "border-green-500/40 bg-green-900/30 text-green-300",
  error:   "border-red-500/40 bg-red-900/30 text-red-300",
  info:    "border-blue-500/40 bg-blue-900/30 text-blue-300",
  warning: "border-yellow-500/40 bg-yellow-900/30 text-yellow-300",
};

export default function Toast() {
  const { state } = useApp();
  const { toast } = state;

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-md text-sm font-medium ${COLORS[toast.type] || COLORS.info}`}>
        <span className="text-base">{ICONS[toast.type] || ICONS.info}</span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
