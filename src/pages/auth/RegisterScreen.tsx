import { useState } from "react";
import { useNavigate } from "react-router";
import buteelLogo from "@/imports/Artboard_1.png";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Btn } from "@/components/ui/Btn";
import { Card } from "@/components/ui/Card";

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [lastName,  setLastName]  = useState("");
  const [firstName, setFirstName] = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [pass,      setPass]      = useState("");
  const [pass2,     setPass2]     = useState("");
  const [agreed,    setAgreed]    = useState(false);

  const canSubmit = agreed;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4" style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, #000) 100%)" }}>
            <img src={buteelLogo} alt="Buteel" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-900">Бүртгүүлэх</h1>
          <p className="text-sm text-zinc-500 font-medium mt-1">Хэрэглэгчийн мэдээллээ оруулна уу</p>
        </div>
        <Card className="p-8">
          <div className="space-y-4 mb-5">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Овог" placeholder="Батбаяр" value={lastName}  onChange={setLastName} />
              <Input label="Нэр"  placeholder="Болд"     value={firstName} onChange={setFirstName} />
            </div>
            <Input label="И-мэйл"         type="email"    placeholder="name@example.com" value={email} onChange={setEmail} />
            <Input label="Утасны дугаар"  placeholder="+976 9900 0000"                   value={phone} onChange={setPhone} />
            <Input label="Нууц үг"        type="password" placeholder="••••••••" helper="8+ тэмдэгт, тоо, үсэг агуулах" value={pass}  onChange={setPass} />
            <Input label="Нууц үг давтах" type="password" placeholder="••••••••"
              error={pass2 && pass !== pass2 ? "Нууц үг таарахгүй байна" : undefined}
              value={pass2} onChange={setPass2} />
          </div>

          {/* Terms row */}
          <div className="flex items-start gap-3 cursor-pointer mb-5 select-none" onClick={() => setAgreed(a => !a)}>
            <div className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center border-2 transition-all flex-shrink-0 ${agreed ? "bg-primary border-primary" : "border-zinc-300"}`}>
              {agreed && <Check size={12} className="text-white" />}
            </div>
            <span className="text-sm text-zinc-600" onClick={e => e.stopPropagation()}>
              <button type="button" className="text-primary hover:underline font-medium" onClick={e => { e.preventDefault(); navigate("/terms"); }}>Үйлчилгээний нөхцөл</button>-тэй танилцаж зөвшөөрч байна
            </span>
          </div>

          <Btn full size="lg" disabled={!canSubmit} onClick={() => navigate("/verify")}>Бүртгүүлэх</Btn>

          <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
            <span className="text-sm text-zinc-500">Аккаунт байна уу? </span>
            <button type="button" className="text-sm font-semibold text-primary hover:text-primary/80" onClick={() => navigate("/login")}>Нэвтрэх</button>
          </div>
        </Card>
      </div>
    </div>
  );
}
