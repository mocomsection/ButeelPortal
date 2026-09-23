import { useState } from "react";
import { Shield, X, Eye, EyeOff, Check, AlertCircle, CheckCircle2 } from "lucide-react";

export function PasswordModal({ onClose }: { onClose: () => void }) {
  const [curPass,  setCurPass]  = useState("");
  const [newPass,  setNewPass]  = useState("");
  const [newPass2, setNewPass2] = useState("");
  const [showCur,  setShowCur]  = useState(false);
  const [showNew,  setShowNew]  = useState(false);
  const [showNew2, setShowNew2] = useState(false);
  const [saved,    setSaved]    = useState(false);

  const passWeak     = newPass.length > 0 && newPass.length < 8;
  const passMismatch = newPass2.length > 0 && newPass !== newPass2;
  const canSave      = !!curPass && newPass.length >= 8 && !passMismatch;

  const handleSave = () => {
    if (!canSave) return;
    setSaved(true);
    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl border border-border max-w-sm w-full p-6"
        onClick={e => e.stopPropagation()}>
        {saved ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={22} className="text-green-600" />
            </div>
            <p className="font-bold text-zinc-900 text-sm">Нууц үг амжилттай солигдлоо</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                  <Shield size={15} className="text-primary" />
                </div>
                <p className="font-bold text-zinc-900 text-sm">Нууц үг солих</p>
              </div>
              <button type="button" onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors">
                <X size={14} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase block mb-1.5">Одоогийн нууц үг</label>
                <div className="relative">
                  <input
                    type={showCur ? "text" : "password"}
                    value={curPass}
                    onChange={e => setCurPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 pr-10 py-2.5 text-sm rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-background"
                  />
                  <button type="button" onClick={() => setShowCur(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showCur ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase block mb-1.5">Шинэ нууц үг</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-3.5 pr-10 py-2.5 text-sm rounded-xl border outline-none focus:ring-2 transition-colors bg-background ${
                      passWeak ? "border-red-300 focus:ring-red-400/20 focus:border-red-400" : "border-border focus:ring-primary/20 focus:border-primary"
                    }`}
                  />
                  <button type="button" onClick={() => setShowNew(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {passWeak && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />8+ тэмдэгт оруулна уу</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase block mb-1.5">Нууц үг давтах</label>
                <div className="relative">
                  <input
                    type={showNew2 ? "text" : "password"}
                    value={newPass2}
                    onChange={e => setNewPass2(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-3.5 pr-10 py-2.5 text-sm rounded-xl border outline-none focus:ring-2 transition-colors bg-background ${
                      passMismatch ? "border-red-300 focus:ring-red-400/20 focus:border-red-400" : "border-border focus:ring-primary/20 focus:border-primary"
                    }`}
                  />
                  <button type="button" onClick={() => setShowNew2(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showNew2 ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {passMismatch && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />Нууц үг таарахгүй байна</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors">
                Болих
              </button>
              <button type="button" disabled={!canSave} onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))" }}>
                <Check size={13} />Хадгалах
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
