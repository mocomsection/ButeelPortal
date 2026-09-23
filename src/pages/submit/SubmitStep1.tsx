import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Btn } from "@/components/ui/Btn";
import { CONTENT_TYPES } from "@/data/content";

export default function SubmitStep1() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");

  const colorMeta: Record<string, {
    gradient: string; iconColor: string;
    border: string; activeBg: string;
    badge: string; badgeText: string; chevron: string;
  }> = {
    violet: {
      gradient: "linear-gradient(135deg,color-mix(in srgb, var(--primary) 85%, purple), var(--primary))",
      iconColor: "text-white",
      border: "border-primary",
      activeBg: "bg-violet-50/70",
      badge: "bg-violet-100 text-violet-700",
      badgeText: "Дуу · Цомог",
      chevron: "text-primary",
    },
    blue: {
      gradient: "linear-gradient(135deg,#2563EB,#0EA5E9)",
      iconColor: "text-white",
      border: "border-blue-500",
      activeBg: "bg-blue-50/70",
      badge: "bg-blue-100 text-blue-700",
      badgeText: "Аудио Ном",
      chevron: "text-blue-600",
    },
    amber: {
      gradient: "linear-gradient(135deg,#F59E0B,#EF4444)",
      iconColor: "text-white",
      border: "border-amber-500",
      activeBg: "bg-amber-50/70",
      badge: "bg-amber-100 text-amber-700",
      badgeText: "Кино",
      chevron: "text-amber-600",
    },
  };

  const selectedType = CONTENT_TYPES.find(t => t.id === selected);

  return (
    <Shell title="Шинэ Контент Нэмэх" subtitle="Контентын төрлөө сонгоод тохирох гэрээний дагуу явна уу">
      <div className="max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {CONTENT_TYPES.map(t => {
            const isOn = selected === t.id;
            const m = colorMeta[t.color];
            return (
              <button key={t.id} type="button"
                onClick={() => setSelected(t.id)}
                className={`flex flex-col p-5 rounded-2xl border-2 text-left transition-all h-full ${
                  isOn ? `${m.border} ${m.activeBg}` : "border-zinc-200 hover:border-zinc-300 bg-white"
                }`}>
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 flex-shrink-0"
                  style={{ background: isOn ? m.gradient : "#F4F4F5" }}>
                  <t.icon size={26} className={isOn ? m.iconColor : "text-zinc-400"} />
                </div>

                {/* Category pill */}
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full w-fit mb-3 ${
                  isOn ? m.badge : "bg-zinc-100 text-zinc-500"
                }`}>
                  {m.badgeText}
                </span>

                {/* Title + chevron */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <p className="font-extrabold text-base text-zinc-900 leading-tight">{t.label}</p>
                  <ChevronRight size={16} className={`flex-shrink-0 ${isOn ? m.chevron : "text-zinc-300"}`} />
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-500 leading-relaxed">{t.sub}</p>

                {/* Contract tag */}
                <p className={`text-xs font-semibold mt-3 ${isOn ? "text-zinc-500" : "text-zinc-400"}`}>
                  {t.contractName}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end">
          <Btn disabled={!selected} onClick={() => selectedType && navigate(selectedType.submitPath)}>
            Үргэлжлүүлэх <ChevronRight size={16} />
          </Btn>
        </div>
      </div>
    </Shell>
  );
}

