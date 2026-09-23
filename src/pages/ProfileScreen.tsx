import { useState, useRef } from "react";
import { Camera, Check, Mail, Phone, User, AlertCircle, CheckCircle2, RefreshCw, Shield, Lock, Monitor, Smartphone } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { PasswordModal } from "@/components/ui/PasswordModal";

type SaveState = "idle" | "saving" | "saved";

const ORIGINAL_EMAIL = "bold@example.com";
const ORIGINAL_PHONE = "+976 9900 1122";

function VerifiedBadge({ verified }: { verified: boolean }) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-md">
        <CheckCircle2 size={9} />Баталгаажсан
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
      <AlertCircle size={9} />Баталгаажаагүй
    </span>
  );
}

export default function ProfileScreen() {
  // ── avatar ────────────────────────────────────────────────────────────────
  const [avatarUrl, setAvatarUrl]   = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setAvatarUrl(URL.createObjectURL(f));
  };

  // ── form ──────────────────────────────────────────────────────────────────
  const [lastName,  setLastName]  = useState("Жаргал");
  const [firstName, setFirstName] = useState("Болд");
  const [email,     setEmail]     = useState(ORIGINAL_EMAIL);
  const [phone,     setPhone]     = useState(ORIGINAL_PHONE);

  // ── verification state: verified by default (set during registration) ─────
  const emailVerified = email.trim() === ORIGINAL_EMAIL;
  const phoneVerified = phone.trim() === ORIGINAL_PHONE;

  // ── password modal ────────────────────────────────────────────────────────
  const [showPassModal, setShowPassModal] = useState(false);

  // ── save ──────────────────────────────────────────────────────────────────
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const emailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSave    = !!lastName.trim() && !!firstName.trim() && !!email.trim() && emailValid && !!phone.trim();

  const handleSave = () => {
    if (!canSave) return;
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);
    }, 800);
  };

  const handleReset = () => {
    setLastName("Жаргал"); setFirstName("Болд");
    setEmail(ORIGINAL_EMAIL); setPhone(ORIGINAL_PHONE);
  };

  const initials = [firstName[0], lastName[0]].filter(Boolean).join("").toUpperCase();

  const LAST_SESSIONS = [
    { icon: Monitor,    device: "Chrome · Windows",   location: "Улаанбаатар, Монгол",   time: "Одоо",             current: true  },
    { icon: Smartphone, device: "Safari · iPhone",    location: "Улаанбаатар, Монгол",   time: "2 цагийн өмнө",    current: false },
    { icon: Monitor,    device: "Chrome · MacOS",     location: "Улаанбаатар, Монгол",   time: "2026-09-20 09:12", current: false },
  ];

  return (
    <Shell title="Профайл засах" subtitle="Хувийн мэдээлэл тохиргоо">
      {showPassModal && <PasswordModal onClose={() => setShowPassModal(false)} />}
      <div className="max-w-xl space-y-5">

        {/* ── Avatar ── */}
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <div
                className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center text-white font-extrabold text-lg shadow"
                style={{
                  background: avatarUrl
                    ? undefined
                    : "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 72%, #000))",
                }}>
                {avatarUrl
                  ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  : initials || <User size={22} />}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-white border-2 border-white shadow flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary transition-colors">
                <Camera size={11} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            <div className="min-w-0">
              <p className="font-extrabold text-foreground text-sm leading-tight">
                {[firstName, lastName].filter(Boolean).join(" ") || "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-2 text-xs font-semibold text-muted-foreground border border-dashed border-border px-2.5 py-1 rounded-lg hover:border-primary/50 hover:text-primary transition-colors">
                Зураг солих
              </button>
            </div>
          </div>
        </Card>

        {/* ── Personal info ── */}
        <Card className="p-5">
          <p className="font-bold text-sm text-foreground mb-4">Хувийн мэдээлэл</p>
          <div className="space-y-4">

            {/* Овог + Нэр */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase block mb-1.5">
                  Овог <span className="text-red-500">*</span>
                </label>
                <input
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Батбаяр"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none focus:ring-2 transition-colors bg-background ${
                    !lastName.trim() ? "border-red-300 focus:ring-red-400/20 focus:border-red-400" : "border-border focus:ring-primary/20 focus:border-primary"
                  }`}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase block mb-1.5">
                  Нэр <span className="text-red-500">*</span>
                </label>
                <input
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Болд"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none focus:ring-2 transition-colors bg-background ${
                    !firstName.trim() ? "border-red-300 focus:ring-red-400/20 focus:border-red-400" : "border-border focus:ring-primary/20 focus:border-primary"
                  }`}
                />
              </div>
            </div>

            {/* И-мэйл */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase">
                  И-мэйл <span className="text-red-500">*</span>
                </label>
                <VerifiedBadge verified={emailVerified} />
              </div>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border outline-none focus:ring-2 transition-colors bg-background ${
                    !emailValid ? "border-red-300 focus:ring-red-400/20 focus:border-red-400" : !emailVerified ? "border-amber-300 focus:ring-amber-400/20 focus:border-amber-400" : "border-border focus:ring-primary/20 focus:border-primary"
                  }`}
                />
              </div>
              {!emailValid && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={10} />Зөв и-мэйл хаяг оруулна уу
                </p>
              )}
              {emailValid && !emailVerified && (
                <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  <AlertCircle size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-amber-700 font-semibold">Дахин баталгаажуулалт шаардлагатай</p>
                    <p className="text-xs text-amber-600 mt-0.5">И-мэйл хаяг өөрчлөгдсөн тул хадгалсны дараа баталгаажуулах код илгээгдэнэ.</p>
                  </div>
                  <button type="button" onClick={() => setEmail(ORIGINAL_EMAIL)}
                    className="text-xs text-amber-600 hover:underline flex-shrink-0 flex items-center gap-1 font-semibold">
                    <RefreshCw size={10} />Буцаах
                  </button>
                </div>
              )}
            </div>

            {/* Утас */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase">
                  Утасны дугаар <span className="text-red-500">*</span>
                </label>
                <VerifiedBadge verified={phoneVerified} />
              </div>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+976 9900 0000"
                  className={`w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border outline-none focus:ring-2 transition-colors bg-background ${
                    !phone.trim() ? "border-red-300 focus:ring-red-400/20 focus:border-red-400" : !phoneVerified ? "border-amber-300 focus:ring-amber-400/20 focus:border-amber-400" : "border-border focus:ring-primary/20 focus:border-primary"
                  }`}
                />
              </div>
              {!phone.trim() && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={10} />Утасны дугаар шаардлагатай
                </p>
              )}
              {phone.trim() && !phoneVerified && (
                <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  <AlertCircle size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-amber-700 font-semibold">Дахин баталгаажуулалт шаардлагатай</p>
                    <p className="text-xs text-amber-600 mt-0.5">Утасны дугаар өөрчлөгдсөн тул хадгалсны дараа OTP код илгээгдэнэ.</p>
                  </div>
                  <button type="button" onClick={() => setPhone(ORIGINAL_PHONE)}
                    className="text-xs text-amber-600 hover:underline flex-shrink-0 flex items-center gap-1 font-semibold">
                    <RefreshCw size={10} />Буцаах
                  </button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* ── Security ── */}
        <Card className="p-5">
          <p className="font-bold text-sm text-foreground mb-4">Аюулгүй байдал</p>

          {/* Password row */}
          <div className="flex items-center justify-between py-3 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Lock size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Нууц үг</p>
                <p className="text-xs text-muted-foreground mt-0.5">Сүүлд солисон: 2026-06-15</p>
              </div>
            </div>
            <button type="button" onClick={() => setShowPassModal(true)}
              className="text-xs font-bold text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5">
              <Shield size={11} />Солих
            </button>
          </div>

          {/* Active sessions */}
          <div className="mt-4">
            <p className="text-xs font-bold text-zinc-500 uppercase mb-3">Идэвхтэй сессүүд</p>
            <div className="space-y-2">
              {LAST_SESSIONS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-colors ${s.current ? "bg-green-50/60 border-green-200" : "bg-muted/30 border-border/60"}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${s.current ? "bg-green-100" : "bg-muted"}`}>
                      <Icon size={13} className={s.current ? "text-green-700" : "text-muted-foreground"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-semibold text-foreground">{s.device}</p>
                        {s.current && (
                          <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-md">Энэ төхөөрөмж</span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{s.location} · {s.time}</p>
                    </div>
                    {!s.current && (
                      <button type="button" className="text-xs text-destructive hover:underline flex-shrink-0 font-semibold">
                        Гарах
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* ── Save bar ── */}
        <div className="flex items-center justify-between py-1">
          <p className="text-xs">
            {saveState === "saved" && (
              <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                <Check size={13} />Хадгалагдлаа
              </span>
            )}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="h-9 px-4 rounded-xl text-sm font-semibold border border-border bg-card text-foreground/70 hover:bg-muted/40 transition-colors">
              Буцаах
            </button>
            <button
              type="button"
              disabled={!canSave || saveState === "saving"}
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

      </div>
    </Shell>
  );
}
