import { useState } from "react";
import { useNavigate } from "react-router";
import buteelLogo from "@/imports/Artboard_1.png";
import { FileText, Smartphone } from "lucide-react";
import { Btn } from "@/components/ui/Btn";
import { Card } from "@/components/ui/Card";

export default function VerifyScreen() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(true);
  const [resendSec, setResendSec] = useState(59);

  useState(() => {
    const t = setInterval(() => setResendSec(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(t);
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4" style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, #000) 100%)" }}>
            <img src={buteelLogo} alt="Buteel" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-900">Баталгаажуулах</h1>
          <p className="text-sm text-zinc-500 font-medium mt-1">
            {method === "email" ? "И-мэйл хаяг руу илгээсэн кодыг оруулна уу" : "Утасны дугаар руу илгээсэн кодыг оруулна уу"}
          </p>
        </div>

        <Card className="p-8">
          {/* Method toggle */}
          <div className="flex bg-zinc-100 rounded-xl p-1 mb-6">
            {(["email", "phone"] as const).map(m => (
              <button type="button" key={m} onClick={() => { setMethod(m); setCode(""); setSent(true); setResendSec(59); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all ${method === m ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500"}`}>
                {m === "email" ? <><FileText size={14} />И-мэйл</> : <><Smartphone size={14} />Утас</>}
              </button>
            ))}
          </div>

          {/* Destination hint */}
          <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-3 mb-6 text-sm text-violet-800 font-medium text-center">
            {method === "email" ? "bo**@example.mn" : "+976 ****-0000"}
          </div>

          {/* Code input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-700 mb-2">Баталгаажуулах код</label>
            <input
              type="text" inputMode="numeric" maxLength={6} value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="w-full text-center text-2xl font-bold px-4 py-4 rounded-xl border-2 border-zinc-200 bg-white outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-primary transition placeholder-zinc-200"
            />
          </div>

          <Btn full size="lg" disabled={code.length < 6} onClick={() => navigate("/onboarding/account-type")}>
            Баталгаажуулах
          </Btn>

          <div className="mt-4 text-center">
            {resendSec > 0 ? (
              <p className="text-sm text-zinc-400">Дахин илгээх <span className="font-semibold text-zinc-600">{resendSec}с</span></p>
            ) : (
              <button type="button" onClick={() => setResendSec(59)} className="text-sm font-semibold text-primary hover:text-primary/80">
                Код дахин илгээх
              </button>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
            <button type="button" className="text-sm text-zinc-500 hover:text-zinc-700" onClick={() => navigate("/register")}>
              ← Бүртгэлдээ буцах
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
