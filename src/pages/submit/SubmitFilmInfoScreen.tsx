import { ContentCoverUpload, type ContentCover } from "@/components/ui/ContentCoverUpload";
import { ContributorPicker, type ContributorPerson } from "@/components/ui/ContributorPicker";
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router";
import { Shell } from "@/components/layout/Shell";
import {
  Film, ArrowLeft, ArrowRight, Send, Plus, X, Check,
  ChevronDown, UploadCloud, CircleCheckBig, ClipboardCheck,
  Search, UserRound, Users, ZapIcon, CalendarDays, CalendarClock,
  Info, Image as ImageIcon, ImageOff, RadioTower, Link2, Eye, EyeOff, TriangleAlert, AlertCircle,
  Building2, Clapperboard, Clock, Lock,
} from "lucide-react";
import "@/styles/wizard.css";
import { MOVIES as RELEASES } from "@/data/movies";
import { DateInput } from "@/components/ui/DateInput";
import { SelectInput } from "@/components/ui/SelectInput";
import { getAccountState } from "@/data/ob-state";

type Stage = 1 | 2 | 3 | 4 | 5;
type Person = ContributorPerson;
type CastMember = { id: string; name: string; role: string };
type Cover = ContentCover;

const STEPS = ["Үндсэн мэдээлэл","Файл оруулах","Постер","Тохиргоо","Хянах & Илгээх"];
const FILM_GENRES = ["Уран сайхны","Баримтат","Богино хэрэглэл","Хүүхэлдэйн","Аниме","Комеди","Драм","Экшн","Триллер","Аймшгийн","Романтик","Түүхэн","Хүүхэд","Бусад"];
const FILM_LANGUAGES = ["Монгол","English / Latin","Орос","Хятад","Солонгос","Японы","Бусад"];
const FILM_AGE_RATINGS = ["0+","6+","12+","16+","18+"];
const FILM_ROLES = ["Зохиолч","Гол дүрийн жүжигчин","Жүжигчид","Зурагчин","Монтажчин","Хөгжмийн зохиолч","Продакшн дизайнер","Хувцас загварч","Арт директор","Дууны найруулагч"];
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
  const [showContributorErrors, setShowContributorErrors] = useState(false);

  // Title
  const [titleMn, setTitleMn] = useState(editRelease?.title ?? "");
  const [titleEn, setTitleEn] = useState(editRelease?.titles?.en || "");
  const [titleLang, setTitleLang] = useState("mn");
  const [showTitleErrors, setShowTitleErrors] = useState(false);
  const [titleLangOpen, setTitleLangOpen] = useState(false);

  // Directors — separate required field
  const [knownPeople, setKnownPeople] = useState<Person[]>(() => [...KNOWN_PEOPLE, ...(editRelease?.cast || []).filter(person => !KNOWN_PEOPLE.some(known => known.name === person.name)).map(person => ({ id: `person-${person.name}`, name: person.name }))].filter((person, index, people) => people.findIndex(item => item.name === person.name) === index));
  const [directors, setDirectors] = useState<Person[]>(() => (editRelease?.cast || []).filter(person => person.role === "Найруулагч").map(person => knownPeople.find(known => known.name === person.name)!));

  // Producers — separate optional field
  const [producers, setProducers] = useState<Person[]>(() => (editRelease?.cast || []).filter(person => person.role === "Продюсер").map(person => knownPeople.find(known => known.name === person.name)!));

  // Writers — separate optional field
  const [writers, setWriters] = useState<Person[]>(() => (editRelease?.cast || []).filter(person => person.role === "Зохиолч").map(person => knownPeople.find(known => known.name === person.name)!));

  // Other cast/crew — excludes director and producer roles
  const [cast, setCast] = useState<CastMember[]>(
    editRelease?.cast?.filter(person => !["Найруулагч", "Продюсер", "Зохиолч"].includes(person.role)).map(person => ({ ...knownPeople.find(known => known.name === person.name)!, role: person.role })) ?? []
  );
  const [castRole, setCastRole] = useState("Гол дүрийн жүжигчин");

  // Release metadata
  const [genre, setGenre] = useState(editRelease?.genre ?? "");
  const [genreOpen, setGenreOpen] = useState(false);
  const [genreSearch, setGenreSearch] = useState("");
  const [subGenre, setSubGenre] = useState(editRelease?.subGenre || "");
  const [language, setLanguage] = useState(editRelease?.language || "Монгол");
  const [ageRating, setAgeRating] = useState(editRelease?.ageRating ?? "");

  const [duration, setDuration] = useState("");

  // Studios — multiple, searchable
  const [primaryStudio] = useState(() => getAccountState().setups.film?.name?.trim() || "");
  const [studios, setStudios] = useState<string[]>(editRelease?.collaboratingStudios || []);
  const [studioOptions, setStudioOptions] = useState<Person[]>(() => editRelease?.label && !KNOWN_STUDIOS.some(studio => studio.name === editRelease.label) ? [...KNOWN_STUDIOS, { id: `studio-${editRelease.label}`, name: editRelease.label }] : KNOWN_STUDIOS);

  const [synopsis, setSynopsis] = useState(editRelease?.synopsis ?? "");
  const [cOwner, setCOwner] = useState(editRelease?.copyrightOwner || "");
  const [cYear, setCYear] = useState(editRelease?.copyrightYear || String(new Date().getFullYear()));



  // File — URL + password instead of direct upload
  const [filmUrl, setFilmUrl] = useState(editRelease?.filmUrl || "");
  const [filmPassword, setFilmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");

  const [poster, setPoster] = useState<Cover | null>(null);

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
  }, [titleMn, titleEn, directors, producers, writers, cast, genre, subGenre, ageRating, studios,
      duration, filmUrl, filmPassword,
      poster, scheduleMode, releaseDate, selectedServices, reviewConfirmed]);

  const handleNext = () => {
    if ((stage === 1 || stage === 5) && (!titleMn.trim() || (titleLang !== "en" && !titleEn.trim()))) {
      setShowTitleErrors(true);
      setStage(1);
      return;
    }
    if ((stage === 3 || stage === 5) && !poster) { setStage(3); return; }
    if ((stage === 1 || stage === 5) && directors.length === 0) {
      setShowContributorErrors(true);
      setStage(1);
      return;
    }
    if (stage < 5) setStage((stage + 1) as Stage);
    else if (reviewConfirmed) setSubmitted(true);
  };
  const handleBack = () => { if (stage > 1) setStage((stage - 1) as Stage); else navigate(-1); };
  const closeAll = () => { setGenreOpen(false); setTitleLangOpen(false); };


  const s1ok = !!titleMn.trim() && (titleLang === "en" || !!titleEn.trim()) && directors.length > 0 && !!genre && !!ageRating;
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
      return (
        <>
          <div className="wiz-mode-pill"><Film size={13} />Кино · Кино видео бүтээл түгээх гэрээ</div>
          <h2>Үндсэн мэдээлэл</h2>

          {/* Title — single field + right-side lang selector */}
          <div className="wiz-section">
            <div className="wiz-field" onClick={e => e.stopPropagation()}>
              <label className="wiz-label">
                Киноны нэр <span className="wiz-req">*</span>
                <InfoTip text="Гарчгийг англи хэлээс өөр хэлээр бичсэн бол англи хувилбар эсвэл латин үсгээр бичсэн нэрийг заавал оруулна уу." />
              </label>
              <div className="wiz-title-wrap">
                <div className="wiz-title-row">
                  <input required aria-label="Киноны нэр" aria-invalid={showTitleErrors && !titleMn.trim()} value={titleMn} onChange={e => setTitleMn(e.target.value)}
                    placeholder="Гарчиг оруулах" />
                  <SelectInput variant="attached" value={titleLang} onChange={setTitleLang}
                  options={TITLE_LANGS.map(language => ({ value: language.code, label: language.label }))} />
                </div>
                {titleLang !== "en" && titleMn.trim().length > 0 && (
                  <div className="wiz-title-row wiz-title-en-row">
                    <span className="wiz-title-en-label">EN · Заавал</span>
                    <input required aria-label="English / Latin гарчиг" aria-invalid={showTitleErrors && !titleEn.trim()} value={titleEn} onChange={e => setTitleEn(e.target.value)}
                      placeholder="English / Latin гарчиг" />
                  </div>
                )}
              </div>
              {showTitleErrors && (!titleMn.trim() || (titleLang !== "en" && !titleEn.trim())) && <p role="alert" className="mt-2 text-xs text-destructive">{!titleMn.trim() ? "Киноны нэрийг оруулна уу." : "Англи эсвэл латин бичиглэлтэй гарчгийг заавал оруулна уу."}</p>}
            </div>
          </div>

          <div className="wiz-section">
            <div className="wiz-field">
              <label className="wiz-label">Тайлбар / Агуулга<InfoTip text="Киноны агуулгыг товчхон танилцуулна. Үзэгчдийн сонирхлыг татах хэд хэдэн өгүүлбэр бичнэ." /></label>
              <textarea value={synopsis} onChange={e => setSynopsis(e.target.value)} rows={4} placeholder="Киноны товч агуулга..."
                className="w-full resize-y rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
            </div>
          </div>

          <div className="wiz-section">
            <ContributorPicker label="Найруулагч" hint="Киноны найруулагч" required error={showContributorErrors} people={directors} options={knownPeople} onChange={setDirectors} onCreate={person => setKnownPeople(previous => [...previous, person])} />
          </div>
          <div className="wiz-section">
            <ContributorPicker label="Продюсер" hint="Киноны продюсер" people={producers} options={knownPeople} onChange={setProducers} onCreate={person => setKnownPeople(previous => [...previous, person])} />
          </div>
          <div className="wiz-section">
            <ContributorPicker label="Зохиолч" hint="Сценарийн зохиолч" people={writers} options={knownPeople} onChange={setWriters} onCreate={person => setKnownPeople(previous => [...previous, person])} />
          </div>
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
                <SelectInput
                  value={language}
                  onChange={setLanguage}
                  options={FILM_LANGUAGES}
                />
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

              <div className="wiz-field">
                <label className="wiz-label" htmlFor="film-duration">Үргэлжлэх хугацаа (минут)<InfoTip text="Киноны нийт үргэлжлэх хугацааг бүтэн минутаар оруулна. Жишээ: 105 минут." /></label>
                <input id="film-duration" type="text" inputMode="numeric" pattern="[0-9]*" value={duration}
                  onChange={e => { if (/^\d*$/.test(e.target.value)) setDuration(e.target.value); }}
                  className="wiz-input" placeholder="Жишээ: 105" />
              </div>

              <div className="wiz-field sm:col-span-2">
                <label className="wiz-label">Үндсэн студи / Продакшн</label>
                <div className="wiz-locked">
                  <div className="wiz-locked-main"><Building2 size={15} /><b>{primaryStudio || "Студи / Продакшн тохируулаагүй"}</b></div>
                  <span><Lock size={11} />Аккаунтын тохиргооноос</span>
                </div>
                {!primaryStudio && <p className="wiz-hint">Аккаунтын тохиргоонд үндсэн студи / продакшнаа тохируулна уу.</p>}
              </div>
            </div>
          </div>

          <div className="wiz-section space-y-3">
            <ContributorPicker label="Бусад оролцогч" hint="Жүжигчин, зурагчин болон бусад багийн гишүүд" people={cast.filter(person => person.role === castRole)} options={knownPeople}
              roleSelection={{ value: castRole, onChange: setCastRole, options: FILM_ROLES.filter(role => role !== "Зохиолч") }}
              onChange={people => setCast(previous => [...previous.filter(person => person.role !== castRole), ...people.map(person => ({ ...person, role: castRole }))])}
              onCreate={person => setKnownPeople(previous => [...previous, person])}
              selectedContent={cast.length > 0 && <div className="space-y-3 border-t border-border pt-3">
                {[...new Set(cast.map(person => person.role))].map(role => <div key={role} className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">{role}</p>
                  <div className="flex flex-wrap gap-2">
                    {cast.filter(person => person.role === role).map(person => <div key={person.id} className="flex min-w-0 max-w-full items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">{person.name.split(/\s+/).map(word => word[0]).join("").slice(0, 2).toUpperCase()}</span>
                      <span className="min-w-0 break-words text-sm font-medium">{person.name}</span>
                      <button type="button" aria-label={`${person.name} · ${role} хасах`} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive"
                        onClick={() => setCast(previous => previous.filter(item => !(item.id === person.id && item.role === role)))}><X size={13} /></button>
                    </div>)}
                  </div>
                </div>)}
              </div>} />
          </div>

          <div className="wiz-section">
            <ContributorPicker label="Хамтарсан студи / Продакшн" hint="Кино бүтээлд хамтран оролцсон байгууллагууд" entityType="organization"
              people={studios.map(name => studioOptions.find(studio => studio.name === name) || { id: name, name })}
              options={studioOptions.filter(studio => studio.name !== primaryStudio)} onChange={people => setStudios(people.map(person => person.name).filter(name => name !== primaryStudio))}
              onCreate={studio => setStudioOptions(previous => [...previous, studio])} />
          </div>

          {/* Copyright — always visible */}
          <div className="wiz-section">
            <div className="wiz-field" style={{ marginBottom: 6 }}>
              <label className="wiz-label">
                Зохиогчийн эрх <span style={{ fontWeight: 400, color: "var(--muted-foreground)" }}>©</span>
                <InfoTip text="Оюуны өмчийн эрх эзэмшигч болон он. Зохиолч, хэвлэлийн газар эсвэл компани байж болно." />
              </label>
            </div>
            <div className="wiz-rights-row">
              <input value={cOwner} onChange={e => setCOwner(e.target.value)} className="wiz-input" placeholder="Эрх эзэмшигчийн нэр эсвэл байгууллага" />
<SelectInput
                className="w-[100px] shrink-0 [&_button]:justify-start [&_button]:gap-4"
                value={cYear}
                onChange={setCYear}
                options={Array.from({length: new Date().getFullYear()-1899},(_,i)=>{const y=new Date().getFullYear()-i; return {value:String(y),label:String(y)};})}
              />
            </div>
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

    if (stage === 3) return <ContentCoverUpload kind="film" value={poster} onChange={setPoster} />;

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
                    <DateInput value={releaseDate} onChange={setReleaseDate} min={addDays(7)} />
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
    const castSummary = Object.entries<string[]>(
      cast.reduce<Record<string, string[]>>((acc, c) => { (acc[c.name] ??= []).push(c.role); return acc; }, {})
    ).map(([name, roles]) => `${name} (${roles.join(", ")})`).join(" · ") || "—";
    const directorSummary = directors.map(d => d.name).join(", ") || "—";
    const producerSummary = producers.map(p => p.name).join(", ") || "—";
    const writerSummary = writers.map(w => w.name).join(", ") || "—";

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
                    ["Жанр", genre || "—"],
                    ["Хэл", language],
                    ["Нас хязгаарлалт", ageRating || "—"],
                    ["Үргэлжлэх хугацаа", duration.trim() ? `${duration.trim()} минут` : "—"],
                    ["Үндсэн студи / Продакшн", primaryStudio || "—"],
                    ["Хамтарсан студи / Продакшн", studios.join(", ") || "—"],
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
                  <div className="wiz-review-data-item"><span>Зохиолч</span><b>{writerSummary}</b></div>
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
          </div>
        </div>
        <div className="wiz-confirm-block">
          <label className={`wiz-confirm-item ${reviewConfirmed ? "checked" : ""}`}>
            <input type="checkbox" checked={reviewConfirmed} onChange={e => setReviewConfirmed(e.target.checked)} />
            <div className="wiz-confirm-item-body">
              <span className="wiz-confirm-item-title">Мэдээллээ шалгасан</span>
              <span className="wiz-confirm-item-desc">Оруулсан бүх мэдээлэл зөв бөгөөд нийтлэхэд бэлэн болохыг баталгаажуулна.</span>
            </div>
          </label>
        </div>
      </div>
    );
  }

  // ─── Guide Panel ──────────────────────────────────────────────────────────
  function GuidePanel() {
    const stageData = [
      { num: 1, title: "Үндсэн мэдээлэл", ok: s1ok, items: [
        { label: titleMn.trim() ? `"${titleMn}"` : "Киноны нэр оруулна уу", ok: !!titleMn.trim() },
        ...(titleLang !== "en" ? [{ label: "English / Latin гарчиг", ok: !!titleEn.trim() }] : []),
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
