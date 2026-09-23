import { useState } from "react";
import { useNavigate } from "react-router";
import buteelLogo from "@/imports/Artboard_1.png";
import { Check, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { OnboardingProgress } from "@/pages/onboarding/OnboardingProgress";
import { OB_AGREEMENTS } from "@/data/agreements";

export default function OnboardingAgreementsScreen() {
  const navigate = useNavigate();
  const [signed, setSigned] = useState<string[]>(["distribution"]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) => {
    if (id === "distribution") return; // required
    setSigned(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3" style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, #000) 100%)" }}>
            <img src={buteelLogo} alt="Buteel" className="w-8 h-8 object-contain" />
          </div>
        </div>

        <OnboardingProgress step={2} />

        <Card className="p-6">
          <h2 className="font-bold text-zinc-900 mb-1">Үйлчилгээний гэрээ</h2>
          <p className="text-sm text-zinc-500 mb-2">Гэрээ тус бүр нь тодорхой үйлчилгээг нэмж нээнэ. Дуу түгээх гэрээ заавал шаардлагатай.</p>


          <div className="space-y-3 mb-6">
            {OB_AGREEMENTS.map(ag => {
              const isOn = signed.includes(ag.id);
              const isExpanded = expanded === ag.id;
              return (
                <div key={ag.id} className={`rounded-xl border-2 overflow-hidden transition-all ${isOn ? ag.bg : ag.unselBg}`}>
                  <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => toggle(ag.id)}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${ag.iconBg} text-white`}>
                      <ag.icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-zinc-900">{ag.name}</p>
                        {ag.required && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold">Заавал</span>}
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{ag.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={e => { e.stopPropagation(); setExpanded(isExpanded ? null : ag.id); }}
                        className="text-zinc-400 hover:text-zinc-600 p-1">
                        <ChevronDown size={14} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                      <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${isOn ? "bg-primary border-primary" : "border-zinc-300 bg-white"} ${ag.required ? "opacity-60" : ""}`}>
                        {isOn && <Check size={11} className="text-white" />}
                      </div>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-zinc-100/60">
                      <p className="text-xs font-semibold uppercase text-zinc-400 mb-2 mt-3">Нээгдэх үйлчилгээнүүд</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ag.services.map(s => (
                          <span key={s} className={`text-xs px-2 py-0.5 rounded-md font-medium ${ag.badge}`}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Services summary */}
          <div className="bg-zinc-50 rounded-xl p-4 mb-5 border border-zinc-100">
            <p className="text-xs font-bold uppercase text-zinc-400 mb-2">Нээгдэх үйлчилгээнүүд нийт ({OB_AGREEMENTS.filter(a => signed.includes(a.id)).flatMap(a => a.services).length})</p>
            <div className="flex flex-wrap gap-1">
              {OB_AGREEMENTS.filter(a => signed.includes(a.id)).flatMap(a => a.services).map(s => (
                <span key={s} className="text-xs bg-white border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded font-medium">{s}</span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Btn variant="secondary" onClick={() => navigate("/onboarding/label")}>Буцах</Btn>
            <Btn full size="lg" onClick={() => navigate("/onboarding/complete")}>Зөвшөөрч үргэлжлүүлэх</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}
