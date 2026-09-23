import { Check } from "lucide-react";

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-start gap-0">
      {steps.map((s, i) => (
        <div key={i} className="flex items-start">
          <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ring-4
              ${i < current  ? "bg-primary text-primary-foreground ring-secondary"
              : i === current ? "bg-primary text-primary-foreground ring-secondary/80"
              : "bg-card text-muted-foreground ring-border border border-border"}`}>
              {i < current ? <Check size={13} strokeWidth={2.5} /> : i + 1}
            </div>
            <span className={`text-xs hidden sm:block font-semibold leading-none whitespace-nowrap
              ${i === current ? "text-primary" : i < current ? "text-foreground/60" : "text-muted-foreground"}`}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`mt-4 mx-2 sm:mx-4 h-0.5 w-8 sm:w-14 flex-shrink-0 rounded-full ${i < current ? "bg-primary" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
