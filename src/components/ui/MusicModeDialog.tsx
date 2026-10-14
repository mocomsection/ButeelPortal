import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Check, Disc3, Headphones, Video, X } from "lucide-react";

export function MusicModeDialog({ open, onClose, onChoose }: {
  open: boolean;
  onClose: () => void;
  onChoose: (mode: "single" | "album") => void;
}) {
  const [selected, setSelected] = useState<"single" | "album" | null>(null);
  useEffect(() => { if (open) setSelected(null); }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={next => { if (!next) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-4 right-4 top-1/2 z-50 -translate-y-1/2 flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[580px] sm:-translate-x-1/2">
          <div className="flex shrink-0 items-start justify-between gap-3 px-5 pt-5 pb-4 sm:px-7 sm:pt-6 sm:pb-5">
            <div className="min-w-0">
              <Dialog.Title className="text-lg font-extrabold text-foreground">Дуу, Цомог үүсгэх</Dialog.Title>
              <Dialog.Description className="mt-1 text-xs sm:text-sm text-muted-foreground">Контентын төрлийг сонгоно уу</Dialog.Description>
            </div>
            <Dialog.Close aria-label="Үүсгэх цонх хаах" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground">
              <X size={16} />
            </Dialog.Close>
          </div>
          <div className="grid min-h-0 grid-cols-1 gap-2 overflow-y-auto px-5 pb-5 sm:grid-cols-3 sm:gap-3 sm:px-7">
            {([
              { id: "single", icon: Headphones, label: "Single", description: "Зөвхөн нэг дуу гаргах" },
              { id: "album", icon: Disc3, label: "Album / EP", description: "Олон дуу багтаасан цомог үүсгэх" },
            ] as const).map(option => {
              const active = selected === option.id;
              const Icon = option.icon;
              return (
                <button key={option.id} type="button" aria-pressed={active} onClick={() => setSelected(option.id)} className={`group relative flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-colors sm:flex-col sm:items-start sm:gap-0 sm:p-4 ${active ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/40 hover:bg-muted/30"}`}>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:mb-3 sm:h-11 sm:w-11 ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-primary"}`}><Icon size={20} /></div>
                  <div className="min-w-0 flex-1 sm:flex-none">
                    <p className="text-sm font-extrabold text-foreground">{option.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{option.description}</p>
                  </div>
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border sm:mt-3 sm:ml-auto ${active ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{active && <Check size={11} />}</span>
                </button>
              );
            })}
            <div aria-disabled="true" className="flex items-center gap-3 rounded-xl border-2 border-dashed border-border/60 bg-muted/20 p-3 sm:flex-col sm:items-start sm:gap-0 sm:p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted sm:mb-3 sm:h-11 sm:w-11"><Video size={20} className="text-muted-foreground/60" /></div>
              <div className="min-w-0 flex-1 sm:flex-none"><p className="text-sm font-extrabold text-muted-foreground">Дууны видео</p><p className="mt-1 text-xs text-muted-foreground">MV нийтлэх</p></div>
              <span className="shrink-0 rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 sm:mt-3">Тун удахгүй</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-muted/20 px-5 py-4 sm:px-7">
            <Dialog.Close className="h-10 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground/70 hover:bg-muted/40">Болих</Dialog.Close>
            <button type="button" disabled={!selected} onClick={() => { if (selected) onChoose(selected); }} className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none">Үргэлжлүүлэх<ArrowRight size={14} /></button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
