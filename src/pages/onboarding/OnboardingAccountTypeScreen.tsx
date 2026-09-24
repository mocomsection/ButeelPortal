import { useState } from "react";
import { useNavigate } from "react-router";
import buteelLogo from "@/imports/Artboard_1.png";
import { User, Building2, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { OnboardingProgress } from "@/pages/onboarding/OnboardingProgress";
import { patchObState } from "@/data/ob-state";
import type { AccountType } from "@/data/ob-state";

const TYPES: { id: AccountType; icon: React.ElementType; label: string; desc: string }[] = [
  { id: "individual", icon: User,      label: "Хувь хүн",    desc: "Ганцаарчилсан артист, зохиолч, найруулагч" },
  { id: "org",        icon: Building2, label: "Байгууллага",  desc: "Лейбл, продакшн компани, хэвлэлийн газар" },
];

export default function OnboardingAccountTypeScreen() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<AccountType | "">("");

  const handleNext = () => {
    if (!accountType) return;
    patchObState({ accountType });
    navigate("/onboarding/contracts");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
            style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, #000) 100%)" }}>
            <img src={buteelLogo} alt="Buteel" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-xl font-extrabold text-zinc-900">Тавтай морилно уу!</h1>
          <p className="text-sm text-zinc-500 mt-1">Аккаунтаа тохируулж эхлэцгээе.</p>
        </div>

        <OnboardingProgress step={0} />

        <Card className="p-6">
          <h2 className="font-bold text-zinc-900 mb-1">Аккаунтын төрөл</h2>
          <p className="text-sm text-zinc-500 mb-4">Таны хэрэглэгчийн ангилалыг сонгоно уу.</p>
          <div className="space-y-3 mb-6">
            {TYPES.map(t => (
              <button key={t.id} onClick={() => setAccountType(t.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  accountType === t.id
                    ? "border-primary bg-primary/5"
                    : "border-zinc-200 hover:border-zinc-300 bg-white"
                }`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  accountType === t.id ? "bg-primary text-white" : "bg-zinc-100 text-zinc-500"
                }`}>
                  <t.icon size={21} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-zinc-900">{t.label}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{t.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  accountType === t.id ? "bg-primary border-primary" : "border-zinc-300"
                }`}>
                  {accountType === t.id && <Check size={11} className="text-white" />}
                </div>
              </button>
            ))}
          </div>
          <Btn full size="lg" disabled={!accountType} onClick={handleNext}>Үргэлжлүүлэх</Btn>
        </Card>
      </div>
    </div>
  );
}
