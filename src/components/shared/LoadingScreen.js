import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50">
      {/* Animated rings */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-indigo-400/30 animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-indigo-600/20 flex items-center justify-center">
          <span className="text-2xl">🧠</span>
        </div>
      </div>
      <h2 className="text-xl font-bold gradient-text mb-2">MH Resilience Pro</h2>
      <p className="text-slate-500 text-sm animate-pulse">Loading your assessment...</p>
    </div>
  );
}

/** Skeleton loader for card placeholders */
export function SkeletonCard({ className = "" }) {
  return (
    <div className={`card p-5 animate-pulse ${className}`}>
      <div className="shimmer h-4 w-32 rounded-lg mb-4" />
      <div className="shimmer h-3 w-full rounded-lg mb-2" />
      <div className="shimmer h-3 w-3/4 rounded-lg mb-2" />
      <div className="shimmer h-3 w-1/2 rounded-lg" />
    </div>
  );
}
