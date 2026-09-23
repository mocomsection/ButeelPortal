import React from "react";

export function Btn({ children, variant = "primary", size = "md", onClick, disabled, full, icon }: {
  children: React.ReactNode; variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg"; onClick?: () => void; disabled?: boolean; full?: boolean; icon?: React.ReactNode;
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
    lg: "h-10 px-5 text-sm gap-2 rounded-xl",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-semibold border transition-all
        ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""} ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "cursor-pointer"}`}
    >{icon}{children}</button>
  );
}
