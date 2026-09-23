import { useNavigate, useLocation } from "react-router";
import buteelLogo from "@/imports/Artboard_1.png";
import { TrendingUp, User, HelpCircle, X, FileText, LogOut, Disc3, BookOpen, Film, Users, BarChart2, Wallet, Settings } from "lucide-react";

const NAV_GROUPS = [
  {
    label: "ҮНДСЭН",
    items: [
      { id: "dashboard",        path: "/dashboard",          label: "Хяналтын Самбар", icon: BarChart2 },
      { id: "catalog-music",    path: "/catalog?type=music",     label: "Дуу / Цомог",     icon: Disc3 },
      { id: "catalog-audiobook",path: "/catalog?type=audiobook", label: "Аудио Ном",       icon: BookOpen },
      { id: "catalog-film",     path: "/catalog?type=film",      label: "Кино",             icon: Film },
      { id: "reports",          path: "/reports",            label: "Тайлан",           icon: TrendingUp },
      { id: "revenue",          path: "/revenue",            label: "Орлого",           icon: Wallet },
    ],
  },
  {
    label: "БУСАД",
    items: [
      { id: "account", path: "/account", label: "Аккаунтын Тохиргоо", icon: Settings },
      { id: "users",   path: "/users",   label: "Хэрэглэгч",           icon: Users },
      { id: "help",    path: "/help",    label: "Тусламж",              icon: HelpCircle },
    ],
  },
];

export function Sidebar({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const navigate = useNavigate();
  const { pathname, search: locSearch } = useLocation();
  const activeSubType = pathname.startsWith("/catalog")
    ? (new URLSearchParams(locSearch).get("type") ?? "music")
    : "";

  const isActive = (id: string) => {
    if (id === "dashboard")         return pathname === "/dashboard";
    if (id === "catalog-music")     return pathname.startsWith("/catalog") && activeSubType === "music";
    if (id === "catalog-audiobook") return pathname.startsWith("/catalog") && activeSubType === "audiobook";
    if (id === "catalog-film")      return pathname.startsWith("/catalog") && activeSubType === "film";
    if (id === "reports")           return pathname.startsWith("/reports");
    if (id === "revenue")           return pathname.startsWith("/revenue");
    if (id === "account")           return pathname.startsWith("/account");
    if (id === "users")             return pathname.startsWith("/users");
    if (id === "help")              return pathname === "/help";
    return false;
  };

  return (
    <aside className={`${mobile ? "fixed inset-0 z-50 flex" : "hidden lg:flex w-60 flex-shrink-0"}`}>
      {mobile && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />}

      <div
        className={`flex flex-col relative ${mobile ? "relative z-10 w-60 h-full" : "w-full h-full"}`}
        style={{ background: "#0D0B18" }}>

        {/* Decorative glows */}
        <div className="absolute bottom-0 left-0 w-52 h-52 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at bottom left, rgba(108,77,246,0.2) 0%, transparent 65%)" }} />
        <div className="absolute top-1/2 right-0 w-20 h-40 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at right, rgba(108,77,246,0.06) 0%, transparent 70%)" }} />

        {/* Logo row */}
        <div className="px-5 pt-5 pb-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 75%, #000))" }}>
              <img src={buteelLogo} alt="Buteel" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-white font-extrabold text-[15px]">Buteel</span>
          </div>
          {mobile && (
            <button type="button" onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="mx-4 h-px bg-white/[0.06] flex-shrink-0" />

        {/* Nav groups */}
        <nav className="flex-1 px-3 pt-3 pb-2 flex flex-col gap-4 overflow-y-auto min-h-0">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="text-[10px] font-bold uppercase text-white/22 px-3 mb-2">{group.label}</p>
              <div className="flex flex-col gap-0.5">
                {group.items.map(item => {
                  const active = isActive(item.id);
                  const Icon = item.icon;
                  return (
                    <button key={item.id} type="button"
                      onClick={() => { navigate(item.path); onClose?.(); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                        active ? "text-white font-semibold" : "text-white/55 hover:text-white/85 hover:bg-white/[0.05]"
                      }`}
                      style={active ? { background: "var(--primary)", boxShadow: "0 4px 16px 0 rgba(108,77,246,0.3)" } : undefined}>
                      <Icon size={16} className={active ? "text-white" : "text-white/40"} />
                      <span className="flex-1 text-left">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mx-4 h-px bg-white/[0.06] flex-shrink-0" />

        {/* Bottom: screen map + logout */}
        <div className="px-3 py-3 flex flex-col gap-0.5 flex-shrink-0">
          <button type="button" onClick={() => { navigate("/screen-map"); onClose?.(); }}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[11px] transition-all ${pathname === "/screen-map" ? "text-white/65 font-semibold" : "text-white/22 hover:bg-white/[0.05] hover:text-white/45"}`}>
            <FileText size={12} className="flex-shrink-0" />Screen Map
          </button>
          <button type="button" onClick={() => navigate("/login")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/32 hover:bg-white/[0.05] hover:text-white/60 transition-all">
            <LogOut size={15} className="flex-shrink-0" />Гарах
          </button>
        </div>
      </div>
    </aside>
  );
}
