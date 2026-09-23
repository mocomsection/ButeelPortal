import { Check } from "lucide-react";
import { OB_STEPS } from "@/data/agreements";

export function OnboardingProgress({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between mb-8 px-1">
      {OB_STEPS.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
              i < step ? "bg-primary border-primary text-primary-foreground"
              : i === step ? "border-primary text-primary bg-card"
              : "border-border text-muted-foreground bg-card"
            }`}>
              {i < step ? <Check size={13} /> : i + 1}
            </div>
            <span className={`text-xs font-semibold hidden sm:block text-center leading-tight max-w-[64px] ${
              i === step ? "text-primary" : i < step ? "text-foreground/60" : "text-muted-foreground/50"
            }`}>{label}</span>
          </div>
          {i < OB_STEPS.length - 1 && (
            <div className={`mx-2 h-0.5 w-8 sm:w-14 mt-[-14px] ${i < step ? "bg-primary" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
