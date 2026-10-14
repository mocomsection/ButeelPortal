import { useState } from "react";
import { useNavigate } from "react-router";
import buteelLogo from "@/imports/Artboard_1.png";
import { User, Building2, Check, ArrowLeft, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { RegisterNumberInput, isValidRegisterNumber } from "@/components/ui/RegisterNumberInput";
import { OnboardingProgress } from "@/pages/onboarding/OnboardingProgress";
import { patchObState, getAccountState } from "@/data/ob-state";
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
  const user = getAccountState();
  const lastName = user.lastName;
  const firstName = user.firstName;
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
    patchObState({ accountType, partyName, partyRegister: register.trim(), signerName: [user.lastName, user.firstName].filter(Boolean).join(" ") });
    navigate("/onboarding/contracts");
  };

  const canInfoNext = accountType === "individual"
    ? !!lastName.trim() && !!firstName.trim() && isValidRegisterNumber(register)
    : !!orgName.trim() && !!register.trim();

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-4 py-10 sm:py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
            style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, #000) 100%)" }}>
            <img src={buteelLogo} alt="Buteel" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-xl font-extrabold text-foreground">Buteel Portal</h1>
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
                    <div><p className="mb-2 text-sm font-medium text-muted-foreground">Овог</p><p className="break-words rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 text-sm text-foreground">{lastName || "—"}</p></div>
                    <div><p className="mb-2 text-sm font-medium text-muted-foreground">Нэр</p><p className="break-words rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 text-sm text-foreground">{firstName || "—"}</p></div>
                  </div>
                  <div><p className="mb-2 text-sm font-medium text-muted-foreground">Регистрийн дугаар <span className="text-red-500">*</span></p><RegisterNumberInput value={register} onChange={setRegister} /><p className="mt-1 text-xs text-muted-foreground">Хоёр үсгээ сонгоод найман цифрээ оруулна уу.</p></div>
                </>
              ) : (
                <>
                  <InfoField label="Байгууллагын нэр" required value={orgName} onChange={setOrgName}
                    placeholder="Steppe Records ХХК" />
                  <InfoField label="Байгууллагын регистр" required value={register} onChange={value => setRegister(value.replace(/[^0-9]/g, ""))}
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
      <label className="block text-xs font-bold text-zinc-500 normal-case mb-1.5">
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
