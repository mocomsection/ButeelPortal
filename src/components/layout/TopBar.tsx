import { useState } from "react";
import { useNavigate } from "react-router";
import { Bell, ChevronDown, CheckCircle2, AlertCircle, Settings, User, Users, Shield, LogOut, Menu } from "lucide-react";
import { NOTIFS } from "@/data/notifications";
import { PasswordModal } from "@/components/ui/PasswordModal";
import profilePhoto from "@/imports/513145850_23886763664345716_5292993413416052748_n.jpg";

export function TopBar({ title, onMenuClick }: { title: string; onMenuClick: () => void }) {
  const navigate = useNavigate();
  const [showNotifs,    setShowNotifs]    = useState(false);
  const [showProfile,   setShowProfile]   = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFS);
  const unread = notifs.filter(n => !n.read).length;

  const notifIcon: Record<string, string> = {
    success: "bg-green-100 text-green-600",
    warning: "bg-amber-100 text-amber-600",
    info:    "bg-blue-100 text-blue-600",
  };

  return (
    <>
      {showPassModal && <PasswordModal onClose={() => setShowPassModal(false)} />}

      <header className="h-14 bg-card border-b border-border flex items-center px-4 lg:px-6 gap-3 flex-shrink-0 sticky top-0 z-30">
        <button type="button" onClick={onMenuClick} className="lg:hidden text-muted-foreground hover:text-foreground">
          <Menu size={22} />
        </button>
        <div className="flex-1" />

        <div className="flex items-center gap-1.5">
          {/* Notifications */}
          <div className="relative">
            <button type="button" onClick={() => { setShowNotifs(v => !v); setShowProfile(false); }}
              className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-colors">
              <Bell size={17} />
              {unread > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-primary rounded-full text-[10px] font-bold text-primary-foreground flex items-center justify-center px-0.5">{unread}</span>
              )}
            </button>
            {showNotifs && (
              <div className="absolute right-0 top-11 w-80 bg-card rounded-2xl shadow-xl border border-border z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <p className="font-bold text-sm text-foreground">Мэдэгдлүүд</p>
                  <button type="button" onClick={() => setNotifs(n => n.map(x => ({ ...x, read: true })))}
                    className="text-xs font-semibold text-primary hover:underline">Бүгдийг уншсан</button>
                </div>
                <div className="max-h-[360px] overflow-y-auto divide-y divide-border/50">
                  {notifs.map(n => (
                    <div key={n.id} className={`px-4 py-3 flex gap-3 cursor-pointer hover:bg-muted/40 transition-colors ${!n.read ? "bg-secondary/60" : ""}`}
                      onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${notifIcon[n.type] || "bg-muted text-muted-foreground"}`}>
                        {n.type === "success" ? <CheckCircle2 size={15} /> : n.type === "warning" ? <AlertCircle size={15} /> : <Bell size={15} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs font-bold truncate ${!n.read ? "text-foreground" : "text-foreground/70"}`}>{n.title}</p>
                          {!n.read && <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button type="button" onClick={() => { setShowProfile(v => !v); setShowNotifs(false); }}
              className="flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-xl hover:bg-muted/60 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 border border-border/40">
                <img src={profilePhoto} alt="Профайл" className="w-full h-full object-cover" />
              </div>
              <div className="hidden md:block text-left leading-tight">
                <p className="text-xs font-semibold text-foreground">Болд Жаргал</p>
                <p className="text-xs text-muted-foreground">Үндсэн Хэрэглэгч</p>
              </div>
              <ChevronDown size={13} className="text-muted-foreground hidden md:block" />
            </button>
            {showProfile && (
              <div className="absolute right-0 top-11 w-64 bg-card rounded-2xl shadow-xl border border-border z-50 overflow-hidden">
                <div className="px-4 py-3.5 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-border/40">
                      <img src={profilePhoto} alt="Профайл" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Болд Жаргал</p>
                      <p className="text-xs text-muted-foreground">bold@example.mn</p>
                      <span className="text-xs bg-secondary text-primary font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block">Үндсэн Хэрэглэгч</span>
                    </div>
                  </div>
                </div>
                <div className="py-1.5">
                  {[
                    { label: "Профайл Засах",         icon: User,      action: () => { navigate("/profile"); setShowProfile(false); } },
                    { label: "Аккаунт Тохиргоо",      icon: Settings,  action: () => { navigate("/account"); setShowProfile(false); } },
                    { label: "Хэрэглэгч Удирдах",     icon: Users,     action: () => { navigate("/users"); setShowProfile(false); } },
                    { label: "Нууц Үг Солих",          icon: Shield,    action: () => { setShowProfile(false); setShowPassModal(true); } },
                  ].map(item => (
                    <button key={item.label} type="button" onClick={item.action}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/40 transition-colors">
                      <item.icon size={15} className="text-muted-foreground" />
                      {item.label}
                    </button>
                  ))}
                  <div className="mx-3 my-1 border-t border-border" />
                  <button type="button" onClick={() => navigate("/login")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                    <LogOut size={15} />Гарах
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
