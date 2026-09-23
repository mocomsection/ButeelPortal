import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export function Input({ label, type = "text", placeholder, error, helper, value, onChange }: {
  label?: string; type?: string; placeholder?: string; error?: string;
  helper?: string; value?: string; onChange?: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold text-foreground leading-none mb-1.5">{label}</label>
      )}
      <div className="relative">
        <input
          type={isPassword && show ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className={`w-full h-10 px-3.5 text-sm rounded-xl border bg-card text-foreground placeholder-muted-foreground outline-none transition-all
            focus:ring-2 focus:ring-primary/20 focus:border-primary
            ${error ? "border-destructive bg-destructive/5" : "border-border hover:border-primary/40"}`}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {helper && !error && <p className="text-xs text-muted-foreground leading-relaxed">{helper}</p>}
      {error && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  );
}
