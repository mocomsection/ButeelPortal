import { useState, useId } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export function Input({ label, type = "text", placeholder, error, helper, value, onChange, autoComplete, onBlur }: {
  label?: string; type?: string; placeholder?: string; error?: string;
  helper?: string; value?: string; onChange?: (v: string) => void;
  autoComplete?: string; onBlur?: () => void;
}) {
  const [show, setShow] = useState(false);
  const inputId = useId();
  const isPassword = type === "password";
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-foreground leading-relaxed">{label}</label>
      )}
      <div className="relative">
        <input
          id={inputId}
          autoComplete={autoComplete}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={error || helper ? `${inputId}-hint` : undefined}
          type={isPassword && show ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className={`min-w-0 w-full h-11 pl-3.5 ${isPassword ? "pr-11" : "pr-3.5"} text-sm rounded-xl border bg-card text-foreground placeholder-muted-foreground outline-none transition-colors
            focus:ring-2 focus:ring-primary/20 focus:border-primary
            ${error ? "border-destructive bg-destructive/5" : "border-border hover:border-primary/40"}`}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)}
            aria-label={show ? "Нууц үг нуух" : "Нууц үг харуулах"} aria-pressed={show}
            className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary transition-colors">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {helper && !error && <p id={`${inputId}-hint`} className="text-xs text-muted-foreground leading-relaxed">{helper}</p>}
      {error && <p id={`${inputId}-hint`} className="text-xs leading-relaxed text-destructive flex items-start gap-1.5"><AlertCircle size={13} className="mt-0.5 shrink-0" />{error}</p>}
    </div>
  );
}
