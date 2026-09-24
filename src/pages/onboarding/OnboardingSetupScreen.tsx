import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import buteelLogo from "@/imports/Artboard_1.png";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { Input } from "@/components/ui/Input";
import { OnboardingProgress } from "@/pages/onboarding/OnboardingProgress";
import { OB_CONTRACTS } from "@/data/agreements";
import { getObState, patchObState } from "@/data/ob-state";

export default function OnboardingSetupScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const idx = parseInt(params.get("idx") ?? "0", 10);

  const state = getObState();
  const contract = OB_CONTRACTS.find(c => c.id === state.contracts[idx]);

  const [name, setName] = useState("");

  useEffect(() => {
    if (!contract) navigate("/onboarding/contracts");
    const existing = state.setups?.[state.contracts[idx]];
    setName(existing?.name ?? "");
  }, [idx]);

  if (!contract) return null;

  const total = state.contracts.length;
  const subLabel = total > 1 ? `${idx + 1}/${total}` : undefined;

  const handleNext = () => {
    if (!name.trim()) return;
    const current = getObState();
    patchObState({ setups: { ...current.setups, [contract.id]: { name: name.trim() } } });
    const nextIdx = idx + 1;
    if (nextIdx < state.contracts.length) {
      navigate(`/onboarding/setup?idx=${nextIdx}`);
    } else {
      navigate("/onboarding/complete");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
            style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, #000) 100%)" }}>
            <img src={buteelLogo} alt="Buteel" className="w-8 h-8 object-contain" />
          </div>
        </div>

        <OnboardingProgress step={3} subLabel={subLabel} />

        <Card className="overflow-hidden p-0">
          {/* Contract context banner */}
          <div className={`px-6 py-3.5 ${contract.iconBg}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <contract.icon size={14} className="text-white" />
              </div>
              <p className="text-[11px] text-white/80 font-semibold uppercase tracking-wide">
                {total > 1 ? `Тохиргоо ${idx + 1}/${total} — ` : ""}
                {contract.name}
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h2 className="font-bold text-zinc-900 text-lg mb-1">{contract.setupLabel}</h2>
              <p className="text-sm text-zinc-500 leading-relaxed">{contract.setupHelper}</p>
            </div>

            <div className="mb-6">
              <Input
                label={contract.setupLabel}
                placeholder={contract.setupPlaceholder}
                value={name}
                onChange={setName}
              />
              {name.trim() && (
                <div className={`mt-3 rounded-xl px-4 py-3 flex items-center gap-3 ${contract.badgeBg}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${contract.iconBg}`}>
                    <contract.setupIcon size={13} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-zinc-500">Нийтлэгдэх нэр</p>
                    <p className="text-sm font-semibold text-zinc-900 truncate">{name.trim()}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Btn variant="secondary"
                onClick={() => idx > 0 ? navigate(`/onboarding/setup?idx=${idx - 1}`) : navigate(`/onboarding/sign?idx=${total - 1}`)}>
                Буцах
              </Btn>
              <Btn full size="lg" disabled={!name.trim()} onClick={handleNext}>
                {idx < total - 1 ? "Дараагийн тохиргоо →" : "Дуусгах →"}
              </Btn>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
