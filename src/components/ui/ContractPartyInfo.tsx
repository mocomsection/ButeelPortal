import { Building2, User } from "lucide-react";

export function ContractPartyInfo({ isOrg, name, register, signerName }: { isOrg: boolean; name: string; register: string; signerName: string }) {
  return <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground">{isOrg ? <Building2 size={16} /> : <User size={16} />}</div>
    <div className="min-w-0 flex-1">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{isOrg ? "Байгууллагын нэр" : "Гэрээ байгуулах этгээд"}</p>
      <p className="break-words text-sm font-semibold leading-relaxed text-foreground">{name || "—"}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{isOrg ? "Байгууллагын регистр" : "Регистр"}: <span className="font-medium text-foreground">{register || "—"}</span></p>
      {isOrg && <div className="mt-3 border-t border-border/60 pt-3"><p className="text-xs text-muted-foreground">Байгууллагыг төлөөлж гарын үсэг зурах хэрэглэгч</p><p className="mt-1 break-words text-sm font-medium text-foreground">{signerName || "—"}</p></div>}
    </div>
  </div>;
}
