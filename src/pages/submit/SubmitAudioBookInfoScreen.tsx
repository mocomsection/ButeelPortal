import { ContentCoverUpload, type ContentCover } from "@/components/ui/ContentCoverUpload";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router";
import { Shell } from "@/components/layout/Shell";
import {
  BookOpen, ArrowLeft, ArrowRight, Send, Plus, X, Check,
  ChevronDown, ChevronUp, Play, RefreshCw, Trash2, UploadCloud, FileAudio,
  AudioWaveform, TriangleAlert, CircleCheckBig, ClipboardCheck,
  Search, UserRound, ZapIcon, CalendarDays, CalendarClock,
  Info, Fingerprint, Sparkles, Image as ImageIcon, ImageOff, AlertCircle,
  GripVertical, Building2, Lock, LoaderCircle,
} from "lucide-react";
import "@/styles/wizard.css";
import { AUDIOBOOKS as RELEASES } from "@/data/audiobooks";
import { DateInput } from "@/components/ui/DateInput";
import { SelectInput } from "@/components/ui/SelectInput";
import { ContributorPicker, type ContributorPerson } from "@/components/ui/ContributorPicker";
import { readAudioMetadata } from "@/utils/audioMetadata";

type Stage = 1 | 2 | 3 | 4 | 5;
type Person = ContributorPerson;
type Chapter = {
  uploadError?: string; audioUrl?: string; fileSize?: string; bitrate?: string;
  id: string; title: string;
  titles: { mn: string; en: string; [k: string]: string };
  activeLang: string;
  duration: string;
  sourceName: string; fileFormat: string; sampleRate: string; bitDepth: string;
  uploadedAt?: string;
  uploading: boolean; uploadProgress: number;
  isrcMode: "generate" | "existing";
  isrc: string;
};
type Cover = ContentCover;

const STEPS = ["Үндсэн мэдээлэл","Бүлгүүд","Ковер зураг","Нийтлэх & Түгээх","Шалгах & Илгээх"];
const AB_GENRES = ["Уран зохиол","Түүх","Шинжлэх ухаан","Хүүхэд","Танин мэдэхүй","Бизнес","Сэтгэл зүй","Хичээл","Туулган амьдрал","Яруу найраг","Бусад"];
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
const AB_LANGUAGES = ["Монгол","English / Latin","Орос","Хятад","Солонгос","Японы","Бусад"];
const KNOWN_PEOPLE: Person[] = [
  { id: "P1", name: "Д. Мөнхбат" },
  { id: "P2", name: "Болд Жаргал" },
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

function makeChapter(idx: number): Chapter {
  return {
    id: "CH-" + Date.now() + "-" + idx,
    title: "",
    titles: { mn: "", en: "" },
    activeLang: "mn",
    duration: "", sourceName: "", fileFormat: "", sampleRate: "", bitDepth: "",
    uploading: false, uploadProgress: 0,
    isrcMode: "generate", isrc: "",
  };
}

function WaveBars({ seed = 0 }: { seed?: number }) {
  const h = [8,14,20,11,24,17,10,22,28,16,12,25,18,9,21,27,14,19,8,24];
  return (
    <div className="wiz-waveform">
      {h.map((v, i) => <i key={i} style={{ height: Math.max(3, Math.round(((v + (seed + i) % 7) / 36) * 24)) + "px" }} />)}
    </div>
  );
}

export default function SubmitAudioBookInfoScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: pathId } = useParams<{ id?: string }>();
  const editId = pathId ?? searchParams.get("edit");
  const editRelease = editId ? RELEASES.find(r => r.id === editId && r.contentType === "audiobook") : null;

  const [stage, setStage] = useState<Stage>(1);

  // Title
  const [titleMn, setTitleMn] = useState(editRelease?.title ?? "");
  const [titleEn, setTitleEn] = useState(editRelease?.titles?.en || "");
  const [titleLang, setTitleLang] = useState("mn");
  const [titleLangOpen, setTitleLangOpen] = useState(false);

  // People
  const [knownPeople, setKnownPeople] = useState<Person[]>(() => [...KNOWN_PEOPLE, ...[...new Set([...(editRelease?.authors || (editRelease?.primaryArtist ? [editRelease.primaryArtist] : [])), ...(editRelease?.narrators || [])])].filter(name => !KNOWN_PEOPLE.some(person => person.name === name)).map(name => ({ id: `person-${name}`, name }))]);
  const [authors, setAuthors] = useState<Person[]>(() => (editRelease?.authors || (editRelease?.primaryArtist ? [editRelease.primaryArtist] : [])).map(name => knownPeople.find(person => person.name === name)!));
  const [narrators, setNarrators] = useState<Person[]>(() => (editRelease?.narrators || []).map(name => knownPeople.find(person => person.name === name)!));
  const [showContributorErrors, setShowContributorErrors] = useState(false);

  // Release info
  const [publisher, setPublisher] = useState(editRelease?.label ?? "");
  const [genre, setGenre] = useState(editRelease?.genre ?? "");
  const [genreOpen, setGenreOpen] = useState(false);
  const [genreSearch, setGenreSearch] = useState("");
  const [subGenre, setSubGenre] = useState(editRelease?.subGenre || "");
  const [language, setLanguage] = useState(editRelease?.language || "Монгол");
  const [synopsis, setSynopsis] = useState(editRelease?.synopsis ?? "");
  const [isbn, setIsbn] = useState(editRelease?.isbn || "");
  const [cOwner, setCOwner] = useState(editRelease?.copyrightOwner || "");
  const [cYear, setCYear] = useState(editRelease?.copyrightYear || String(new Date().getFullYear()));
  const [ageRating, setAgeRating] = useState(editRelease?.ageRating || "Бүгдэд тохиромжтой");
  const [isAbridged, setIsAbridged] = useState(editRelease?.isAbridged || false);

  // Chapters
  const [chapters, setChapters] = useState<Chapter[]>(() => editRelease?.tracks.map((track, index) => ({ ...makeChapter(index + 1), title: track.title, titles: track.titles || { mn: track.title, en: "" }, activeLang: track.activeLang || "mn", duration: track.duration, sourceName: track.fileName, fileFormat: track.audioFormat, sampleRate: track.sampleRate || "", bitDepth: track.bitDepth || "", fileSize: track.fileSize, uploadedAt: track.uploadedAt, isrc: track.isrc })) || []);
  const [openChapter, setOpenChapter] = useState(0);
  const [chDragOver, setChDragOver] = useState<number | null>(null);
  const chDragFromRef = useRef<number | null>(null);
  const [chLangOpenId, setChLangOpenId] = useState<string | null>(null);
  const uploadRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const updateChapter = useCallback((id: string, patch: Partial<Chapter>) => {
    setChapters(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  }, []);

  const simulateChapterUpload = useCallback((id: string, file: File) => {
    updateChapter(id, { uploading: true, uploadProgress: 0, sourceName: file.name, uploadError: "", duration: "", sampleRate: "", bitDepth: "" });
    const reader = new FileReader();
    reader.onprogress = event => {
      if (event.lengthComputable) updateChapter(id, { uploadProgress: Math.round(event.loaded / event.total * 100) });
    };
    reader.onerror = () => updateChapter(id, { uploading: false, sourceName: "", uploadError: "Файлыг уншиж чадсангүй. Дахин сонгоно уу." });
    reader.onload = async () => {
      try {
        const metadata = await readAudioMetadata(file);
        updateChapter(id, { ...metadata, uploading: false, uploadProgress: 100, audioUrl: String(reader.result) });
      } catch {
        updateChapter(id, { uploading: false, sourceName: "", uploadError: "Аудио мэдээллийг уншиж чадсангүй. Дахин сонгоно уу." });
      }
    };
    reader.readAsDataURL(file);
  }, [updateChapter]);

  const [cover, setCover] = useState<Cover | null>(null);

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
  }, [titleMn, titleEn, authors, narrators, genre, subGenre, publisher, language,
      isbn, synopsis, cOwner, cYear, chapters, cover,
      scheduleMode, releaseDate, reviewConfirmed]);

  const handleNext = () => {
    if ((stage === 3 || stage === 5) && !cover) { setStage(3); return; }
    if ((stage === 1 || stage === 5) && authors.length === 0) {
      setShowContributorErrors(true);
      setStage(1);
      return;
    }
    if ((stage === 1 || stage === 5) && titleLang !== "en" && !titleEn.trim()) {
      setStage(1);
      return;
    }
    if ((stage === 2 || stage === 5) && (chapters.length === 0 || chapters.some(chapter => {
      const language = chapter.activeLang || "mn";
      return !chapter.sourceName || chapter.uploading || !!chapter.uploadError || !chapter.titles[language]?.trim() || (language !== "en" && !chapter.titles.en?.trim());
    }))) {
      setStage(2);
      return;
    }
    if (stage < 5) setStage((stage + 1) as Stage);
    else if (reviewConfirmed) setSubmitted(true);
  };
  const handleBack = () => { if (stage > 1) setStage((stage - 1) as Stage); else navigate(-1); };
  function handleChapterDrop(targetIdx: number) {
    const from = chDragFromRef.current;
    if (from === null || from === targetIdx) { setChDragOver(null); chDragFromRef.current = null; return; }
    setChapters(cs => { const next = [...cs]; const [moved] = next.splice(from, 1); next.splice(targetIdx, 0, moved); return next; });
    setOpenChapter(oc => {
      if (oc === from) return targetIdx;
      if (from < oc && targetIdx >= oc) return oc - 1;
      if (from > oc && targetIdx <= oc) return oc + 1;
      return oc;
    });
    setChDragOver(null); chDragFromRef.current = null;
  }

  function ChapterTitleEditor({ ch, idx }: { ch: Chapter; idx: number }) {
    const active = ch.activeLang || "mn";
    return (
      <div className="wiz-field" onClick={e => e.stopPropagation()}>
        <label className="wiz-label">Бүлгийн гарчиг <span className="wiz-req">*</span>
          <InfoTip text="Гарчгийг англи хэлээс өөр хэлээр бичсэн бол англи хувилбар эсвэл латин үсгээр бичсэн нэрийг заавал оруулна уу." />
        </label>
        <div className="wiz-title-wrap">
          <div className="wiz-title-row">
            <input value={ch.titles[active] || ""}
              onChange={e => updateChapter(ch.id, { title: e.target.value, titles: { ...ch.titles, [active]: e.target.value } })}
              placeholder={`${idx + 1}-р бүлэг`} />
            <SelectInput variant="attached" value={active}
              onChange={language => updateChapter(ch.id, { activeLang: language, title: ch.titles[language] || "" })}
              options={TITLE_LANGS.map(language => ({ value: language.code, label: language.label }))} />
          </div>
          {active !== "en" && !!ch.titles[active]?.trim() && (
            <div className="wiz-title-row wiz-title-en-row">
              <span className="wiz-title-en-label">EN · Заавал</span>
              <input required aria-label="English / Latin бүлгийн гарчиг" value={ch.titles.en || ""}
                onChange={e => updateChapter(ch.id, { titles: { ...ch.titles, en: e.target.value } })}
                placeholder="English / Latin гарчиг" />
            </div>
          )}
        </div>
      </div>
    );
  }

  const closeAll = () => { setGenreOpen(false); setChLangOpenId(null); setTitleLangOpen(false); };

  const s1ok = !!titleMn.trim() && (titleLang === "en" || !!titleEn.trim()) && authors.length > 0 && !!genre;
  const s2ok = chapters.length > 0 && chapters.every(chapter => {
    const language = chapter.activeLang || "mn";
    return !!chapter.sourceName && !chapter.uploading && !chapter.uploadError && !!chapter.titles[language]?.trim() && (language === "en" || !!chapter.titles.en?.trim());
  });
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
              <InfoTip text="Гарчгийг англи хэлээс өөр хэлээр бичсэн бол англи хувилбар эсвэл латин үсгээр бичсэн нэрийг заавал оруулна уу." />
            </label>
            <div className="wiz-title-wrap">
              <div className="wiz-title-row">
                <input value={titleMn} onChange={e => setTitleMn(e.target.value)}
                  placeholder="Гарчиг оруулах" />
                <SelectInput variant="attached" value={titleLang} onChange={setTitleLang}
                  options={TITLE_LANGS.map(language => ({ value: language.code, label: language.label }))} />
              </div>
              {titleLang !== "en" && titleMn.trim().length > 0 && (
                <div className="wiz-title-row wiz-title-en-row">
                  <span className="wiz-title-en-label">EN · Заавал</span>
                  <input required aria-label="English / Latin гарчиг" value={titleEn} onChange={e => setTitleEn(e.target.value)}
                    placeholder="English / Latin гарчиг" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* UPC / ISRC auto-generation */}
        <div className="wiz-section">
          <div className="wiz-id-auto">
            <Fingerprint size={17} />
            <div>
              <b>UPC автоматаар үүсгэгдэнэ</b>
              <span>Аудио номыг илгээсний дараа UPC код автоматаар оноогдоно. Гараар оруулах шаардлагагүй.</span>
            </div>
          </div>
        </div>

        <div className="wiz-section">
          <ContributorPicker label="Зохиолч" hint="Нэг эсвэл олон зохиолч сонгоно" required error={showContributorErrors}
            people={authors} options={knownPeople} onChange={setAuthors} onCreate={person => setKnownPeople(previous => [...previous, person])} />
        </div>
        <div className="wiz-section">
          <ContributorPicker label="Уншигч" hint="Аудио номыг уншсан нэг эсвэл олон хүн"
            people={narrators} options={knownPeople} onChange={setNarrators} onCreate={person => setKnownPeople(previous => [...previous, person])} />
        </div>

        {/* Fields grid */}
        <div className="wiz-section">
          <div className="wiz-grid2">
            <div className="wiz-field">
              <label className="wiz-label">Нийтлэгч / Хэвлэлийн газар<InfoTip text="Аудио номын хэвлэлийн газар. Байхгүй бол хоосон орхино — артистын нэр ашиглагдана." /></label>
              <div className="wiz-locked">
                <div className="wiz-locked-main"><Building2 size={15} /><b>MOCO Records</b></div>
                <span><Lock size={11} />Account тохиргооноос</span>
              </div>
            </div>
            <div className="wiz-field">
              <label className="wiz-label">Хэл</label>
              <SelectInput
                value={language}
                onChange={setLanguage}
                options={AB_LANGUAGES}
              />
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
              <SelectInput
                value={ageRating}
                onChange={setAgeRating}
                options={["Бүгдэд тохиромжтой", "6+", "13+", "18+"]}
              />
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

    // ── Stage 2 ────────────────────────────────────────────────────────────
    if (stage === 2) return (
      <>
        <div className="wiz-add-song-bar">
          <div>
            <h2 style={{ margin: "0 0 4px" }}>Бүлгийн мэдээлэл</h2>
            <div className="wiz-hint">Бүлэг бүрийн мэдээллийг нээгээд бөглөнө.</div>
          </div>
          <button type="button" className="wiz-btn" style={{ gap: 6, flexShrink: 0 }}
            onClick={() => { setOpenChapter(chapters.length); setChapters(prev => [...prev, makeChapter(prev.length + 1)]); }}>
            <Plus size={13} />Бүлэг нэмэх
          </button>
        </div>
        <div className="wiz-tracks">
          {chapters.map((ch, idx) => {
            const isOpen = openChapter === idx;
            const hasFile = !!ch.sourceName;
            const displayTitle = ch.titles?.[ch.activeLang || "mn"] || ch.title || `${idx + 1}-р бүлэг`;
            return (
              <div key={ch.id}
                className={`wiz-track ${chDragOver === idx ? "drag-over" : ""} ${isOpen ? "open" : ""}`}
                onDragOver={e => { e.preventDefault(); setChDragOver(idx); }}
                onDragLeave={() => setChDragOver(null)}
                onDrop={() => handleChapterDrop(idx)}>
                <div className="wiz-track-head" onClick={() => setOpenChapter(isOpen ? -1 : idx)}>
                  <div className="wiz-drag-handle" draggable onClick={e => e.stopPropagation()}
                    onDragStart={() => { chDragFromRef.current = idx; }}
                    onDragEnd={() => { setChDragOver(null); chDragFromRef.current = null; }}>
                    <GripVertical size={14} />
                  </div>
                  <span className="wiz-track-no">{idx + 1}</span>
                  <div className="wiz-track-main">
                    <div className="wiz-track-main-info">
                      <span className="wiz-track-title">{displayTitle}</span>
                      <span className="wiz-track-meta-text">
                        {ch.uploading ? `Хуулж байна ${ch.uploadProgress}%` : hasFile ? `${ch.sourceName}${ch.duration ? " · " + ch.duration : ""}` : "Файл оруулаагүй"}
                      </span>
                    </div>
                    <div className="wiz-track-summary">
                      {hasFile && !ch.uploading && <>
                        {ch.fileFormat && <span className="wiz-status-pill">{ch.fileFormat}</span>}
                        {ch.sampleRate && <span className="wiz-status-pill">{ch.sampleRate}</span>}
                        {ch.bitDepth && <span className="wiz-status-pill">{ch.bitDepth}</span>}
                      </>}
                      <button type="button" className="wiz-btn icon-btn" onClick={e => { e.stopPropagation(); setChapters(prev => prev.filter((_, i) => i !== idx)); }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp size={16} style={{ color: "#999", flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: "#999", flexShrink: 0 }} />}
                </div>
                {isOpen && (
                  <div className="wiz-track-body">
                    <div className="wiz-track-panel">
                      <div className="wiz-track-panel-head">
                        <div className="wiz-track-panel-title"><AudioWaveform size={16} /><b>Аудио файл</b></div>
                        <span>WAV · FLAC · MP3</span>
                      </div>
                      {!hasFile && !ch.uploading ? (
                        <div className="wiz-audio-source">
                          <div className="wiz-audio-empty">
                            <div><b>Аудио файл оруулаагүй</b><span>Аудио файлаа сонгоно уу.</span></div>
                            <button type="button" onClick={() => uploadRefs.current[ch.id]?.click()} className="wiz-btn primary"><UploadCloud size={13} />Файл хуулах</button>
                          </div>
                        </div>
                      ) : ch.uploading ? (
                        <div className="wiz-audio-source">
                          <div className="wiz-audio-source-top">
                            <LoaderCircle size={20} className="animate-spin shrink-0 text-primary" />
                            <div className="wiz-audio-file" role="status" aria-live="polite"><b>{ch.sourceName}</b><span>{ch.uploadProgress >= 100 ? "Аудио мэдээлэл уншиж байна…" : `Файл уншиж байна · ${ch.uploadProgress}%`}</span></div>
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
                              <button type="button" className="wiz-btn" onClick={() => uploadRefs.current[ch.id]?.click()}><RefreshCw size={13} />Дахин хуулах</button>
                            </div>
                          </div>
                          <div className="wiz-audio-meta justify-between">
                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                            {ch.fileFormat && <span>{ch.fileFormat}</span>}
                            <span>{ch.sampleRate || "Hz: Уншигдсангүй"}</span>
                            {ch.bitDepth && <span>{ch.bitDepth}</span>}
                            </div>
                            {ch.fileSize && <span>{ch.fileSize}</span>}
                          </div>
                          {ch.uploadedAt && <p className="mt-2 text-xs text-muted-foreground">Хуулсан огноо: {new Date(ch.uploadedAt).toLocaleString("mn-MN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>}
                        </div>
                      )}
                      {ch.uploadError && <p role="alert" className="mt-2 text-xs text-destructive">{ch.uploadError}</p>}
                      <input ref={el => { uploadRefs.current[ch.id] = el; }} type="file" accept=".wav,.flac,.mp3,.aiff" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) simulateChapterUpload(ch.id, f); e.target.value = ""; }} />

                      <div className="mt-5">
                      {ChapterTitleEditor({ ch, idx })}

                      {/* ISRC */}
                      <div className="wiz-id-auto">
                        <Sparkles size={16} />
                        <div>
                          <b>ISRC автоматаар үүснэ</b>
                          <span>Илгээсний дараа энэ бүлэгт ISRC код автоматаар оноогдоно.</span>
                        </div>
                      </div>
                      </div>
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

    if (stage === 3) return <ContentCoverUpload kind="audiobook" value={cover} onChange={setCover} />;

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
                  <DateInput value={releaseDate} onChange={setReleaseDate} min={addDays(7)} />
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
          <button className="wiz-btn" onClick={() => navigate("/audiobooks")}>Каталог харах</button>
          <button className="wiz-btn primary" onClick={() => navigate("/dashboard")}>Хяналтын самбар</button>
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
                    ["Зохиолч", authors.map(a => a.name).join(", ") || "—"],
                    ["Уншигч", narrators.map(person => person.name).join(", ") || "—"],
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
                        <b>{ch.titles?.[ch.activeLang || "mn"] || ch.title || `${i + 1}-р бүлэг`}</b>
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
        { label: titleMn.trim() ? `"${titleMn}"` : "Монгол нэр оруулна уу", ok: !!titleMn.trim() },
        ...(titleLang !== "en" ? [{ label: "English / Latin нэр", ok: !!titleEn.trim() }] : []),
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
