import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import * as Dialog from "@radix-ui/react-dialog";
import buteelLogo from "@/imports/Artboard_1.png";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export function Shell({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setMenuOpen(false);
    scrollRef.current?.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  return (
    <div className="h-dvh bg-background flex overflow-hidden">
      <Sidebar />
      <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
          <Dialog.Content aria-describedby={undefined} className="fixed inset-y-0 left-0 z-50 w-60 max-w-[85vw] outline-none">
            <Dialog.Title className="sr-only">Үндсэн цэс</Dialog.Title>
            <Sidebar mobile onClose={() => setMenuOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <div ref={scrollRef} className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <TopBar title={title} onMenuClick={() => setMenuOpen(true)} />
        <main className="flex-1 min-w-0 p-4 sm:p-5 lg:p-7 w-full max-w-[1400px] mx-auto">
          {(title || subtitle) && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="min-w-0">
                <h1 className="break-words text-xl sm:text-2xl font-extrabold leading-relaxed text-foreground">{title}</h1>
                {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
              </div>
              {action && <div className="min-w-0 max-w-full self-start sm:self-auto">{action}</div>}
            </div>
          )}
          {children}
        </main>
        <footer className="mt-6 px-5 lg:px-7 py-5 border-t border-border bg-card/80 backdrop-blur-sm">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 bg-primary">
                <img src={buteelLogo} alt="" className="w-3.5 h-3.5 object-contain" />
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground/70">Buteel Portal</span> · Mongol Content LLC © 2026
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {[["Үйлчилгээний нөхцөл", "/terms"], ["Нууцлалын бодлого", "/terms"]].map(([label, path]) => (
                <button key={label} type="button" onClick={() => navigate(path)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{label}</button>
              ))}
              <a href="mailto:support@buteel.mn" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Холбоо Барих
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
