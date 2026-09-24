import { useNavigate } from "react-router";
import buteelLogo from "@/imports/Artboard_1.png";
import { Check, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { OnboardingProgress } from "@/pages/onboarding/OnboardingProgress";
import { OB_CONTRACTS } from "@/data/agreements";
import { getObState, completeOnboarding } from "@/data/ob-state";

export default function OnboardingCompleteScreen() {
  const navigate = useNavigate();
  const state = getObState();
  const signedContracts = OB_CONTRACTS.filter(c => state.contracts.includes(c.id));

  const handleStart = () => {
    completeOnboarding();
    navigate("/dashboard");
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

        <OnboardingProgress step={4} />

        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={34} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-1">Аккаунт амжилттай үүслээ!</h2>
          <p className="text-sm text-zinc-500 mb-6">Бүтээлүүдийг нийтлэхэд бэлэн боллоо.</p>

          <div className="space-y-3 mb-6 text-left">
            {signedContracts.map(c => {
              const setup = state.setups?.[c.id];
              return (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${c.iconBg}`}>
                    <c.icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 truncate">{c.name}</p>
                    {setup?.name && <p className="text-xs text-zinc-500 truncate">{setup.name}</p>}
                  </div>
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-green-600" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <Btn variant="secondary" full onClick={() => navigate("/account/payment")}>Төлбөрийн мэдээлэл</Btn>
            <Btn full onClick={handleStart}>Эхлэх</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}
