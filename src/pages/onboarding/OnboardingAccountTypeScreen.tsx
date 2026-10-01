import { useState } from "react";
import { useNavigate } from "react-router";
import buteelLogo from "@/imports/Artboard_1.png";
import { User, Building2, Check, ArrowLeft, AlertCircle } from "lucide-react";
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
  const [phase, setPhase] = useState<"type" | "info">("type");

  // Individual fields
  const [lastName,  setLastName]  = useState("");
  const [firstName, setFirstName] = useState("");
  // Org fields
  const [orgName,  setOrgName]  = useState("");
  const [register, setRegister] = useState("");

  const handleTypeNext = () => {
    if (!accountType) return;
    setPhase("info");
  };

  const handleInfoNext = () => {
    if (!canInfoNext) return;
    const partyName = accountType === "individual"
      ? `${lastName.trim()} ${firstName.trim()}`.trim()
      : orgName.trim();
    patchObState({ accountType, partyName, partyRegister: register.trim() });
    navigate("/onboarding/contracts");
  };

  const canInfoNext = accountType === "individual"
    ? !!lastName.trim() && !!firstName.trim() && !!register.trim()
    : !!orgName.trim() && !!register.trim();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
            style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, #000) 100%)" }}>
            <img src={buteelLogo} alt="Buteel" className="w-8 h-8 object-contain" />
          </div>
          {phase === "type" ? (
            <>
              <h1 className="text-xl font-extrabold text-zinc-900">Тавтай морилно уу!</h1>
              <p className="text-sm text-zinc-500 mt-1">Аккаунтаа тохируулж эхлэцгээе.</p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-extrabold text-zinc-900">
                {accountType === "individual" ? "Хувь хүний мэдээлэл" : "Байгууллагын мэдээлэл"}
              </h1>
              <p className="text-sm text-zinc-500 mt-1">Гэрээ байгуулахад шаардлагатай мэдээлэл</p>
            </>
          )}
        </div>

        <OnboardingProgress step={0} />

        {phase === "type" && (
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
            <Btn full size="lg" disabled={!accountType} onClick={handleTypeNext}>Үргэлжлүүлэх</Btn>
          </Card>
        )}

        {phase === "info" && (
          <Card className="p-6">
            <h2 className="font-bold text-zinc-900 mb-1">
              {accountType === "individual" ? "Хувь хүний мэдээлэл" : "Байгууллагын мэдээлэл"}
            </h2>
            <p className="text-sm text-zinc-500 mb-5">
              {accountType === "individual"
                ? "Иргэний үнэмлэхтэй тохирсон байх ёстой."
                : "Улсын бүртгэлтэй тохирсон байх ёстой."}
            </p>

            <div className="space-y-4 mb-5">
              {accountType === "individual" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoField label="Овог" required value={lastName} onChange={setLastName} placeholder="Батбаяр" />
                    <InfoField label="Нэр"  required value={firstName} onChange={setFirstName} placeholder="Болд" />
                  </div>
                  <InfoField label="Регистрийн дугаар" required value={register} onChange={setRegister}
                    placeholder="УН12345678" hint="Иргэний үнэмлэх дээрх дугаар" />
                </>
              ) : (
                <>
                  <InfoField label="Байгууллагын нэр" required value={orgName} onChange={setOrgName}
                    placeholder="Steppe Records ХХК" />
                  <InfoField label="Байгууллагын регистр" required value={register} onChange={setRegister}
                    placeholder="1234567" hint="Улсын бүртгэлийн гэрчилгээ дэх дугаар" />
                </>
              )}
            </div>

            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5 mb-5">
              <AlertCircle size={12} className="text-amber-500 flex-shrink-0" />
              <p className="text-xs text-amber-700">Гэрээний баримтад ашиглагдана — бодит мэдээлэл оруулна уу.</p>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setPhase("type")}
                className="flex items-center gap-1.5 h-10 px-4 rounded-xl border border-border text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors flex-shrink-0">
                <ArrowLeft size={14} />Буцах
              </button>
              <Btn full size="lg" disabled={!canInfoNext} onClick={handleInfoNext}>Үргэлжлүүлэх</Btn>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function InfoField({
  label, required, value, onChange, placeholder, hint,
}: {
  label: string; required?: boolean; value: string;
  onChange: (v: string) => void; placeholder?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white"
      />
      {hint && <p className="text-[11px] text-zinc-400 mt-1">{hint}</p>}
    </div>
  );
}
