import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router";
import { Shell } from "@/components/layout/Shell";
import {
  Film, ArrowLeft, ArrowRight, Send, Plus, X, Check,
  ChevronDown, UploadCloud, CircleCheckBig, ClipboardCheck,
  Search, UserRound, Users, ZapIcon, CalendarDays, CalendarClock,
  Info, Image as ImageIcon, ImageOff, RadioTower, Link2, Eye, EyeOff, TriangleAlert, AlertCircle,
  Building2, Clapperboard, Clock,
} from "lucide-react";
import "@/styles/wizard.css";
import { RELEASES } from "@/data/releases";

type Stage = 1 | 2 | 3 | 4 | 5;
type Person = { id: string; name: string };
type CastMember = { id: string; name: string; role: string };
type Cover = { name: string; dataUrl: string; width: number; height: number; size: number };

const STEPS = ["Үндсэн мэдээлэл","Файл оруулах","Постер","Тохиргоо","Хянах & Илгээх"];
const FILM_GENRES = ["Уран сайхны","Баримтат","Богино хэрэглэл","Хүүхэлдэйн","Аниме","Комеди","Драм","Экшн","Триллер","Аймшгийн","Романтик","Түүхэн","Хүүхэд","Бусад"];
const FILM_LANGUAGES = ["Монгол","English / Latin","Орос","Хятад","Солонгос","Японы","Бусад"];
const FILM_AGE_RATINGS = ["0+","6+","12+","16+","18+"];
const FILM_ROLES = ["Зохиолч","Гол дүрийн жүжигчин","Жүжигчид","Зурагчин","Монтажчин","Хөгжмийн зохиолч","Продакшн дизайнер","Хувцас загварч","Арт директор","Дууны найруулагч"];
const KNOWN_STUDIOS: Person[] = [
  { id: "ST1", name: "Mongol Content LLC" },
  { id: "ST2", name: "Nomad Films" },
  { id: "ST3", name: "Алтай Пикчерс" },
  { id: "ST4", name: "Монгол Кино" },
  { id: "ST5", name: "УБ Студи" },
  { id: "ST6", name: "Steppe Pictures" },
];
const FILM_SVCS_DOMESTIC = ["MN TV+","ТВ-8"];
const FILM_SVCS_VOD = ["Netflix","Apple TV+","Amazon Prime Video","Disney+"];
const FILM_SVCS_DIGITAL = ["Vimeo","YouTube Premium"];
const KNOWN_PEOPLE: Person[] = [
  { id: "P1", name: "Б. Батбаяр" },
  { id: "P2", name: "Д. Мөнхбат" },
  { id: "P3", name: "Н. Батсайхан" },
  { id: "P4", name: "Г. Ариунаа" },
  { id: "P5", name: "Д. Гантулга" },
  { id: "P6", name: "Б. Мөнхзул" },
];

const TITLE_LANGS = [
  { code: "mn", label: "Монгол" },
  { code: "en", label: "English / Latin" },
  { code: "ru", label: "Орос" },
  { code: "zh", label: "Хятад" },
  { code: "ko", label: "Солонгос" },
  { code: "ja", label: "Японы" },
  { code: "other", label: "Бусад" },
];
function titleLangLabel(code: string) {
  return TITLE_LANGS.find(l => l.code === code)?.label ?? code;
}

function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [open]);
  return (
    <span className="wiz-info-wrap">
      <span className="wiz-info-btn" role="button" aria-label="Тайлбар"
        onMouseDown={e => {
          e.stopPropagation();
          const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
          setPos({ x: r.left + r.width / 2, y: r.top });
          setOpen(v => !v);
        }}>i</span>
      {open && (
        <span className="wiz-info-tip-popup" style={{ position: "fixed", left: pos.x, top: pos.y - 8, transform: "translate(-50%,-100%)", zIndex: 9999 }}>
          {text}
        </span>
      )}
    </span>
  );
}

function addDays(n: number) {
  const d = new Date(Date.now() + n * 86400000);
  return d.toISOString().split("T")[0];
}

function initials(name: string) {
  return name.split(" ").map(w => w[0] || "").join("").toUpperCase().slice(0, 2) || "?";
}

function filmSvcIcon(name: string): string {
  const map: Record<string, string> = {
    "Netflix": "NF", "Apple TV+": "TV", "Amazon Prime Video": "AP",
    "Disney+": "D+", "Vimeo": "VI", "YouTube Premium": "YT",
    "MN TV+": "MN", "ТВ-8": "ТВ",
  };
  return map[name] ?? name.slice(0, 2).toUpperCase();
}

export default function SubmitFilmInfoScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: pathId } = useParams<{ id?: string }>();
  const editId = pathId ?? searchParams.get("edit");
  const editRelease = editId ? RELEASES.find(r => r.id === editId && r.contentType === "film") : null;

  const [stage, setStage] = useState<Stage>(1);

  // Title
  const [titleMn, setTitleMn] = useState(editRelease?.title ?? "");
  const [titleEn, setTitleEn] = useState("");
  const [titleLang, setTitleLang] = useState("mn");
  const [titleLangOpen, setTitleLangOpen] = useState(false);
  const [titleExtras, setTitleExtras] = useState<Record<string, string>>({});

  // Directors — separate required field
  const [directors, setDirectors] = useState<Person[]>([]);
  const [directorOpen, setDirectorOpen] = useState(false);
  const [directorQuery, setDirectorQuery] = useState("");

  // Producers — separate optional field
  const [producers, setProducers] = useState<Person[]>([]);
  const [producerOpen, setProducerOpen] = useState(false);
  const [producerQuery, setProducerQuery] = useState("");

  // Other cast/crew — excludes director and producer roles
  const [cast, setCast] = useState<CastMember[]>(
    editRelease?.cast?.map((c, i) => ({ id: String(i), name: c.name, role: c.role })) ?? []
  );
  const [castOpen, setCastOpen] = useState(false);
  const [castQuery, setCastQuery] = useState("");
  const [castRole, setCastRole] = useState("Зохиолч");

  // Release metadata
  const [genre, setGenre] = useState(editRelease?.genre ?? "");
  const [genreOpen, setGenreOpen] = useState(false);
  const [genreSearch, setGenreSearch] = useState("");
  const [subGenre, setSubGenre] = useState("");
  const [language, setLanguage] = useState("Монгол");
  const [ageRating, setAgeRating] = useState(editRelease?.ageRating ?? "");

  // Duration — simple text "H:MM:SS" or "MM:SS"
  const [duration, setDuration] = useState("");

  // Studios — multiple, searchable
  const [studios, setStudios] = useState<string[]>(editRelease?.label ? [editRelease.label] : []);
  const [studioOpen, setStudioOpen] = useState(false);
  const [studioQuery, setStudioQuery] = useState("");

  const [synopsis, setSynopsis] = useState(editRelease?.synopsis ?? "");
  const [cOwner, setCOwner] = useState("");
  const [cYear, setCYear] = useState(String(new Date().getFullYear()));
  const [showCopyright, setShowCopyright] = useState(false);

  // File — URL + password instead of direct upload
  const [filmUrl, setFilmUrl] = useState("");
  const [filmPassword, setFilmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");

  // Poster
  const [poster, setPoster] = useState<Cover | null>(null);
  const posterRef = React.useRef<HTMLInputElement>(null);
  const handlePosterFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => setPoster({ name: f.name, dataUrl: ev.target!.result as string, width: img.width, height: img.height, size: f.size });
      img.src = ev.target!.result as string;
    };
    reader.readAsDataURL(f);
  };

  // Distribution
  const [scheduleMode, setScheduleMode] = useState<"asap" | "date">("asap");
  const [releaseDate, setReleaseDate] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const toggleService = (svc: string) => setSelectedServices(prev => prev.includes(svc) ? prev.filter(s => s !== svc) : [...prev, svc]);

  // Review
  const [submitted, setSubmitted] = useState(false);
  const [reviewConfirmed, setReviewConfirmed] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const tid = setTimeout(() => {
      try {
        const t = new Date();
        setDraftSavedAt(`${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}`);
      } catch {}
    }, 1500);
    return () => clearTimeout(tid);
  }, [titleMn, titleEn, directors, producers, cast, genre, subGenre, ageRating, studios,
      duration, filmUrl, filmPassword,
      poster, scheduleMode, releaseDate, selectedServices, reviewConfirmed]);

  const handleNext = () => { if (stage < 5) setStage((stage + 1) as Stage); else if (reviewConfirmed) setSubmitted(true); };
  const handleBack = () => { if (stage > 1) setStage((stage - 1) as Stage); else navigate(-1); };
  const closeAll = () => { setCastOpen(false); setGenreOpen(false); setTitleLangOpen(false); setDirectorOpen(false); setProducerOpen(false); setStudioOpen(false); };

  const s1ok = !!titleMn.trim() && directors.length > 0 && !!genre && !!ageRating;
  const s2ok = !!filmUrl.trim();
  const s3ok = !!poster;
  const s4ok = (scheduleMode === "asap" || !!releaseDate) && selectedServices.length > 0;

  const shellTitle = titleMn.trim() || (editRelease ? "Кино засах" : "Кино нэмэх");
  const shellSubtitle = directors.length > 0 ? `Найруулагч: ${directors.map(d => d.name).join(", ")}` : "Кино, видео бүтээлийн мэдээлэл";
  const publishLabel = scheduleMode === "asap" ? "Аль болох хурдан · 2–3 ажлын өдөр" : (releaseDate ? `Нийтлэх огноо · ${releaseDate}` : "Огноо сонгоогүй");

  // ─── Stage content — called as function to preserve input focus ─────────────
  function renderStage(): React.ReactNode {

    // ── Stage 1 ────────────────────────────────────────────────────────────
    if (stage === 1) {
      // Cast: grouped by person name for display
      const castByName = cast.reduce<Record<string, CastMember[]>>((acc, c) => {
        (acc[c.name] ??= []).push(c);
        return acc;
      }, {});

      // Reusable person picker builder (directors / producers / cast)
      function personPickerJSX({
        label, hint, required, people, setPeople,
        open, setOpen, query, setQuery, emptyText, accentColor,
        withRole, role, setRole,
      }: {
        label: string; hint: string; required?: boolean;
        people: Person[]; setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
        open: boolean; setOpen: (v: boolean) => void; query: string; setQuery: (v: string) => void;
        emptyText: string; accentColor?: string;
        withRole?: boolean; role?: string; setRole?: (r: string) => void;
      }) {
        const alreadyAdded = (name: string) => people.some(p => p.name === name);
        const alreadyInRole = (name: string, r: string) => cast.some(c => c.name === name && c.role === r);
        const filtered = KNOWN_PEOPLE.filter(p => !query || p.name.toLowerCase().includes(query.toLowerCase()));
        const canCreate = query.trim() && !alreadyAdded(query.trim());
        const canCreateCast = query.trim() && role && !alreadyInRole(query.trim(), role);
        const bg = accentColor ?? "var(--w-accent)";

        return (
          <div className="wiz-artist-section">
            <div className="wiz-artist-section-head">
              <div>
                <h3 style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  {label}{required && <span className="wiz-req">*</span>}
                </h3>
                <span>{hint}</span>
              </div>
              <button type="button" className="wiz-btn wiz-artist-role-action"
                onClick={e => { e.stopPropagation(); setOpen(!open); setQuery(""); }}>
                <Plus size={12} />{people.length > 0 ? "Нэмэх" : "Сонгох"}
              </button>
            </div>
            <div className="wiz-artist-role-box">
              {people.length > 0 ? (
                <div className="wiz-artist-selected-list">
                  {people.map(p => (
                    <div key={p.id} className="wiz-artist-selected-card">
                      <span className="wiz-avatar md" style={{ background: bg, color: "#fff" }}>{initials(p.name)}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <b style={{ display: "block", fontSize: 13 }}>{p.name}</b>
                        <span style={{ fontSize: 12, color: "var(--w-muted)" }}>{label}</span>
                      </div>
                      <button type="button" className="wiz-btn icon-btn"
                        onClick={() => setPeople(prev => prev.filter(x => x.id !== p.id))}>
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="wiz-artist-empty"><UserRound size={15} /><span>{emptyText}</span></div>
              )}
              {open && (
                <div style={{ marginTop: 8, border: "1px solid var(--w-line)", borderRadius: 10, background: "#fff", overflow: "hidden", boxShadow: "0 8px 24px #0002" }}
                  onClick={e => e.stopPropagation()}>
                  <div style={{ padding: "6px 8px 4px", position: "relative" }}>
                    <Search size={13} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", color: "#999" }} />
                    <input className="wiz-input" style={{ height: 38, paddingLeft: 32 }}
                      value={query} onChange={e => setQuery(e.target.value)}
                      placeholder={`${label} хайх эсвэл нэр оруулах...`} autoFocus />
                  </div>
                  <div style={{ maxHeight: 180, overflowY: "auto" }}>
                    {filtered.map(p => {
                      const added = alreadyAdded(p.name);
                      return (
                        <div key={p.id} className="wiz-option"
                          style={{ display: "flex", alignItems: "center", gap: 9, opacity: added ? 0.45 : 1 }}
                          onMouseDown={() => {
                            if (added) return;
                            setPeople(prev => [...prev, p]);
                            setQuery(""); setOpen(false);
                          }}>
                          <span className="wiz-avatar sm">{initials(p.name)}</span>
                          <span style={{ flex: 1, fontSize: 13 }}>{p.name}</span>
                          {added && <span style={{ fontSize: 11, color: "var(--w-muted)" }}>аль байна</span>}
                        </div>
                      );
                    })}
                    {canCreate && (
                      <div className="wiz-option" style={{ color: "var(--w-accent)", fontWeight: 700, display: "flex", alignItems: "center", gap: 7 }}
                        onMouseDown={() => {
                          setPeople(prev => [...prev, { id: "N" + Date.now(), name: query.trim() }]);
                          setQuery(""); setOpen(false);
                        }}>
                        <Plus size={12} />"{query.trim()}" нэмэх
                      </div>
                    )}
                    {filtered.length === 0 && !canCreate && (
                      <div style={{ padding: "12px 14px", fontSize: 13, color: "var(--w-muted)" }}>Илэрц олдсонгүй</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }

      function directorPickerJSX() {
        return personPickerJSX({
          label: "Найруулагч", hint: "Киноны найруулагч — шаардлагатай", required: true,
          people: directors, setPeople: setDirectors,
          open: directorOpen, setOpen: setDirectorOpen, query: directorQuery, setQuery: setDirectorQuery,
          emptyText: "Найруулагч нэмэгдээгүй байна.", accentColor: "var(--w-accent)",
        });
      }

      function producerPickerJSX() {
        return personPickerJSX({
          label: "Продюсер", hint: "Кино бүтээгдэхүүнийг санхүүжүүлж удирдсан хүн",
          people: producers, setPeople: setProducers,
          open: producerOpen, setOpen: setProducerOpen, query: producerQuery, setQuery: setProducerQuery,
          emptyText: "Продюсер нэмэгдээгүй байна.", accentColor: "#7c3aed",
        });
      }

      // CastPicker — other crew roles only (no director/producer)
      function castPickerJSX() {
        const castByName = cast.reduce<Record<string, CastMember[]>>((acc, c) => {
          (acc[c.name] ??= []).push(c);
          return acc;
        }, {});
        const alreadyInRole = (name: string, role: string) => cast.some(c => c.name === name && c.role === role);
        const filteredPeople = KNOWN_PEOPLE.filter(p => !castQuery || p.name.toLowerCase().includes(castQuery.toLowerCase()));
        const canCreateNew = castQuery.trim() && !alreadyInRole(castQuery.trim(), castRole);

        return (
          <div className="wiz-artist-section">
            <div className="wiz-artist-section-head">
              <div>
                <h3>Бусад баг</h3>
                <span>Зохиолч, жүжигчид, зурагчин болон бусад</span>
              </div>
              <button type="button" className="wiz-btn wiz-artist-role-action"
                onClick={e => { e.stopPropagation(); setCastOpen(v => !v); setCastQuery(""); }}>
                <Plus size={12} />Нэмэх
              </button>
            </div>
            <div className="wiz-artist-role-box">
              {Object.keys(castByName).length > 0 ? (
                <div className="wiz-artist-selected-list">
                  {Object.entries(castByName).map(([name, entries]) => (
                    <div key={name} className="wiz-artist-selected-card" style={{ alignItems: "flex-start" }}>
                      <span className="wiz-avatar md" style={{ marginTop: 2 }}>{initials(name)}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <b style={{ display: "block", fontSize: 13 }}>{name}</b>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 5 }}>
                          {entries.map(e => (
                            <span key={e.id} style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#ebebf4", color: "var(--w-text)" }}>
                              {e.role}
                              <button type="button"
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginLeft: 1, display: "flex", alignItems: "center", opacity: 0.7, color: "inherit" }}
                                onClick={() => setCast(prev => prev.filter(x => x.id !== e.id))}>
                                <X size={9} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                      <button type="button" className="wiz-btn icon-btn"
                        onClick={() => setCast(prev => prev.filter(x => x.name !== name))}>
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="wiz-artist-empty"><UserRound size={15} /><span>Бусад баг гишүүн нэмэгдээгүй.</span></div>
              )}

              {castOpen && (
                <div style={{ marginTop: 8, border: "1px solid var(--w-line)", borderRadius: 10, background: "#fff", overflow: "hidden", boxShadow: "0 8px 24px #0002" }}
                  onClick={e => e.stopPropagation()}>
                  <div style={{ padding: "8px 8px 4px", borderBottom: "1px solid var(--w-line)" }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: "var(--w-muted)", margin: "0 0 5px 2px" }}>ҮҮРЭГ СОНГОХ</p>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", paddingBottom: 8 }}>
                      {FILM_ROLES.map(r => (
                        <button key={r} type="button"
                          style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: `1px solid ${castRole === r ? "var(--w-accent)" : "#d8d9e1"}`, background: castRole === r ? "var(--w-soft)" : "#fff", color: castRole === r ? "var(--w-accent)" : "var(--w-text)", cursor: "pointer" }}
                          onMouseDown={e => { e.preventDefault(); setCastRole(r); }}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: "6px 8px 4px", position: "relative" }}>
                    <Search size={13} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", color: "#999" }} />
                    <input className="wiz-input" style={{ height: 38, paddingLeft: 32 }}
                      value={castQuery} onChange={e => setCastQuery(e.target.value)}
                      placeholder={`${castRole} хайх эсвэл нэр оруулах...`} autoFocus />
                  </div>
                  <div style={{ maxHeight: 180, overflowY: "auto" }}>
                    {filteredPeople.map(p => {
                      const alreadyHasRole = alreadyInRole(p.name, castRole);
                      return (
                        <div key={p.id} className="wiz-option"
                          style={{ display: "flex", alignItems: "center", gap: 9, opacity: alreadyHasRole ? 0.45 : 1 }}
                          onMouseDown={() => {
                            if (!alreadyHasRole) {
                              setCast(prev => [...prev, { id: Date.now().toString(), name: p.name, role: castRole }]);
                              setCastQuery(""); setCastOpen(false);
                            }
                          }}>
                          <span className="wiz-avatar sm">{initials(p.name)}</span>
                          <span style={{ flex: 1, fontSize: 13 }}>{p.name}</span>
                          {alreadyHasRole && <span style={{ fontSize: 11, color: "var(--w-muted)" }}>{castRole} аль байна</span>}
                        </div>
                      );
                    })}
                    {canCreateNew && (
                      <div className="wiz-option" style={{ color: "var(--w-accent)", fontWeight: 700, display: "flex", alignItems: "center", gap: 7 }}
                        onMouseDown={() => { setCast(prev => [...prev, { id: Date.now().toString(), name: castQuery.trim(), role: castRole }]); setCastQuery(""); setCastOpen(false); }}>
                        <Plus size={12} />"{castQuery.trim()}" — {castRole} нэмэх
                      </div>
                    )}
                    {filteredPeople.length === 0 && !canCreateNew && (
                      <div style={{ padding: "12px 14px", fontSize: 13, color: "var(--w-muted)" }}>Илэрц олдсонгүй</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }

      return (
        <>
          <div className="wiz-mode-pill"><Film size={13} />Кино · Кино видео бүтээл түгээх гэрээ</div>
          <h2>Үндсэн мэдээлэл</h2>

          {/* Title — single field + right-side lang selector */}
          <div className="wiz-section">
            <div className="wiz-field" onClick={e => e.stopPropagation()}>
              <label className="wiz-label">
                Киноны нэр <span className="wiz-req">*</span>
                <InfoTip text="Киноны гарчиг. Монгол болон English хувилбар шаардлагатай — олон улсын платформд English гарчиг харагдана." />
              </label>
              <div className="wiz-title-wrap">
                <div className="wiz-title-row">
                  <input value={titleMn} onChange={e => setTitleMn(e.target.value)}
                    placeholder="Гарчиг оруулах" />
                  <button type="button" className="wiz-title-lang-btn"
                    onClick={() => setTitleLangOpen(v => !v)}>
                    <span>{titleLangLabel(titleLang)}</span>
                    <ChevronDown size={11} />
                    {titleLangOpen && (
                      <div className="wiz-title-lang-drop" onMouseDown={e => e.stopPropagation()}>
                        {TITLE_LANGS.map(l => (
                          <div key={l.code} className={`wiz-title-lang-opt ${titleLang === l.code ? "active" : ""}`}
                            onMouseDown={() => { setTitleLang(l.code); setTitleLangOpen(false); }}>
                            {l.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                </div>
                {titleLang !== "en" && (
                  <div className="wiz-title-row wiz-title-en-row">
                    <span className="wiz-title-en-label">EN · заавал</span>
                    <input value={titleEn} onChange={e => setTitleEn(e.target.value)}
                      placeholder="English / Latin гарчиг" />
                  </div>
                )}
                {Object.entries(titleExtras).map(([code, val]) => (
                  <div className="wiz-title-row wiz-title-extra-row" key={code}>
                    <span className="wiz-title-extra-lang-badge">{titleLangLabel(code)}</span>
                    <input value={val}
                      onChange={e => setTitleExtras(prev => ({ ...prev, [code]: e.target.value }))}
                      placeholder={`${titleLangLabel(code)} гарчиг`} />
                    <button type="button" className="wiz-title-remove-btn"
                      onClick={() => setTitleExtras(prev => { const n = { ...prev }; delete n[code]; return n; })}>
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
              {titleLang !== "en" && !titleEn.trim() && titleMn.trim().length >= 3 && (
                <div className="wiz-title-warn">
                  <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                  English / Latin хувилбар нь дэлхийн платформуудад шаардлагатай. Дээр оруулна уу.
                </div>
              )}
              {TITLE_LANGS.filter(l => l.code !== titleLang && l.code !== "en" && !titleExtras[l.code]).length > 0 && (
                <div className="wiz-title-add-strip">
                  <span className="wiz-title-add-strip-label">Нэмэлт хувилбар:</span>
                  {TITLE_LANGS.filter(l => l.code !== titleLang && l.code !== "en" && !titleExtras[l.code]).map(l => (
                    <button key={l.code} type="button" className="wiz-title-add-btn"
                      onClick={() => setTitleExtras(prev => ({ ...prev, [l.code]: "" }))}>
                      + {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Director */}
          <div className="wiz-section">{directorPickerJSX()}</div>

          {/* Producer */}
          <div className="wiz-section">{producerPickerJSX()}</div>

          {/* Other cast/crew */}
          <div className="wiz-section">{castPickerJSX()}</div>

          {/* Film metadata */}
          <div className="wiz-section">
            <div className="wiz-grid2">
              <div className="wiz-field">
                <label className="wiz-label">Жанр <span className="wiz-req">*</span><InfoTip text="Киноны төрөл. Зөв жанр нь хайлт болон санал болгох системд нөлөөлнө." /></label>
                <div className="wiz-select-picker">
                  <div className="wiz-select-value" onClick={e => { e.stopPropagation(); setGenreOpen(v => !v); setGenreSearch(""); }}>
                    <span style={{ color: genre ? "var(--w-text)" : "var(--w-muted)", fontSize: 13 }}>{genre || "Жанр хайж сонгох"}</span>
                    <ChevronDown size={15} />
                  </div>
                  {genreOpen && (
                    <div className="wiz-select-menu" onClick={e => e.stopPropagation()}>
                      <div className="wiz-select-search"><Search size={13} /><input className="wiz-input" style={{ height: 32, paddingLeft: 28 }} value={genreSearch} onChange={e => setGenreSearch(e.target.value)} placeholder="Жанр хайх" autoFocus /></div>
                      {FILM_GENRES.filter(g => !genreSearch || g.toLowerCase().includes(genreSearch.toLowerCase())).map(g => (
                        <div key={g} className={`wiz-option ${g === genre ? "selected" : ""}`} onMouseDown={() => { setGenre(g); setGenreOpen(false); }}>{g}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="wiz-field">
                <label className="wiz-label">Дэд жанр</label>
                <input value={subGenre} onChange={e => setSubGenre(e.target.value)} className="wiz-input" placeholder="Жш: Нийгмийн, Сэтгэл зүй..." />
              </div>
              <div className="wiz-field">
                <label className="wiz-label">Хэл</label>
                <select value={language} onChange={e => setLanguage(e.target.value)} className="wiz-select">
                  {FILM_LANGUAGES.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="wiz-field">
                <label className="wiz-label">Нас хязгаарлалт <span className="wiz-req">*</span><InfoTip text="Агуулгад тохирсон насны ангилал. 18+ материал агуулсан бол заавал зааж тэмдэглэнэ." /></label>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {FILM_AGE_RATINGS.map(r => (
                    <button key={r} type="button"
                      style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 700, border: `1px solid ${ageRating === r ? "var(--w-accent)" : "#d8d9e1"}`, background: ageRating === r ? "var(--w-soft)" : "#fff", color: ageRating === r ? "var(--w-accent)" : "var(--w-text)", cursor: "pointer", transition: "all .15s" }}
                      onClick={() => setAgeRating(r)}>{r}</button>
                  ))}
                </div>
              </div>

              {/* Duration — simple text */}
              <div className="wiz-field">
                <label className="wiz-label">Үргэлжлэх хугацаа<InfoTip text="Киноны нийт урт. Цаг:минут:секунд форматаар бичнэ. Жш: 1:45:30" /></label>
                <input value={duration} onChange={e => setDuration(e.target.value)}
                  className="wiz-input" placeholder="1:45:30" style={{ maxWidth: 160 }} />
                <p className="wiz-hint" style={{ marginTop: 3 }}>Цаг:минут:секунд — жш: 1:45:30</p>
              </div>

              {/* Studios — searchable multiple */}
              <div className="wiz-field" style={{ gridColumn: "1/-1", position: "relative" }}>
                <label className="wiz-label">Студи / Продакшн<InfoTip text="Кино бүтээлд оролцсон продакшн компани. Олон байвал бүгдийг нэмнэ." /></label>
                {studios.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                    {studios.map(s => (
                      <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, padding: "4px 10px 4px 12px", borderRadius: 20, background: "var(--w-soft)", color: "var(--w-accent)", border: "1px solid #e4e0ff" }}>
                        {s}
                        <button type="button" onClick={() => setStudios(prev => prev.filter(x => x !== s))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", color: "inherit", opacity: 0.7 }}>
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ position: "relative" }}>
                  <Search size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#999", pointerEvents: "none" }} />
                  <input value={studioQuery} onChange={e => { setStudioQuery(e.target.value); setStudioOpen(true); }}
                    onFocus={() => setStudioOpen(true)}
                    className="wiz-input" style={{ paddingLeft: 32 }}
                    placeholder="Студи хайх эсвэл нэр бичих..." />
                </div>
                {studioOpen && (studioQuery.trim() || KNOWN_STUDIOS.length > 0) && (
                  <div style={{ marginTop: 4, border: "1px solid var(--w-line)", borderRadius: 10, background: "#fff", overflow: "hidden", boxShadow: "0 8px 24px #0002", position: "relative", zIndex: 20 }}
                    onClick={e => e.stopPropagation()}>
                    <div style={{ maxHeight: 180, overflowY: "auto" }}>
                      {KNOWN_STUDIOS.filter(s => !studios.includes(s.name) && (!studioQuery || s.name.toLowerCase().includes(studioQuery.toLowerCase()))).map(s => (
                        <div key={s.id} className="wiz-option" style={{ display: "flex", alignItems: "center", gap: 9 }}
                          onMouseDown={() => { setStudios(prev => [...prev, s.name]); setStudioQuery(""); setStudioOpen(false); }}>
                          <span style={{ fontSize: 13 }}>{s.name}</span>
                        </div>
                      ))}
                      {studioQuery.trim() && !studios.includes(studioQuery.trim()) && !KNOWN_STUDIOS.some(s => s.name === studioQuery.trim()) && (
                        <div className="wiz-option" style={{ color: "var(--w-accent)", fontWeight: 700, display: "flex", alignItems: "center", gap: 7 }}
                          onMouseDown={() => { setStudios(prev => [...prev, studioQuery.trim()]); setStudioQuery(""); setStudioOpen(false); }}>
                          <Plus size={12} />"{studioQuery.trim()}" нэмэх
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="wiz-section">
            <div className="wiz-field">
              <label className="wiz-label">Тайлбар / Агуулга<InfoTip text="Киноны агуулгыг товчхон танилцуулна. Үзэгчдийн сонирхлыг татах хэд хэдэн өгүүлбэр бичнэ." /></label>
              <textarea value={synopsis} onChange={e => setSynopsis(e.target.value)} rows={4} placeholder="Киноны товч агуулга..."
                style={{ width: "100%", padding: "10px 12px", fontSize: 14, borderRadius: 8, border: "1px solid #d8d9e1", outline: "none", resize: "vertical", fontFamily: "inherit", color: "var(--w-text)", background: "#fff" }} />
            </div>
          </div>

          {/* Copyright */}
          <div className="wiz-section">
            <button type="button" onClick={() => setShowCopyright(v => !v)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, color: "var(--w-text)", padding: "4px 0", width: "100%" }}>
              {!cOwner && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--w-danger)", flexShrink: 0 }} />}
              Зохиогчийн эрх
              {!cOwner && <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 20, background: "#fde8e8", color: "var(--w-danger)" }}>Дутуу</span>}
              {cOwner && <Check size={13} style={{ color: "#22c55e" }} />}
              <ChevronDown size={14} style={{ marginLeft: "auto", transform: showCopyright ? "rotate(180deg)" : "", transition: "transform .2s" }} />
            </button>
            {showCopyright && (
              <div className="wiz-grid2" style={{ marginTop: 12 }}>
                <div className="wiz-field">
                  <label className="wiz-label">© Эзэмшигч <span className="wiz-req">*</span><InfoTip text="Оюуны өмчийн эрх эзэмшигч. Зохиолч, хэвлэлийн газар эсвэл компани байж болно." /></label>
                  <input value={cOwner} onChange={e => setCOwner(e.target.value)} className="wiz-input" placeholder="Хувь хүн эсвэл компани" />
                </div>
                <div className="wiz-field">
                  <label className="wiz-label">© Он<InfoTip text="Оюуны өмчийн эрх анх авсан жил." /></label>
                  <input type="number" value={cYear} onChange={e => setCYear(e.target.value)} min="1900" max="2030" className="wiz-input" />
                </div>
              </div>
            )}
          </div>
        </>
      );
    }

    // ── Stage 2 — File URL + password ─────────────────────────────────────
    if (stage === 2) return (
      <>
        <h2>Файл оруулах</h2>

        {/* Film file via URL */}
        <div className="wiz-section">
          <div className="wiz-field">
            <label className="wiz-label">
              Киноны файл холбоос <span className="wiz-req">*</span>
            </label>
            <div style={{ position: "relative" }}>
              <Link2 size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--w-muted)", pointerEvents: "none" }} />
              <input type="url" value={filmUrl} onChange={e => setFilmUrl(e.target.value)}
                className="wiz-input" style={{ paddingLeft: 34 }}
                placeholder="https://drive.google.com/... эсвэл Vimeo / Dropbox холбоос" />
            </div>
            <p className="wiz-hint" style={{ marginTop: 4 }}>Google Drive, Dropbox, Vimeo, WeTransfer гэх мэт үйлчилгээний нийтийн холбоос оруулна уу.</p>
          </div>

          <div className="wiz-field">
            <label className="wiz-label">
              Нэвтрэх нууц үг
              <span style={{ fontWeight: 400, color: "#9d9ab5", fontSize: 12, marginLeft: 6 }}>(хэрэв байгаа бол)</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={filmPassword} onChange={e => setFilmPassword(e.target.value)}
                className="wiz-input" style={{ paddingRight: 40 }}
                placeholder="Файл руу хандах нууц үг" />
              <button type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--w-muted)", display: "flex", alignItems: "center" }}>
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {filmUrl.trim() && (
            <div className="wiz-id-auto" style={{ marginTop: 4 }}>
              <Check size={17} style={{ color: "#22c55e" }} />
              <div>
                <b>Холбоос оруулсан</b>
                <span style={{ wordBreak: "break-all" }}>{filmUrl}</span>
              </div>
            </div>
          )}
        </div>

        {/* Trailer URL */}
        <div className="wiz-section">
          <div className="wiz-field">
            <label className="wiz-label">
              Трейлер URL
              <span style={{ fontWeight: 400, color: "#9d9ab5", fontSize: 12, marginLeft: 6 }}>(заавал биш)</span>
            </label>
            <div style={{ position: "relative" }}>
              <Link2 size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--w-muted)", pointerEvents: "none" }} />
              <input value={trailerUrl} onChange={e => setTrailerUrl(e.target.value)}
                className="wiz-input" style={{ paddingLeft: 34 }}
                placeholder="https://youtube.com/watch?v=..." />
            </div>
          </div>
        </div>
      </>
    );

    // ── Stage 3 — Poster 250×375 (2:3) ────────────────────────────────────
    if (stage === 3) {
      const validRatio = poster ? Math.abs(poster.width / poster.height - 2 / 3) < 0.06 : false;
      return (
        <>
          <h2>Постер зураг</h2>
          <div className="wiz-cover-layout" style={{ gridTemplateColumns: "250px 1fr" }}>
            {/* 250×375 drop zone (2:3 ratio) */}
            <div className="wiz-cover-drop" style={{ aspectRatio: "2/3" }} onClick={() => posterRef.current?.click()}>
              {poster ? (
                <>
                  <img src={poster.dataUrl} alt="poster" />
                  <div className="wiz-cover-overlay">
                    <UploadCloud size={14} />
                    <b style={{ flex: 1, minWidth: 0 }}>{poster.name}</b>
                    <span>{poster.width}×{poster.height}</span>
                  </div>
                </>
              ) : (
                <div className="wiz-cover-content">
                  <ImageIcon size={34} />
                  <b>Постер оруулах</b>
                  <span>JPG, PNG · Min 1000×1500px</span>
                  <button type="button" className="wiz-btn" onClick={e => { e.stopPropagation(); posterRef.current?.click(); }}>Файл сонгох</button>
                </div>
              )}
            </div>

            {/* Requirements panel */}
            <div className="wiz-cover-req-box">
              <h3>Постер зургийн шаардлага</h3>
              <p>Киноны постер нь дараах стандартыг хангасан байх ёстой.</p>
              <div className="wiz-cover-req-group">
                {[
                  "Хамгийн багадаа 1000×1500px",
                  "2:3 харьцаа (постер формат)",
                  "JPG эсвэл PNG формат",
                  "72 DPI-аас их нягтрал",
                  "Зохиогчийн эрх зөрчилгүй зураг",
                ].map(t => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 7, padding: "4px 0", fontSize: 12, color: "#5b5f70" }}>
                    <Check size={12} style={{ color: "#22c55e", flexShrink: 0 }} />{t}
                  </div>
                ))}
              </div>
              <div className="wiz-cover-spec-badges">
                <span className="wiz-cover-spec-badge">2:3</span>
                <span className="wiz-cover-spec-badge">Min 1000×1500</span>
                <span className="wiz-cover-spec-badge">JPG/PNG</span>
                <span className="wiz-cover-spec-badge">72+ DPI</span>
              </div>
              {poster && (
                <p style={{ marginTop: 12, fontSize: 12, color: validRatio ? "#22c55e" : "#f59e0b", display: "flex", alignItems: "center", gap: 5 }}>
                  {validRatio ? <Check size={11} /> : <TriangleAlert size={11} />}
                  {poster.width}×{poster.height}px · {(poster.size / 1024 / 1024).toFixed(1)} MB
                  {!validRatio && " — Харьцаа хангалтгүй"}
                </p>
              )}
              {!poster && (
                <button type="button" className="wiz-btn" style={{ marginTop: 14 }} onClick={() => posterRef.current?.click()}>
                  <UploadCloud size={14} />Постер сонгох
                </button>
              )}
            </div>
          </div>
          <input ref={posterRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handlePosterFile} />
        </>
      );
    }

    // ── Stage 4 — publish + film platforms ────────────────────────────────
    if (stage === 4) {
      function ServiceGroup({ title, desc, svcList }: { title: string; desc: string; svcList: string[] }) {
        const allOn = svcList.every(s => selectedServices.includes(s));
        function toggleGroup() {
          if (allOn) setSelectedServices(prev => prev.filter(s => !svcList.includes(s)));
          else setSelectedServices(prev => [...prev, ...svcList.filter(s => !prev.includes(s))]);
        }
        return (
          <div className="wiz-service-group">
            <div className="wiz-service-group-head">
              <div><h4>{title}</h4><p>{desc}</p></div>
              <button type="button" className={`wiz-group-toggle ${allOn ? "active" : ""}`} onClick={toggleGroup}>
                <span className="wiz-group-toggle-check"><Check size={11} /></span>
                {allOn ? "Сонгосон" : "Сонгох"}
              </button>
            </div>
            <div className="wiz-bundle-services">
              {svcList.map(name => {
                const on = selectedServices.includes(name);
                return (
                  <div key={name} className="wiz-bundle-service"
                    style={{ cursor: "pointer", borderColor: on ? "var(--w-accent)" : undefined, background: on ? "var(--w-soft)" : undefined, position: "relative", transition: "all .15s" }}
                    onClick={() => toggleService(name)}>
                    <span className="wiz-service-logo" style={{ background: on ? "var(--w-accent)" : undefined, color: on ? "#fff" : undefined, transition: "all .15s" }}>{filmSvcIcon(name)}</span>
                    <b>{name}</b>
                    {on && <Check size={11} style={{ position: "absolute", top: 8, right: 8, color: "var(--w-accent)" }} />}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      return (
        <div className="wiz-publish-shell">
          <div className="wiz-publish-topbar">
            <div><h2>Тохиргоо</h2><p>Нийтлэх хугацаа болон кино түгээх платформуудаа сонгоно уу.</p></div>
            <div className="wiz-publish-summary">
              <span className="wiz-publish-summary-pill"><CalendarClock size={13} />{publishLabel}</span>
              <span className="wiz-publish-summary-pill"><RadioTower size={13} />{selectedServices.length} платформ</span>
            </div>
          </div>

          <section className="wiz-publish-block">
            <div className="wiz-publish-block-head">
              <div><h3>Нийтлэх хугацаа</h3><p>Бэлэн болмогц нийтлэх эсвэл тодорхой өдөр төлөвлөнө.</p></div>
            </div>
            <div className="wiz-publish-block-body">
              <div className="wiz-schedule-grid">
                {[
                  { id: "asap", icon: <ZapIcon size={18} />, title: "Аль болох хурдан", desc: "Шалгалт дуусмагц нийтэлнэ. Ойролцоогоор 2–3 ажлын өдөр." },
                  { id: "date", icon: <CalendarDays size={18} />, title: "Огноо төлөвлөх", desc: "Тодорхой өдөр сонгоно. Өнөөдрөөс дор хаяж 7 хоногийн дараа байна." },
                ].map(opt => (
                  <label key={opt.id} className={`wiz-schedule-choice ${scheduleMode === opt.id ? "active" : ""}`}>
                    <input type="radio" name="schedule" checked={scheduleMode === opt.id} onChange={() => setScheduleMode(opt.id as "asap" | "date")} />
                    <span className="wiz-schedule-icon">{opt.icon}</span>
                    <span className="wiz-schedule-text"><b>{opt.title}</b><span>{opt.desc}</span></span>
                    <span className="wiz-schedule-check"><Check size={11} /></span>
                  </label>
                ))}
              </div>
              {scheduleMode === "date" && (
                <div className="wiz-schedule-date">
                  <div className="wiz-field" style={{ margin: 0 }}>
                    <label className="wiz-label" style={{ fontSize: 12 }}>Нийтлэх огноо <span className="wiz-req">*</span></label>
                    <input type="date" className="wiz-input" min={addDays(7)} value={releaseDate} onChange={e => setReleaseDate(e.target.value)} />
                  </div>
                  <div className="wiz-schedule-date-note"><Info size={13} /><span>Хамгийн эрт боломжит огноо: <b>{addDays(7)}</b>.</span></div>
                </div>
              )}
            </div>
          </section>

          <section className="wiz-publish-block">
            <div className="wiz-publish-block-head">
              <div><h3>Түгээх платформууд</h3><p>Киноны түгээлт хийх платформуудаа сонгоно уу.</p></div>
            </div>
            <div className="wiz-publish-block-body">
              <div className="wiz-service-section">
                <ServiceGroup title="Дотоодын ТВ платформ" desc="Монголын ТВ болон стриминг үйлчилгээнүүд" svcList={FILM_SVCS_DOMESTIC} />
                <ServiceGroup title="Дэлхийн VOD платформ" desc="Олон улсын стриминг үйлчилгээнүүд" svcList={FILM_SVCS_VOD} />
                <ServiceGroup title="Дижитал платформ" desc="Вэб болон дижитал видео суваг" svcList={FILM_SVCS_DIGITAL} />
              </div>
            </div>
          </section>
        </div>
      );
    }

    // ── Stage 5 — success ──────────────────────────────────────────────────
    if (submitted) return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "48px 0", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: "#fde8ef", display: "grid", placeItems: "center" }}>
          <CircleCheckBig size={30} style={{ color: "#f43f5e" }} />
        </div>
        <div>
          <h2 style={{ margin: 0 }}>Амжилттай илгээгдлээ!</h2>
          <p style={{ color: "var(--w-muted)", marginTop: 6 }}>"{titleMn}" кино шалгагдаж байна.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="wiz-btn" onClick={() => navigate("/movies")}>Каталог харах</button>
          <button className="wiz-btn primary" onClick={() => navigate("/dashboard")}>Хяналтын самбар</button>
        </div>
      </div>
    );

    // ── Stage 5 — review ───────────────────────────────────────────────────
    const castSummary = Object.entries(
      cast.reduce<Record<string, string[]>>((acc, c) => { (acc[c.name] ??= []).push(c.role); return acc; }, {})
    ).map(([name, roles]) => `${name} (${roles.join(", ")})`).join(" · ") || "—";
    const directorSummary = directors.map(d => d.name).join(", ") || "—";
    const producerSummary = producers.map(p => p.name).join(", ") || "—";

    return (
      <div className="wiz-review-shell">
        <div className="wiz-review-hero">
          <h2>Хянах & Илгээх</h2>
          <p>Мэдээллийг нягтлан шалгана уу. Бүх зүйл зөв бол илгээнэ үү.</p>
        </div>
        <div className="wiz-review-grid">
          {/* Left column */}
          <div className="wiz-review-col">
            <div className="wiz-review-panel">
              <div className="wiz-review-panel-head">
                <div className="wiz-review-panel-head-title"><Film size={15} /><b>Үндсэн мэдээлэл</b></div>
              </div>
              <div className="wiz-review-panel-body">
                <div className="wiz-review-data-grid">
                  {([
                    [titleLangLabel(titleLang) + " нэр", titleMn || "—"],
                    ...(titleLang !== "en" ? [["English нэр", titleEn || "—"]] as [string,string][] : []),
                    ...Object.entries(titleExtras).map(([code, val]) => [titleLangLabel(code) + " нэр", val || "—"] as [string,string]),
                    ["Жанр", genre || "—"],
                    ["Хэл", language],
                    ["Нас хязгаарлалт", ageRating || "—"],
                    ["Үргэлжлэх хугацаа", duration.trim() || "—"],
                    ["Студи", studios.join(", ") || "—"],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="wiz-review-data-item"><span>{k}</span><b>{v}</b></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="wiz-review-panel">
              <div className="wiz-review-panel-head">
                <div className="wiz-review-panel-head-title"><Clapperboard size={15} /><b>Бүрэлдэхүүн</b></div>
              </div>
              <div className="wiz-review-panel-body">
                <div className="wiz-review-data-grid">
                  <div className="wiz-review-data-item"><span>Найруулагч</span><b>{directorSummary}</b></div>
                  <div className="wiz-review-data-item"><span>Продюсер</span><b>{producerSummary}</b></div>
                  {cast.length > 0 && (
                    <div className="wiz-review-data-item"><span>Бусад баг</span><b style={{ lineHeight: 1.6 }}>{castSummary}</b></div>
                  )}
                </div>
              </div>
            </div>
            <div className="wiz-review-panel">
              <div className="wiz-review-panel-head">
                <div className="wiz-review-panel-head-title"><Link2 size={15} /><b>Файл</b></div>
              </div>
              <div className="wiz-review-panel-body">
                <div className="wiz-review-data-item">
                  <span>Файл холбоос</span>
                  <b style={{ wordBreak: "break-all", fontSize: 12 }}>{filmUrl || "—"}</b>
                </div>
                {filmPassword && (
                  <div className="wiz-review-data-item" style={{ marginTop: 8 }}>
                    <span>Нууц үг</span>
                    <b>••••••</b>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Right column */}
          <div className="wiz-review-col">
            <div className="wiz-review-panel">
              <div className="wiz-review-panel-head">
                <div className="wiz-review-panel-head-title"><ImageIcon size={15} /><b>Постер</b></div>
              </div>
              <div className="wiz-review-panel-body">
                {/* 2:3 ratio poster preview */}
                <div className="wiz-review-cover-preview" style={{ aspectRatio: "2/3" }}>
                  {poster ? (
                    <img src={poster.dataUrl} alt="poster" />
                  ) : (
                    <div className="wiz-review-cover-empty">
                      <ImageOff size={28} />
                      <div>Постер оруулаагүй</div>
                    </div>
                  )}
                </div>
                {poster && (
                  <p style={{ marginTop: 8, fontSize: 11, color: "var(--w-muted)", textAlign: "center" }}>
                    {poster.width}×{poster.height}px · {(poster.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                )}
              </div>
            </div>
            <div className="wiz-review-panel">
              <div className="wiz-review-panel-head">
                <div className="wiz-review-panel-head-title"><CalendarClock size={15} /><b>Нийтлэх хугацаа</b></div>
              </div>
              <div className="wiz-review-panel-body">
                <div className="wiz-review-data-item">
                  <span>Горим</span>
                  <b>{scheduleMode === "asap" ? "Аль болох хурдан (2–3 ажлын өдөр)" : "Огноо төлөвлөсөн"}</b>
                </div>
                {scheduleMode === "date" && releaseDate && (
                  <div className="wiz-review-data-item" style={{ marginTop: 8 }}>
                    <span>Нийтлэх огноо</span>
                    <b>{releaseDate}</b>
                  </div>
                )}
                {selectedServices.length > 0 && (
                  <div className="wiz-review-service-wrap" style={{ marginTop: 10 }}>
                    {selectedServices.map(s => (
                      <span key={s} className="wiz-review-service-chip">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="wiz-review-confirm-simple">
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13 }}>
                <input type="checkbox" checked={reviewConfirmed} onChange={e => setReviewConfirmed(e.target.checked)}
                  style={{ width: 16, height: 16, marginTop: 1, accentColor: "#f43f5e", flexShrink: 0 }} />
                <span>Дээрх мэдээлэл зөв болохыг баталгаажуулж, нийтлэхийг зөвшөөрч байна.</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Guide Panel ──────────────────────────────────────────────────────────
  function GuidePanel() {
    const stageData = [
      { num: 1, title: "Үндсэн мэдээлэл", ok: s1ok, items: [
        { label: titleMn.trim() ? `"${titleMn}"` : "Монгол нэр оруулна уу", ok: !!titleMn.trim() },
        { label: directors.length > 0 ? `Найруулагч: ${directors.map(d => d.name).join(", ")}` : "Найруулагч нэмэх шаардлагатай", ok: directors.length > 0 },
        { label: genre || "Жанр сонгоогүй", ok: !!genre },
        { label: ageRating ? `Нас: ${ageRating}` : "Нас хязгаарлалт сонгоогүй", ok: !!ageRating },
      ]},
      { num: 2, title: "Файл оруулах", ok: s2ok, items: [
        { label: filmUrl ? "Файл холбоос оруулсан" : "Холбоос оруулаагүй", ok: !!filmUrl.trim() },
      ]},
      { num: 3, title: "Постер", ok: s3ok, items: [
        { label: poster ? `${poster.width}×${poster.height}px` : "Постер оруулаагүй", ok: !!poster },
      ]},
      { num: 4, title: "Тохиргоо", ok: s4ok, items: [
        { label: scheduleMode === "asap" ? "Аль болох хурдан" : (releaseDate ? `Огноо: ${releaseDate}` : "Огноо тохируулаагүй"), ok: scheduleMode === "asap" || !!releaseDate },
        { label: `${selectedServices.length} платформ сонгосон`, ok: selectedServices.length > 0 },
      ]},
      { num: 5, title: "Хянах & Илгээх", ok: reviewConfirmed, items: [
        { label: "Мэдээллийг баталгаажуулах", ok: reviewConfirmed },
      ]},
    ];
    const completedCount = stageData.filter(s => s.ok).length;
    return (
      <div className="wiz-guide-panel" style={{ marginTop: 0 }}>
        <div className="wiz-guide-card">
          <div className="wiz-guide-header">
            <div className="wiz-guide-header-title"><ClipboardCheck size={13} />Явц</div>
            <span className="wiz-guide-progress-badge">{completedCount}/{stageData.length}</span>
          </div>
          <div className="wiz-guide-bar-wrap">
            <div className="wiz-guide-bar"><i style={{ width: `${(completedCount / stageData.length) * 100}%` }} /></div>
          </div>
          <div className="wiz-guide-steps-list">
            {stageData.map(({ num, title, ok, items }) => {
              const isActive = stage === num;
              const isPast = stage > num;
              const isIssue = isPast && !ok;
              const dotType = ok && isPast ? "ok" : isActive ? "active" : isIssue ? "fail" : "pending";
              const showItems = isActive || isIssue;
              const rowCls = ["wiz-guide-step-row", isActive ? "active" : "", ok && isPast ? "done" : "", isIssue ? "issues" : ""].filter(Boolean).join(" ");
              return (
                <div key={num} className={rowCls} onClick={() => setStage(num as Stage)}>
                  <div className={`wiz-guide-step-dot ${dotType}`}>{ok && isPast ? <Check size={11} /> : isIssue ? "!" : num}</div>
                  <div className="wiz-guide-step-right">
                    <div className="wiz-guide-step-label">{title}</div>
                    {!showItems && ok && isPast && <div className="wiz-guide-step-sublabel">Бүрэн дууссан</div>}
                    {!isActive && !isPast && !ok && <div className="wiz-guide-step-sublabel" style={{ color: "#c5c8d8" }}>—</div>}
                    {showItems && (
                      <div className="wiz-guide-step-checklist">
                        {items.map((item, i) => (
                          <div key={i} className={`wiz-guide-check-item ${item.ok ? "ok" : "fail"}`}>
                            {item.ok ? <Check size={10} /> : <div className="wiz-guide-check-dot" />}
                            <span>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Shell title={shellTitle} subtitle={shellSubtitle}>
      <div className="wiz-in-shell" onClick={closeAll}>
        <div className="wiz-layout">
          <div className="wiz-content">
            <div className="wiz-steps" style={{ "--wiz-pct": `${((stage - 1) / (STEPS.length - 1)) * 80}%` } as React.CSSProperties}>
              {STEPS.map((s, i) => (
                <div key={s} className={`wiz-step ${stage === i + 1 ? "active" : stage > i + 1 ? "done" : ""}`}
                  onClick={e => { e.stopPropagation(); setStage((i + 1) as Stage); }}>
                  <span className="wiz-step-num">{stage > i + 1 ? <Check size={13} /> : i + 1}</span>
                  <span className="wiz-step-label-text">{s}</span>
                </div>
              ))}
            </div>
            <div className="wiz-form">{renderStage()}</div>
            <div className="wiz-footer">
              <button className="wiz-btn" onClick={handleBack}><ArrowLeft size={15} />Өмнөх</button>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {draftSavedAt && (
                  <span style={{ fontSize: 12, color: "#9d9ab5", display: "flex", alignItems: "center", gap: 5 }}>
                    <Check size={11} />Ноорог хадгалагдсан · {draftSavedAt}
                  </span>
                )}
                <button className="wiz-btn primary" disabled={stage === 5 && !reviewConfirmed} onClick={handleNext}>
                  {stage === 5 ? <><Send size={14} />Илгээх</> : <>Үргэлжлүүлэх<ArrowRight size={14} /></>}
                </button>
              </div>
            </div>
          </div>
          <GuidePanel />
        </div>
      </div>
    </Shell>
  );
}
