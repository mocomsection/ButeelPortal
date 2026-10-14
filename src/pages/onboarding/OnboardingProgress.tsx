import { Check } from "lucide-react";
import { OB_STEPS } from "@/data/agreements";

interface Props {
  step: number;
  subLabel?: string;
}

export function OnboardingProgress({ step, subLabel }: Props) {
  const total = OB_STEPS.length;

  return (
    <div className="mb-8 overflow-x-auto pb-2">
    <div className="relative grid min-w-[520px] grid-cols-4 items-start">
      {OB_STEPS.map((label, i) => (
        <div key={i} aria-current={i === step ? "step" : undefined} className="relative flex flex-col items-center gap-2.5">
          {i < total - 1 && <span className={"absolute left-1/2 top-5 h-0.5 w-full " + (i < step ? "bg-primary" : "bg-border")} />}
          <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
            i < step  ? "bg-primary border-primary text-primary-foreground"
            : i === step ? "border-primary text-primary bg-card"
            : "border-border text-muted-foreground bg-card"
          }`}>
            {i < step ? <Check size={16} /> : i + 1}
          </div>
          <span className={`whitespace-nowrap text-sm font-medium text-center leading-relaxed ${
            i === step ? "text-primary" : i < step ? "text-foreground/60" : "text-muted-foreground/40"
          }`}>
            {label}{i === step && subLabel && <span className="ml-1.5 text-xs">{subLabel}</span>}
          </span>
        </div>
      ))}
    </div>
    </div>
  );
}
