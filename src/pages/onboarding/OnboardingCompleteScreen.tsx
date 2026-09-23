import { useNavigate } from "react-router";
import buteelLogo from "@/imports/Artboard_1.png";
import { Check, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { OnboardingProgress } from "@/pages/onboarding/OnboardingProgress";
import { OB_AGREEMENTS } from "@/data/agreements";

export default function OnboardingCompleteScreen() {
  const navigate = useNavigate();
  const services = OB_AGREEMENTS[0].services;
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3" style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, #000) 100%)" }}>
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

          <div className="bg-violet-50 rounded-xl p-4 border border-violet-100 text-left mb-6">
            <p className="text-xs font-bold uppercase text-violet-400 mb-2">Нээгдсэн Үйлчилгээнүүд</p>
            <div className="flex flex-wrap gap-1.5">
              {services.map(s => (
                <span key={s} className="flex items-center gap-1 text-xs bg-white text-violet-700 border border-violet-200 px-2 py-0.5 rounded-lg font-semibold">
                  <Check size={9} />{s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Btn variant="secondary" full onClick={() => navigate("/account/payment")}>Төлбөрийн Мэдээлэл</Btn>
            <Btn full onClick={() => navigate("/dashboard")}>Эхлэх</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}
