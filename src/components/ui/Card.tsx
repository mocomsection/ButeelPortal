import React from "react";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card rounded-2xl border border-border shadow-[0_2px_12px_0_color-mix(in_srgb,var(--primary)_7%,transparent),0_1px_3px_0_rgba(0,0,0,0.04)] ${className}`}>
      {children}
    </div>
  );
}
