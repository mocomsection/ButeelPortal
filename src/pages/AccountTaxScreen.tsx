import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Check, Building2, User, Receipt, AlertCircle } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";

type AccType = "individual" | "org";
type SaveState = "idle" | "saving" | "saved";

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({
  label, required, helper, children,
}: { label: string; required?: boolean; helper?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold text-zinc-500 uppercase block mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {helper && <p className="text-xs text-muted-foreground mt-1">{helper}</p>}
    </div>
  );
}

function TextInput({
  value, onChange, placeholder, className = "",
}: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${className}`}
    />
  );
}

export default function AccountTaxScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accType: AccType = (searchParams.get("type") as AccType) ?? "individual";
  const isOrg = accType === "org";

  // ── individual fields ─────────────────────────────────────────────────────
  const [lastName,   setLastName]   = useState("Жаргал");
  const [firstName,  setFirstName]  = useState("Болд");
  const [regNumber,  setRegNumber]  = useState("УН12345678");
  const [taxId,      setTaxId]      = useState("9900112233");

  // ── organization fields ───────────────────────────────────────────────────
  const [orgName,    setOrgName]    = useState("Steppe Records ХХК");
  const [orgReg,     setOrgReg]     = useState("1234567");
  const [orgTaxId,   setOrgTaxId]   = useState("7711223344");

  // ── shared ────────────────────────────────────────────────────────────────
  const [vatPayer,   setVatPayer]   = useState(false);
  const [vatRegNum,  setVatRegNum]  = useState("");
  const [saveState,  setSaveState]  = useState<SaveState>("idle");

  const indCanSave = !!lastName.trim() && !!firstName.trim() && !!regNumber.trim() && !!taxId.trim();
  const orgCanSave = !!orgName.trim() && !!orgReg.trim() && !!orgTaxId.trim();
  const canSave    = isOrg ? orgCanSave : indCanSave;

  const handleSave = () => {
    if (!canSave) return;
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => { setSaveState("idle"); navigate("/account"); }, 1400);
    }, 700);
  };

  return (
    <Shell title="Аккаунтын мэдээлэл засах">
      <div className="max-w-xl space-y-5">

        <button type="button" onClick={() => navigate("/account")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors -mt-1 mb-1">
          <ArrowLeft size={15} />Буцах
        </button>

        {/* ── Account type indicator ── */}
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${isOrg ? "bg-blue-50 border-blue-200" : "bg-secondary/40 border-primary/20"}`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isOrg ? "bg-blue-500" : "bg-primary"}`}>
            {isOrg ? <Building2 size={14} className="text-white" /> : <User size={14} className="text-white" />}
          </div>
          <div>
            <p className={`text-sm font-bold ${isOrg ? "text-blue-800" : "text-primary"}`}>
              {isOrg ? "Байгуулгын аккаунт" : "Хувь хүний аккаунт"}
            </p>
            <p className={`text-xs mt-0.5 ${isOrg ? "text-blue-600" : "text-primary/70"}`}>
              {isOrg ? "Хуулийн этгээдийн мэдээлэл" : "Иргэний мэдээлэл"}
            </p>
          </div>
        </div>

        {/* ── Individual fields ── */}
        {!isOrg && (
          <Card className="p-5">
            <p className="font-bold text-sm text-foreground mb-4">Иргэний мэдээлэл</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Овог" required>
                  <TextInput value={lastName} onChange={setLastName} placeholder="Батбаяр" />
                </Field>
                <Field label="Нэр" required>
                  <TextInput value={firstName} onChange={setFirstName} placeholder="Болд" />
                </Field>
              </div>
              <Field label="Регистрийн дугаар" required helper="Иргэний үнэмлэхийн дугаар (жишээ: УН12345678)">
                <TextInput
                  value={regNumber}
                  onChange={v => setRegNumber(v.toUpperCase())}
                  placeholder="УН12345678"
                  className="font-mono"
                />
              </Field>
              <Field label="ТТД" required helper="Татвар төлөгчийн дугаар">
                <TextInput
                  value={taxId}
                  onChange={setTaxId}
                  placeholder="0000000000"
                  className="font-mono"
                />
              </Field>
            </div>
          </Card>
        )}

        {/* ── Organization fields ── */}
        {isOrg && (
          <Card className="p-5">
            <p className="font-bold text-sm text-foreground mb-4">Байгуулгын мэдээлэл</p>
            <div className="space-y-4">
              <Field label="Байгуулгын нэр" required>
                <TextInput value={orgName} onChange={setOrgName} placeholder="ХХК / ТББ нэр" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Улсын бүртгэлийн дугаар" required helper="ХЗД-ийн бүртгэлийн дугаар">
                  <TextInput
                    value={orgReg}
                    onChange={setOrgReg}
                    placeholder="1234567"
                    className="font-mono"
                  />
                </Field>
                <Field label="ТТД" required helper="Татвар төлөгчийн дугаар">
                  <TextInput
                    value={orgTaxId}
                    onChange={setOrgTaxId}
                    placeholder="0000000000"
                    className="font-mono"
                  />
                </Field>
              </div>
            </div>
          </Card>
        )}

        {/* ── НӨАТ ── */}
        <Card className="p-5">
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setVatPayer(v => !v)}>
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${vatPayer ? "bg-primary border-primary" : "border-border"}`}>
              {vatPayer && <Check size={10} className="text-white" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">НӨАТ төлөгч мөн</p>
              <p className="text-xs text-muted-foreground mt-0.5">НӨАТ-ын бүртгэлтэй бол сонгоно уу</p>
            </div>
          </div>

          {vatPayer && (
            <div className="mt-4 pt-4 border-t border-border">
              <Field label="НӨАТ бүртгэлийн дугаар" helper="Татварын газрын НӨАТ бүртгэлийн дугаар">
                <TextInput
                  value={vatRegNum}
                  onChange={setVatRegNum}
                  placeholder="0000000000"
                  className="font-mono"
                />
              </Field>
            </div>
          )}
        </Card>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between pb-2">
          <button type="button" onClick={() => navigate("/account")}
            className="h-9 px-4 rounded-xl text-sm font-semibold border border-border bg-card text-foreground/70 hover:bg-muted/40 transition-colors">
            Болих
          </button>
          <button type="button" disabled={!canSave || saveState === "saving"}
            onClick={handleSave}
            className="h-9 px-5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))" }}>
            {saveState === "saving" ? (
              <><span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />Хадгалж байна...</>
            ) : saveState === "saved" ? (
              <><Check size={14} />Хадгалагдлаа</>
            ) : "Хадгалах"}
          </button>
        </div>

      </div>
    </Shell>
  );
}
