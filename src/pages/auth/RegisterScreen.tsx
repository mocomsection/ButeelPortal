import { useState } from "react";
import { useNavigate } from "react-router";
import buteelLogo from "@/imports/Artboard_1.png";
import { Mail, Smartphone } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Btn } from "@/components/ui/Btn";
import { Card } from "@/components/ui/Card";
import { patchAccountState } from "@/data/ob-state";
import { validateRegistration } from "@/data/registration-validation";

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [lastName,  setLastName]  = useState("");
  const [firstName, setFirstName] = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [pass,      setPass]      = useState("");
  const [pass2,     setPass2]     = useState("");
  const [agreed,    setAgreed]    = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<"email" | "phone">("email");
  const [submitted, setSubmitted] = useState(false);
  const errors = validateRegistration({ lastName, firstName, email, phone, password: pass, confirmation: pass2, agreed });
  const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) {
      const form = event.currentTarget;
      requestAnimationFrame(() => form.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    patchAccountState({ firstName: firstName.trim(), lastName: lastName.trim() });
    sessionStorage.setItem("buteel_verification", JSON.stringify({ method: verificationMethod, destination: verificationMethod === "email" ? email.trim() : phone.trim() }));
    navigate("/verify");
  };


  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-4 py-10 sm:py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4" style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, #000) 100%)" }}>
            <img src={buteelLogo} alt="Buteel" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-900">Бүртгүүлэх</h1>
          <p className="text-sm text-zinc-500 font-medium mt-1">Хэрэглэгчийн мэдээллээ оруулна уу</p>
        </div>
        <Card className="p-5 sm:p-8">
          <form noValidate onSubmit={handleRegister}>
          <div className="space-y-4 mb-5">
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3">
              <Input label="Овог" placeholder="Батбаяр" value={lastName} onChange={setLastName} autoComplete="family-name" error={submitted ? errors.lastName : undefined} />
              <Input label="Нэр" placeholder="Болд" value={firstName} onChange={setFirstName} autoComplete="given-name" error={submitted ? errors.firstName : undefined} />
            </div>
            <Input label="И-мэйл" type="email" placeholder="name@example.com" value={email} onChange={setEmail} autoComplete="email" error={submitted ? errors.email : undefined} />
            <Input label="Утасны дугаар" type="tel" placeholder="+976 9900 0000" value={phone} onChange={setPhone} autoComplete="tel" error={submitted ? errors.phone : undefined} />
            <fieldset><legend className="mb-2 text-sm font-medium text-foreground">Баталгаажуулах код хаашаа илгээх вэ?</legend>
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
                {(["email", "phone"] as const).map(method => <button key={method} type="button" aria-pressed={verificationMethod === method} onClick={() => setVerificationMethod(method)} className={"flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm transition-colors " + (verificationMethod === method ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground")}>
                  {method === "email" ? <Mail size={16} /> : <Smartphone size={16} />}{method === "email" ? "И-мэйл" : "Утас"}
                </button>)}
              </div><p className="mt-2 text-xs text-muted-foreground">{verificationMethod === "email" ? "Баталгаажуулах код и-мэйлээр ирнэ." : "Баталгаажуулах код SMS-ээр ирнэ."}</p>
            </fieldset>
            <Input label="Нууц үг" type="password" placeholder="••••••••" helper="8+ тэмдэгт, тоо, үсэг агуулах" value={pass} onChange={setPass} autoComplete="new-password" error={submitted ? errors.password : undefined} />
            <Input label="Нууц үг давтах" type="password" placeholder="••••••••"
              value={pass2} onChange={setPass2} autoComplete="new-password" error={submitted ? errors.confirmation : undefined} />
          </div>

          {/* Terms row */}
          <div className="flex items-center gap-3 mb-3">
            <input id="register-terms" type="checkbox" checked={agreed} onChange={event => setAgreed(event.target.checked)} aria-invalid={submitted && !!errors.agreed} aria-describedby={submitted && errors.agreed ? "register-terms-error" : undefined} className="h-5 w-5 shrink-0 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
            <span className="text-sm leading-relaxed text-muted-foreground">
              <button type="button" className="text-primary hover:underline font-medium" onClick={() => navigate("/terms")}>Үйлчилгээний нөхцөл</button><label htmlFor="register-terms" className="cursor-pointer">-тэй танилцаж зөвшөөрч байна</label>
            </span>
          </div>

          {submitted && errors.agreed && <p id="register-terms-error" className="mb-3 text-xs leading-relaxed text-destructive">{errors.agreed}</p>}
          <div className="mt-5"><Btn full size="lg" type="submit">Бүртгүүлэх</Btn></div>

          <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
            <span className="text-sm text-zinc-500">Аккаунт байна уу? </span>
            <button type="button" className="text-sm font-semibold text-primary hover:text-primary/80" onClick={() => navigate("/login")}>Нэвтрэх</button>
          </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
