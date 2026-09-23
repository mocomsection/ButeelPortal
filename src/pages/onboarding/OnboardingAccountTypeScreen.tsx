import { useState } from "react";
import { useNavigate } from "react-router";
import buteelLogo from "@/imports/Artboard_1.png";
import { User, Building2, Landmark, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { OnboardingProgress } from "@/pages/onboarding/OnboardingProgress";

export default function OnboardingAccountTypeScreen() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("");
  const types = [
    { id: "individual", icon: User,      label: "Хувь хүн / Уран бүтээлч",  desc: "Ганцаарчилсан артист, бүтээлч" },
    { id: "business",   icon: Building2, label: "Жижиг бизнес / Студи",     desc: "ХХК, бичлэгийн студи, хамтлаг" },
    { id: "org",        icon: Landmark,  label: "Байгууллага / Лейбл",       desc: "Хөгжмийн лейбл, агентлаг" },
  ];
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3" style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, #000) 100%)" }}>
            <img src={buteelLogo} alt="Buteel" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-xl font-extrabold text-zinc-900">Тавтай морилно уу!</h1>
        </div>

        <OnboardingProgress step={0} />

        <Card className="p-6">
          <h2 className="font-bold text-zinc-900 mb-4">Аккаунтын төрөл</h2>
          <div className="space-y-3 mb-6">
            {types.map(t => (
              <button key={t.id} onClick={() => setAccountType(t.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${accountType === t.id ? "border-primary bg-violet-50/60" : "border-zinc-200 hover:border-zinc-300"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accountType === t.id ? "bg-primary text-white" : "bg-zinc-100 text-zinc-500"}`}>
                  <t.icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-zinc-900">{t.label}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{t.desc}</p>
                </div>
                {accountType === t.id && <Check size={18} className="text-primary flex-shrink-0" />}
              </button>
            ))}
          </div>
          <Btn full size="lg" onClick={() => navigate("/onboarding/label")}>Үргэлжлүүлэх</Btn>
        </Card>
      </div>
    </div>
  );
}
