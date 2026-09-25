import { useState, useRef, useEffect } from "react";
import {
  Camera, Check, Mail, Phone, User, AlertCircle, CheckCircle2,
  Shield, Lock, Monitor, Smartphone, Pencil, X, RefreshCw, KeyRound,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { PasswordModal } from "@/components/ui/PasswordModal";

const ORIGINAL_EMAIL = "bold@example.com";
const ORIGINAL_PHONE = "+976 9900 1122";
const DEMO_OTP = "123456";

// ── Verification modal ────────────────────────────────────────────────────────
type VerifyFor = "email" | "phone";

function VerifyModal({
  target,
  value,
  onSuccess,
  onClose,
}: {
  target: VerifyFor;
  value: string;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resent, setResent] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const setRef = (i: number) => (el: HTMLInputElement | null) => { inputRefs.current[i] = el; };
  const focusAt = (i: number) => inputRefs.current[i]?.focus();

  useEffect(() => { focusAt(0); }, []);

  useEffect(() => {
    if (timer === 0) return;
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const handleDigit = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    setError(false);
    if (val && i < 5) focusAt(i + 1);
  };

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) focusAt(i - 1);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setDigits(text.split(""));
      focusAt(5);
    }
  };

  const code = digits.join("");
  const handleSubmit = () => {
    if (code === DEMO_OTP) {
      onSuccess();
    } else {
      setError(true);
      setDigits(["", "", "", "", "", ""]);
      focusAt(0);
    }
  };

  const handleResend = () => {
    setTimer(60);
    setResent(true);
    setDigits(["", "", "", "", "", ""]);
    setError(false);
    setTimeout(() => setResent(false), 3000);
  };

  const label = target === "email" ? "И-мэйл" : "Утас";
  const hint  = target === "email"
    ? `${value} хаяг руу 6 оронтой код илгээлээ`
    : `${value} дугаарт OTP код илгээлээ`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl border border-border max-w-sm w-full p-6"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <KeyRound size={20} className="text-primary" />
          </div>
          <button type="button" onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors">
            <X size={15} />
          </button>
        </div>
        <h3 className="text-base font-extrabold text-zinc-900 mb-1">{label} баталгаажуулах</h3>
        <p className="text-sm text-zinc-500 mb-5">{hint}. 5 минутын дотор оруулна уу.</p>

        <div className="flex gap-2 justify-center mb-4" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={setRef(i)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKey(i, e)}
              className={`w-10 h-12 text-center text-lg font-extrabold rounded-xl border-2 outline-none transition-colors ${
                error
                  ? "border-red-400 bg-red-50 text-red-600"
                  : d
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border focus:border-primary"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-500 text-center flex items-center justify-center gap-1 mb-3">
            <AlertCircle size={11} />Код буруу байна. Дахин оруулна уу.
          </p>
        )}
        {resent && (
          <p className="text-xs text-green-600 text-center flex items-center justify-center gap-1 mb-3">
            <CheckCircle2 size={11} />Код дахин илгээгдлээ.
          </p>
        )}

        <button type="button"
          disabled={code.length < 6}
          onClick={handleSubmit}
          className="w-full h-10 rounded-xl text-sm font-bold text-white mb-3 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))" }}>
          Баталгаажуулах
        </button>

        <div className="text-center">
          {timer > 0 ? (
            <p className="text-xs text-zinc-400">
              Дахин илгээх <span className="font-bold text-zinc-600">0:{String(timer).padStart(2, "0")}</span>
            </p>
          ) : (
            <button type="button" onClick={handleResend}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 mx-auto">
              <RefreshCw size={10} />Дахин илгээх
            </button>
          )}
        </div>

        <p className="text-[11px] text-zinc-400 text-center mt-3">
          Туршилтын код: <span className="font-bold">{DEMO_OTP}</span>
        </p>
      </div>
    </div>
  );
}

// ── Verified badge ────────────────────────────────────────────────────────────
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

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setAvatarUrl(URL.createObjectURL(f));
  };

  // ── saved values (source of truth) ─────────────────────────────────────────
  const [savedLastName,  setSavedLastName]  = useState("Жаргал");
  const [savedFirstName, setSavedFirstName] = useState("Болд");
  const [savedEmail,     setSavedEmail]     = useState(ORIGINAL_EMAIL);
  const [savedPhone,     setSavedPhone]     = useState(ORIGINAL_PHONE);

  // ── draft values (while editing) ───────────────────────────────────────────
  const [editing,    setEditing]    = useState(false);
  const [lastName,   setLastName]   = useState(savedLastName);
  const [firstName,  setFirstName]  = useState(savedFirstName);
  const [email,      setEmail]      = useState(savedEmail);
  const [phone,      setPhone]      = useState(savedPhone);

  const enterEdit = () => {
    setLastName(savedLastName);
    setFirstName(savedFirstName);
    setEmail(savedEmail);
    setPhone(savedPhone);
    setEditing(true);
  };
  const cancelEdit = () => setEditing(false);

  // ── verification state ──────────────────────────────────────────────────────
  const [verifyFor, setVerifyFor] = useState<VerifyFor | null>(null);
  const emailChanged = email.trim() !== savedEmail;
  const phoneChanged = phone.trim() !== savedPhone;

  // ── save flow ───────────────────────────────────────────────────────────────
  const emailValid  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSave     = !!lastName.trim() && !!firstName.trim() && emailValid && !!phone.trim();

  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const doCommit = () => {
    setSaving(true);
    setTimeout(() => {
      setSavedLastName(lastName);
      setSavedFirstName(firstName);
      setSavedEmail(email);
      setSavedPhone(phone);
      setSaving(false);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2500);
    }, 600);
  };

  const handleSave = () => {
    if (!canSave) return;
    if (emailChanged) { setVerifyFor("email"); return; }
    if (phoneChanged) { setVerifyFor("phone"); return; }
    doCommit();
  };

  const handleVerifySuccess = () => {
    setVerifyFor(null);
    // If email was verified and phone also changed, next verify phone
    if (verifyFor === "email" && phoneChanged) {
      setVerifyFor("phone");
    } else {
      doCommit();
    }
  };

  const initials = [savedFirstName[0], savedLastName[0]].filter(Boolean).join("").toUpperCase();

  const LAST_SESSIONS = [
    { icon: Monitor,    device: "Chrome · Windows",   location: "Улаанбаатар, Монгол", time: "Одоо",             current: true  },
    { icon: Smartphone, device: "Safari · iPhone",    location: "Улаанбаатар, Монгол", time: "2 цагийн өмнө",    current: false },
    { icon: Monitor,    device: "Chrome · MacOS",     location: "Улаанбаатар, Монгол", time: "2026-09-20 09:12", current: false },
  ];

  const [showPassModal, setShowPassModal] = useState(false);

  return (
    <Shell title="Профайл" subtitle="Хувийн мэдээлэл тохиргоо">
      {showPassModal && <PasswordModal onClose={() => setShowPassModal(false)} />}
      {verifyFor && (
        <VerifyModal
          target={verifyFor}
          value={verifyFor === "email" ? email : phone}
          onSuccess={handleVerifySuccess}
          onClose={() => setVerifyFor(null)}
        />
      )}

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
              <button type="button" onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-white border-2 border-white shadow flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary transition-colors">
                <Camera size={11} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-foreground text-sm leading-tight">
                {[savedFirstName, savedLastName].filter(Boolean).join(" ") || "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{savedEmail}</p>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="mt-2 text-xs font-semibold text-muted-foreground border border-dashed border-border px-2.5 py-1 rounded-lg hover:border-primary/50 hover:text-primary transition-colors">
                Зураг солих
              </button>
            </div>
          </div>
        </Card>

        {/* ── Personal info ── */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-sm text-foreground">Хувийн мэдээлэл</p>
            {!editing && (
              <button type="button" onClick={enterEdit}
                className="flex items-center gap-1.5 text-xs font-bold text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-xl transition-colors">
                <Pencil size={11} />Засах
              </button>
            )}
          </div>

          {/* READ MODE */}
          {!editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Овог" value={savedLastName} />
                <Field label="Нэр"  value={savedFirstName} />
              </div>
              <Field label="И-мэйл" value={savedEmail}
                badge={<VerifiedBadge verified={savedEmail === ORIGINAL_EMAIL} />} />
              <Field label="Утасны дугаар" value={savedPhone}
                badge={<VerifiedBadge verified={savedPhone === ORIGINAL_PHONE} />} />
            </div>
          )}

          {/* EDIT MODE */}
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <EditField
                  label="Овог" required value={lastName}
                  onChange={setLastName} placeholder="Батбаяр"
                  error={!lastName.trim() ? "Шаардлагатай" : undefined}
                />
                <EditField
                  label="Нэр" required value={firstName}
                  onChange={setFirstName} placeholder="Болд"
                  error={!firstName.trim() ? "Шаардлагатай" : undefined}
                />
              </div>

              {/* Email */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase">
                    И-мэйл <span className="text-red-500">*</span>
                  </label>
                  {!emailChanged && <VerifiedBadge verified={savedEmail === ORIGINAL_EMAIL} />}
                </div>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input type="email" value={email} onChange={e => { setEmail(e.target.value); }}
                    placeholder="name@example.com"
                    className={`w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border outline-none focus:ring-2 transition-colors bg-background ${
                      !emailValid ? "border-red-300 focus:ring-red-400/20 focus:border-red-400"
                      : emailChanged ? "border-amber-300 focus:ring-amber-400/20 focus:border-amber-400"
                      : "border-border focus:ring-primary/20 focus:border-primary"
                    }`}
                  />
                </div>
                {!emailValid && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />Зөв и-мэйл хаяг оруулна уу</p>}
                {emailValid && emailChanged && (
                  <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                    <AlertCircle size={12} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 flex-1">И-мэйл өөрчлөгдсөн тул хадгалах үед баталгаажуулах код илгээгдэнэ.</p>
                    <button type="button" onClick={() => setEmail(savedEmail)}
                      className="text-xs text-amber-600 hover:underline flex-shrink-0 flex items-center gap-1 font-semibold">
                      <X size={10} />Буцаах
                    </button>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase">
                    Утасны дугаар <span className="text-red-500">*</span>
                  </label>
                  {!phoneChanged && <VerifiedBadge verified={savedPhone === ORIGINAL_PHONE} />}
                </div>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+976 9900 0000"
                    className={`w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border outline-none focus:ring-2 transition-colors bg-background ${
                      !phone.trim() ? "border-red-300 focus:ring-red-400/20 focus:border-red-400"
                      : phoneChanged ? "border-amber-300 focus:ring-amber-400/20 focus:border-amber-400"
                      : "border-border focus:ring-primary/20 focus:border-primary"
                    }`}
                  />
                </div>
                {!phone.trim() && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />Утасны дугаар шаардлагатай</p>}
                {phone.trim() && phoneChanged && (
                  <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                    <AlertCircle size={12} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 flex-1">Утасны дугаар өөрчлөгдсөн тул хадгалах үед OTP код илгээгдэнэ.</p>
                    <button type="button" onClick={() => setPhone(savedPhone)}
                      className="text-xs text-amber-600 hover:underline flex-shrink-0 flex items-center gap-1 font-semibold">
                      <X size={10} />Буцаах
                    </button>
                  </div>
                )}
              </div>

              {/* Edit action row */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button type="button" onClick={cancelEdit}
                  className="h-9 px-4 rounded-xl text-sm font-semibold border border-border text-foreground/70 hover:bg-muted/40 transition-colors">
                  Цуцлах
                </button>
                <button type="button"
                  disabled={!canSave || saving}
                  onClick={handleSave}
                  className="h-9 px-5 rounded-xl text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))" }}>
                  {saving
                    ? <><span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />Хадгалж байна...</>
                    : (emailChanged || phoneChanged) ? "Хадгалах ба баталгаажуулах" : "Хадгалах"}
                </button>
              </div>
            </div>
          )}

          {saved && (
            <div className="mt-3 flex items-center gap-1.5 text-green-600 text-xs font-semibold">
              <CheckCircle2 size={13} />Мэдээлэл амжилттай хадгалагдлаа
            </div>
          )}
        </Card>

        {/* ── Security ── */}
        <Card className="p-5">
          <p className="font-bold text-sm text-foreground mb-4">Аюулгүй байдал</p>
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
                        {s.current && <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-md">Энэ төхөөрөмж</span>}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{s.location} · {s.time}</p>
                    </div>
                    {!s.current && (
                      <button type="button" className="text-xs text-destructive hover:underline flex-shrink-0 font-semibold">Гарах</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

      </div>
    </Shell>
  );
}

// ── helper components ─────────────────────────────────────────────────────────
function Field({ label, value, badge }: { label: string; value: string; badge?: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <p className="text-[10px] font-bold text-zinc-400 uppercase">{label}</p>
        {badge}
      </div>
      <p className="text-sm font-semibold text-foreground">{value || "—"}</p>
    </div>
  );
}

function EditField({
  label, required, value, onChange, placeholder, error,
}: {
  label: string; required?: boolean; value: string;
  onChange: (v: string) => void; placeholder?: string; error?: string;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-zinc-500 uppercase block mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none focus:ring-2 transition-colors bg-background ${
          error ? "border-red-300 focus:ring-red-400/20 focus:border-red-400" : "border-border focus:ring-primary/20 focus:border-primary"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{error}</p>}
    </div>
  );
}
