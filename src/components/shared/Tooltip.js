/**
 * Tooltip component — shows on hover, beginner-friendly explanations.
 * Uses pure CSS positioning (no portals) for simplicity.
 */
import React from "react";

export default function Tooltip({ text, children, position = "top", width = "w-56" }) {
  const positions = {
    top:    "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left:   "right-full top-1/2 -translate-y-1/2 mr-2",
    right:  "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <span className="relative inline-flex group">
      {children}
      <span
        className={`
          absolute z-50 ${positions[position]} ${width}
          px-3 py-2 rounded-xl text-xs leading-relaxed text-slate-300
          bg-slate-900 border border-slate-700 shadow-2xl
          opacity-0 group-hover:opacity-100 pointer-events-none
          transition-all duration-200 scale-95 group-hover:scale-100
        `}
      >
        {text}
        {/* Arrow */}
        <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-700" />
      </span>
    </span>
  );
}

/** Info icon that triggers tooltip */
export function InfoIcon({ tooltip }) {
  return (
    <Tooltip text={tooltip} width="w-64">
      <span className="cursor-help inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-700 text-slate-400 text-[9px] font-bold hover:bg-slate-600 transition-colors ml-1">
        ?
      </span>
    </Tooltip>
  );
}
