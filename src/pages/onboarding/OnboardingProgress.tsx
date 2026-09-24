import { Check } from "lucide-react";
import { OB_STEPS } from "@/data/agreements";

interface Props {
  step: number;
  subLabel?: string;
}

export function OnboardingProgress({ step, subLabel }: Props) {
  const total = OB_STEPS.length;
  const f = total > 1 ? step / (total - 1) : 0;

  return (
    <div className="relative flex justify-between items-start mb-8">
      {/* Background line */}
      <div className="absolute top-4 left-4 right-4 h-0.5 bg-border" />
      {/* Active line */}
      <div
        className="absolute top-4 left-4 h-0.5 bg-primary transition-all duration-500"
        style={{ width: step === 0 ? 0 : `calc(${(f * 100).toFixed(2)}% - ${(f * 32).toFixed(2)}px)` }}
      />
      {OB_STEPS.map((label, i) => (
        <div key={i} className="relative flex flex-col items-center gap-1.5 z-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
            i < step  ? "bg-primary border-primary text-primary-foreground"
            : i === step ? "border-primary text-primary bg-card"
            : "border-border text-muted-foreground bg-card"
          }`}>
            {i < step ? <Check size={13} /> : i + 1}
          </div>
          <span className={`text-[11px] font-semibold text-center leading-tight max-w-[52px] ${
            i === step ? "text-primary" : i < step ? "text-foreground/60" : "text-muted-foreground/40"
          }`}>
            {i === step && subLabel ? subLabel : label}
          </span>
        </div>
      ))}
    </div>
  );
}
