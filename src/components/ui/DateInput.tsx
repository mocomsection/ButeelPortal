import { useState, useEffect } from "react";
import * as Popover from "@radix-ui/react-popover";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS_MN = ["1 сар","2 сар","3 сар","4 сар","5 сар","6 сар","7 сар","8 сар","9 сар","10 сар","11 сар","12 сар"];
const DAYS_MN   = ["Да","Мя","Лх","Пү","Ба","Бя","Ня"];

function parseDate(val: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return null;
  const d = new Date(val + "T00:00:00");
  return isNaN(d.getTime()) || toYMD(d) !== val ? null : d;
}

function fmt(val: string): string {
  const d = parseDate(val);
  if (!d) return "";
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function toYMD(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

interface DateInputProps {
  value: string;
  onChange: (v: string) => void;
  min?: string;
  max?: string;
  placeholder?: string;
  className?: string;
}

export function DateInput({ value, onChange, min, max, placeholder = "Огноо сонгох", className = "" }: DateInputProps) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const initial = parseDate(value) ?? today;
  const [viewYear,  setViewYear]  = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  useEffect(() => {
    const d = parseDate(value);
    if (d) { setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }
  }, [value]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Build calendar grid (Mon-start)
  const firstDay = new Date(viewYear, viewMonth, 1);
  // shift: Mon=0 … Sun=6
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isDisabled = (day: number) => {
    const ymd = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    if (min && ymd < min) return true;
    if (max && ymd > max) return true;
    return false;
  };

  const isSelected = (day: number) => {
    return value === `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  };

  const isToday = (day: number) => {
    return toYMD(today) === `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  };

  const select = (day: number) => {
    const ymd = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    onChange(ymd);
    setOpen(false);
  };

  const displayVal = value ? fmt(value) : "";

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
    <div className={`relative ${className}`}>
      <Popover.Trigger asChild>
      <button type="button" aria-label={placeholder}
        className={`min-h-11 w-full flex items-center justify-between px-3.5 py-2.5 text-sm rounded-xl border bg-card transition-colors text-left ${open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-zinc-300"}`}>
        <span className={displayVal ? "text-foreground font-medium" : "text-zinc-400"}>{displayVal || placeholder}</span>
        <CalendarDays size={14} className="text-zinc-400 flex-shrink-0 ml-2" />
      </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={4} collisionPadding={8} aria-label="Огноо сонгох" className="z-[1000] w-72 max-w-[calc(100vw-16px)] max-h-[var(--radix-popover-content-available-height)] overflow-y-auto rounded-xl border border-border bg-card p-4 shadow-xl outline-none">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button type="button" aria-label="Өмнөх сар" onClick={prevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted/60 transition-colors text-zinc-500">
              <ChevronLeft size={15} />
            </button>
            <span className="text-sm font-bold text-zinc-900">
              {MONTHS_MN[viewMonth]} {viewYear}
            </span>
            <button type="button" aria-label="Дараагийн сар" onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted/60 transition-colors text-zinc-500">
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS_MN.map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-zinc-400 py-1">{d}</div>
            ))}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const disabled = isDisabled(day);
              const selected = isSelected(day);
              const today_   = isToday(day);
              return (
                <button key={i} type="button" disabled={disabled}
                  onClick={() => select(day)}
                  className={`h-8 w-full rounded-lg text-xs font-semibold transition-colors
                    ${selected ? "bg-primary text-white shadow-sm" :
                      today_ ? "border border-primary/40 text-primary" :
                      disabled ? "text-zinc-300 cursor-not-allowed" :
                      "text-zinc-700 hover:bg-primary/10 hover:text-primary"}`}>
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <button type="button" onClick={() => { onChange(""); setOpen(false); }}
              className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 transition-colors">
              Цэвэрлэх
            </button>
            <button type="button"
              onClick={() => {
                const t = toYMD(today);
                if ((!min || t >= min) && (!max || t <= max)) { onChange(t); setOpen(false); }
              }}
              className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
              Өнөөдөр
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </div>
    </Popover.Root>
  );
}
