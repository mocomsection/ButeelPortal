import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Shell } from "@/components/layout/Shell";
import {
  BookOpen, ArrowLeft, ArrowRight, Send, Plus, X, Check,
  ChevronDown, Play, RefreshCw, Trash2, UploadCloud, FileAudio,
  AudioWaveform, TriangleAlert, CircleCheckBig, ClipboardCheck,
  Search, UserRound, ZapIcon, CalendarDays, CalendarClock,
  Info, Fingerprint, Image as ImageIcon, ImageOff, AlertCircle,
} from "lucide-react";
import "@/styles/wizard.css";
import { RELEASES } from "@/data/releases";

type Stage = 1 | 2 | 3 | 4 | 5;
type Person = { id: string; name: string };
type Chapter = {
  id: string; title: string; duration: string;
  sourceName: string; fileFormat: string; sampleRate: string; bitDepth: string;
  uploading: boolean; uploadProgress: number;
};
type Cover = { name: string; dataUrl: string; width: number; height: number; size: number };

const STEPS = ["Үндсэн мэдээлэл","Бүлгүүд","Ковер зураг","Нийтлэх & Түгээх","Шалгах & Илгээх"];
const AB_GENRES = ["Уран зохиол","Түүх","Шинжлэх ухаан","Хүүхэд","Танин мэдэхүй","Бизнес","Сэтгэл зүй","Хичээл","Туулган амьдрал","Яруу найраг","Бусад"];
const AB_LANGUAGES = ["Монгол","English / Latin","Орос","Хятад","Солонгос","Японы","Бусад"];
const KNOWN_PEOPLE: Person[] = [
  { id: "P1", name: "Д. Мөнхбат" },
  { id: "P2", name: "Болд Жаргал" },
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

function makeChapter(idx: number): Chapter {
  return { id: "CH-" + Date.now() + "-" + idx, title: `${idx}-р бүлэг`, duration: "", sourceName: "", fileFormat: "", sampleRate: "", bitDepth: "", uploading: false, uploadProgress: 0 };
}

function WaveBars({ seed = 0 }: { seed?: number }) {
  const h = [8,14,20,11,24,17,10,22,28,16,12,25,18,9,21,27,14,19,8,24];
  return (
    <div className="wiz-waveform">
      {h.map((v, i) => <i key={i} style={{ height: Math.max(3, Math.round(((v + (seed + i) % 7) / 36) * 24)) + "px" }} />)}
    </div>
  );
}

// ─── Person Picker — defined OUTSIDE to prevent remount-on-each-keystroke ─────
function PersonPicker({
  label, hint, required, multiple, people, query, open,
  onQueryChange, onOpen, onClose, onAdd, onRemove, roleName,
}: {
  label: string; hint?: string; required?: boolean; multiple: boolean;
  people: Person[]; query: string; open: boolean;
  onQueryChange: (v: string) => void;
  onOpen: () => void; onClose: () => void;
  onAdd: (p: Person) => void; onRemove: (id: string) => void;
  roleName: string;
}) {
  const filtered = KNOWN_PEOPLE.filter(p =>
    !people.find(x => x.id === p.id) &&
    (!query || p.name.toLowerCase().includes(query.toLowerCase()))
  );
  const canCreateNew = query.trim() && !KNOWN_PEOPLE.some(p => p.name.toLowerCase() === query.trim().toLowerCase());

  return (
    <div className="wiz-field">
      <div className="wiz-artist-section">
        <div className="wiz-artist-section-head">
          <div>
            <h3>{label}{required && <span className="wiz-req" style={{ marginLeft: 3 }}>*</span>}</h3>
            {hint && <span>{hint}</span>}
          </div>
          {(multiple || people.length === 0) && (
            <button type="button" className="wiz-btn wiz-artist-role-action"
              onClick={e => { e.stopPropagation(); if (open) onClose(); else onOpen(); }}>
              <Plus size={12} />{people.length > 0 ? "Нэмэх" : `${label} сонгох`}
            </button>
          )}
        </div>
        <div className="wiz-artist-role-box">
          {people.length > 0 ? (
            <div className="wiz-artist-selected-list">
              {people.map(p => (
                <div key={p.id} className="wiz-artist-selected-card">
                  <span className="wiz-avatar md">{initials(p.name)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <b style={{ display: "block", fontSize: 13 }}>{p.name}</b>
                    <span style={{ fontSize: 12, color: "#888" }}>{roleName}</span>
                  </div>
                  <button type="button" className="wiz-btn icon-btn" onClick={() => onRemove(p.id)}><X size={13} /></button>
                </div>
              ))}
            </div>
          ) : (
            <div className="wiz-artist-empty">
              <UserRound size={15} />
              <span>{label} сонгоогүй байна.</span>
            </div>
          )}
          {open && (
            <div style={{ marginTop: 10, border: "1px solid var(--w-line)", borderRadius: 10, background: "#fff", overflow: "hidden", boxShadow: "0 8px 24px #0002" }}
              onClick={e => e.stopPropagation()}>
              <div style={{ padding: "8px 8px 4px", position: "relative" }}>
                <Search size={13} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", color: "#999" }} />
                <input className="wiz-input" style={{ height: 38, paddingLeft: 32 }}
                  value={query} onChange={e => onQueryChange(e.target.value)}
                  placeholder={`${label} хайх эсвэл нэр оруулах...`} autoFocus />
              </div>
              <div style={{ maxHeight: 200, overflowY: "auto" }}>
                {filtered.map(p => (
                  <div key={p.id} className="wiz-option" style={{ display: "flex", alignItems: "center", gap: 9 }}
                    onMouseDown={() => { onAdd(p); onQueryChange(""); onClose(); }}>
                    <span className="wiz-avatar sm">{initials(p.name)}</span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: "block", fontSize: 13 }}>{p.name}</span>
                      <span style={{ display: "block", fontSize: 11, color: "var(--w-muted)" }}>ID: {p.id}</span>
                    </span>
                  </div>
                ))}
                {canCreateNew && (
                  <div className="wiz-option" style={{ color: "var(--w-accent)", fontWeight: 700, display: "flex", alignItems: "center", gap: 7 }}
                    onMouseDown={() => { onAdd({ id: "NEW-" + Date.now(), name: query.trim() }); onQueryChange(""); onClose(); }}>
                    <Plus size={12} />"{query.trim()}" нэмэх
                  </div>
                )}
                {filtered.length === 0 && !canCreateNew && (
                  <div style={{ padding: "12px 14px", fontSize: 13, color: "var(--w-muted)" }}>Илэрц олдсонгүй</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SubmitAudioBookInfoScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const editRelease = editId ? RELEASES.find(r => r.id === editId && r.contentType === "audiobook") : null;

  const [stage, setStage] = useState<Stage>(1);

  // Title
  const [titleMn, setTitleMn] = useState(editRelease?.title ?? "");
  const [titleEn, setTitleEn] = useState("");
  const [titleLang, setTitleLang] = useState("mn");
  const [titleLangOpen, setTitleLangOpen] = useState(false);
  const [titleExtras, setTitleExtras] = useState<Record<string, string>>({});

  // People
  const [authors, setAuthors] = useState<Person[]>([]);
  const [authorOpen, setAuthorOpen] = useState(false);
  const [authorQuery, setAuthorQuery] = useState("");
  const [narrator, setNarrator] = useState<Person | null>(null);
  const [narratorOpen, setNarratorOpen] = useState(false);
  const [narratorQuery, setNarratorQuery] = useState("");

  // Release info
  const [publisher, setPublisher] = useState(editRelease?.label ?? "");
  const [genre, setGenre] = useState(editRelease?.genre ?? "");
  const [genreOpen, setGenreOpen] = useState(false);
  const [genreSearch, setGenreSearch] = useState("");
  const [subGenre, setSubGenre] = useState("");
  const [language, setLanguage] = useState("Монгол");
  const [synopsis, setSynopsis] = useState(editRelease?.synopsis ?? "");
  const [isbn, setIsbn] = useState("");
  const [cOwner, setCOwner] = useState("");
  const [cYear, setCYear] = useState(String(new Date().getFullYear()));
  const [showCopyright, setShowCopyright] = useState(false);
  const [ageRating, setAgeRating] = useState("Бүгдэд тохиромжтой");
  const [isAbridged, setIsAbridged] = useState(false);

  // Chapters
  const [chapters, setChapters] = useState<Chapter[]>([makeChapter(1)]);
  const [openChapter, setOpenChapter] = useState(0);
  const uploadRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const updateChapter = useCallback((id: string, patch: Partial<Chapter>) => {
    setChapters(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  }, []);

  const simulateChapterUpload = useCallback((id: string, fname: string) => {
    updateChapter(id, { uploading: true, uploadProgress: 0, sourceName: fname });
    let p = 0;
    const iv = setInterval(() => {
      p += Math.floor(Math.random() * 15) + 5;
      if (p >= 100) {
        clearInterval(iv);
        updateChapter(id, { uploading: false, uploadProgress: 100, fileFormat: "WAV", sampleRate: "44.1 kHz", bitDepth: "24-bit", duration: `${5 + Math.floor(Math.random() * 20)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}` });
      } else {
        updateChapter(id, { uploadProgress: p });
      }
    }, 150);
  }, [updateChapter]);

  // Cover
  const [cover, setCover] = useState<Cover | null>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => setCover({ name: f.name, dataUrl: ev.target!.result as string, width: img.width, height: img.height, size: f.size });
      img.src = ev.target!.result as string;
    };
    reader.readAsDataURL(f);
  };

  // Distribution
  const [scheduleMode, setScheduleMode] = useState<"asap" | "date">("asap");
  const [releaseDate, setReleaseDate] = useState("");

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
  }, [titleMn, titleEn, authors, narrator, genre, subGenre, publisher, language,
      isbn, synopsis, cOwner, cYear, chapters, cover,
      scheduleMode, releaseDate, reviewConfirmed]);

  const handleNext = () => { if (stage < 5) setStage((stage + 1) as Stage); else if (reviewConfirmed) setSubmitted(true); };
  const handleBack = () => { if (stage > 1) setStage((stage - 1) as Stage); else navigate(-1); };
  const closeAll = () => { setAuthorOpen(false); setNarratorOpen(false); setGenreOpen(false); setTitleLangOpen(false); };

  const s1ok = !!titleMn.trim() && authors.length > 0 && !!genre;
  const s2ok = chapters.length > 0 && chapters.some(c => c.sourceName && !c.uploading);
  const s3ok = !!cover;
  const s4ok = scheduleMode === "asap" || !!releaseDate;

  const shellTitle = titleMn.trim() || (editRelease ? "Аудио ном засах" : "Аудио ном нэмэх");
  const shellSubtitle = authors.length > 0 ? authors.map(a => a.name).join(", ") : "Аудио ном, бүлгүүдийн мэдээлэл";
  const publishLabel = scheduleMode === "asap" ? "Аль болох хурдан · 2–3 ажлын өдөр" : (releaseDate ? `Нийтлэх огноо · ${releaseDate}` : "Огноо сонгоогүй");

  // ─── Stage content — called as function to preserve input focus ─────────────
  function renderStage(): React.ReactNode {

    // ── Stage 1 ────────────────────────────────────────────────────────────
    if (stage === 1) return (
      <>
        <div className="wiz-mode-pill"><BookOpen size={13} />Аудио ном · Аудио ном түгээх гэрээ</div>
        <h2>Үндсэн мэдээлэл</h2>

        {/* Title — single field + right-side lang selector */}
        <div className="wiz-section">
          <div className="wiz-field" onClick={e => e.stopPropagation()}>
            <label className="wiz-label">
              Номын нэр <span className="wiz-req">*</span>
              <InfoTip text="Аудио номын гарчиг. Монгол болон English хувилбар шаардлагатай — олон улсын платформд English гарчиг харагдана." />
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

        {/* UPC / ISRC auto-generation */}
        <div className="wiz-section">
          <div className="wiz-id-auto">
            <Fingerprint size={17} />
            <div>
              <b>UPC & ISRC автоматаар үүсгэгдэнэ</b>
              <span>Аудио номын UPC болон бүлэг тус бүрийн ISRC кодыг нийтлэх үед систем автоматаар үүсгэнэ — гараар оруулах шаардлагагүй.</span>
            </div>
          </div>
        </div>

        {/* Authors */}
        <div className="wiz-section">
          <PersonPicker
            label="Зохиолч" hint="Нэг эсвэл олон зохиолч нэмнэ" required multiple
            people={authors} query={authorQuery} open={authorOpen}
            onQueryChange={setAuthorQuery} onOpen={() => setAuthorOpen(true)} onClose={() => setAuthorOpen(false)}
            onAdd={p => setAuthors(prev => [...prev, p])} onRemove={id => setAuthors(prev => prev.filter(a => a.id !== id))}
            roleName="Зохиолч"
          />
        </div>

        {/* Narrator */}
        <div className="wiz-section">
          <div className="wiz-field">
            <div className="wiz-artist-section">
              <div className="wiz-artist-section-head">
                <div>
                  <h3>Уншигч / Нарратор</h3>
                  <span>Аудио ном уншсан хүн</span>
                </div>
                {!narrator && (
                  <button type="button" className="wiz-btn wiz-artist-role-action"
                    onClick={e => { e.stopPropagation(); setNarratorOpen(v => !v); setNarratorQuery(""); }}>
                    <Plus size={12} />Сонгох
                  </button>
                )}
              </div>
              <div className="wiz-artist-role-box">
                {narrator ? (
                  <div className="wiz-artist-selected-card">
                    <span className="wiz-avatar md">{initials(narrator.name)}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <b style={{ display: "block", fontSize: 13 }}>{narrator.name}</b>
                      <span style={{ fontSize: 12, color: "#888" }}>Уншигч / Нарратор</span>
                    </div>
                    <button type="button" className="wiz-btn icon-btn" onClick={() => setNarrator(null)}><X size={13} /></button>
                  </div>
                ) : (
                  <div className="wiz-artist-empty"><UserRound size={15} /><span>Уншигч сонгоогүй байна.</span></div>
                )}
                {narratorOpen && (
                  <div style={{ marginTop: 10, border: "1px solid var(--w-line)", borderRadius: 10, background: "#fff", overflow: "hidden", boxShadow: "0 8px 24px #0002" }}
                    onClick={e => e.stopPropagation()}>
                    <div style={{ padding: "8px 8px 4px", position: "relative" }}>
                      <Search size={13} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", color: "#999" }} />
                      <input className="wiz-input" style={{ height: 38, paddingLeft: 32 }}
                        value={narratorQuery} onChange={e => setNarratorQuery(e.target.value)}
                        placeholder="Уншигч хайх эсвэл нэр оруулах..." autoFocus />
                    </div>
                    <div style={{ maxHeight: 180, overflowY: "auto" }}>
                      {KNOWN_PEOPLE.filter(p => !narratorQuery || p.name.toLowerCase().includes(narratorQuery.toLowerCase())).map(p => (
                        <div key={p.id} className="wiz-option" style={{ display: "flex", alignItems: "center", gap: 9 }}
                          onMouseDown={() => { setNarrator(p); setNarratorOpen(false); setNarratorQuery(""); }}>
                          <span className="wiz-avatar sm">{initials(p.name)}</span>
                          <span style={{ flex: 1 }}>
                            <span style={{ display: "block", fontSize: 13 }}>{p.name}</span>
                            <span style={{ display: "block", fontSize: 11, color: "var(--w-muted)" }}>ID: {p.id}</span>
                          </span>
                        </div>
                      ))}
                      {narratorQuery.trim() && !KNOWN_PEOPLE.some(p => p.name.toLowerCase() === narratorQuery.trim().toLowerCase()) && (
                        <div className="wiz-option" style={{ color: "var(--w-accent)", fontWeight: 700, display: "flex", alignItems: "center", gap: 7 }}
                          onMouseDown={() => { setNarrator({ id: "NEW-" + Date.now(), name: narratorQuery.trim() }); setNarratorOpen(false); setNarratorQuery(""); }}>
                          <Plus size={12} />"{narratorQuery.trim()}" нэмэх
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Fields grid */}
        <div className="wiz-section">
          <div className="wiz-grid2">
            <div className="wiz-field">
              <label className="wiz-label">Нийтлэгч / Хэвлэлийн газар</label>
              <input value={publisher} onChange={e => setPublisher(e.target.value)} className="wiz-input" placeholder="Хэвлэлийн газар нэр" />
            </div>
            <div className="wiz-field">
              <label className="wiz-label">Хэл</label>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="wiz-select">
                {AB_LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="wiz-field">
              <label className="wiz-label">Жанр <span className="wiz-req">*</span><InfoTip text="Номын агуулгын чиглэл. Зөв жанр нь хайлт болон санал болгох системд нөлөөлнө." /></label>
              <div className="wiz-select-picker">
                <div className="wiz-select-value" onClick={e => { e.stopPropagation(); setGenreOpen(v => !v); setGenreSearch(""); }}>
                  <span style={{ color: genre ? "var(--w-text)" : "var(--w-muted)", fontSize: 13 }}>{genre || "Жанр хайж сонгох"}</span>
                  <ChevronDown size={15} />
                </div>
                {genreOpen && (
                  <div className="wiz-select-menu" onClick={e => e.stopPropagation()}>
                    <div className="wiz-select-search"><Search size={13} /><input className="wiz-input" style={{ height: 32, paddingLeft: 28 }} value={genreSearch} onChange={e => setGenreSearch(e.target.value)} placeholder="Жанр хайх" autoFocus /></div>
                    {AB_GENRES.filter(g => !genreSearch || g.toLowerCase().includes(genreSearch.toLowerCase())).map(g => (
                      <div key={g} className={`wiz-option ${g === genre ? "selected" : ""}`} onMouseDown={() => { setGenre(g); setGenreOpen(false); }}>{g}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="wiz-field">
              <label className="wiz-label">Дэд жанр</label>
              <input value={subGenre} onChange={e => setSubGenre(e.target.value)} className="wiz-input" placeholder="Жш: Детектив, Туулган..." />
            </div>
            <div className="wiz-field">
              <label className="wiz-label">ISBN <span style={{ fontWeight: 400, color: "#9d9ab5", fontSize: 12 }}>(заавал биш)</span><InfoTip text="Олон улсын стандарт номын дугаар. Хэвлэмэл номтой хосолсон тохиолдолд оруулна." /></label>
              <input value={isbn} onChange={e => setIsbn(e.target.value)} className="wiz-input" placeholder="978-..." />
            </div>
          </div>
        </div>

        {/* Synopsis */}
        <div className="wiz-section">
          <div className="wiz-field">
            <label className="wiz-label">Тайлбар / Агуулга<InfoTip text="Номын агуулгыг товчхон танилцуулна. Уншигчдын сонирхлыг татах хэдэн өгүүлбэр бичнэ." /></label>
            <textarea value={synopsis} onChange={e => setSynopsis(e.target.value)} rows={4}
              placeholder="Номын товч агуулга..."
              style={{ width: "100%", padding: "10px 12px", fontSize: 14, borderRadius: 8, border: "1px solid #d8d9e1", outline: "none", resize: "vertical", fontFamily: "inherit", color: "var(--w-text)", background: "#fff" }} />
          </div>
        </div>

        {/* Content info — book-appropriate */}
        <div className="wiz-section">
          <div className="wiz-grid2">
            <div className="wiz-field">
              <label className="wiz-label">Насны тохиромж<InfoTip text="Уншигчдын нас. Хүүхдийн ном, насанд хүрэгчдийн агуулга гэх мэт тодорхойлно." /></label>
              <select value={ageRating} onChange={e => setAgeRating(e.target.value)} className="wiz-select">
                {["Бүгдэд тохиромжтой", "6+", "13+", "18+"].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="wiz-field">
              <label className="wiz-label">Хувилбар<InfoTip text="Бүтэн эсвэл товчилсон хувилбар эсэхийг зааж өгнө." /></label>
              <div className="wiz-choice-row" style={{ marginTop: 0 }}>
                <label className={`wiz-radio-card ${!isAbridged ? "active" : ""}`} style={{ flex: 1 }}>
                  <input type="radio" checked={!isAbridged} onChange={() => setIsAbridged(false)} /><b>Бүтэн</b>
                </label>
                <label className={`wiz-radio-card ${isAbridged ? "active" : ""}`} style={{ flex: 1 }}>
                  <input type="radio" checked={isAbridged} onChange={() => setIsAbridged(true)} /><b>Товчилсон</b>
                </label>
              </div>
            </div>
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

    // ── Stage 2 ────────────────────────────────────────────────────────────
    if (stage === 2) return (
      <>
        <h2>Бүлгүүд</h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: "var(--w-muted)" }}>{chapters.length} бүлэг</span>
          <button type="button" className="wiz-btn" style={{ gap: 6 }}
            onClick={() => setChapters(prev => [...prev, makeChapter(prev.length + 1)])}>
            <Plus size={13} />Бүлэг нэмэх
          </button>
        </div>
        <div className="wiz-tracks">
          {chapters.map((ch, idx) => {
            const isOpen = openChapter === idx;
            const hasFile = !!ch.sourceName;
            return (
              <div key={ch.id} className="wiz-track">
                <div className="wiz-track-head single" onClick={() => setOpenChapter(isOpen ? -1 : idx)}>
                  <span className="wiz-track-no">{idx + 1}</span>
                  <div className="wiz-track-main">
                    <div className="wiz-track-main-info">
                      <span className="wiz-track-title">{ch.title || `${idx + 1}-р бүлэг`}</span>
                      <span className="wiz-track-meta-text">
                        {ch.uploading ? `Хуулж байна ${ch.uploadProgress}%` : hasFile ? `${ch.sourceName}${ch.duration ? " · " + ch.duration : ""}` : "Файл оруулаагүй"}
                      </span>
                    </div>
                    <div className="wiz-track-summary">
                      {hasFile && !ch.uploading && <>
                        {ch.fileFormat && <span className="wiz-status-pill isrc">{ch.fileFormat}</span>}
                        {ch.sampleRate && <span className="wiz-status-pill">{ch.sampleRate}</span>}
                        {ch.bitDepth && <span className="wiz-status-pill">{ch.bitDepth}</span>}
                      </>}
                      <button type="button" className="wiz-btn icon-btn" onClick={e => { e.stopPropagation(); setChapters(prev => prev.filter((_, i) => i !== idx)); }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <ChevronDown size={14} style={{ color: "#aaa", transform: isOpen ? "rotate(180deg)" : "", transition: "transform .2s", flexShrink: 0 }} />
                </div>
                {isOpen && (
                  <div className="wiz-track-body">
                    <div className="wiz-track-panel">
                      <div className="wiz-field">
                        <label className="wiz-label">Бүлгийн гарчиг</label>
                        <input value={ch.title} onChange={e => updateChapter(ch.id, { title: e.target.value })} className="wiz-input" placeholder={`${idx + 1}-р бүлэг`} />
                      </div>
                      <div className="wiz-track-panel-head" style={{ marginTop: 14 }}>
                        <div className="wiz-track-panel-title"><AudioWaveform size={16} /><b>Аудио файл</b></div>
                        <span>WAV · FLAC · MP3</span>
                      </div>
                      {!hasFile && !ch.uploading ? (
                        <button type="button" onClick={() => uploadRefs.current[ch.id]?.click()} className="wiz-track-add-row">
                          <UploadCloud size={15} />Файл хуулах
                        </button>
                      ) : ch.uploading ? (
                        <div className="wiz-audio-source">
                          <div className="wiz-audio-source-top">
                            <FileAudio size={20} style={{ color: "var(--w-accent)", flexShrink: 0 }} />
                            <div className="wiz-audio-file"><b>{ch.sourceName}</b><span>Хуулж байна...</span></div>
                          </div>
                          <div style={{ marginTop: 10, height: 4, background: "#eeeef4", borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ width: `${ch.uploadProgress}%`, height: "100%", background: "var(--w-accent)", borderRadius: 99, transition: "width .2s" }} />
                          </div>
                        </div>
                      ) : (
                        <div className="wiz-audio-source">
                          <div className="wiz-audio-source-top">
                            <button className="wiz-audio-play"><Play size={12} /></button>
                            <div className="wiz-audio-file"><b>{ch.sourceName}</b><span style={{ color: "var(--w-accent)" }}>Track source</span></div>
                            {ch.duration && <span className="wiz-audio-duration">{ch.duration}</span>}
                            <WaveBars seed={idx * 5} />
                            <div className="wiz-audio-actions">
                              <button type="button" className="wiz-btn icon-btn" onClick={() => uploadRefs.current[ch.id]?.click()}><RefreshCw size={13} /></button>
                            </div>
                          </div>
                          <div className="wiz-audio-meta">
                            <span>{ch.sourceName}</span>
                            {ch.fileFormat && <span>{ch.fileFormat}</span>}
                            {ch.sampleRate && <span>{ch.sampleRate}</span>}
                            {ch.bitDepth && <span>{ch.bitDepth}</span>}
                          </div>
                        </div>
                      )}
                      <input ref={el => { uploadRefs.current[ch.id] = el; }} type="file" accept=".wav,.flac,.mp3,.aiff" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) simulateChapterUpload(ch.id, f.name); }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {chapters.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--w-muted)" }}>
            <BookOpen size={32} style={{ margin: "0 auto 10px", opacity: 0.3 }} />
            <p>Бүлэг нэмэгдээгүй байна</p>
          </div>
        )}
      </>
    );

    // ── Stage 3 — Cover 250×250 ─────────────────────────────────────────────
    if (stage === 3) {
      const validCover = cover ? cover.width === cover.height && cover.width >= 1400 : false;
      return (
        <>
          <h2>Ковер зураг</h2>
          <div className="wiz-cover-layout" style={{ gridTemplateColumns: "250px 1fr" }}>
            {/* 250×250 drop zone — aspect-ratio 1/1 + 250px column = 250×250 */}
            <div className="wiz-cover-drop" onClick={() => coverRef.current?.click()}>
              {cover ? (
                <>
                  <img src={cover.dataUrl} alt="cover" />
                  <div className="wiz-cover-overlay">
                    <UploadCloud size={14} />
                    <b style={{ flex: 1, minWidth: 0 }}>{cover.name}</b>
                    <span>{cover.width}×{cover.height}</span>
                  </div>
                </>
              ) : (
                <div className="wiz-cover-content">
                  <ImageIcon size={34} />
                  <b>Зураг оруулах</b>
                  <span>JPG, PNG · Min 3000×3000px</span>
                  <button type="button" className="wiz-btn" onClick={e => { e.stopPropagation(); coverRef.current?.click(); }}>Файл сонгох</button>
                </div>
              )}
            </div>

            {/* Requirements panel */}
            <div className="wiz-cover-req-box">
              <h3>Ковер зургийн шаардлага</h3>
              <p>Аудио номын ковер нь дараах стандартыг хангасан байх ёстой.</p>
              <div className="wiz-cover-req-group">
                {[
                  "Хамгийн багадаа 1400×1400px",
                  "Дөрвөлжин 1:1 харьцаа (дөрвөлжин)",
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
                <span className="wiz-cover-spec-badge">1:1</span>
                <span className="wiz-cover-spec-badge">Min 1400px</span>
                <span className="wiz-cover-spec-badge">JPG/PNG</span>
                <span className="wiz-cover-spec-badge">72+ DPI</span>
              </div>
              {cover && (
                <p style={{ marginTop: 12, fontSize: 12, color: validCover ? "#22c55e" : "#f59e0b", display: "flex", alignItems: "center", gap: 5 }}>
                  {validCover ? <Check size={11} /> : <TriangleAlert size={11} />}
                  {cover.width}×{cover.height}px · {(cover.size / 1024 / 1024).toFixed(1)} MB
                  {!validCover && " — Хэмжээ хангалтгүй"}
                </p>
              )}
              {!cover && (
                <button type="button" className="wiz-btn" style={{ marginTop: 14 }} onClick={() => coverRef.current?.click()}>
                  <UploadCloud size={14} />Зураг сонгох
                </button>
              )}
            </div>
          </div>
          <input ref={coverRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleCoverFile} />
        </>
      );
    }

    // ── Stage 4 — wiz-publish-shell (no platform section for audiobooks) ────
    if (stage === 4) return (
      <div className="wiz-publish-shell">
        <div className="wiz-publish-topbar">
          <div><h2>Нийтлэх & Түгээх</h2><p>Аудио номыг нийтлэх хугацааг сонгоно уу.</p></div>
          <div className="wiz-publish-summary">
            <span className="wiz-publish-summary-pill"><CalendarClock size={13} />{publishLabel}</span>
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
      </div>
    );

    // ── Stage 5 — success screen ────────────────────────────────────────────
    if (submitted) return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "48px 0", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: "#dcf4ea", display: "grid", placeItems: "center" }}>
          <CircleCheckBig size={30} style={{ color: "#1a8c52" }} />
        </div>
        <div>
          <h2 style={{ margin: 0 }}>Амжилттай илгээгдлээ!</h2>
          <p style={{ color: "var(--w-muted)", marginTop: 6 }}>"{titleMn}" аудио ном шалгагдаж байна.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="wiz-btn" onClick={() => navigate("/catalog?type=audiobook")}>Каталог харах</button>
          <button className="wiz-btn primary" onClick={() => navigate("/")}>Хяналтын самбар</button>
        </div>
      </div>
    );

    // ── Stage 5 — review ───────────────────────────────────────────────────
    return (
      <div className="wiz-review-shell">
        <div className="wiz-review-hero">
          <h2>Шалгах & Илгээх</h2>
          <p>Мэдээллийг нягтлан шалгана уу. Бүх зүйл зөв бол илгээнэ үү.</p>
        </div>
        <div className="wiz-review-grid">
          {/* Left column */}
          <div className="wiz-review-col">
            <div className="wiz-review-panel">
              <div className="wiz-review-panel-head">
                <div className="wiz-review-panel-head-title"><BookOpen size={15} /><b>Үндсэн мэдээлэл</b></div>
              </div>
              <div className="wiz-review-panel-body">
                <div className="wiz-review-data-grid">
                  {([
                    [titleLangLabel(titleLang) + " нэр", titleMn || "—"],
                    ...(titleLang !== "en" ? [["English нэр", titleEn || "—"]] as [string,string][] : []),
                    ...Object.entries(titleExtras).map(([code, val]) => [titleLangLabel(code) + " нэр", val || "—"] as [string,string]),
                    ["Зохиолч", authors.map(a => a.name).join(", ") || "—"],
                    ["Уншигч", narrator?.name || "—"],
                    ["Нийтлэгч", publisher || "—"],
                    ["Жанр", genre || "—"],
                    ["Хэл", language],
                    ["Насны тохиромж", ageRating],
                    ["Хувилбар", isAbridged ? "Товчилсон" : "Бүтэн"],
                    ["UPC", "Автоматаар үүснэ"],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="wiz-review-data-item">
                      <span>{k}</span>
                      <b>{v}</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="wiz-review-panel">
              <div className="wiz-review-panel-head">
                <div className="wiz-review-panel-head-title"><AudioWaveform size={15} /><b>Бүлгүүд ({chapters.length})</b></div>
              </div>
              <div className="wiz-review-panel-body" style={{ padding: "0 16px" }}>
                <div className="wiz-review-tracks">
                  {chapters.slice(0, 6).map((ch, i) => (
                    <div key={ch.id} className="wiz-review-track-row">
                      <div className="wiz-review-track-no">{i + 1}</div>
                      <div className="wiz-review-track-info">
                        <b>{ch.title || `${i + 1}-р бүлэг`}</b>
                        <span>{ch.sourceName || "Файл оруулаагүй"}</span>
                      </div>
                      <div className="wiz-review-track-meta">
                        <b>{ch.duration || "—"}</b>
                        <span>Автоматаар үүснэ</span>
                      </div>
                    </div>
                  ))}
                  {chapters.length > 6 && (
                    <div style={{ padding: "10px 0", fontSize: 12, color: "var(--w-muted)" }}>+ {chapters.length - 6} бүлэг</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Right column */}
          <div className="wiz-review-col">
            <div className="wiz-review-panel">
              <div className="wiz-review-panel-head">
                <div className="wiz-review-panel-head-title"><ImageIcon size={15} /><b>Ковер зураг</b></div>
              </div>
              <div className="wiz-review-panel-body">
                <div className="wiz-review-cover-preview">
                  {cover ? (
                    <img src={cover.dataUrl} alt="cover" />
                  ) : (
                    <div className="wiz-review-cover-empty">
                      <ImageOff size={28} />
                      <div>Зураг оруулаагүй</div>
                    </div>
                  )}
                </div>
                {cover && (
                  <p style={{ marginTop: 8, fontSize: 11, color: "var(--w-muted)", textAlign: "center" }}>
                    {cover.width}×{cover.height}px · {(cover.size / 1024 / 1024).toFixed(1)} MB
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
              </div>
            </div>
            <div className="wiz-review-confirm-simple">
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13 }}>
                <input type="checkbox" checked={reviewConfirmed} onChange={e => setReviewConfirmed(e.target.checked)}
                  style={{ width: 16, height: 16, marginTop: 1, accentColor: "var(--w-accent)", flexShrink: 0 }} />
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
        { label: authors.length > 0 ? authors.map(a => a.name).join(", ") : "Зохиолч нэмэх шаардлагатай", ok: authors.length > 0 },
        { label: genre || "Жанр сонгоогүй", ok: !!genre },
      ]},
      { num: 2, title: "Бүлгүүд", ok: s2ok, items: [
        { label: `${chapters.length} бүлэг нэмэгдсэн`, ok: chapters.length > 0 },
        { label: chapters.filter(c => c.sourceName).length + " файл оруулсан", ok: chapters.some(c => !!c.sourceName) },
      ]},
      { num: 3, title: "Ковер зураг", ok: s3ok, items: [
        { label: cover ? `${cover.width}×${cover.height}px` : "Зураг оруулаагүй", ok: !!cover },
      ]},
      { num: 4, title: "Нийтлэх & Түгээх", ok: s4ok, items: [
        { label: scheduleMode === "asap" ? "Аль болох хурдан" : (releaseDate ? `Огноо: ${releaseDate}` : "Огноо тохируулаагүй"), ok: s4ok },
      ]},
      { num: 5, title: "Шалгах & Илгээх", ok: reviewConfirmed, items: [
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
