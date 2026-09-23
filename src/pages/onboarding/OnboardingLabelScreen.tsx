import { useNavigate } from "react-router";
import buteelLogo from "@/imports/Artboard_1.png";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { Input } from "@/components/ui/Input";
import { OnboardingProgress } from "@/pages/onboarding/OnboardingProgress";
import { useState } from "react";

export default function OnboardingLabelScreen() {
  const navigate = useNavigate();
  const [labelName, setLabelName] = useState("");
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3" style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, #000) 100%)" }}>
            <img src={buteelLogo} alt="Buteel" className="w-8 h-8 object-contain" />
          </div>
        </div>

        <OnboardingProgress step={1} />

        <Card className="p-6">
          <h2 className="font-bold text-zinc-900 mb-4">Лейбл тохиргоо</h2>

          <div className="mb-6">
            <Input label="Лейблийн нэр" placeholder="Жишээ нь: Steppe Records, Bold Music"
              value={labelName} onChange={setLabelName}
              helper="Бүтээлүүд энэ лейбл дор бүртгэгдэнэ. Нэг л удаа тохируулах боломжтой." />
          </div>

          <div className="flex gap-3">
            <Btn variant="secondary" onClick={() => navigate("/onboarding/account-type")}>Буцах</Btn>
            <Btn full size="lg" onClick={() => navigate("/onboarding/agreements")}>Үргэлжлүүлэх</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}
