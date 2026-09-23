export function Toggle({ on, onChange, label, sub }: { on: boolean; onChange: (v: boolean) => void; label: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border cursor-pointer" onClick={() => onChange(!on)}>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      <div className={`relative w-10 h-6 rounded-full transition-colors ${on ? "bg-primary" : "bg-border"}`}>
        <div className={`absolute top-0.5 w-5 h-5 bg-card rounded-full shadow transition-transform ${on ? "left-[18px]" : "left-0.5"}`} />
      </div>
    </div>
  );
}
