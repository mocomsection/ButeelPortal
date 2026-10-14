import React from "react";

export function Btn({ children, variant = "primary", size = "md", onClick, disabled, full, icon, type = "button" }: {
  children: React.ReactNode; variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg"; onClick?: () => void; disabled?: boolean; full?: boolean; icon?: React.ReactNode;
  type?: "button" | "submit";
}) {
  const variants = {
    primary:   "bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground border-transparent shadow-[0_2px_8px_0_color-mix(in_srgb,var(--primary)_30%,transparent)]",
    secondary: "bg-card hover:bg-muted/50 text-foreground border-border shadow-sm",
    outline:   "bg-transparent hover:bg-muted/40 text-foreground border-border hover:border-primary/50",
    ghost:     "bg-transparent hover:bg-muted/60 text-muted-foreground border-transparent hover:text-primary",
    danger:    "bg-destructive hover:bg-destructive/90 text-destructive-foreground border-transparent shadow-sm",
  };
  const sizes = {
    sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
    md: "h-9 px-4 text-sm gap-2 rounded-xl",
    lg: "min-h-11 px-5 py-2 text-sm gap-2 rounded-xl",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-semibold border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
        ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""} ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "cursor-pointer"}`}
    >{icon}{children}</button>
  );
}
