import { useState } from "react";
import { useNavigate } from "react-router";
import buteelLogo from "@/imports/Artboard_1.png";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { OnboardingProgress } from "@/pages/onboarding/OnboardingProgress";
import { OB_CONTRACTS } from "@/data/agreements";
import { patchObState } from "@/data/ob-state";
import type { ContractId } from "@/data/ob-state";

export default function OnboardingContractsScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<ContractId[]>([]);

  const toggle = (id: ContractId) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleNext = () => {
    if (!selected.length) return;
    patchObState({ contracts: selected, signed: {}, setups: {} });
    navigate("/onboarding/sign?idx=0");
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

        <OnboardingProgress step={1} />

        <Card className="p-6">
          <h2 className="font-bold text-zinc-900 mb-1">Гэрээний төрөл</h2>
          <p className="text-sm text-zinc-500 mb-4">Хийх гэрээ(нүүд)ээ сонгоно уу. Олон гэрээ сонгох боломжтой.</p>

          <div className="space-y-3 mb-6">
            {OB_CONTRACTS.map(c => {
              const isOn = selected.includes(c.id);
              return (
                <button key={c.id} onClick={() => toggle(c.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    isOn ? `border-current ${c.color} bg-zinc-50` : "border-zinc-200 hover:border-zinc-300 bg-white"
                  }`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white ${c.iconBg}`}>
                    <c.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${isOn ? "text-zinc-900" : "text-zinc-800"}`}>{c.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-snug">{c.desc}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {c.services.slice(0, 4).map(s => (
                        <span key={s} className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${c.badgeBg}`}>{s}</span>
                      ))}
                      {c.services.length > 4 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-zinc-100 text-zinc-500">+{c.services.length - 4}</span>
                      )}
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isOn ? `${c.iconBg} border-transparent` : "border-zinc-300 bg-white"
                  }`}>
                    {isOn && <Check size={13} className="text-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3">
            <Btn variant="secondary" onClick={() => navigate("/onboarding/account-type")}>Буцах</Btn>
            <Btn full size="lg" disabled={!selected.length} onClick={handleNext}>
              {selected.length > 0 ? `${selected.length} гэрээ — Үргэлжлүүлэх` : "Үргэлжлүүлэх"}
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}
