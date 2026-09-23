import { ArrowDownToLine, Disc3, BookOpen, Film } from "lucide-react";
import { AVAILABLE_BALANCE, LIFETIME_TOTAL, fmtMoney } from "./revenueUtils";

interface RevenueSummaryCardProps {
  revenueContentType: "music" | "audiobook" | "film";
  setRevenueContentType: (v: "music" | "audiobook" | "film") => void;
  onWithdrawClick: () => void;
}

export function RevenueSummaryCard({ revenueContentType, setRevenueContentType, onWithdrawClick }: RevenueSummaryCardProps) {
  return (
    <>
      {/* Financial summary banner */}
      <div className="rounded-2xl p-6 relative overflow-hidden bg-[#0f0825]"
        style={{ background: "linear-gradient(135deg,#0f0825 0%,#2d1060 55%,var(--primary) 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(ellipse at 80% 10%, rgba(167,139,250,0.25) 0%, transparent 50%), radial-gradient(ellipse at 10% 90%, rgba(109,77,246,0.15) 0%, transparent 50%)" }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
              <p className="text-white/55 text-xs font-bold uppercase">Нийт орлого</p>
            </div>
            <p className="text-4xl font-extrabold text-white">{fmtMoney(LIFETIME_TOTAL)}</p>
            <p className="text-white/40 text-xs mt-1.5">Баталгаажсан нийт хугацааны орлого</p>
          </div>
          <div className="sm:border-l sm:border-white/10 sm:pl-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
              <p className="text-white/55 text-xs font-bold uppercase">Боломжтой үлдэгдэл</p>
            </div>
            <p className="text-2xl font-extrabold text-white">{fmtMoney(AVAILABLE_BALANCE)}</p>
            <p className="text-white/40 text-xs mt-1.5">Хамгийн бага татах дүн ₮100,000.00</p>
          </div>
          <div className="sm:ml-2 flex-shrink-0">
            <button type="button" onClick={onWithdrawClick}
              className="flex items-center gap-2 bg-white text-primary font-bold text-sm px-5 h-10 rounded-xl hover:bg-secondary transition-colors shadow-lg shadow-black/20">
              <ArrowDownToLine size={15} />Орлого татах
            </button>
          </div>
        </div>
      </div>

      {/* Content type segmented control */}
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl w-fit">
        {([
          { id: "music",     label: "Цомог / Дуу", icon: Disc3 },
          { id: "audiobook", label: "Аудио ном",   icon: BookOpen },
          { id: "film",      label: "Кино",         icon: Film },
        ] as const).map(ct => (
          <button key={ct.id} type="button"
            onClick={() => setRevenueContentType(ct.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-semibold transition-all ${revenueContentType === ct.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <ct.icon size={14} />{ct.label}
          </button>
        ))}
      </div>
    </>
  );
}
