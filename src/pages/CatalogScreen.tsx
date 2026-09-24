import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Music2, Plus, Search, Check, X, AlertCircle, Disc3, Eye, BookOpen,
  ChevronDown, MoreHorizontal, Filter, LayoutGrid, List, Film, Pencil,
  User, Tag, ArrowRight, Headphones, Building2, Clapperboard, Mic2, Video,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RELEASES } from "@/data/releases";
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
  if (r.contentType === "film")      return `/catalog/film/film?id=${r.id}`;
  if (r.contentType === "audiobook") return `/catalog/audiobook/book?id=${r.id}`;
  return `/catalog/music/release?id=${r.id}`;
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
  const dropBtn = `flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-semibold border transition-colors ${active || open ? "border-primary bg-secondary text-primary" : "border-border bg-card text-foreground/70 hover:border-primary/40"}`;
  return (
    <div className="relative flex-shrink-0">
      <button type="button" onClick={onToggle} className={dropBtn}>
        <Icon size={13} />
        <span>{value === "all" ? label : value}</span>
        {value !== "all"
          ? <button type="button" onClick={e => { e.stopPropagation(); setValue("all"); }} className="ml-0.5 hover:opacity-70"><X size={10} /></button>
          : <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />}
      </button>
      {open && (
        <div className="absolute top-11 left-0 z-30 bg-card rounded-2xl shadow-xl border border-border w-56">
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
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CatalogScreen() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const ct: "music" | "audiobook" | "film" =
    pathname.includes("audiobook") ? "audiobook" :
    pathname.includes("film") ? "film" : "music";
  const cfg = TYPE_CONFIG[ct];

  // ── filter state ──────────────────────────────────────────────────────────
  const [view, setView] = useState<"list" | "grid">("grid");
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

  const closeAllDrops = () => {
    setArtistOpen(false); setLabelOpen(false);
    setStatusOpen(false); setReleaseTypeOpen(false);
  };

  const typeReleases = RELEASES.filter(r => r.contentType === ct);
  const uniqueArtists = [...new Set(typeReleases.map(r => r.primaryArtist))].sort();
  const uniqueLabels  = [...new Set(typeReleases.map(r => r.label).filter(Boolean))].sort();

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
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [musicMode, setMusicMode]           = useState<"single" | "album" | null>(null);

  const handleNew = () => {
    if (ct === "audiobook") { navigate("/submit/audiobook"); return; }
    if (ct === "film")      { navigate("/submit/film"); return; }
    setMusicMode(null); setShowMusicModal(true);
  };

  const dropBtn = (active: boolean) =>
    `flex items-center gap-2 h-9 px-3.5 rounded-xl text-sm font-semibold border transition-colors ${active ? "border-primary bg-secondary text-primary" : "border-border bg-card text-foreground/70 hover:border-primary/40"}`;

  const EmptyIcon = cfg.emptyIcon;

  return (
    <Shell title={cfg.title} subtitle={cfg.subtitle}>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2 mb-5 flex-wrap" onClick={closeAllDrops}>

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
          <div className="relative flex-shrink-0" onClick={e => e.stopPropagation()}>
            <button type="button"
              onClick={() => { setReleaseTypeOpen(v => !v); setArtistOpen(false); setLabelOpen(false); setStatusOpen(false); }}
              className={dropBtn(releaseTypeOpen || releaseTypeFilter !== "all")}>
              <Disc3 size={13} />
              {releaseTypeFilter === "all" ? "Төрөл" : releaseTypeFilter}
              <ChevronDown size={12} className={`transition-transform ${releaseTypeOpen ? "rotate-180" : ""}`} />
            </button>
            {releaseTypeOpen && (
              <div className="absolute top-11 left-0 z-30 bg-card rounded-2xl shadow-xl border border-border py-1.5 min-w-[160px]">
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
              </div>
            )}
          </div>
        )}

        {/* Status filter */}
        <div className="relative flex-shrink-0" onClick={e => e.stopPropagation()}>
          <button type="button"
            onClick={() => { setStatusOpen(v => !v); setArtistOpen(false); setLabelOpen(false); setReleaseTypeOpen(false); }}
            className={dropBtn(statusOpen || statusFilters.length > 0)}>
            <Filter size={13} />
            {statusFilters.length === 0 ? "Статус" : `${statusFilters.length} статус`}
            <ChevronDown size={12} className={`transition-transform ${statusOpen ? "rotate-180" : ""}`} />
          </button>
          {statusOpen && (
            <div className="absolute top-11 left-0 z-30 bg-card rounded-2xl shadow-xl border border-border py-1.5 min-w-[196px]">
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
            </div>
          )}
        </div>

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

        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 h-9 text-sm bg-card rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-muted-foreground"
            placeholder={cfg.searchPlaceholder} />
        </div>

        {/* View toggle + New */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center border border-border rounded-xl overflow-hidden bg-card">
            <button type="button" onClick={() => setView("list")}
              className={`p-2 transition-colors ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <List size={15} />
            </button>
            <button type="button" onClick={() => setView("grid")}
              className={`p-2 transition-colors ${view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <LayoutGrid size={15} />
            </button>
          </div>
          <Btn size="sm" icon={<Plus size={14} />} onClick={handleNew}>{cfg.newLabel}</Btn>
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
          ) : filtered.map(r => (
            <div key={r.id}
              className={`bg-white rounded-xl border-t-2 border border-zinc-100 shadow-sm hover:shadow-[0_4px_20px_0_rgba(108,77,246,0.1)] transition-all overflow-hidden ${statusColor[r.status] || "border-t-zinc-200"}`}>
              {/* Cover */}
              <div className={`${ct === "film" ? "aspect-[2/3]" : "aspect-square"} bg-zinc-900 flex items-center justify-center cursor-pointer group relative`}
                onClick={() => navigate(detailPath(r))}>
                {r.contentType === "audiobook" ? <BookOpen size={28} className="text-white/30" />
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
              <div className="p-3">
                <p className="font-semibold text-sm text-zinc-900 truncate leading-tight">{r.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5 truncate">{r.primaryArtist}</p>

                <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
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
                <div className="mt-2 pt-2 border-t border-zinc-100 space-y-0.5">
                  {ct === "music" && (
                    <>
                      {r.label && <p className="text-xs text-zinc-400 truncate"><span className="font-semibold text-zinc-500">Лейбл:</span> {r.label}</p>}
                      <p className="text-xs text-zinc-400 font-mono truncate"><span className="font-semibold text-zinc-500 font-sans">UPC:</span> {r.upc || "—"}</p>
                    </>
                  )}
                  {ct === "audiobook" && (
                    <>
                      <p className="text-xs text-zinc-400 truncate"><span className="font-semibold text-zinc-500">Зохиолч:</span> {r.primaryArtist}</p>
                      {r.label && <p className="text-xs text-zinc-400 truncate"><span className="font-semibold text-zinc-500">Нийтлэгч:</span> {r.label}</p>}
                      <p className="text-xs text-zinc-400"><span className="font-semibold text-zinc-500">Бүлэг:</span> {r.tracks.length}</p>
                    </>
                  )}
                  {ct === "film" && (
                    <>
                      <p className="text-xs text-zinc-400 truncate"><span className="font-semibold text-zinc-500">Найруулагч:</span> {r.primaryArtist}</p>
                      {r.label && <p className="text-xs text-zinc-400 truncate"><span className="font-semibold text-zinc-500">Студи:</span> {r.label}</p>}
                    </>
                  )}
                </div>

                <p className="text-xs text-zinc-400 mt-1.5">{r.releaseDate}</p>

                {/* Actions */}
                <div className="flex items-center gap-1 mt-2.5">
                  <button type="button" onClick={() => navigate(detailPath(r))}
                    className="flex items-center justify-center w-8 h-8 rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 transition-colors">
                    <Eye size={14} />
                  </button>
                  {(r.status === "draft" || r.status === "revision") && (
                    <button type="button" onClick={() => navigate(
                      r.contentType === "film" ? `/submit/film?edit=${r.id}` :
                      r.contentType === "audiobook" ? `/submit/audiobook?edit=${r.id}` :
                      `/submit/release?edit=${r.id}&mode=${r.type === "Single" ? "single" : "album"}`
                    )}
                      className="flex items-center justify-center w-8 h-8 rounded-xl border border-violet-200 text-violet-600 hover:bg-violet-50 transition-colors">
                      <Pencil size={14} />
                    </button>
                  )}
                  <button type="button"
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50">
                  <th className="text-left text-xs font-semibold text-zinc-400 uppercase px-5 py-3">
                    {ct === "music" ? "Дуу / Цомог нэр" : ct === "audiobook" ? "Номын нэр" : "Киноны нэр"}
                  </th>
                  <th className="text-left text-xs font-semibold text-zinc-400 uppercase px-4 py-3 hidden sm:table-cell">
                    {ct === "music" ? "Артист" : ct === "audiobook" ? "Зохиолч" : "Найруулагч"}
                  </th>
                  <th className="text-left text-xs font-semibold text-zinc-400 uppercase px-4 py-3 hidden lg:table-cell">
                    {ct === "music" ? "Лейбл" : ct === "audiobook" ? "Нийтлэгч" : "Студи"}
                  </th>
                  {ct === "music" && (
                    <th className="text-left text-xs font-semibold text-zinc-400 uppercase px-4 py-3 hidden xl:table-cell">UPC</th>
                  )}
                  {ct === "audiobook" && (
                    <th className="text-left text-xs font-semibold text-zinc-400 uppercase px-4 py-3 hidden xl:table-cell">Бүлэг</th>
                  )}
                  {ct === "music" && (
                    <th className="text-left text-xs font-semibold text-zinc-400 uppercase px-4 py-3 hidden sm:table-cell">Төрөл</th>
                  )}
                  <th className="text-left text-xs font-semibold text-zinc-400 uppercase px-4 py-3">Статус</th>
                  <th className="text-left text-xs font-semibold text-zinc-400 uppercase px-4 py-3 hidden md:table-cell">Огноо</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-400 uppercase">Үйлдэл</th>
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
                        <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center flex-shrink-0">
                          {r.contentType === "audiobook" ? <BookOpen size={14} className="text-white" />
                            : r.contentType === "film"  ? <Film size={14} className="text-white" />
                            : <Music2 size={14} className="text-white" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-zinc-900">{r.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-zinc-500 hidden sm:table-cell">{artistLabel(r)}</td>
                    <td className="px-4 py-3.5 text-sm text-zinc-500 hidden lg:table-cell">{r.label || "—"}</td>
                    {ct === "music" && (
                      <td className="px-4 py-3.5 text-xs text-zinc-400 font-mono hidden xl:table-cell">{r.upc || "—"}</td>
                    )}
                    {ct === "audiobook" && (
                      <td className="px-4 py-3.5 text-xs text-zinc-500 hidden xl:table-cell">{r.tracks.length} бүлэг</td>
                    )}
                    {ct === "music" && (
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-medium">{r.type}</span>
                      </td>
                    )}
                    <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3.5 text-sm text-zinc-400 hidden md:table-cell">{r.releaseDate}</td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => navigate(detailPath(r))}
                          className="flex items-center justify-center w-8 h-8 rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 transition-colors">
                          <Eye size={14} />
                        </button>
                        {(r.status === "draft" || r.status === "revision") && (
                          <button type="button" onClick={() => navigate(
                      r.contentType === "film" ? `/submit/film?edit=${r.id}` :
                      r.contentType === "audiobook" ? `/submit/audiobook?edit=${r.id}` :
                      `/submit/release?edit=${r.id}&mode=${r.type === "Single" ? "single" : "album"}`
                    )}
                            className="flex items-center justify-center w-8 h-8 rounded-xl border border-violet-200 text-violet-600 hover:bg-violet-50 transition-colors">
                            <Pencil size={14} />
                          </button>
                        )}
                        <button type="button"
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

      {/* ── Music new-content modal (single / album / music-video choice) ── */}
      {showMusicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMusicModal(false)} />

          <div className="relative bg-card rounded-2xl shadow-2xl border border-border w-full max-w-[580px] overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-7 pt-6 pb-5">
              <div>
                <h2 className="text-lg font-extrabold text-foreground m-0">Дуу, Цомог үүсгэх</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Контентын төрлийг сонгоно уу</p>
              </div>
              <button type="button" onClick={() => setShowMusicModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors flex-shrink-0">
                <X size={16} />
              </button>
            </div>

            {/* 3-column card grid */}
            <div className="grid grid-cols-3 gap-3 px-7 pb-3">
              {([
                { id: "single" as const, icon: Headphones, label: "Single",     sub: "Зөвхөн нэг дуу гаргах" },
                { id: "album"  as const, icon: Disc3,      label: "Album / EP", sub: "Олон дуу багтаасан цомог үүсгэх" },
              ] as { id: "single" | "album"; icon: (p: { size?: number; className?: string }) => JSX.Element; label: string; sub: string }[]).map(m => {
                const on = musicMode === m.id;
                const MIcon = m.icon;
                return (
                  <button key={m.id} type="button" onClick={() => setMusicMode(m.id)}
                    className={`group flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all ${
                      on
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:border-primary/40 hover:bg-muted/30"
                    }`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                      on ? "bg-primary" : "bg-muted group-hover:bg-primary/10"
                    }`}>
                      <MIcon size={20} className={on ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"} />
                    </div>
                    <p className="font-extrabold text-sm text-foreground leading-tight">{m.label}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{m.sub}</p>
                    {on && (
                      <div className="mt-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center ml-auto">
                        <Check size={11} className="text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Music Video — disabled / coming soon */}
              <div className="relative flex flex-col items-start p-4 rounded-xl border-2 border-dashed border-border/60 bg-muted/20 opacity-60 select-none cursor-not-allowed">
                <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center mb-3">
                  <Video size={20} className="text-muted-foreground/50" />
                </div>
                <p className="font-extrabold text-sm text-foreground/60 leading-tight">Дууны видео</p>
                <p className="text-xs text-muted-foreground/60 mt-1 leading-relaxed">MV нийтлэх</p>
                <span className="mt-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                  Тун удахгүй
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-7 py-4 mt-1 border-t border-border bg-muted/20">
              <button type="button" onClick={() => setShowMusicModal(false)}
                className="h-9 px-4 rounded-xl text-sm font-semibold border border-border bg-card text-foreground/70 hover:bg-muted/40 transition-colors">
                Болих
              </button>
              <button type="button" disabled={!musicMode}
                onClick={() => { if (musicMode) { setShowMusicModal(false); navigate(`/submit/release?mode=${musicMode}`); } }}
                className="h-9 px-5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5">
                Үргэлжлүүлэх <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}
