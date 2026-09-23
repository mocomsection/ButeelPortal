import { useState } from "react";
import buteelLogo from "@/imports/Artboard_1.png";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export function Shell({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar />
      {menuOpen && <Sidebar mobile onClose={() => setMenuOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <TopBar title={title} onMenuClick={() => setMenuOpen(true)} />
        <main className="flex-1 p-5 lg:p-7 w-full max-w-[1400px] mx-auto">
          {(title || subtitle) && (
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-extrabold text-foreground">{title}</h1>
                {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
              </div>
              {action && <div className="flex-shrink-0">{action}</div>}
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
            <div className="flex items-center gap-4">
              {[["Үйлчилгээний Нөхцөл", "/terms"], ["Нууцлалын Бодлого", "/terms"]].map(([label]) => (
                <button key={label} type="button" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{label}</button>
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
