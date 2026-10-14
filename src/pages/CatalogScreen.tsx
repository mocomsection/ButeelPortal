import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { deleteDraftProduct, getCatalogSnapshot, subscribeCatalog } from "@/data/catalog-store";
import { useNavigate, useLocation } from "react-router";
import * as Popover from "@radix-ui/react-popover";
import {
  Music2, Plus, Search, Check, X, AlertCircle, Disc3, Eye, BookOpen,
  ChevronDown, MoreHorizontal, Filter, LayoutGrid, List, Film, Pencil,
  User, Tag, Building2, Clapperboard, Mic2, Trash2, Copy,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { MusicModeDialog } from "@/components/ui/MusicModeDialog";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { ReleaseData } from "@/types";

// ── Per-type static config ────────────────────────────────────────────────────
const TYPE_CONFIG = {
  music: {
    title:       "Дуу / Цомог",
    subtitle:    "Хөгжмийн цомог болон дуунуудын жагсаалт",
    artistLabel: "Артист",
    artistIcon:  User,
    labelLabel:  "Лейбл",
    labelIcon:   Tag,
    searchPlaceholder: "Нэр, артист, UPC хайх...",
    newLabel:    "Шинэ Дуу",
    emptyIcon:   Music2,
  },
  audiobook: {
    title:       "Аудио Ном",
    subtitle:    "Аудио ном, podcast болон хичээлүүд",
    artistLabel: "Зохиолч",
    artistIcon:  Mic2,
    labelLabel:  "Нийтлэгч",
    labelIcon:   Building2,
    searchPlaceholder: "Гарчиг, зохиолч хайх...",
    newLabel:    "Шинэ Ном",
    emptyIcon:   BookOpen,
  },
  film: {
    title:       "Кино",
    subtitle:    "Кино, богино хэрэглэл, документаль бүтээлүүд",
    artistLabel: "Найруулагч",
    artistIcon:  Clapperboard,
    labelLabel:  "Студи",
    labelIcon:   Building2,
    searchPlaceholder: "Нэр, найруулагч хайх...",
    newLabel:    "Шинэ Кино",
    emptyIcon:   Film,
  },
} as const;

const MUSIC_RELEASE_TYPES = ["Single", "EP", "Album"];

const STATUS_OPTIONS = [
  { id: "submitted",   label: "Илгээгдсэн" },
  { id: "distributed", label: "Түгээгдсэн" },
  { id: "reviewing",   label: "Шалгагдаж Байна" },
  { id: "revision",    label: "Засвар Шаардсан" },
  { id: "withdrawn",   label: "Татан Буулгасан" },
  { id: "draft",       label: "Ноорог" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const statusColor: Record<string, string> = {
  distributed: "border-t-green-500", reviewing: "border-t-amber-400",
  revision: "border-t-red-400",      withdrawn: "border-t-zinc-400",
  draft: "border-t-zinc-300",        submitted: "border-t-violet-500",
};

function artistLabel(r: ReleaseData) {
  return r.featArtists.length
    ? `${r.primaryArtist} feat. ${r.featArtists.join(", ")}`
    : r.primaryArtist;
}

function detailPath(r: ReleaseData) {
  if (r.contentType === "film")      return `/movies/${r.id}`;
  if (r.contentType === "audiobook") return `/audiobooks/${r.id}`;
  return `/releases/${r.id}`;
}

function editPath(r: ReleaseData) {
  if (r.contentType === "film")      return `/movies/${r.id}/edit`;
  if (r.contentType === "audiobook") return `/audiobooks/${r.id}/edit`;
  return `/releases/${r.id}/edit`;
}

function ContentTypeIcon({ ct }: { ct: string }) {
  if (ct === "audiobook") return <BookOpen size={11} className="text-blue-500" />;
  if (ct === "film")      return <Film     size={11} className="text-amber-500" />;
  return <Disc3 size={11} className="text-violet-500" />;
}

// ── SearchDrop: reusable dropdown with search ─────────────────────────────────
function SearchDrop({
  open, onToggle, active, Icon, label, value, setValue,
  searchVal, setSearchVal, items, allLabel, onClose,
}: {
  open: boolean; onToggle: () => void; active: boolean;
  Icon: React.ElementType; label: string; value: string; setValue: (v: string) => void;
  searchVal: string; setSearchVal: (v: string) => void;
  items: string[]; allLabel: string; onClose: () => void;
}) {
  const filtered = items.filter(i => !searchVal || i.toLowerCase().includes(searchVal.toLowerCase()));
  const dropBtn = `flex items-center gap-2 h-10 px-3.5 rounded-xl text-sm font-semibold border transition-colors ${active || open ? "border-primary bg-secondary text-primary" : "border-border bg-card text-foreground/70 hover:border-primary/40"}`;
  return (
    <Popover.Root open={open} onOpenChange={next => { if (!next) onClose(); }}>
      <div className="relative flex-shrink-0 flex items-center">
      <Popover.Trigger asChild>
      <button type="button" onClick={onToggle} aria-expanded={open} className={`${dropBtn} whitespace-nowrap`}>
        <Icon size={13} />
        <span>{value === "all" ? label : value}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      </Popover.Trigger>
      {value !== "all" && <button type="button" aria-label={`${label} шүүлтүүр цэвэрлэх`} onClick={() => setValue("all")} className="ml-1 p-2 rounded-lg text-muted-foreground hover:bg-muted"><X size={12} /></button>}
      </div>
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={8} collisionPadding={16} className="z-40 bg-card rounded-2xl shadow-xl border border-border w-56 max-w-[calc(100vw-2rem)] outline-none">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={searchVal} onChange={e => setSearchVal(e.target.value)} autoFocus
                className="w-full pl-7 pr-2.5 py-1.5 text-xs rounded-lg border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                placeholder={`${label} хайх...`} />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto py-1">
            <button type="button" onClick={() => { setValue("all"); onClose(); setSearchVal(""); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted/40 transition-colors ${value === "all" ? "text-primary font-semibold" : "text-foreground/70"}`}>
              {allLabel} {value === "all" && <Check size={12} />}
            </button>
            {filtered.map(a => (
              <button key={a} type="button" onClick={() => { setValue(a); onClose(); setSearchVal(""); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-secondary/60 transition-colors ${value === a ? "text-primary font-semibold" : "text-foreground"}`}>
                {a} {value === a && <Check size={12} />}
              </button>
            ))}
            {filtered.length === 0 && <p className="px-4 py-3 text-xs text-muted-foreground">Олдсонгүй</p>}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CatalogScreen() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const ct: "music" | "audiobook" | "film" =
    pathname.startsWith("/audiobooks") ? "audiobook" :
    pathname.startsWith("/movies")     ? "film" : "music";
  const cfg = TYPE_CONFIG[ct];

  // ── filter state ──────────────────────────────────────────────────────────
  const [view, setView] = useState<"list" | "grid">("grid");
  const [visibleCount, setVisibleCount] = useState(10);
  const [search, setSearch] = useState("");
  const [artistFilter, setArtistFilter]   = useState("all");
  const [artistSearch, setArtistSearch]   = useState("");
  const [artistOpen, setArtistOpen]       = useState(false);
  const [labelFilter, setLabelFilter]     = useState("all");
  const [labelSearch, setLabelSearch]     = useState("");
  const [labelOpen, setLabelOpen]         = useState(false);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [statusOpen, setStatusOpen]       = useState(false);
  // music-only
  const [releaseTypeFilter, setReleaseTypeFilter] = useState("all");
  const [releaseTypeOpen, setReleaseTypeOpen]     = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openMenuId) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openMenuId]);

  const closeAllDrops = () => {
    setArtistOpen(false); setLabelOpen(false);
    setStatusOpen(false); setReleaseTypeOpen(false);
  };

  const catalogProducts = useSyncExternalStore(subscribeCatalog, getCatalogSnapshot);
  const [deleteTarget, setDeleteTarget] = useState<ReleaseData | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const typeReleases = catalogProducts.filter(r => r.contentType === ct);
  const uniqueArtists = [...new Set<string>(typeReleases.map(r => r.primaryArtist))].sort();
  const uniqueLabels  = [...new Set<string>(typeReleases.map(r => r.label).filter(Boolean))].sort();

  const filtered = typeReleases.filter(r => {
    const matchStatus  = statusFilters.length === 0 || statusFilters.includes(r.status);
    const matchArtist  = artistFilter === "all" || r.primaryArtist === artistFilter;
    const matchLabel   = labelFilter  === "all" || r.label === labelFilter;
    const matchRelType = ct !== "music" || releaseTypeFilter === "all" || r.type === releaseTypeFilter;
    const q = search.toLowerCase();
    const matchSearch  = !q ||
      r.title.toLowerCase().includes(q) ||
      r.primaryArtist.toLowerCase().includes(q) ||
      r.featArtists.some(a => a.toLowerCase().includes(q)) ||
      (r.upc ?? "").includes(q) ||
      r.tracks.some(t => t.isrc.toLowerCase().includes(q));
    return matchStatus && matchArtist && matchLabel && matchRelType && matchSearch;
  });

  const toggleStatus = (id: string) =>
    setStatusFilters(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  // ── New content ───────────────────────────────────────────────────────────
  const [showMusicModal, setShowMusicModal] = useState(pathname === "/releases/new");

  // auto-open modal when landing on /releases/new
  useEffect(() => {
    if (pathname === "/releases/new") setShowMusicModal(true);
  }, [pathname]);

  const handleNew = () => {
    if (ct === "audiobook") { navigate("/audiobooks/new"); return; }
    if (ct === "film")      { navigate("/movies/new"); return; }
    setShowMusicModal(true);
  };

  const dropBtn = (active: boolean) =>
    `flex flex-shrink-0 items-center gap-2 h-10 px-3.5 rounded-xl text-sm font-semibold whitespace-nowrap border transition-colors ${active ? "border-primary bg-secondary text-primary" : "border-border bg-card text-foreground/70 hover:border-primary/40"}`;

  useEffect(() => {
    setVisibleCount(10);
  }, [pathname, search, artistFilter, labelFilter, releaseTypeFilter, statusFilters]);

  const EmptyIcon = cfg.emptyIcon;

  return (
    <Shell title={cfg.title} subtitle={cfg.subtitle}>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <div aria-label="Контентын шүүлтүүрүүд" className="flex w-full lg:w-auto max-w-full flex-wrap items-center gap-2">

        {/* Artist / Зохиолч / Найруулагч */}
        <SearchDrop
          open={artistOpen}
          onToggle={() => { setArtistOpen(v => !v); setLabelOpen(false); setStatusOpen(false); setReleaseTypeOpen(false); }}
          active={artistFilter !== "all"}
          Icon={cfg.artistIcon}
          label={cfg.artistLabel}
          value={artistFilter}
          setValue={setArtistFilter}
          searchVal={artistSearch}
          setSearchVal={setArtistSearch}
          items={uniqueArtists}
          allLabel="Бүгд"
          onClose={closeAllDrops}
        />

        {/* Label / Хэвлэлийн газар / Студи */}
        <SearchDrop
          open={labelOpen}
          onToggle={() => { setLabelOpen(v => !v); setArtistOpen(false); setStatusOpen(false); setReleaseTypeOpen(false); }}
          active={labelFilter !== "all"}
          Icon={cfg.labelIcon}
          label={cfg.labelLabel}
          value={labelFilter}
          setValue={setLabelFilter}
          searchVal={labelSearch}
          setSearchVal={setLabelSearch}
          items={uniqueLabels}
          allLabel="Бүгд"
          onClose={closeAllDrops}
        />

        {/* Music-only: release type filter */}
        {ct === "music" && (
          <Popover.Root open={releaseTypeOpen} onOpenChange={next => { if (!next) setReleaseTypeOpen(false); }}>
            <Popover.Trigger asChild>
            <button type="button"
              onClick={() => { setReleaseTypeOpen(v => !v); setArtistOpen(false); setLabelOpen(false); setStatusOpen(false); }}
              className={dropBtn(releaseTypeOpen || releaseTypeFilter !== "all")}>
              <Disc3 size={13} />
              {releaseTypeFilter === "all" ? "Төрөл" : releaseTypeFilter}
              <ChevronDown size={12} className={`transition-transform ${releaseTypeOpen ? "rotate-180" : ""}`} />
            </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content align="start" sideOffset={8} collisionPadding={16} className="z-40 bg-card rounded-2xl shadow-xl border border-border py-1.5 min-w-[160px] outline-none">
                <button type="button" onClick={() => { setReleaseTypeFilter("all"); closeAllDrops(); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted/40 transition-colors ${releaseTypeFilter === "all" ? "text-primary font-semibold" : "text-foreground/70"}`}>
                  Бүгд {releaseTypeFilter === "all" && <Check size={12} />}
                </button>
                {MUSIC_RELEASE_TYPES.map(t => (
                  <button key={t} type="button" onClick={() => { setReleaseTypeFilter(t); closeAllDrops(); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-secondary/60 transition-colors ${releaseTypeFilter === t ? "text-primary font-semibold" : "text-foreground"}`}>
                    {t} {releaseTypeFilter === t && <Check size={12} />}
                  </button>
                ))}
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        )}

        {/* Status filter */}
        <Popover.Root open={statusOpen} onOpenChange={next => { if (!next) setStatusOpen(false); }}>
          <Popover.Trigger asChild>
          <button type="button"
            onClick={() => { setStatusOpen(v => !v); setArtistOpen(false); setLabelOpen(false); setReleaseTypeOpen(false); }}
            className={dropBtn(statusOpen || statusFilters.length > 0)}>
            <Filter size={13} />
            {statusFilters.length === 0 ? "Төлөв" : `${statusFilters.length} төлөв`}
            <ChevronDown size={12} className={`transition-transform ${statusOpen ? "rotate-180" : ""}`} />
          </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content align="start" sideOffset={8} collisionPadding={16} className="z-40 bg-card rounded-2xl shadow-xl border border-border py-1.5 min-w-[196px] max-h-[60dvh] overflow-y-auto outline-none">
              {STATUS_OPTIONS.map(opt => (
                <button key={opt.id} type="button" onClick={() => toggleStatus(opt.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/40 transition-colors">
                  <div className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-all flex-shrink-0 ${statusFilters.includes(opt.id) ? "bg-primary border-primary" : "border-border"}`}>
                    {statusFilters.includes(opt.id) && <Check size={10} className="text-primary-foreground" />}
                  </div>
                  <span className={`font-medium flex-1 text-left ${statusFilters.includes(opt.id) ? "text-foreground" : "text-foreground/70"}`}>{opt.label}</span>
                  <span className="text-xs text-muted-foreground">{typeReleases.filter(r => r.status === opt.id).length}</span>
                </button>
              ))}
              {statusFilters.length > 0 && (
                <div className="px-4 pt-1.5 pb-2 border-t border-border mt-1">
                  <button type="button" onClick={() => setStatusFilters([])}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground">Цэвэрлэх</button>
                </div>
              )}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* Active status pills */}
        {statusFilters.map(id => {
          const opt = STATUS_OPTIONS.find(o => o.id === id);
          return opt ? (
            <span key={id} className="inline-flex items-center gap-1 px-2.5 h-9 rounded-xl text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200 flex-shrink-0">
              {opt.label}
              <button type="button" onClick={() => toggleStatus(id)} className="hover:text-violet-900 p-0.5"><X size={10} /></button>
            </span>
          ) : null;
        })}

        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto lg:flex-1 min-w-0">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 h-10 text-sm bg-card rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-muted-foreground"
            placeholder={cfg.searchPlaceholder} />
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center border border-border rounded-xl overflow-hidden bg-card">
            <button type="button" onClick={() => setView("list")} aria-label="Жагсаалтаар харах" aria-pressed={view === "list"}
              className={`h-10 w-10 flex items-center justify-center transition-colors ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <List size={15} />
            </button>
            <button type="button" onClick={() => setView("grid")} aria-label="Картаар харах" aria-pressed={view === "grid"}
              className={`h-10 w-10 flex items-center justify-center transition-colors ${view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>
        </div>
        <div className="ml-auto flex-shrink-0 [&_button]:min-h-10">
          <Btn size="lg" icon={<Plus size={14} />} onClick={handleNew}>{cfg.newLabel}</Btn>
        </div>
      </div>

      {/* ── Grid view ── */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <EmptyIcon size={36} className="mx-auto text-zinc-200 mb-3" />
              <p className="text-zinc-400 text-sm">Бүтээл олдсонгүй</p>
            </div>
          ) : filtered.slice(0, visibleCount).map(r => (
            <div key={r.id}
              className={`bg-white rounded-xl border-t-2 border border-zinc-100 shadow-sm hover:shadow-[0_4px_20px_0_rgba(108,77,246,0.1)] transition-all overflow-hidden ${statusColor[r.status] || "border-t-zinc-200"}`}>
              {/* Cover */}
              <div className={`${ct === "film" ? "aspect-[2/3]" : "aspect-square"} bg-zinc-900 flex items-center justify-center cursor-pointer group relative`}
                onClick={() => navigate(detailPath(r))}>
                {r.cover
                  ? <img src={r.cover} alt={r.title} className="absolute inset-0 w-full h-full object-cover" />
                  : r.contentType === "audiobook" ? <BookOpen size={28} className="text-white/30" />
                  : r.contentType === "film"  ? <Film     size={28} className="text-white/30" />
                  : <Music2 size={28} className="text-white/30" />}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-800">Харах</div>
                </div>
                {r.status === "revision" && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <AlertCircle size={12} className="text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3.5">
                <p className="font-semibold text-sm text-zinc-900 truncate leading-snug">{r.title}</p>
                <p className="text-xs text-zinc-500 mt-1 truncate">{r.primaryArtist}</p>

                <div className="flex items-center justify-between mt-2.5 flex-wrap gap-1">
                  {ct === "music" ? (
                    <>
                      <div className="flex items-center gap-1">
                        <ContentTypeIcon ct={r.contentType} />
                        <span className="text-xs bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded font-medium">{r.type}</span>
                      </div>
                      <StatusBadge status={r.status} />
                    </>
                  ) : (
                    <StatusBadge status={r.status} />
                  )}
                </div>

                {/* Type-specific detail row */}
                <div className="mt-2.5 pt-2.5 border-t border-zinc-100 space-y-1.5">
                  {ct === "music" && (
                    <>
                      {r.label && <p className="text-xs text-zinc-400 truncate"><span className="font-semibold text-zinc-500">Лейбл:</span> {r.label}</p>}
                      <p className="text-xs text-zinc-400 truncate"><span className="font-semibold text-zinc-500">UPC:</span> {r.upc || "—"}</p>
                    </>
                  )}
                  {ct === "audiobook" && r.label && (
                    <p className="text-xs text-zinc-400 truncate"><span className="font-semibold text-zinc-500">Нийтлэгч:</span> {r.label}</p>
                  )}
                  {ct === "film" && r.label && (
                    <p className="text-xs text-zinc-400 truncate"><span className="font-semibold text-zinc-500">Студи:</span> {r.label}</p>
                  )}
                  {r.releaseDate && <p className="text-xs text-zinc-400 truncate"><span className="font-semibold text-zinc-500">Нийтлэх огноо:</span> {r.releaseDate}</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 mt-3">
                  <button type="button" onClick={() => navigate(detailPath(r))}
                    className="flex items-center justify-center w-8 h-8 rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 transition-colors">
                    <Eye size={14} />
                  </button>
                  {(r.status === "draft" || r.status === "revision") && (
                    <button type="button" onClick={() => navigate(editPath(r))}
                      className="flex items-center justify-center w-8 h-8 rounded-xl border border-violet-200 text-violet-600 hover:bg-violet-50 transition-colors">
                      <Pencil size={14} />
                    </button>
                  )}
                  <button type="button"
                    onClick={e => {
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      setMenuPos({ top: rect.bottom + 4, left: rect.right - 160 });
                      setOpenMenuId(openMenuId === r.id ? null : r.id);
                    }}
                    className="flex items-center justify-center w-8 h-8 rounded-xl border border-zinc-200 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600 transition-colors ml-auto">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── List view ── */
        <Card className="overflow-hidden">
          <p className="flex items-center justify-center gap-2 border-b border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground min-[1200px]:hidden">
            <span aria-hidden="true">↔</span> Бүх баганыг харахын тулд зүүн, баруун тийш гүйлгэнэ үү
          </p>
          <div role="region" aria-label={`${cfg.title} мэдээллийн хүснэгт`} tabIndex={0} className="overflow-x-auto overscroll-x-contain pb-4 focus-visible:outline-2 focus-visible:outline-primary">
            <table className="w-full min-w-[900px] [&_th]:whitespace-nowrap">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50">
                  <th className="text-left text-xs font-semibold text-zinc-400 normal-case px-5 py-3">
                    {ct === "music" ? "Дуу / Цомог нэр" : ct === "audiobook" ? "Номын нэр" : "Киноны нэр"}
                  </th>
                  <th className="text-left text-xs font-semibold text-zinc-400 normal-case px-4 py-3">
                    {ct === "music" ? "Артист" : ct === "audiobook" ? "Зохиолч" : "Найруулагч"}
                  </th>
                  <th className="text-left text-xs font-semibold text-zinc-400 normal-case px-4 py-3">
                    {ct === "music" ? "Лейбл" : ct === "audiobook" ? "Нийтлэгч" : "Студи"}
                  </th>
                  {ct === "music" && (
                    <th className="text-left text-xs font-semibold text-zinc-400 normal-case px-4 py-3">UPC</th>
                  )}
                  {ct === "audiobook" && (
                    <th className="text-left text-xs font-semibold text-zinc-400 normal-case px-4 py-3">Бүлэг</th>
                  )}
                  {ct === "music" && (
                    <th className="text-left text-xs font-semibold text-zinc-400 normal-case px-4 py-3">Төрөл</th>
                  )}
                  <th className="text-left text-xs font-semibold text-zinc-400 normal-case px-4 py-3">Төлөв</th>
                  <th className="text-left text-xs font-semibold text-zinc-400 normal-case px-4 py-3">Огноо</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-400 normal-case">Үйлдэл</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="py-16 text-center">
                    <EmptyIcon size={36} className="mx-auto text-zinc-200 mb-3" />
                    <p className="text-zinc-400 text-sm">Бүтээл олдсонгүй</p>
                  </td></tr>
                ) : filtered.map(r => (
                  <tr key={r.id} className="hover:bg-zinc-100/70 transition-colors">
                    <td className="px-5 py-3.5 cursor-pointer" onClick={() => navigate(detailPath(r))}>
                      <div className="flex items-center gap-3">
                        <div className={`relative rounded-lg bg-zinc-900 overflow-hidden flex-shrink-0 flex items-center justify-center ${r.contentType === "film" ? "w-7 h-10" : "w-9 h-9"}`}>
                          {r.cover
                            ? <img src={r.cover} alt={r.title} className="absolute inset-0 w-full h-full object-cover" />
                            : r.contentType === "audiobook" ? <BookOpen size={13} className="text-white/50" />
                            : r.contentType === "film"      ? <Film     size={13} className="text-white/50" />
                            : <Music2 size={13} className="text-white/50" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-zinc-900">{r.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-zinc-500">{artistLabel(r)}</td>
                    <td className="px-4 py-3.5 text-sm text-zinc-500">{r.label || "—"}</td>
                    {ct === "music" && (
                      <td className="px-4 py-3.5 text-xs text-zinc-400">{r.upc || "—"}</td>
                    )}
                    {ct === "audiobook" && (
                      <td className="px-4 py-3.5 text-xs text-zinc-500">{r.tracks.length} бүлэг</td>
                    )}
                    {ct === "music" && (
                      <td className="px-4 py-3.5">
                        <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-medium">{r.type}</span>
                      </td>
                    )}
                    <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3.5 text-sm text-zinc-400">{r.releaseDate}</td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => navigate(detailPath(r))}
                          className="flex items-center justify-center w-8 h-8 rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 transition-colors">
                          <Eye size={14} />
                        </button>
                        {(r.status === "draft" || r.status === "revision") && (
                          <button type="button" onClick={() => navigate(editPath(r))}
                            className="flex items-center justify-center w-8 h-8 rounded-xl border border-violet-200 text-violet-600 hover:bg-violet-50 transition-colors">
                            <Pencil size={14} />
                          </button>
                        )}
                        <button type="button"
                          onClick={e => {
                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                            setMenuPos({ top: rect.bottom + 4, left: rect.right - 160 });
                            setOpenMenuId(openMenuId === r.id ? null : r.id);
                          }}
                          className="flex items-center justify-center w-8 h-8 rounded-xl border border-zinc-200 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600 transition-colors">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {view === "grid" && filtered.length > 0 && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-xs text-muted-foreground">Нийт {filtered.length} бүтээлээс {Math.min(visibleCount, filtered.length)} харагдаж байна</p>
          {visibleCount < filtered.length && (
            <button type="button" onClick={() => setVisibleCount(count => count + 10)}
              className="min-h-11 rounded-xl border border-border bg-card px-6 py-2 text-sm font-semibold text-primary hover:bg-secondary">
              Цааш үзэх
            </button>
          )}
        </div>
      )}

      <MusicModeDialog open={showMusicModal} onClose={() => setShowMusicModal(false)} onChoose={mode => { setShowMusicModal(false); navigate(`/releases/new/${mode}`); }} />

      {/* Grid action menu */}
      {openMenuId && (() => {
        const r = filtered.find(x => x.id === openMenuId);
        if (!r) return null;
        return (
          <div ref={menuRef}
            className="fixed z-[300] bg-white rounded-xl border border-border shadow-xl py-1 w-40"
            style={{ top: menuPos.top, left: menuPos.left }}>
            <button type="button" onClick={() => setOpenMenuId(null)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors">
              <Copy size={14} className="text-zinc-400" />Хуулах
            </button>
            {r.status === "draft" && <>
            <div className="border-t border-zinc-100 my-1" />
            <button type="button" onClick={() => {
              setOpenMenuId(null);
              setDeleteError("");
              setDeleteTarget(r);
            }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
              <Trash2 size={14} />Устгах
            </button>
            </>}
          </div>
        );
      })()}
      <Dialog.Root open={!!deleteTarget} onOpenChange={open => { if (!open) { setDeleteTarget(null); setDeleteError(""); } }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-4 right-4 top-1/2 z-[401] flex max-h-[calc(100dvh-2rem)] -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:left-1/2 sm:right-auto sm:w-full sm:max-w-md sm:-translate-x-1/2">
            <div className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive"><AlertCircle size={20} /></span>
                <Dialog.Title className="text-lg font-extrabold text-foreground">{deleteTarget?.status === "draft" ? "Ноорог устгах уу?" : "Устгах боломжгүй"}</Dialog.Title>
              </div>
              <Dialog.Close aria-label="Мэдэгдэл хаах" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><X size={16} /></Dialog.Close>
            </div>
            <div className="overflow-y-auto px-5 pb-5 pt-3 sm:px-6">
              <Dialog.Description className="break-words text-sm leading-relaxed text-muted-foreground">
                {deleteTarget?.status === "draft" ? `“${deleteTarget.title}” ноорогийг устгана. Энэ үйлдлийг буцаах боломжгүй.` : "Зөвхөн ноорог төлөвтэй бүтээлийг устгаж болно. Илгээгдсэн болон түгээгдсэн бүтээлүүд хадгалагдана."}
              </Dialog.Description>
              {deleteError && <div role="alert" className="mt-3 flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"><AlertCircle size={16} className="mt-0.5 shrink-0" /><span>{deleteError}</span></div>}
            </div>
            <div className="flex justify-end gap-2 border-t border-border bg-muted/20 px-5 py-4 sm:px-6">
              <Btn variant={deleteTarget?.status === "draft" ? "secondary" : "primary"} onClick={() => { setDeleteTarget(null); setDeleteError(""); }}>{deleteTarget?.status === "draft" ? "Болих" : "Ойлголоо"}</Btn>
              {deleteTarget?.status === "draft" && <Btn variant="danger" icon={<Trash2 size={14} />} onClick={() => {
                try {
                  deleteDraftProduct(deleteTarget.id);
                  setDeleteTarget(null);
                } catch (error) {
                  setDeleteError(error instanceof Error ? error.message : "Ноорогийг устгаж чадсангүй. Дахин оролдоно уу.");
                }
              }}>Устгах</Btn>}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Shell>
  );
}
