import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams, useParams, useLocation } from "react-router";
import { Shell } from "@/components/layout/Shell";
import {
  Music2, Disc3, ArrowLeft, ArrowRight, Send, CloudUpload,
  Plus, X, Check, Info, Lock, Building2, Sparkles, ChevronDown, ChevronUp,
  Search, UserRoundPlus, AudioWaveform, Fingerprint, Mic2, Users, Activity,
  Play, RefreshCw, Trash2, UploadCloud, FileAudio, TriangleAlert,
  Pencil, GripVertical, Image, ImageOff, ZapIcon, CalendarDays,
  CalendarClock, RadioTower, ListMusic, ClipboardCheck, CircleCheckBig,
  Clock3, CircleX, UserRound, PlusCircle, CheckCircle2, Headphones, Video, AlertCircle,
  Star,
} from "lucide-react";
import "@/styles/wizard.css";
import { RELEASES } from "@/data/releases";

import skymelodyLogo from "@/imports/skymelody.png";
import unimusicLogo from "@/imports/unimusic.png";
import gtoneLogo from "@/imports/gtone.png";
import hitoneLogo from "@/imports/hitone.png";
import appleMusicLogo from "@/imports/applemusic.png";
import deezerLogo from "@/imports/deezer.png";
import egshigLogo from "@/imports/egshig.png";
import mmusicLogo from "@/imports/mmusic.png";
import sonsyLogo from "@/imports/sonsy.png";
import sonsyFmLogo from "@/imports/sonsyfm.png";
import spotifyLogo from "@/imports/spotify.png";
import youtubeMusicLogo from "@/imports/youtubemusic.png";

const SERVICE_LOGOS: Record<string, string> = {
  "SkyMelody":           skymelodyLogo,
  "Unimusic":            unimusicLogo,
  "GTone":               gtoneLogo,
  "Hitone":              hitoneLogo,
  "Apple Music":         appleMusicLogo,
  "Deezer":              deezerLogo,
  "Egshig":              egshigLogo,
  "M Music":             mmusicLogo,
  "Sonsy Music":         sonsyLogo,
  "Sonsy FM 78.9 & 100.1": sonsyFmLogo,
  "Spotify":             spotifyLogo,
  "YouTube Music":       youtubeMusicLogo,
};

// ─── types ───────────────────────────────────────────────────────────────────
type Mode = "single" | "album";
type Stage = 1 | 2 | 3 | 4 | 5;
type Artist = { id: string; name: string };
type ContribRef = { id: string; name: string; affiliation: string };
type OtherContrib = { id: string; name: string; role: string };
type TrackCredits = { composer: ContribRef[]; lyricist: ContribRef[]; other: OtherContrib[] };
type Track = {
  assetId: string;
  title: string;
  titles: { mn: string; en: string; [k: string]: string };
  activeLang: string;
  duration: string; sourceName: string; fileFormat: string; sampleRate: string; bitDepth: string;
  audioUrl: string; playing: boolean; uploading: boolean; uploadProgress: number; pendingSourceName: string;
  isrc: string; hasOwnISRC: boolean; isrcMode: "generate" | "existing";
  primaryArtists: Artist[]; featuredArtists: Artist[];
  genre: string; secondaryGenre: string;
  hasLyrics: boolean | null; explicitStatus: "not_explicit" | "explicit";
  vocalLanguage: string; lyrics: string;
  credits: TrackCredits;
  source: "new" | "existing";
  releaseStatus?: "live" | "approved" | "draft" | "denied" | "taken_down";
  usages: { album: string; upc: string; date: string }[];
};
type Cover = { name: string; dataUrl: string; width: number; height: number; size: number };

// ─── constants ────────────────────────────────────────────────────────────────
const ARTISTS: Artist[] = [
  { id: "ART-000184", name: "The Wasabies" },
  { id: "ART-000267", name: "Nene" },
  { id: "ART-000391", name: "ThunderZ" },
];
const ACCOUNT_CONTRIBS: ContribRef[] = [
  { id: "CON-001", name: "Золбоо Энхтүвшин", affiliation: "ASCAP" },
  { id: "CON-002", name: "Temka", affiliation: "" },
  { id: "CON-003", name: "Munkh", affiliation: "" },
  { id: "CON-004", name: "Anu", affiliation: "BMI" },
];
const GENRES = ["Alternative","Blues","Classical","Country","Electronic","Folk","Hip-Hop / Rap","Jazz","Metal","Pop","R&B / Soul","Reggae","Rock","Singer / Songwriter","Soundtrack","World"];

function GenreSelect({ value, otherValue, onChange, label, required, small }: {
  value: string; otherValue?: string; onChange: (v: string) => void;
  label: string; required?: boolean; small?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setMenuStyle({ position: "fixed", top: r.bottom + 4, left: r.left, width: r.width, zIndex: 9999 });
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.closest(".wiz-select-picker")?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [open]);

  const filtered = GENRES.filter(g =>
    g.toLowerCase().includes(search.toLowerCase()) && g !== otherValue
  );

  return (
    <div className="wiz-field">
      <label className="wiz-label" style={small ? { fontSize: 12 } : undefined}>{label}{required && <span className="wiz-req">*</span>}</label>
      <div className="wiz-select-picker">
        <div ref={triggerRef} className="wiz-select-value" onClick={() => { setOpen(v => !v); setSearch(""); }}>
          <span style={{ color: value ? "var(--w-text)" : "var(--w-muted)", fontSize: 13 }}>{value || "Жанр хайж сонгох"}</span>
          <ChevronDown size={small ? 14 : 15} />
        </div>
        {open && (
          <div className="wiz-select-menu" style={{ ...menuStyle, position: "fixed" }}>
            <div className="wiz-select-search">
              <Search size={13} />
              <input className="wiz-input" style={{ height: 34, paddingLeft: 30 }}
                value={search} onChange={e => setSearch(e.target.value)} placeholder="Жанр хайх" autoFocus />
            </div>
            {filtered.map(g => (
              <div key={g} className={`wiz-option ${g === value ? "selected" : ""}`}
                onMouseDown={() => { onChange(g); setOpen(false); setSearch(""); }}>{g}</div>
            ))}
            {filtered.length === 0 && <div style={{ padding: "10px 12px", fontSize: 13, color: "#999" }}>Олдсонгүй</div>}
          </div>
        )}
      </div>
    </div>
  );
}
const LANGUAGES: { code: string; name: string }[] = [
  { code: "mn", name: "Монгол" },
  { code: "en", name: "English / Latin" },
  { code: "ko", name: "한국어" },
  { code: "ja", name: "日本語" },
];
const STEPS = ["Үндсэн мэдээлэл", "Дууны мэдээлэл", "Ковер зураг", "Нийтлэх & Түгээх", "Шалгах & илгээх"];
const SERVICES_DOMESTIC = ["Sonsy Music", "M Music"];
const SERVICES_PRBT = ["Hitone", "Unimusic", "SkyMelody", "GTone"];
const SERVICES_INTERNATIONAL = ["Egshig", "Apple Music", "Spotify", "YouTube Music", "Deezer"];
const SERVICES_PROMO = ["Sonsy FM 78.9 & 100.1"];
const ALL_SERVICES = [...SERVICES_DOMESTIC, ...SERVICES_PRBT, ...SERVICES_INTERNATIONAL, ...SERVICES_PROMO];
const OTHER_ROLES: Record<string, string> = {
  producer: "Producer",
  mixing_engineer: "Mixing Engineer",
  mastering_engineer: "Mastering Engineer",
  recording_engineer: "Recording Engineer",
};
type SongStatus = NonNullable<Track["releaseStatus"]>;
const ELIGIBLE_SONG_STATUSES: Set<SongStatus> = new Set(["approved", "live"]);

const SONG_LIBRARY: Track[] = [
  {
    assetId: "AST-000701", title: "Бороо",
    titles: { mn: "Бороо", en: "Rain" }, activeLang: "mn",
    duration: "03:42", sourceName: "Nene - Boroo.wav", fileFormat: "WAV", sampleRate: "44.1 kHz", bitDepth: "24-bit",
    audioUrl: "", playing: false, uploading: false, uploadProgress: 0, pendingSourceName: "",
    isrc: "MN-ABC-26-00001", hasOwnISRC: true, isrcMode: "existing",
    primaryArtists: [{ id: "ART-000267", name: "Nene" }], featuredArtists: [],
    genre: "Pop", secondaryGenre: "R&B / Soul",
    hasLyrics: true, explicitStatus: "not_explicit", vocalLanguage: "mn", lyrics: "Бороо орж байна...\nЧамайг санаж байна...",
    credits: { composer: [{ id: "CON-001", name: "Золбоо Энхтүвшин", affiliation: "ASCAP" }], lyricist: [], other: [] },
    source: "existing", releaseStatus: "live",
    usages: [{ album: "Шөнийн хот", upc: "865123456789", date: "2026-05-18" }],
  },
  {
    assetId: "AST-000702", title: "Хайр",
    titles: { mn: "Хайр", en: "Love" }, activeLang: "mn",
    duration: "04:08", sourceName: "", fileFormat: "", sampleRate: "", bitDepth: "",
    audioUrl: "", playing: false, uploading: false, uploadProgress: 0, pendingSourceName: "",
    isrc: "MN-ABC-26-00002", hasOwnISRC: true, isrcMode: "existing",
    primaryArtists: [{ id: "ART-000267", name: "Nene" }], featuredArtists: [{ id: "ART-000391", name: "ThunderZ" }],
    genre: "Pop", secondaryGenre: "Hip-Hop / Rap",
    hasLyrics: true, explicitStatus: "explicit", vocalLanguage: "mn", lyrics: "",
    credits: { composer: [], lyricist: [], other: [] },
    source: "existing", releaseStatus: "live",
    usages: [{ album: "Дурсамж", upc: "865111222333", date: "2026-02-14" }],
  },
  {
    assetId: "AST-000645", title: "Чамд",
    titles: { mn: "Чамд", en: "For You" }, activeLang: "mn",
    duration: "03:21", sourceName: "", fileFormat: "", sampleRate: "", bitDepth: "",
    audioUrl: "", playing: false, uploading: false, uploadProgress: 0, pendingSourceName: "",
    isrc: "MN-ZZZ-25-00123", hasOwnISRC: true, isrcMode: "existing",
    primaryArtists: [{ id: "ART-000184", name: "The Wasabies" }], featuredArtists: [],
    genre: "Rock", secondaryGenre: "Alternative",
    hasLyrics: false, explicitStatus: "not_explicit", vocalLanguage: "", lyrics: "",
    credits: { composer: [], lyricist: [], other: [] },
    source: "existing", releaseStatus: "approved", usages: [],
  },
  {
    assetId: "AST-000503", title: "Манлай",
    titles: { mn: "Манлай", en: "Champion" }, activeLang: "mn",
    duration: "03:55", sourceName: "ThunderZ - Manlay.wav", fileFormat: "WAV", sampleRate: "44.1 kHz", bitDepth: "16-bit",
    audioUrl: "", playing: false, uploading: false, uploadProgress: 0, pendingSourceName: "",
    isrc: "MN-THZ-25-00088", hasOwnISRC: true, isrcMode: "existing",
    primaryArtists: [{ id: "ART-000391", name: "ThunderZ" }], featuredArtists: [],
    genre: "Hip-Hop / Rap", secondaryGenre: "",
    hasLyrics: true, explicitStatus: "not_explicit", vocalLanguage: "mn", lyrics: "",
    credits: { composer: [], lyricist: [], other: [] },
    source: "existing", releaseStatus: "draft", usages: [],
  },
  {
    assetId: "AST-000412", title: "Замын Эхлэл",
    titles: { mn: "Замын Эхлэл", en: "Start of the Road" }, activeLang: "mn",
    duration: "02:58", sourceName: "Wasabies - Zamiin.wav", fileFormat: "WAV", sampleRate: "48 kHz", bitDepth: "24-bit",
    audioUrl: "", playing: false, uploading: false, uploadProgress: 0, pendingSourceName: "",
    isrc: "MN-WBS-25-00041", hasOwnISRC: true, isrcMode: "existing",
    primaryArtists: [{ id: "ART-000184", name: "The Wasabies" }], featuredArtists: [],
    genre: "Rock", secondaryGenre: "Alternative",
    hasLyrics: false, explicitStatus: "not_explicit", vocalLanguage: "mn", lyrics: "",
    credits: { composer: [], lyricist: [], other: [] },
    source: "existing", releaseStatus: "denied", usages: [],
  },
];

// ─── helpers ──────────────────────────────────────────────────────────────────
function initials(name: string) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}
function langName(code: string) {
  return LANGUAGES.find(l => l.code === code)?.name || code;
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
function makeNewTrack(idx = 1): Track {
  return {
    assetId: "NEW-" + Date.now() + "-" + idx, title: "Шинэ дуу " + idx,
    titles: { mn: "Шинэ дуу " + idx, en: "" }, activeLang: "mn",
    duration: "", sourceName: "", fileFormat: "", sampleRate: "", bitDepth: "",
    audioUrl: "", playing: false, uploading: false, uploadProgress: 0, pendingSourceName: "",
    isrc: "", hasOwnISRC: false, isrcMode: "generate",
    primaryArtists: [], featuredArtists: [],
    genre: "", secondaryGenre: "",
    hasLyrics: null, explicitStatus: "not_explicit", vocalLanguage: "", lyrics: "",
    credits: { composer: [], lyricist: [], other: [] },
    source: "new", usages: [],
  };
}
function displayISRC(code: string) { return (code || "").replace(/-/g, ""); }
function parseDuration(v: string) {
  if (!v || v === "—") return 0;
  const p = v.split(":").map(Number);
  return p.length === 2 ? p[0] * 60 + (p[1] || 0) : 0;
}
function addDays(n: number) {
  const d = new Date(); d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
const serviceIconLabel = (name: string) => {
  const m: Record<string, string> = { "Sonsy Music": "S", "M Music": "M", "Hitone": "H", "Unimusic": "U", "SkyMelody": "SM", "GTone": "G", "Egshig": "E", "Apple Music": "AM", "Spotify": "SP", "YouTube Music": "YT", "Deezer": "DZ", "Sonsy FM 78.9 & 100.1": "FM" };
  return m[name] || "♪";
};

// ─── waveform visual ──────────────────────────────────────────────────────────
function WaveBars({ seed = 0 }) {
  const h = [8, 14, 20, 11, 24, 17, 10, 22, 28, 16, 12, 25, 18, 9, 21, 27, 14, 19, 8, 24, 13, 29, 17, 11, 22, 15, 26, 10, 20, 14];
  return (
    <div className="wiz-waveform" aria-hidden>
      {h.map((v, i) => (
        <i key={i} style={{ height: Math.max(4, v + (seed + i) % 7) + "px" }} />
      ))}
    </div>
  );
}

// ─── main wizard ──────────────────────────────────────────────────────────────
export default function MusicWizard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: pathId } = useParams<{ id?: string }>();
  const { pathname } = useLocation();

  // mode from path (/releases/new/single or /releases/new/album) or ?mode= query param
  const pathMode: Mode | null = pathname.endsWith("/single") ? "single" : pathname.endsWith("/album") ? "album" : null;
  const urlMode = searchParams.get("mode") as Mode | null;
  // edit id from path param (/releases/:id/edit) or ?edit= query param
  const editId = pathId ?? searchParams.get("edit");
  const editRelease = editId ? RELEASES.find(r => r.id === editId) : null;
  const isRevisionEdit = editRelease?.status === "revision";
  const autoMode: Mode | null = editRelease
    ? (editRelease.type === "Single" ? "single" : "album")
    : (pathMode ?? (urlMode === "single" || urlMode === "album" ? urlMode : null));
  const [mode, setMode] = useState<Mode | null>(autoMode);
  const [stage, setStage] = useState<Stage>(1);

  // stage 1
  const [titlesMn, setTitlesMn] = useState("");
  const [titlesEn, setTitlesEn] = useState("");
  const [titleLang, setTitleLang] = useState<string>("mn");
  const [titleExtras, setTitleExtras] = useState<Record<string, string>>({});
  const [primary, setPrimary] = useState<Artist[]>([]);
  const [featured, setFeatured] = useState<Artist[]>([]);
  const [primaryGenre, setPrimaryGenre] = useState("");
  const [secondaryGenre, setSecondaryGenre] = useState("");
  const [previous, setPrevious] = useState(false);
  const [originalDate, setOriginalDate] = useState("");
  const [prevUPC, setPrevUPC] = useState("");
  const [cOwner, setCOwner] = useState("");
  const [cYear, setCYear] = useState(String(new Date().getFullYear()));
  const [pOwner, setPOwner] = useState("");
  const [pYear, setPYear] = useState(String(new Date().getFullYear()));

  // stage 2
  const [tracks, setTracks] = useState<Track[]>([makeNewTrack(1)]);
  const [openTrack, setOpenTrack] = useState(-1);
  const [artists, setArtists] = useState<Artist[]>(ARTISTS);
  const [accountContribs, setAccountContribs] = useState<ContribRef[]>(ACCOUNT_CONTRIBS);
  const uploadRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // stage 3
  const [cover, setCover] = useState<Cover>({ name: "", dataUrl: "", width: 0, height: 0, size: 0 });
  const [coverError, setCoverError] = useState("");
  const [coverDrag, setCoverDrag] = useState(false);
  const coverFileRef = useRef<HTMLInputElement>(null);

  // stage 4
  const [scheduleMode, setScheduleMode] = useState<"asap" | "date">("asap");
  const [releaseDate, setReleaseDate] = useState("");
  const [services, setServices] = useState(new Set<string>(ALL_SERVICES));

  // stage 5
  const [reviewConfirmed, setReviewConfirmed] = useState(false);

  // modals
  const [artistModal, setArtistModal] = useState<{ open: boolean; kind: "primary" | "featured"; trackIdx?: number } | null>(null);
  const [artistModalSel, setArtistModalSel] = useState(new Set<string>());
  const [artistSearch, setArtistSearch] = useState("");
  const [contribModal, setContribModal] = useState<{ open: boolean; trackIdx: number; role: "composer" | "lyricist" | "other" } | null>(null);
  const [otherRole, setOtherRole] = useState("producer");
  const [createContribModal, setCreateContribModal] = useState<{ open: boolean; trackIdx: number; role: string; isOther: boolean } | null>(null);
  const [newContribName, setNewContribName] = useState("");
  const [newContribAffil, setNewContribAffil] = useState("");
  const [createName, setCreateName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showAddSong, setShowAddSong] = useState(false);
  const [showReleasedPicker, setShowReleasedPicker] = useState(false);
  const [addSongSel, setAddSongSel] = useState(new Set<string>());
  const [addSongSearch, setAddSongSearch] = useState("");
  const [pendingUploads, setPendingUploads] = useState<Track[]>([]);
  const [relLangOpen, setRelLangOpen] = useState(false);
  const [trackLangOpenIdx, setTrackLangOpenIdx] = useState<number | null>(null);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const dragFromRef = useRef<number | null>(null);

  const isSingle = mode === "single";

  // ─── auto-save draft to localStorage
  useEffect(() => {
    if (!mode) return;
    const tid = setTimeout(() => {
      try {
        const draft = {
          mode, stage, titlesMn, titlesEn, titleLang,
          primary, featured, primaryGenre, secondaryGenre,
          previous, originalDate, prevUPC,
          tracks: tracks.map(t => ({ ...t, audioUrl: "", playing: false, uploading: false })),
          scheduleMode, releaseDate, services: [...services],
          reviewConfirmed,
        };
        localStorage.setItem("wiz-draft", JSON.stringify(draft));
        const t = new Date();
        setDraftSavedAt(`${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}`);
      } catch {}
    }, 1500);
    return () => clearTimeout(tid);
  }, [mode, titlesMn, titlesEn, titleLang, primary, featured,
      primaryGenre, secondaryGenre, previous, originalDate, prevUPC,
      cOwner, cYear, pOwner, pYear,
      tracks, scheduleMode, releaseDate, services, reviewConfirmed]);

  // pre-fill from existing release when ?edit=xxx
  useEffect(() => {
    if (!editRelease) return;
    setTitlesMn(editRelease.title);
    const toArtist = (name: string, idx: number) => ({ id: `EDIT-${idx}`, name });
    setPrimary([toArtist(editRelease.primaryArtist, 0)]);
    setFeatured(editRelease.featArtists.map(toArtist));
    setPrimaryGenre(editRelease.genre);
    if (editRelease.releaseDate) {
      setScheduleMode("date");
      setReleaseDate(editRelease.releaseDate);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── track updater
  const updateTrack = (idx: number, patch: Partial<Track>) =>
    setTracks(ts => ts.map((t, i) => i === idx ? { ...t, ...patch } : t));

  // ─── mode select
  function chooseMode(m: Mode) {
    setMode(m);
    const t = makeNewTrack(1);
    setTracks([t]);
    setOpenTrack(0);
  }

  // ─── artist helpers
  function openArtistModal(kind: "primary" | "featured", trackIdx?: number) {
    setArtistModal({ open: true, kind, trackIdx });
    setArtistModalSel(new Set());
    setArtistSearch("");
  }
  function confirmArtistSel() {
    if (!artistModal) return;
    const { kind, trackIdx } = artistModal;
    if (trackIdx !== undefined) {
      const arr = kind === "primary" ? tracks[trackIdx].primaryArtists : tracks[trackIdx].featuredArtists;
      const toAdd = artists.filter(a => artistModalSel.has(a.id) && !arr.some(x => x.id === a.id));
      updateTrack(trackIdx, kind === "primary" ? { primaryArtists: [...arr, ...toAdd] } : { featuredArtists: [...arr, ...toAdd] });
    } else {
      const arr = kind === "primary" ? primary : featured;
      const toAdd = artists.filter(a => artistModalSel.has(a.id) && !arr.some(x => x.id === a.id));
      if (kind === "primary") setPrimary([...arr, ...toAdd]);
      else setFeatured([...arr, ...toAdd]);
    }
    setArtistModal(null); setShowCreate(false); setCreateName("");
  }
  function createArtist(name: string) {
    const a: Artist = { id: "ART-" + String(500 + artists.length).padStart(6, "0"), name };
    setArtists(prev => [...prev, a]);
    if (!artistModal) return;
    const { kind, trackIdx } = artistModal;
    if (trackIdx !== undefined) {
      const arr = kind === "primary" ? tracks[trackIdx].primaryArtists : tracks[trackIdx].featuredArtists;
      updateTrack(trackIdx, kind === "primary" ? { primaryArtists: [...arr, a] } : { featuredArtists: [...arr, a] });
    } else {
      if (kind === "primary") setPrimary(p => [...p, a]);
      else setFeatured(f => [...f, a]);
    }
    setArtistModal(null); setShowCreate(false); setCreateName("");
  }

  // ─── cover helpers
  function validateCover(file: File, w: number, h: number): string {
    if (!["image/jpeg", "image/png"].includes(file.type)) return "Ковер зураг JPG эсвэл PNG форматтай байх ёстой.";
    if (file.size > 20 * 1024 * 1024) return "Ковер зургийн файлын хэмжээ 20MB-аас их байж болохгүй.";
    if (w !== h) return "Ковер зураг 1:1 харьцаатай, төгс квадрат байх ёстой.";
    if (w < 1500) return "Ковер зураг хамгийн багадаа 1500 × 1500 px хэмжээтэй байх ёстой.";
    if (w > 6000) return "Ковер зураг хамгийн ихдээ 6000 × 6000 px хэмжээтэй байж болно.";
    return "";
  }
  function handleCoverFile(file: File) {
    setCoverError("");
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const err = validateCover(file, img.naturalWidth, img.naturalHeight);
        if (err) { setCoverError(err); return; }
        setCover({ name: file.name, dataUrl: reader.result as string, width: img.naturalWidth, height: img.naturalHeight, size: file.size });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // ─── audio upload simulation
  function simulateUpload(trackIdx: number, file: File) {
    const ext = file.name.split(".").pop()?.toUpperCase() || "AUDIO";
    updateTrack(trackIdx, { uploading: true, uploadProgress: 0, pendingSourceName: file.name, sourceName: "" });
    let p = 0;
    const url = URL.createObjectURL(file);
    const timer = setInterval(() => {
      p = Math.min(100, p + 14);
      setTracks(ts => ts.map((t, i) => {
        if (i !== trackIdx) return t;
        if (p >= 100) {
          clearInterval(timer);
          return { ...t, uploading: false, uploadProgress: 100, sourceName: file.name, fileFormat: ext, sampleRate: "44.1 kHz", bitDepth: "24-bit", duration: "3:28", audioUrl: url };
        }
        return { ...t, uploadProgress: p };
      }));
    }, 180);
  }

  // ─── contributor helpers
  function openContribModal(trackIdx: number, role: "composer" | "lyricist" | "other") {
    if (role === "lyricist" && tracks[trackIdx].hasLyrics !== true) return;
    setContribModal({ open: true, trackIdx, role });
    setOtherRole("producer");
  }
  function selectCoreContrib(pid: string) {
    if (!contribModal) return;
    const { trackIdx, role } = contribModal;
    const p = accountContribs.find(x => x.id === pid);
    if (!p) return;
    const arr = role === "composer" ? tracks[trackIdx].credits.composer : tracks[trackIdx].credits.lyricist;
    if (arr.some(x => x.id === pid)) { setContribModal(null); return; }
    const next = [...arr, { id: p.id, name: p.name, affiliation: p.affiliation }];
    updateTrack(trackIdx, { credits: { ...tracks[trackIdx].credits, [role]: next } });
    setContribModal(null);
  }
  function selectOtherContrib(pid: string) {
    if (!contribModal) return;
    const { trackIdx } = contribModal;
    const p = accountContribs.find(x => x.id === pid);
    if (!p) return;
    const arr = tracks[trackIdx].credits.other;
    if (arr.some(x => x.id === pid && x.role === otherRole)) { setContribModal(null); return; }
    updateTrack(trackIdx, { credits: { ...tracks[trackIdx].credits, other: [...arr, { id: p.id, name: p.name, role: otherRole }] } });
    setContribModal(null);
  }
  function saveNewContrib() {
    if (!createContribModal || !newContribName.trim()) return;
    const { trackIdx, role, isOther } = createContribModal;
    const p: ContribRef = { id: "CON-" + String(100 + accountContribs.length).padStart(3, "0"), name: newContribName.trim(), affiliation: isOther ? "" : newContribAffil.trim() };
    setAccountContribs(prev => [...prev, p]);
    const c = tracks[trackIdx].credits;
    if (isOther) {
      updateTrack(trackIdx, { credits: { ...c, other: [...c.other, { id: p.id, name: p.name, role }] } });
    } else {
      const arr = role === "composer" ? c.composer : c.lyricist;
      updateTrack(trackIdx, { credits: { ...c, [role]: [...arr, { id: p.id, name: p.name, affiliation: p.affiliation }] } });
    }
    setCreateContribModal(null);
    setContribModal(null);
    setNewContribName(""); setNewContribAffil("");
  }

  // ─── add song helpers
  function confirmAddSongs() {
    const toAdd: Track[] = [];
    addSongSel.forEach(id => { const s = SONG_LIBRARY.find(x => x.assetId === id); if (s) toAdd.push({ ...s }); });
    pendingUploads.forEach(t => toAdd.push({ ...t }));
    if (isSingle) {
      if (toAdd[0]) setTracks([toAdd[0]]);
    } else {
      setTracks(prev => {
        const existing = new Set(prev.map(t => t.assetId));
        return [...prev, ...toAdd.filter(t => !existing.has(t.assetId))];
      });
    }
    setShowAddSong(false); setShowReleasedPicker(false);
    setAddSongSel(new Set()); setPendingUploads([]);
    setOpenTrack(0);
  }

  // ─── drag reorder (use ref to avoid stale closure on drop)
  function handleDrop(targetIdx: number) {
    const from = dragFromRef.current;
    if (from === null || from === targetIdx) { setDragFrom(null); setDragOver(null); dragFromRef.current = null; return; }
    setTracks(ts => { const next = [...ts]; const [moved] = next.splice(from, 1); next.splice(targetIdx, 0, moved); return next; });
    setOpenTrack(ot => {
      if (ot === from) return targetIdx;
      if (from < ot && targetIdx >= ot) return ot - 1;
      if (from > ot && targetIdx <= ot) return ot + 1;
      return ot;
    });
    setDragFrom(null); setDragOver(null); dragFromRef.current = null;
  }

  // ─── navigation
  function goStage(n: Stage) {
    setStage(n);
    if (n === 2 && tracks.length && openTrack < 0) setOpenTrack(0);
  }
  function handleNext() {
    if (stage < 5) goStage((stage + 1) as Stage);
    else if (reviewConfirmed) navigate("/submit/success");
  }
  function handleBack() {
    if (stage > 1) goStage((stage - 1) as Stage);
    else navigate("/releases");
  }

  function portalType() {
    if (isSingle) return "Single";
    const total = tracks.reduce((s, t) => s + parseDuration(t.duration), 0);
    if (tracks.length <= 1) return "Single";
    if (tracks.length <= 6 && total < 1800) return "EP";
    return "Album";
  }
  function totalDuration() {
    const sec = tracks.reduce((s, t) => s + parseDuration(t.duration), 0);
    if (!sec) return "0:00";
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
  }

  // ══════════════════ sub-components ═══════════════════════════════════════════

  function TitleField() {
    const addableLangs = LANGUAGES.filter(l => l.code !== titleLang && l.code !== "en" && !titleExtras[l.code]);
    return (
      <div className="wiz-field" onClick={e => e.stopPropagation()}>
        <label className="wiz-label">
          {isSingle ? "Дууны нэр" : "Цомгийн нэр"} <span className="wiz-req">*</span>
          <InfoTip text="Дуу / Цомгийн нэр. Монгол болон English хувилбар шаардлагатай — олон улсын платформд English нэр харагдана." />
        </label>
        <div className="wiz-title-wrap">
          <div className="wiz-title-row">
            <input value={titlesMn} onChange={e => setTitlesMn(e.target.value)}
              placeholder="Гарчиг оруулах" />
            <button type="button" className="wiz-title-lang-btn"
              onClick={() => { setRelLangOpen(v => !v); setTrackLangOpenIdx(null); }}>
              <span>{langName(titleLang)}</span>
              <ChevronDown size={11} />
              {relLangOpen && (
                <div className="wiz-title-lang-drop" onMouseDown={e => e.stopPropagation()}>
                  {LANGUAGES.map(l => (
                    <div key={l.code} className={`wiz-title-lang-opt ${titleLang === l.code ? "active" : ""}`}
                      onMouseDown={() => { setTitleLang(l.code); setRelLangOpen(false); }}>
                      {l.name}
                    </div>
                  ))}
                </div>
              )}
            </button>
          </div>
          {titleLang !== "en" && (
            <div className="wiz-title-row wiz-title-en-row">
              <span className="wiz-title-en-label">EN · Заавал</span>
              <input value={titlesEn} onChange={e => setTitlesEn(e.target.value)}
                placeholder="English / Latin гарчиг" />
            </div>
          )}
          {Object.entries(titleExtras).map(([code, val]) => (
            <div className="wiz-title-row wiz-title-extra-row" key={code}>
              <span className="wiz-title-extra-lang-badge">{langName(code)}</span>
              <input value={val}
                onChange={e => setTitleExtras(prev => ({ ...prev, [code]: e.target.value }))}
                placeholder={`${langName(code)} гарчиг`} />
              <button type="button" className="wiz-title-remove-btn"
                onClick={() => setTitleExtras(prev => { const n = { ...prev }; delete n[code]; return n; })}>
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
        {titleLang !== "en" && !titlesEn.trim() && titlesMn.trim().length >= 3 && (
          <div className="wiz-title-warn">
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            English / Latin хувилбар нь дэлхийн платформуудад шаардлагатай. Дээр оруулна уу.
          </div>
        )}
        {addableLangs.length > 0 && (
          <div className="wiz-title-add-strip">
            <span className="wiz-title-add-strip-label">Нэмэлт хувилбар:</span>
            {addableLangs.map(l => (
              <button key={l.code} type="button" className="wiz-title-add-btn"
                onClick={() => setTitleExtras(prev => ({ ...prev, [l.code]: "" }))}>
                + {l.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  function ArtistRoleBox({ kind }: { kind: "primary" | "featured" }) {
    const arr = kind === "primary" ? primary : featured;
    const label = kind === "primary" ? "Үндсэн артист" : "Хамтарсан артист";
    return (
      <div className="wiz-artist-role-box">
        <div className="wiz-artist-role-head">
          <div>
            <label className="wiz-label" style={{ marginBottom: 0 }}>{label}{kind === "primary" && <span className="wiz-req">*</span>}{kind === "primary" && <InfoTip text="Бүх платформд харагдах үндсэн артист. Хэд хэдэн артист байвал бүгдийг нэмнэ." />}</label>
            <div className="wiz-artist-role-hint">{kind === "primary" ? `${isSingle ? "Дуу" : "Цомог"} дээр голлон харагдах артист` : "Заавал биш"}</div>
          </div>
          <button className="wiz-btn wiz-artist-role-action" onClick={() => openArtistModal(kind)}>
            <Plus size={13} />{arr.length ? "Нэмэх" : "Артист сонгох"}
          </button>
        </div>
        {arr.length > 0 ? (
          <div className="wiz-artist-selected-list">
            {arr.map(a => (
              <div key={a.id} className="wiz-artist-selected-card">
                <span className="wiz-avatar md">{initials(a.name)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b style={{ display: "block", fontSize: 13 }}>{a.name}</b>
                  <span style={{ fontSize: 12, color: "#888" }}>{label}</span>
                </div>
                <button className="wiz-btn icon-btn" onClick={() => kind === "primary" ? setPrimary(p => p.filter(x => x.id !== a.id)) : setFeatured(f => f.filter(x => x.id !== a.id))}>
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="wiz-artist-empty"><UserRound size={15} /><span>{kind === "primary" ? "Үндсэн артист сонгоогүй байна." : "Хамтарсан артист байхгүй."}</span></div>
        )}
      </div>
    );
  }


  function TrackTitleEditor({ t, idx }: { t: Track; idx: number }) {
    const active = t.activeLang || "mn";
    const extraCodes = Object.keys(t.titles).filter(k => k !== active && k !== "en");
    const addableLangs = LANGUAGES.filter(l => l.code !== active && l.code !== "en" && !(l.code in t.titles));
    return (
      <div className="wiz-field" onClick={e => e.stopPropagation()}>
        <label className="wiz-label">Дууны нэр <span className="wiz-req">*</span>
          <InfoTip text="Тус дуунд зориулсан нэр. Монгол болон English хувилбар шаардлагатай." />
        </label>
        <div className="wiz-title-wrap">
          <div className="wiz-title-row">
            <input value={t.titles[active] || ""}
              onChange={e => updateTrack(idx, { titles: { ...t.titles, [active]: e.target.value } })}
              placeholder="Гарчиг оруулах" />
            <button type="button" className="wiz-title-lang-btn"
              onClick={() => { setTrackLangOpenIdx(trackLangOpenIdx === idx ? null : idx); setRelLangOpen(false); }}>
              <span>{langName(active)}</span>
              <ChevronDown size={11} />
              {trackLangOpenIdx === idx && (
                <div className="wiz-title-lang-drop" onMouseDown={e => e.stopPropagation()}>
                  {LANGUAGES.map(l => (
                    <div key={l.code} className={`wiz-title-lang-opt ${active === l.code ? "active" : ""}`}
                      onMouseDown={() => { updateTrack(idx, { activeLang: l.code }); setTrackLangOpenIdx(null); }}>
                      {l.name}
                    </div>
                  ))}
                </div>
              )}
            </button>
          </div>
          {active !== "en" && (
            <div className="wiz-title-row wiz-title-en-row">
              <span className="wiz-title-en-label">EN · Заавал</span>
              <input value={t.titles.en || ""}
                onChange={e => updateTrack(idx, { titles: { ...t.titles, en: e.target.value } })}
                placeholder="English / Latin гарчиг" />
            </div>
          )}
          {extraCodes.map(code => (
            <div className="wiz-title-row wiz-title-extra-row" key={code}>
              <span className="wiz-title-extra-lang-badge">{langName(code)}</span>
              <input value={t.titles[code] || ""}
                onChange={e => updateTrack(idx, { titles: { ...t.titles, [code]: e.target.value } })}
                placeholder={`${langName(code)} гарчиг`} />
              <button type="button" className="wiz-title-remove-btn"
                onClick={() => { const nt = { ...t.titles }; delete nt[code]; updateTrack(idx, { titles: nt }); }}>
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
        {active !== "en" && !t.titles.en?.trim() && (t.titles[active]?.trim()?.length ?? 0) >= 3 && (
          <div className="wiz-title-warn">
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            English / Latin хувилбар шаардлагатай.
          </div>
        )}
        {addableLangs.length > 0 && (
          <div className="wiz-title-add-strip">
            <span className="wiz-title-add-strip-label">Нэмэлт хувилбар:</span>
            {addableLangs.map(l => (
              <button key={l.code} type="button" className="wiz-title-add-btn"
                onClick={() => updateTrack(idx, { titles: { ...t.titles, [l.code]: "" } })}>
                + {l.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  function TrackArtistRole({ idx, kind }: { idx: number; kind: "primary" | "featured" }) {
    const arr = kind === "primary" ? tracks[idx].primaryArtists : tracks[idx].featuredArtists;
    const label = kind === "primary" ? "Үндсэн артист" : "Хамтарсан артист";
    return (
      <div className="wiz-track-artist-role">
        <div className="wiz-artist-role-head" style={{ marginBottom: 8 }}>
          <div>
            <label className="wiz-label" style={{ marginBottom: 0, fontSize: 12 }}>{label}{kind === "primary" && <span className="wiz-req">*</span>}</label>
            <div className="wiz-artist-role-hint">{kind === "primary" ? "Track дээр голлон харагдах артист" : "Заавал биш"}</div>
          </div>
          <button className="wiz-btn wiz-artist-role-action" style={{ fontSize: 12 }} onClick={() => openArtistModal(kind, idx)}>
            <Plus size={12} />{arr.length ? "Нэмэх" : "Сонгох"}
          </button>
        </div>
        {arr.length > 0 ? (
          <div className="wiz-artist-selected-list">
            {arr.map(a => (
              <div key={a.id} className="wiz-artist-selected-card">
                <span className="wiz-avatar sm">{initials(a.name)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b style={{ display: "block", fontSize: 12 }}>{a.name}</b>
                  <span style={{ fontSize: 11, color: "#888" }}>{label}</span>
                </div>
                <button className="wiz-btn icon-btn" onClick={() => {
                  const next = arr.filter(x => x.id !== a.id);
                  updateTrack(idx, kind === "primary" ? { primaryArtists: next } : { featuredArtists: next });
                }}><X size={12} /></button>
              </div>
            ))}
          </div>
        ) : (
          <div className="wiz-artist-empty"><UserRound size={14} /><span>{kind === "primary" ? "Үндсэн артист сонгоогүй байна." : "Хамтарсан артист байхгүй."}</span></div>
        )}
      </div>
    );
  }


  function AudioSourceCard({ t, idx }: { t: Track; idx: number }) {
    const isLinked = t.source === "existing";

    if (!t.sourceName) {
      // existing-sourced track without a stored filename — show locked empty state
      if (isLinked) {
        return (
          <div className="wiz-audio-source">
            <div className="wiz-audio-empty" style={{ opacity: 0.7 }}>
              <div>
                <b>Аудио файл холбогдсон</b>
                <span>Эх сурвалжийн аудиог солих боломжгүй.</span>
              </div>
              <span className="wiz-status-pill" style={{ background: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Lock size={10} />Холбогдсон
              </span>
            </div>
          </div>
        );
      }
      return (
        <div className="wiz-audio-source">
          <div className="wiz-audio-empty">
            <div>
              <b>{t.uploading ? "Файл хуулж байна" : "Audio файл оруулаагүй"}</b>
              <span>{t.uploading ? (t.pendingSourceName || "Хуулж байна...") : "Track source файлаа сонгоно."}</span>
            </div>
            <button className="wiz-btn primary" disabled={t.uploading} onClick={() => uploadRefs.current[t.assetId]?.click()}>
              <UploadCloud size={13} />Файл хуулах
            </button>
            <input ref={el => { uploadRefs.current[t.assetId] = el; }} type="file" accept="audio/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) simulateUpload(idx, f); e.target.value = ""; }} />
          </div>
          {t.uploading && (
            <div className="wiz-upload-progress">
              <div className="wiz-upload-progress-top"><b>{t.pendingSourceName || "Хуулж байна..."}</b><span>{t.uploadProgress || 0}%</span></div>
              <div className="wiz-progress-bar"><i style={{ width: `${t.uploadProgress || 0}%` }} /></div>
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="wiz-audio-source">
        <div className="wiz-audio-source-top">
          <button className="wiz-audio-play" disabled={!t.audioUrl}><Play size={13} /></button>
          <div className="wiz-audio-file"><b>{t.sourceName}</b><span>{isLinked ? "Холбогдсон · солих боломжгүй" : "Track source"}</span></div>
          <div className="wiz-audio-duration">{t.duration || "—"}</div>
          <WaveBars seed={idx + 1} />
          {!isLinked && (
            <div className="wiz-audio-actions">
              <button className="wiz-btn" style={{ fontSize: 11, gap: 5 }} onClick={() => uploadRefs.current[t.assetId]?.click()}><RefreshCw size={12} />Дахин хуулах</button>
              <button className="wiz-btn icon-btn" onClick={() => updateTrack(idx, { sourceName: "", fileFormat: "", sampleRate: "", bitDepth: "", duration: "", audioUrl: "" })}><Trash2 size={13} /></button>
            </div>
          )}
          {isLinked && (
            <span className="wiz-status-pill" style={{ background: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
              <Lock size={10} />Холбогдсон
            </span>
          )}
          {!isLinked && <input ref={el => { uploadRefs.current[t.assetId] = el; }} type="file" accept="audio/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) simulateUpload(idx, f); e.target.value = ""; }} />}
        </div>
        <div className="wiz-audio-meta">
          <span className="source-name">{t.sourceName}</span>
          {t.fileFormat && <span>{t.fileFormat}</span>}
          {t.sampleRate && <span>{t.sampleRate}</span>}
          {t.bitDepth && <span>{t.bitDepth}</span>}
        </div>
      </div>
    );
  }

  function TrackContributors({ t, idx }: { t: Track; idx: number }) {
    const c = t.credits;
    return (
      <div className="wiz-contrib-split">
        <div className="wiz-contrib-subsection">
          <div className="wiz-contrib-sub-head">
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Star size={13} style={{ color: "var(--w-accent)", flexShrink: 0 }} /><h4 style={{ margin: 0 }}>Үндсэн оролцогчид</h4></div>
          </div>
          <div className="wiz-credit-role-list">
            {/* Composer */}
            <div className="wiz-credit-role-row">
              <div className="wiz-credit-role-label"><b>Ая зохиогч</b><span>Хууль ёсны бүтэн овог, нэр</span></div>
              <div className="wiz-credit-people">
                {c.composer.length
                  ? c.composer.map(p => (
                    <div key={p.id} className="wiz-credit-person">
                      <span className="wiz-avatar sm">{initials(p.name)}</span>
                      <div className="wiz-credit-person-info"><b>{p.name}</b>{p.affiliation && <span>{p.affiliation}</span>}</div>
                      <button className="wiz-btn icon-btn" onClick={() => updateTrack(idx, { credits: { ...c, composer: c.composer.filter(x => x.id !== p.id) } })}><X size={11} /></button>
                    </div>
                  ))
                  : <span className="wiz-credit-empty">Нэмээгүй</span>}
              </div>
              <button className="wiz-btn" style={{ fontSize: 11 }} onClick={() => openContribModal(idx, "composer")}><Plus size={12} />Нэмэх</button>
            </div>
            {/* Lyricist */}
            {t.hasLyrics === true ? (
              <div className="wiz-credit-role-row">
                <div className="wiz-credit-role-label"><b>Үг зохиогч</b><span>Хууль ёсны бүтэн овог, нэр</span></div>
                <div className="wiz-credit-people">
                  {c.lyricist.length
                    ? c.lyricist.map(p => (
                      <div key={p.id} className="wiz-credit-person">
                        <span className="wiz-avatar sm">{initials(p.name)}</span>
                        <div className="wiz-credit-person-info"><b>{p.name}</b>{p.affiliation && <span>{p.affiliation}</span>}</div>
                        <button className="wiz-btn icon-btn" onClick={() => updateTrack(idx, { credits: { ...c, lyricist: c.lyricist.filter(x => x.id !== p.id) } })}><X size={11} /></button>
                      </div>
                    ))
                    : <span className="wiz-credit-empty">Нэмээгүй</span>}
                </div>
                <button className="wiz-btn" style={{ fontSize: 11 }} onClick={() => openContribModal(idx, "lyricist")}><Plus size={12} />Нэмэх</button>
              </div>
            ) : (
              <div className="wiz-lyricist-unavailable"><Lock size={13} /><span><b>Үг зохиогч</b><br />"Үггүй" дуу дээр үг зохиогч нэмэх боломжгүй.</span></div>
            )}
          </div>
        </div>
        <div className="wiz-contrib-subsection">
          <div className="wiz-contrib-sub-head">
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Users size={13} style={{ color: "var(--w-muted)", flexShrink: 0 }} /><h4 style={{ margin: 0 }}>Бусад оролцогч</h4></div>
            <button className="wiz-btn" style={{ fontSize: 11, minHeight: 36 }} onClick={() => openContribModal(idx, "other")}><Plus size={12} />Нэмэх</button>
          </div>
          {c.other.length > 0 ? (
            <div className="wiz-other-credits">
              {c.other.map((x, ci) => (
                <div key={`${x.id}-${ci}`} className="wiz-other-credit-row">
                  <span className="wiz-other-credit-role">{OTHER_ROLES[x.role] || x.role}</span>
                  <span className="wiz-other-credit-person"><span className="wiz-avatar sm">{initials(x.name)}</span><b>{x.name}</b></span>
                  <button className="wiz-btn icon-btn" style={{ marginLeft: "auto" }} onClick={() => updateTrack(idx, { credits: { ...c, other: c.other.filter((_, i) => i !== ci) } })}><X size={12} /></button>
                </div>
              ))}
            </div>
          ) : <p className="wiz-credit-empty" style={{ padding: "10px 0" }}>Producer, Mixing Engineer гэх мэт нэмэх</p>}
        </div>
      </div>
    );
  }

  function TrackBody({ t, idx }: { t: Track; idx: number }) {
    return (
      <div className="wiz-track-body">
        {t.usages?.length > 0 && (
          <div className="wiz-track-panel">
            <div className="wiz-usage-notice">
              <div className="wiz-usage-notice-top">
                <TriangleAlert size={16} />
                <div><b>Энэ дуу өмнө нь {t.usages.length} цомогт орсон</b><p>Энд зассан мэдээлэл бусад цомогт мөн шинэчлэгдэнэ.</p></div>
              </div>
              <div className="wiz-usage-list">
                {t.usages.map((u, i) => (
                  <div key={i} className="wiz-usage-item">
                    <div><div className="wiz-usage-album">{u.album}</div><div className="wiz-usage-meta">Гарсан огноо · {u.date}</div></div>
                    <div className="wiz-usage-upc"><b>UPC</b><br />{u.upc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Audio */}
        <div className="wiz-track-panel">
          <div className="wiz-track-panel-head">
            <div className="wiz-track-panel-title"><AudioWaveform size={16} /><b>Аудио файл</b></div>
            <span>Source файл ба техникийн мэдээлэл</span>
          </div>
          {AudioSourceCard({ t, idx })}
        </div>

        {/* Album only: title + artist + genre */}
        {!isSingle && (
          <div className="wiz-track-panel">
            <div className="wiz-track-panel-head">
              <div className="wiz-track-panel-title"><Music2 size={16} /><b>Дууны үндсэн мэдээлэл</b></div>
              <span>Track тус бүрийн нэр, артист, жанр</span>
            </div>
            <div className="wiz-track-album-meta">
              {TrackTitleEditor({ t, idx })}
              <div className="wiz-track-artist-rows">
                {TrackArtistRole({ idx, kind: "primary" })}
                {TrackArtistRole({ idx, kind: "featured" })}
              </div>
              <div className="wiz-track-meta-row">
                <GenreSelect value={tracks[idx].genre} otherValue={tracks[idx].secondaryGenre} onChange={v => updateTrack(idx, { genre: v })} label="Үндсэн жанр" required small />
                <GenreSelect value={tracks[idx].secondaryGenre} otherValue={tracks[idx].genre} onChange={v => updateTrack(idx, { secondaryGenre: v })} label="Дэд жанр" small />
              </div>
            </div>
          </div>
        )}

        {/* ISRC */}
        <div className="wiz-track-panel">
          <div className="wiz-track-panel-head">
            <div className="wiz-track-panel-title"><Fingerprint size={16} /><b>ISRC</b></div>
            <span>Бичлэгийг ялгах unique identifier</span>
          </div>
          {t.source === "existing" && t.isrc ? (
            <>
              <div className="wiz-reused-isrc">
                <div className="wiz-reused-isrc-main">
                  <span className="wiz-reused-isrc-icon"><Fingerprint size={16} /></span>
                  <span className="wiz-reused-isrc-text"><span>Өмнө оноогдсон ISRC</span><b>{t.isrc}</b></span>
                </div>
                <span className="wiz-reused-isrc-badge">Өмнөх код</span>
              </div>
              <p className="wiz-reused-isrc-note">Өмнө гарсан recording тул ISRC автоматаар дуудагдсан.</p>
            </>
          ) : (
            <div className="wiz-field" style={{ margin: 0 }}>
              <label className="wiz-label">Энэ бичлэг өмнө нь гарч байсан уу? <span className="wiz-req">*</span><InfoTip text="Тус дууны audio recording өмнө нь бусад цомог эсвэл платформд гарч байсан бол 'Тийм' гэж сонгон өмнөх ISRC кодоо оруулна. Тийм бол шинэ ISRC автоматаар үүснэ." /></label>
              <div className="wiz-choice-row">
                <label className={`wiz-radio-card ${t.isrcMode === "generate" ? "active" : ""}`}>
                  <input type="radio" name={`isrc-${idx}`} checked={t.isrcMode === "generate"} onChange={() => updateTrack(idx, { isrcMode: "generate", isrc: "", hasOwnISRC: false })} /><b>Үгүй</b>
                </label>
                <label className={`wiz-radio-card ${t.isrcMode === "existing" ? "active" : ""}`}>
                  <input type="radio" name={`isrc-${idx}`} checked={t.isrcMode === "existing"} onChange={() => updateTrack(idx, { isrcMode: "existing", hasOwnISRC: true })} /><b>Тийм</b>
                </label>
              </div>
              {t.isrcMode === "existing" ? (
                <div className="wiz-conditional">
                  <div className="wiz-field" style={{ margin: 0 }}>
                    <label className="wiz-label" style={{ fontSize: 12 }}>Өмнөх ISRC код <span className="wiz-req">*</span></label>
                    <input className="wiz-input" value={t.isrc} onChange={e => updateTrack(idx, { isrc: e.target.value })} placeholder="ISRC код" />
                  </div>
                </div>
              ) : (
                <div className="wiz-id-auto"><Sparkles size={16} /><div><b>ISRC автоматаар үүснэ</b><span>Илгээхээс өмнө ISRC код онооно.</span></div></div>
              )}
            </div>
          )}
        </div>

        {/* Lyrics */}
        <div className="wiz-track-panel">
          <div className="wiz-track-panel-head">
            <div className="wiz-track-panel-title"><Mic2 size={16} /><b>Дууны үг & контент</b></div>
            <span>Lyrics, language, explicit</span>
          </div>
          <div className="wiz-field">
            <label className="wiz-label">Энэ дуу үгтэй юу? <span className="wiz-req">*</span></label>
            <div className="wiz-choice-row">
              <label className={`wiz-radio-card ${t.hasLyrics === true ? "active" : ""}`}>
                <input type="radio" name={`lyr-${idx}`} checked={t.hasLyrics === true} onChange={() => updateTrack(idx, { hasLyrics: true })} /><b>Үгтэй</b>
              </label>
              <label className={`wiz-radio-card ${t.hasLyrics === false ? "active" : ""}`}>
                <input type="radio" name={`lyr-${idx}`} checked={t.hasLyrics === false} onChange={() => updateTrack(idx, { hasLyrics: false, explicitStatus: "not_explicit", vocalLanguage: "", lyrics: "", credits: { ...t.credits, lyricist: [] } })} /><b>Үггүй</b>
              </label>
            </div>
          </div>
          {t.hasLyrics === true && (
            <>
              <div className="wiz-field">
                <label className="wiz-label">Explicit контент <span className="wiz-req">*</span><InfoTip text="18+ насанд хүрсэн агуулга. Дуунд тохирохгүй үг, агуулга байвал заавал зааж тэмдэглэнэ." /></label>
                <div className="wiz-choice-row">
                  <label className={`wiz-radio-card ${t.explicitStatus === "not_explicit" ? "active" : ""}`}>
                    <input type="radio" name={`exp-${idx}`} checked={t.explicitStatus === "not_explicit"} onChange={() => updateTrack(idx, { explicitStatus: "not_explicit" })} /><b>Not explicit</b>
                  </label>
                  <label className={`wiz-radio-card ${t.explicitStatus === "explicit" ? "active" : ""}`}>
                    <input type="radio" name={`exp-${idx}`} checked={t.explicitStatus === "explicit"} onChange={() => updateTrack(idx, { explicitStatus: "explicit" })} /><b>Explicit</b>
                  </label>
                </div>
              </div>
              <div className="wiz-field">
                <label className="wiz-label">Дуулагдаж буй үндсэн хэл <span className="wiz-req">*</span><InfoTip text="Дуунд ашиглагдаж буй гол хэл. Хайлт болон жанр тохиргоонд нөлөөлнө." /></label>
                <select className="wiz-select" value={t.vocalLanguage} onChange={e => updateTrack(idx, { vocalLanguage: e.target.value })}>
                  <option value="">Хэл сонгох</option>
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                </select>
              </div>
              <div className="wiz-field">
                <label className="wiz-label">Дууны үг</label>
                <textarea className="wiz-textarea" value={t.lyrics} onChange={e => updateTrack(idx, { lyrics: e.target.value })} placeholder="Дууны үгийг мөр мөрөөр нь бүтнээр оруулна..." />
                <div className="wiz-char-count">{(t.lyrics || "").length} тэмдэгт</div>
              </div>
            </>
          )}
        </div>

        {/* Contributors */}
        <div className="wiz-track-panel">
          <div className="wiz-track-panel-head">
            <div className="wiz-track-panel-title"><Users size={16} /><b>Оролцогчид</b></div>
            <span>Songwriting болон production credits</span>
          </div>
          {TrackContributors({ t, idx })}
        </div>
      </div>
    );
  }

  // ══════════════════ stage renders ═════════════════════════════════════════════

  function Stage1() {
    return (
      <>
        <div className="wiz-mode-pill">
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {isSingle ? <Music2 size={13} /> : <Disc3 size={13} />}{isSingle ? "Дуу" : "Цомог"}
          </span>
        </div>
        <h2>Үндсэн мэдээлэл</h2>
        <div className="wiz-section" style={{ paddingTop: 0, borderTop: "none", marginTop: 0 }}>
          {TitleField()}
          <div className="wiz-artist-section">
            <div className="wiz-artist-section-head">
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Users size={15} style={{ color: "var(--w-accent)", flexShrink: 0 }} />
                <div>
                  <h3 style={{ margin: 0 }}>Артистууд</h3>
                  <span style={{ fontSize: 12, color: "var(--w-muted)" }}>Хайж сонгох эсвэл шинэ артист үүсгэх</span>
                </div>
              </div>
            </div>
            {ArtistRoleBox({ kind: "primary" })}
            {isSingle && ArtistRoleBox({ kind: "featured" })}
          </div>
          <div className="wiz-grid2" style={{ marginTop: 14 }}>
            <GenreSelect value={primaryGenre} otherValue={secondaryGenre} onChange={setPrimaryGenre} label="Үндсэн жанр" required />
            <GenreSelect value={secondaryGenre} otherValue={primaryGenre} onChange={setSecondaryGenre} label="Дэд жанр" />
          </div>
          <div className="wiz-field">
            <label className="wiz-label">Label<InfoTip text="Хэвлэл болон хуваарилалтын компани. Байхгүй бол хоосон орхино — артистын нэр ашиглагдана." /></label>
            <div className="wiz-locked">
              <div className="wiz-locked-main"><Building2 size={15} /><b>MOCO Records</b></div>
              <span><Lock size={11} />Account тохиргооноос</span>
            </div>
          </div>
        </div>
        <div className="wiz-section">
          <div className="wiz-field">
            <label className="wiz-label">Энэ {isSingle ? "дуу" : "цомог"} өмнө нь гарч байсан уу? <span className="wiz-req">*</span><InfoTip text="Өмнө нь бусад платформ дээр гарч байсан бол 'Тийм' гэж сонгоно. Анх удаа гаргаж байгаа бол 'Үгүй' гэж сонгоно. Энэ сонголт UPC болон огноо тохиргоонд нөлөөлнө." /></label>
            <div className="wiz-choice-row">
              <label className={`wiz-radio-card ${!previous ? "active" : ""}`}>
                <input type="radio" name="previous" checked={!previous} onChange={() => setPrevious(false)} /><b>Үгүй</b>
              </label>
              <label className={`wiz-radio-card ${previous ? "active" : ""}`}>
                <input type="radio" name="previous" checked={previous} onChange={() => setPrevious(true)} /><b>Тийм</b>
              </label>
            </div>
          </div>
          {previous ? (
            <div className="wiz-conditional">
              <div className="wiz-grid2">
                <div className="wiz-field" style={{ margin: 0 }}>
                  <label className="wiz-label" style={{ fontSize: 12 }}>Анх гарсан огноо <span className="wiz-req">*</span></label>
                  <input type="date" className="wiz-input" value={originalDate} onChange={e => setOriginalDate(e.target.value)} />
                </div>
                <div className="wiz-field" style={{ margin: 0 }}>
                  <label className="wiz-label" style={{ fontSize: 12 }}>Өмнөх UPC код <span className="wiz-req">*</span></label>
                  <input className="wiz-input" value={prevUPC} onChange={e => setPrevUPC(e.target.value)} placeholder="UPC код" />
                </div>
              </div>
            </div>
          ) : (
            <div className="wiz-id-auto"><Sparkles size={16} /><div><b>UPC автоматаар үүснэ</b><span>Илгээхээс өмнө UPC код онооно.</span></div></div>
          )}
        </div>

        {/* Copyright & phonogram rights */}
        <div className="wiz-section">
          <div className="wiz-grid2">
            <div className="wiz-field">
              <label className="wiz-label">
                Зохиогчийн эрх <span style={{ fontWeight: 400, color: "var(--muted-foreground)" }}>©</span>
                <InfoTip text="© Зохиогчийн эрх — дуу, үг, хөгжмийн зохиогч эсвэл хэвлэгчийн нэр. Ихэвчлэн дуучин эсвэл лейбл байна." />
              </label>
              <div className="wiz-rights-row">
                <input className="wiz-input" value={cOwner} onChange={e => setCOwner(e.target.value)} placeholder="Эрх эзэмшигчийн нэр" />
                <select className="wiz-select wiz-rights-year" value={cYear} onChange={e => setCYear(e.target.value)}>
                  {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => {
                    const y = new Date().getFullYear() - i;
                    return <option key={y} value={String(y)}>{y}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="wiz-field">
              <label className="wiz-label">
                Бичлэгийн эрх <span style={{ fontWeight: 400, color: "var(--muted-foreground)" }}>℗</span>
                <InfoTip text="℗ Бичлэгийн эрх (master rights) — дуу бичлэгийг санхүүжүүлж, дуусгасан этгээд. Ихэвчлэн лейбл эсвэл артист өөрөө байна." />
              </label>
              <div className="wiz-rights-row">
                <input className="wiz-input" value={pOwner} onChange={e => setPOwner(e.target.value)} placeholder="Эрх эзэмшигчийн нэр" />
                <select className="wiz-select wiz-rights-year" value={pYear} onChange={e => setPYear(e.target.value)}>
                  {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => {
                    const y = new Date().getFullYear() - i;
                    return <option key={y} value={String(y)}>{y}</option>;
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  function Stage2() {
    const libFiltered = SONG_LIBRARY.filter(s =>
      ELIGIBLE_SONG_STATUSES.has(s.releaseStatus ?? "live") && (
        s.title.toLowerCase().includes(addSongSearch.toLowerCase()) ||
        s.primaryArtists.some(a => a.name.toLowerCase().includes(addSongSearch.toLowerCase()))
      )
    );
    const addedIds = new Set(tracks.map(t => t.assetId));

    return (
      <>
        <div className="wiz-mode-pill">
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Activity size={13} />{portalType()} · {tracks.length} дуу · {totalDuration()}
          </span>
        </div>
        <div className="wiz-add-song-bar">
          <div>
            <h2 style={{ margin: "0 0 4px" }}>Дууны мэдээлэл</h2>
            <div className="wiz-hint">{isSingle ? "Аудио, ISRC, дууны үг болон оролцогчдын мэдээллийг бөглөнө." : "Track бүрийн мэдээллийг нээгээд бөглөнө."}</div>
          </div>
        </div>

        <div className="wiz-tracks">
          {tracks.map((t, i) => {
            const opened = isSingle || openTrack === i;
            const displayTitle = isSingle ? (titlesMn || titlesEn || "Дуу нэмэх") : (t.titles?.mn || t.title || "Нэргүй дуу");
            const primaryNames = isSingle ? primary.map(a => a.name).join(", ") : t.primaryArtists?.map(a => a.name).join(", ") || "";
            const featNames = isSingle ? featured.map(a => a.name).join(", ") : t.featuredArtists?.map(a => a.name).join(", ") || "";
            const artistText = [primaryNames || "Артист сонгоогүй", featNames ? `(feat. ${featNames})` : ""].filter(Boolean).join(" ");
            return (
              <div key={t.assetId} className={`wiz-track ${dragOver === i ? "drag-over" : ""} ${opened ? "open" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragOver(i); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => handleDrop(i)}>
                <div className={`wiz-track-head ${isSingle ? "single" : ""}`}
                  onClick={isSingle ? undefined : () => setOpenTrack(opened ? -1 : i)}
                  style={isSingle ? { cursor: "default" } : undefined}>
                  {!isSingle && (
                    <div className="wiz-drag-handle" draggable onClick={e => e.stopPropagation()}
                      onDragStart={() => { setDragFrom(i); dragFromRef.current = i; }}
                      onDragEnd={() => { setDragFrom(null); setDragOver(null); dragFromRef.current = null; }}>
                      <GripVertical size={14} />
                    </div>
                  )}
                  <div className="wiz-track-no">{i + 1}</div>
                  <div className="wiz-track-main">
                    <div className="wiz-track-main-info">
                      <span className="wiz-track-title">{displayTitle}</span>
                      <span className="wiz-track-meta-text">{artistText} · {t.duration || "—"}</span>
                    </div>
                    <div className="wiz-track-summary">
                      {t.isrc
                        ? <span className="wiz-status-pill isrc">{displayISRC(t.isrc)}</span>
                        : <span className="wiz-status-pill">ISRC үүснэ</span>}
                      {t.explicitStatus === "explicit" && <span className="wiz-status-pill" style={{ background: "#fff5f6", color: "#cf4b5e", borderColor: "#f5c2c7" }}>E</span>}
                      {(t.sourceName || t.source === "existing") && <span className="wiz-status-pill ok">{t.source === "existing" ? "Audio холбогдсон" : "Audio ✓"}</span>}
                      {!isSingle && tracks.length > 1 && (
                        <button type="button" className="wiz-btn icon-btn"
                          onClick={e => { e.stopPropagation(); setTracks(ts => ts.filter((_, idx2) => idx2 !== i)); if (openTrack === i) setOpenTrack(-1); else if (openTrack > i) setOpenTrack(openTrack - 1); }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  {!isSingle && (opened ? <ChevronUp size={16} style={{ color: "#999", flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: "#999", flexShrink: 0 }} />)}
                </div>
                {opened && TrackBody({ t, idx: i })}
              </div>
            );
          })}
        </div>

        {/* Add track row — below tracks, album mode only */}
        {!isSingle && (
          <button
            type="button"
            className="wiz-track-add-row"
            onClick={() => { setShowAddSong(true); setAddSongSel(new Set()); setPendingUploads([]); setAddSongSearch(""); }}
          >
            <Plus size={14} />Дуу нэмэх
          </button>
        )}
      </>
    );
  }

  function Stage3() {
    const meta = cover.name ? `${cover.width && cover.height ? `${cover.width} × ${cover.height} px` : ""} ${cover.size ? `· ${(cover.size / 1024 / 1024).toFixed(1)} MB` : ""}`.trim() : "";
    return (
      <>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
          <div><h2 style={{ margin: 0 }}>Ковер зураг</h2><p className="wiz-hint" style={{ marginTop: 5 }}>Түгээлтийн үйлчилгээнүүд дээр харагдах үндсэн ковер зургаа оруулна.</p></div>
        </div>
        {coverError && <div className="wiz-cover-validation-error"><CircleX size={15} /><span>{coverError}</span></div>}
        <div className="wiz-cover-layout">
          <div>
            <div className={`wiz-cover-drop ${coverDrag ? "drag" : ""}`}
              onClick={() => coverFileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setCoverDrag(true); }}
              onDragLeave={() => setCoverDrag(false)}
              onDrop={e => { e.preventDefault(); setCoverDrag(false); const f = e.dataTransfer?.files?.[0]; if (f) handleCoverFile(f); }}>
              {cover.dataUrl ? (
                <>
                  <img src={cover.dataUrl} alt="Ковер preview" />
                  <div className="wiz-cover-overlay">
                    <div><b>{cover.name}</b><span>{meta}</span></div>
                    <button className="wiz-btn icon-btn" onClick={e => { e.stopPropagation(); coverFileRef.current?.click(); }}><RefreshCw size={13} /></button>
                  </div>
                </>
              ) : (
                <div className="wiz-cover-content">
                  <Image size={34} />
                  <b>Ковер зургаа оруулах</b>
                  <span>Зургаа энд чирэх эсвэл компьютерээс сонгох</span>
                  <span style={{ fontSize: 10 }}>PNG, JPG · Max 20MB</span>
                  <button className="wiz-btn primary" style={{ marginTop: 10 }} onClick={e => { e.stopPropagation(); coverFileRef.current?.click(); }}>Зураг сонгох</button>
                </div>
              )}
            </div>
            <input ref={coverFileRef} type="file" accept="image/jpeg,image/png" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) handleCoverFile(f); e.target.value = ""; }} />
            {cover.name && (
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                <button className="wiz-btn" onClick={() => coverFileRef.current?.click()}><RefreshCw size={13} />Дахин сонгох</button>
                <button className="wiz-btn" onClick={() => { setCover({ name: "", dataUrl: "", width: 0, height: 0, size: 0 }); setCoverError(""); }}><Trash2 size={13} />Устгах</button>
              </div>
            )}
          </div>
          <div className="wiz-cover-req-box">
            <h3>Ковер зургийн шаардлага</h3>
            <p>Зургаа оруулахаас өмнө дараах шаардлагыг шалгана уу.</p>
            <div className="wiz-cover-req-group">
              <h4>Зураг дээр агуулагдаж болохгүй</h4>
              <div className="wiz-cover-rule-list">
                {["Артистын нэрээс бусад текст, URL, QR code", "Social media logo, username, handle", "Брэнд, сурталчилгааны лавлагаа", "Порнографик зураг, контент", "Лицензгүй зураг, хуулбар контент"].map(r => (
                  <div key={r} className="wiz-cover-rule"><X size={13} /><span>{r}</span></div>
                ))}
              </div>
            </div>
            <div className="wiz-cover-req-group">
              <h4>Файлын техникийн шаардлага</h4>
              <div className="wiz-cover-rule-list">
                {["1:1 харьцаатай төгс квадрат зураг", "Хамгийн багадаа 1500 × 1500 px, ихдээ 6000 × 6000 px", "JPG эсвэл PNG формат", "Файлын хэмжээ 20MB-аас ихгүй"].map(r => (
                  <div key={r} className="wiz-cover-rule"><Check size={13} /><span>{r}</span></div>
                ))}
              </div>
              <div className="wiz-cover-spec-badges">
                {["1:1", "1500–6000 px", "JPG / PNG", "≤ 20MB"].map(b => <span key={b} className="wiz-cover-spec-badge">{b}</span>)}
              </div>
            </div>
            {cover.name && (
              <div className="wiz-id-auto" style={{ marginTop: 12 }}><CircleCheckBig size={16} /><div><b>Техникийн шаардлага хангасан</b><span>{meta || cover.name}</span></div></div>
            )}
          </div>
        </div>
      </>
    );
  }

  function Stage4() {
    const publishLabel = scheduleMode === "asap" ? "Аль болох хурдан · 2–3 ажлын өдөр" : (releaseDate ? `Нийтлэх огноо · ${releaseDate}` : "Нийтлэх огноо сонгоогүй");

    function ServiceGroup({ title, desc, svcList, isPromo }: { title: string; desc: string; svcList: string[]; isPromo?: boolean }) {
      const allOn = svcList.every(n => services.has(n));
      function toggleGroup() {
        setServices(prev => { const next = new Set(prev); svcList.forEach(n => allOn ? next.delete(n) : next.add(n)); return next; });
      }
      return (
        <div className="wiz-service-group">
          <div className="wiz-service-group-head">
            <div><h4>{title}</h4><p>{desc}</p></div>
            <button className={`wiz-group-toggle ${allOn ? "active" : ""}`} onClick={toggleGroup}>
              <span className="wiz-group-toggle-check"><Check size={11} /></span>
              {allOn ? "Сонгосон" : "Сонгох"}
            </button>
          </div>
          <div className="wiz-bundle-services">
            {svcList.map(name => (
              <div key={name} className="wiz-bundle-service">
                {SERVICE_LOGOS[name]
                  ? <img src={SERVICE_LOGOS[name]} alt={name} className="wiz-service-logo" style={{ objectFit: "contain" }} />
                  : <span className="wiz-service-logo">{serviceIconLabel(name)}</span>
                }
                <b>{name}</b>
              </div>
            ))}
          </div>
          {isPromo && (
            <div className="wiz-promo-radio-note"><Info size={13} /><span>Энэ радио цацалт сурталчилгааны зорилготой. Royalty-г эрх эзэмшигч өөрийн CMO-оор цуглуулна.</span></div>
          )}
        </div>
      );
    }

    return (
      <div className="wiz-publish-shell">
        <div className="wiz-publish-topbar">
          <div><h2>Нийтлэх & Түгээх</h2><p>Нийтлэх хугацаа болон хүргэх үйлчилгээнүүдээ нэг дор тохируулна.</p></div>
          <div className="wiz-publish-summary">
            <span className="wiz-publish-summary-pill"><CalendarClock size={13} />{publishLabel}</span>
            <span className="wiz-publish-summary-pill"><RadioTower size={13} />{services.size} суваг сонгосон</span>
          </div>
        </div>

        <section className="wiz-publish-block">
          <div className="wiz-publish-block-head"><div><h3>Нийтлэх хугацаа</h3><p>Бэлэн болмогц нийтлэх эсвэл тодорхой өдөр төлөвлөнө.</p></div></div>
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
          <div className="wiz-publish-block-head"><div><h3>Түгээх үйлчилгээнүүд</h3><p>Бүх сонголт анхнаасаа идэвхтэй. Хүсвэл аль нэг бүлгийг хасаж болно.</p></div></div>
          <div className="wiz-publish-block-body">
            <div className="wiz-service-section">
              <ServiceGroup title="Дотоодын хөгжмийн үйлчилгээ" desc="Монголын хөгжмийн платформууд" svcList={SERVICES_DOMESTIC} />
              <ServiceGroup title="PRBT" desc="Сонгосноор доорх бүх PRBT үйлчилгээнд хүргэнэ." svcList={SERVICES_PRBT} />
              <ServiceGroup title="Олон улсын хөгжмийн үйлчилгээнүүд" desc="Сонгосноор бүх олон улсын платформд хүргэнэ." svcList={SERVICES_INTERNATIONAL} />
              <ServiceGroup title="Сурталчилгааны радио цацалт" desc="Promotional airplay хэлбэрээр радио сувгаар цацуулах." svcList={SERVICES_PROMO} isPromo />
            </div>
          </div>
        </section>
      </div>
    );
  }

  function Stage5() {
    const publishLabel = scheduleMode === "asap" ? "Аль болох хурдан (2–3 ажлын өдөр)" : (releaseDate || "—");
    const svcArr = [...services];
    return (
      <div className="wiz-review-shell">
        <div className="wiz-review-hero">
          <div><h2>Шалгах & Илгээх</h2><p>Илгээхийн өмнө бүх мэдээллээ нэг удаа шалгана уу.</p></div>
          <span className="wiz-review-hero-status"><ClipboardCheck size={13} />Илгээхэд бэлэн эсэхийг шалгах</span>
        </div>
        <div className="wiz-review-grid">
          <div className="wiz-review-col">
            <section className="wiz-review-panel">
              <div className="wiz-review-panel-head">
                <div className="wiz-review-panel-head-title"><Info size={14} /><b>Үндсэн мэдээлэл</b></div>
                <button className="wiz-btn ghost" onClick={() => goStage(1)}>Засах</button>
              </div>
              <div className="wiz-review-panel-body">
                <div className="wiz-review-data-grid">
                  <div className="wiz-review-data-item"><span>Төрөл</span><b>{portalType()}</b></div>
                  <div className="wiz-review-data-item"><span>{langName(titleLang)} нэр</span><b>{titlesMn || "—"}</b></div>
                  {titleLang !== "en" && <div className="wiz-review-data-item"><span>English / Latin</span><b>{titlesEn || "—"}</b></div>}
                  {Object.entries(titleExtras).map(([code, val]) => (
                    <div key={code} className="wiz-review-data-item"><span>{langName(code)} нэр</span><b>{val || "—"}</b></div>
                  ))}
                  <div className="wiz-review-data-item"><span>Үндсэн артист</span><b>{primary.map(a => a.name).join(", ") || "—"}</b></div>
                  {isSingle && featured.length > 0 && <div className="wiz-review-data-item"><span>Хамтарсан артист</span><b>{featured.map(a => a.name).join(", ")}</b></div>}
                  <div className="wiz-review-data-item"><span>Жанр</span><b>{primaryGenre || "—"}</b></div>
                  {secondaryGenre && <div className="wiz-review-data-item"><span>Дэд жанр</span><b>{secondaryGenre}</b></div>}
                  <div className="wiz-review-data-item"><span>Label</span><b>MOCO Records</b></div>
                  {previous && <div className="wiz-review-data-item"><span>Өмнөх UPC</span><b>{prevUPC || "—"}</b></div>}
                  {!previous && <div className="wiz-review-data-item"><span>UPC</span><b>Автоматаар үүснэ</b></div>}
                  {cOwner && <div className="wiz-review-data-item"><span>© Эрх</span><b>{cOwner} {cYear}</b></div>}
                  {pOwner && <div className="wiz-review-data-item"><span>℗ Эрх</span><b>{pOwner} {pYear}</b></div>}
                </div>
              </div>
            </section>
            <section className="wiz-review-panel">
              <div className="wiz-review-panel-head">
                <div className="wiz-review-panel-head-title"><ListMusic size={14} /><b>Дууны мэдээлэл</b></div>
                <button className="wiz-btn ghost" onClick={() => goStage(2)}>Засах</button>
              </div>
              <div className="wiz-review-panel-body">
                <div className="wiz-review-tracks">
                  {tracks.map((t, i) => {
                    const trackTitle = isSingle ? (titlesMn || t.title) : (t.titles?.mn || t.title);
                    const artistsText = isSingle ? (primary.map(a => a.name).join(", ") || "—") : (t.primaryArtists?.map(a => a.name).join(", ") || "—");
                    return (
                      <div key={t.assetId} className="wiz-review-track-row">
                        <span className="wiz-review-track-no">{i + 1}</span>
                        <span className="wiz-review-track-info"><b>{trackTitle || "—"}</b><span>{artistsText}</span></span>
                        <span className="wiz-review-track-meta"><b>{t.duration || "—"}</b><span style={{ fontSize: 11 }}>{t.isrc ? displayISRC(t.isrc) : "ISRC үүснэ"}</span></span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
            <section className="wiz-review-panel">
              <div className="wiz-review-panel-head">
                <div className="wiz-review-panel-head-title"><RadioTower size={14} /><b>Нийтлэх & Түгээх</b></div>
                <button className="wiz-btn ghost" onClick={() => goStage(4)}>Засах</button>
              </div>
              <div className="wiz-review-panel-body">
                <div className="wiz-review-data-grid" style={{ marginBottom: 10 }}>
                  <div className="wiz-review-data-item"><span>Нийтлэх хугацаа</span><b>{publishLabel}</b></div>
                  <div className="wiz-review-data-item"><span>Үйлчилгээний тоо</span><b>{svcArr.length}</b></div>
                </div>
                <div className="wiz-review-service-wrap">
                  {svcArr.map(s => (
                    <span key={s} className="wiz-review-service-chip">
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 6, background: "#f0eeff", fontSize: 8, fontWeight: 900, color: "#625e78" }}>{serviceIconLabel(s)}</span>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>
          <div className="wiz-review-col">
            <section className="wiz-review-panel">
              <div className="wiz-review-panel-head">
                <div className="wiz-review-panel-head-title"><Image size={14} /><b>Ковер зураг</b></div>
                <button className="wiz-btn ghost" onClick={() => goStage(3)}>Засах</button>
              </div>
              <div className="wiz-review-panel-body">
                <div style={{ display: "grid", gap: 10 }}>
                  <div className="wiz-review-cover-preview">
                    {cover.dataUrl ? <img src={cover.dataUrl} alt="Cover" /> : (
                      <div className="wiz-review-cover-empty"><ImageOff size={26} /><div>Ковер зураг оруулаагүй</div></div>
                    )}
                  </div>
                  <div className="wiz-review-data-grid">
                    <div className="wiz-review-data-item"><span>Файл</span><b>{cover.name || "—"}</b></div>
                    <div className="wiz-review-data-item"><span>Хэмжээс</span><b>{cover.width ? `${cover.width} × ${cover.height} px` : "—"}</b></div>
                  </div>
                </div>
              </div>
            </section>
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

  // ══════════════════ guide panel ═══════════════════════════════════════════════

  function GuidePanel() {
    // ── per-step completion logic ──────────────────────────────────────────────
    const isrcComplete = (t: Track) =>
      t.source === "existing" && t.isrc
        ? true
        : t.isrcMode === "generate" || (t.isrcMode === "existing" && !!t.isrc.trim());

    // Stage 1
    const s1_mn    = !!titlesMn.trim();
    const s1_en    = !!titlesEn.trim();
    const s1_art   = primary.length > 0;
    const s1_genre = !!primaryGenre;
    const s1_ok    = s1_mn && s1_en && s1_art && s1_genre;

    // Stage 2
    const n = tracks.length;
    const nAudio    = tracks.filter(t => t.source === "existing" || !!t.sourceName).length;
    const nIsrc     = tracks.filter(isrcComplete).length;
    const nLyrics   = tracks.filter(t => t.hasLyrics !== null).length;
    const nComposer = tracks.filter(t => t.credits.composer.length > 0).length;
    const nTitles   = isSingle ? n : tracks.filter(t => !!(t.titles?.mn?.trim())).length;
    const nArtists  = isSingle ? n : tracks.filter(t => t.primaryArtists.length > 0).length;
    const nGenres   = isSingle ? n : tracks.filter(t => !!t.genre).length;
    const s2_ok = nAudio === n && nIsrc === n && nLyrics === n && nComposer === n
      && nTitles === n && nArtists === n && nGenres === n;

    // Stage 3
    const s3_uploaded = !!cover.name;
    const s3_valid    = s3_uploaded && !coverError && cover.width >= 1500 && cover.width === cover.height;
    const s3_ok       = s3_valid;

    // Stage 4
    const s4_sched    = scheduleMode === "asap" || !!releaseDate;
    const s4_services = services.size > 0;
    const s4_ok       = s4_sched && s4_services;

    // Stage 5
    const s5_ok = reviewConfirmed;

    type CheckItem = { label: string; ok: boolean };
    const stageData: Array<{ num: number; title: string; ok: boolean; items: CheckItem[] }> = [
      {
        num: 1, title: "Үндсэн мэдээлэл", ok: s1_ok,
        items: [
          { label: isSingle ? "Дууны монгол нэр" : "Цомгийн монгол нэр", ok: s1_mn },
          { label: "English / Latin нэр", ok: s1_en },
          { label: "Үндсэн артист", ok: s1_art },
          { label: "Үндсэн жанр", ok: s1_genre },
        ],
      },
      {
        num: 2, title: "Дууны мэдээлэл", ok: s2_ok,
        items: [
          ...(!isSingle ? [
            { label: `Нэр (${nTitles}/${n})`, ok: nTitles === n },
            { label: `Артист (${nArtists}/${n})`, ok: nArtists === n },
            { label: `Жанр (${nGenres}/${n})`, ok: nGenres === n },
          ] : []),
          { label: `Аудио файл (${nAudio}/${n})`, ok: nAudio === n },
          { label: `ISRC (${nIsrc}/${n})`, ok: nIsrc === n },
          { label: `Үгтэй/үггүй (${nLyrics}/${n})`, ok: nLyrics === n },
          { label: `Ая зохиогч (${nComposer}/${n})`, ok: nComposer === n },
        ],
      },
      {
        num: 3, title: "Ковер зураг", ok: s3_ok,
        items: [
          { label: "Зураг оруулсан", ok: s3_uploaded },
          { label: s3_uploaded ? (cover.width >= 1500 && cover.width === cover.height ? `${cover.width}×${cover.height}px ✓` : "Хэмжээс буруу") : "Шаардлага хангасан эсэх", ok: s3_valid },
        ],
      },
      {
        num: 4, title: "Нийтлэх & Түгээх", ok: s4_ok,
        items: [
          { label: s4_sched ? (scheduleMode === "asap" ? "Аль болох хурдан" : `Огноо: ${releaseDate}`) : "Хугацаа тохируулаагүй", ok: s4_sched },
          { label: `${services.size} суваг сонгосон`, ok: s4_services },
        ],
      },
      {
        num: 5, title: "Шалгах & Илгээх", ok: s5_ok,
        items: [
          { label: "Мэдээллийг баталгаажуулсан", ok: s5_ok },
        ],
      },
    ];

    const completedCount = stageData.filter(s => s.ok).length;

    return (
      <div className="wiz-guide-panel" style={{ marginTop: 0 }}>
        <div className="wiz-guide-card">
          {/* Header */}
          <div className="wiz-guide-header">
            <div className="wiz-guide-header-title">
              <ClipboardCheck size={13} />Явц
            </div>
            <span className="wiz-guide-progress-badge">{completedCount}/{stageData.length}</span>
          </div>

          {/* Progress bar */}
          <div className="wiz-guide-bar-wrap">
            <div className="wiz-guide-bar">
              <i style={{ width: `${(completedCount / stageData.length) * 100}%` }} />
            </div>
          </div>

          {/* Steps list */}
          <div className="wiz-guide-steps-list">
            {stageData.map(({ num, title, ok, items }) => {
              const isActive = stage === num;
              const isPast   = stage > num;
              const isIssue  = isPast && !ok;

              const dotType = ok && isPast ? "ok" : isActive ? "active" : isIssue ? "fail" : "pending";
              const showItems = isActive || isIssue;

              const rowCls = [
                "wiz-guide-step-row",
                isActive ? "active" : "",
                ok && isPast ? "done" : "",
                isIssue ? "issues" : "",
              ].filter(Boolean).join(" ");

              const incompleteCount = items.filter(i => !i.ok).length;

              return (
                <div key={num} className={rowCls} onClick={() => goStage(num as Stage)}>
                  <div className={`wiz-guide-step-dot ${dotType}`}>
                    {ok && isPast ? <Check size={11} /> : isIssue ? "!" : num}
                  </div>
                  <div className="wiz-guide-step-right">
                    <div className="wiz-guide-step-label">{title}</div>
                    {!showItems && ok && isPast && (
                      <div className="wiz-guide-step-sublabel">Бүрэн дууссан</div>
                    )}
                    {!isActive && !isPast && !ok && (
                      <div className="wiz-guide-step-sublabel" style={{ color: "#c5c8d8" }}>—</div>
                    )}
                    {showItems && (
                      <div className="wiz-guide-step-checklist">
                        {items.map((item, i) => (
                          <div key={i} className={`wiz-guide-check-item ${item.ok ? "ok" : "fail"}`}>
                            {item.ok
                              ? <Check size={10} />
                              : <div className="wiz-guide-check-dot" />}
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

  // ══════════════════ modals ════════════════════════════════════════════════════

  function ArtistSearchModal() {
    if (!artistModal?.open) return null;
    const { kind, trackIdx } = artistModal;
    const existing = new Set(
      trackIdx !== undefined
        ? (kind === "primary" ? tracks[trackIdx].primaryArtists : tracks[trackIdx].featuredArtists).map(a => a.id)
        : (kind === "primary" ? primary : featured).map(a => a.id)
    );
    const filtered = artists.filter(a => !artistSearch || a.name.toLowerCase().includes(artistSearch.toLowerCase()) || a.id.toLowerCase().includes(artistSearch.toLowerCase()));
    return (
      <div className="wiz-modal-back">
        <div className="wiz-modal wide">
          <div className="wiz-modal-head">
            <div>
              <h3>{kind === "primary" ? "Үндсэн артист" : "Хамтарсан артист"} сонгох</h3>
              <div className="wiz-hint">Нэр эсвэл Artist ID-аар хайгаад артист сонгоно.</div>
            </div>
            <button className="wiz-btn icon-btn" onClick={() => { setArtistModal(null); setShowCreate(false); setCreateName(""); }}><X size={16} /></button>
          </div>
          {!showCreate ? (
            <>
              <div className="wiz-artist-search-input"><Search size={16} /><input className="wiz-input" value={artistSearch} onChange={e => setArtistSearch(e.target.value)} placeholder="Артистын нэр эсвэл Artist ID" autoFocus /></div>
              <div className="wiz-artist-search-list">
                {filtered.map(a => {
                  const ex = existing.has(a.id), picked = artistModalSel.has(a.id);
                  return (
                    <div key={a.id} className={`wiz-artist-search-result ${picked ? "selected" : ""}`} style={ex ? { opacity: .45, cursor: "not-allowed" } : {}}
                      onClick={() => { if (ex) return; setArtistModalSel(prev => { const n = new Set(prev); if (n.has(a.id)) n.delete(a.id); else n.add(a.id); return n; }); }}>
                      <span className="wiz-avatar lg">{initials(a.name)}</span>
                      <span><span className="wiz-artist-result-name">{a.name}</span><span className="wiz-artist-result-id">Artist ID · {a.id}</span></span>
                      {ex ? <Check size={18} /> : picked ? <CheckCircle2 size={18} /> : <PlusCircle size={18} />}
                    </div>
                  );
                })}
                {!filtered.length && <div className="wiz-hint" style={{ padding: 18 }}>Артист олдсонгүй.</div>}
              </div>
              <div className="wiz-artist-modal-actions">
                <button className="wiz-btn ghost" onClick={() => setShowCreate(true)}><UserRoundPlus size={14} />Шинэ артист үүсгэх</button>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="wiz-btn" onClick={() => setArtistModal(null)}>Болих</button>
                  <button className="wiz-btn primary" disabled={!artistModalSel.size} onClick={confirmArtistSel}>Сонгох{artistModalSel.size > 0 ? ` (${artistModalSel.size})` : ""}</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="wiz-field"><label className="wiz-label">Артистын нэр <span className="wiz-req">*</span></label><input className="wiz-input" value={createName} onChange={e => setCreateName(e.target.value)} placeholder="Артистын нэр" autoFocus /></div>
              <div className="wiz-hint">Artist ID автоматаар үүснэ.</div>
              <div className="wiz-modal-footer">
                <button className="wiz-btn" onClick={() => setShowCreate(false)}>Буцах</button>
                <button className="wiz-btn primary" disabled={!createName.trim()} onClick={() => createArtist(createName.trim())}>Үүсгээд нэмэх</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  function ContribModal() {
    if (!contribModal?.open) return null;
    const { trackIdx, role } = contribModal;
    const isOther = role === "other";
    const label = role === "composer" ? "Ая зохиогч" : role === "lyricist" ? "Үг зохиогч" : "Оролцогч";
    const usedSet = new Set(
      isOther ? tracks[trackIdx].credits.other.filter(x => x.role === otherRole).map(x => x.id)
        : (tracks[trackIdx].credits[role as "composer" | "lyricist"] || []).map(x => x.id)
    );
    return (
      <div className="wiz-modal-back">
        <div className="wiz-modal">
          <div className="wiz-modal-head">
            <div><h3>{label} нэмэх</h3><div className="wiz-hint">Өмнө ашигласан хүнээс сонгох эсвэл шинээр үүсгэнэ.</div></div>
            <button className="wiz-btn icon-btn" onClick={() => setContribModal(null)}><X size={16} /></button>
          </div>
          {isOther && (
            <div className="wiz-field">
              <label className="wiz-label">Role</label>
              <div className="wiz-contrib-role-grid">
                {Object.entries(OTHER_ROLES).map(([key, lbl]) => (
                  <div key={key} className={`wiz-contrib-role-option ${otherRole === key ? "active" : ""}`} onClick={() => setOtherRole(key)}>
                    <b>{lbl}</b><span>{key === "producer" ? "Хууль ёсны нэр заавал биш" : "Production credit"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="wiz-field">
            <label className="wiz-label">Өмнө ашигласан хүмүүс</label>
            <div className="wiz-contrib-library">
              {accountContribs.map(p => {
                const used = usedSet.has(p.id);
                return (
                  <div key={p.id} className="wiz-contrib-library-item" style={used ? { opacity: .45, cursor: "not-allowed" } : {}}
                    onClick={() => isOther ? selectOtherContrib(p.id) : selectCoreContrib(p.id)}>
                    <span className="wiz-avatar md">{initials(p.name)}</span>
                    <span><b>{p.name}</b>{p.affiliation ? <span>{p.affiliation}</span> : <span>Өмнө ашигласан</span>}</span>
                    {used ? <Check size={15} /> : <PlusCircle size={15} />}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="wiz-modal-divider">эсвэл</div>
          <button className="wiz-btn" style={{ width: "100%", justifyContent: "center" }}
            onClick={() => setCreateContribModal({ open: true, trackIdx, role: isOther ? otherRole : role, isOther })}>
            <UserRoundPlus size={14} />Шинэ {label.toLowerCase()} үүсгэх
          </button>
        </div>
      </div>
    );
  }

  function CreateContribModal() {
    if (!createContribModal?.open) return null;
    const { role, isOther } = createContribModal;
    const lbl = !isOther ? (role === "composer" ? "Ая зохиогч" : "Үг зохиогч") : (OTHER_ROLES[role] || "Оролцогч");
    return (
      <div className="wiz-modal-back">
        <div className="wiz-modal">
          <div className="wiz-modal-head">
            <div><h3>{lbl} үүсгэх</h3><div className="wiz-hint">Оролцогчдийн жагсаалтад хадгалагдана.</div></div>
            <button className="wiz-btn icon-btn" onClick={() => setCreateContribModal(null)}><X size={16} /></button>
          </div>
          <div className="wiz-field">
            <label className="wiz-label">{!isOther ? "Хууль ёсны бүтэн овог, нэр" : "Credit дээр харагдах нэр"} <span className="wiz-req">*</span></label>
            <input className="wiz-input" value={newContribName} onChange={e => setNewContribName(e.target.value)} placeholder={!isOther ? "Овог Нэр" : "Нэр"} autoFocus />
          </div>
          {!isOther && (
            <div className="wiz-field">
              <label className="wiz-label">Эрхийн байгууллага</label>
              <input className="wiz-input" value={newContribAffil} onChange={e => setNewContribAffil(e.target.value)} placeholder="Жишээ: ASCAP, BMI" />
            </div>
          )}
          <div className="wiz-modal-footer">
            <button className="wiz-btn" onClick={() => setCreateContribModal(null)}>Болих</button>
            <button className="wiz-btn primary" disabled={!newContribName.trim()} onClick={saveNewContrib}>Үүсгээд нэмэх</button>
          </div>
        </div>
      </div>
    );
  }

  function AddSongModal() {
    if (!showAddSong && !showReleasedPicker) return null;
    const addedIds = new Set(tracks.map(t => t.assetId));
    const libFiltered = SONG_LIBRARY.filter(s =>
      ELIGIBLE_SONG_STATUSES.has(s.releaseStatus ?? "live") && (
        s.title.toLowerCase().includes(addSongSearch.toLowerCase()) ||
        s.primaryArtists.some(a => a.name.toLowerCase().includes(addSongSearch.toLowerCase())) ||
        (s.isrc || "").toLowerCase().includes(addSongSearch.toLowerCase())
      )
    );
    const totalSel = addSongSel.size + pendingUploads.length;

    if (showReleasedPicker) return (
      <div className="wiz-modal-back">
        <div className="wiz-modal track">
          <div className="wiz-add-track-header">
            <div><h3>Өмнө гаргасан дуу ашиглах</h3></div>
            <button className="wiz-btn icon-btn" onClick={() => setShowReleasedPicker(false)}><X size={16} /></button>
          </div>
          <div className="wiz-add-track-body">
            <div style={{ position: "relative", marginBottom: 10 }}><Search size={15} style={{ position: "absolute", left: 11, top: 12, color: "#999" }} /><input className="wiz-input" style={{ paddingLeft: 36 }} value={addSongSearch} onChange={e => setAddSongSearch(e.target.value)} placeholder="Нэр, артист, ISRC-аар хайх" /></div>
            <div className="wiz-song-list">
              {libFiltered.map(s => {
                const alreadyAdded = addedIds.has(s.assetId), selected = addSongSel.has(s.assetId);
                return (
                  <div key={s.assetId} className={`wiz-song-item ${selected ? "selected" : ""}`} style={alreadyAdded ? { opacity: .48, cursor: "default" } : {}}
                    onClick={() => { if (alreadyAdded) return; setAddSongSel(prev => { const n = new Set(prev); if (isSingle) { n.clear(); n.add(s.assetId); } else { if (n.has(s.assetId)) n.delete(s.assetId); else n.add(s.assetId); } return n; }); }}>
                    <input type="checkbox" className="wiz-song-check" readOnly checked={selected} disabled={alreadyAdded} />
                    <span className="wiz-song-icon"><Music2 size={15} /></span>
                    <span className="wiz-song-info"><b>{s.titles?.mn || s.title}</b><span>{s.primaryArtists[0]?.name} · {s.duration} · {s.isrc}</span></span>
                    <span className="wiz-song-right">{alreadyAdded ? "Нэмэгдсэн" : (s.usages?.length ? `${s.usages.length} цомогт` : s.isrc)}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="wiz-add-track-footer">
            <button className="wiz-btn" onClick={() => { setShowReleasedPicker(false); setShowAddSong(true); }}>Буцах</button>
            <button className="wiz-btn primary" disabled={totalSel === 0} onClick={confirmAddSongs}>{totalSel > 0 ? `Сонгох (${totalSel})` : "Сонгох"}</button>
          </div>
        </div>
      </div>
    );

    return (
      <div className="wiz-modal-back">
        <div className="wiz-modal track">
          <div className="wiz-add-track-header">
            <div><h3>{isSingle ? "Дуу нэмэх" : "Дуу нэмэх"}</h3></div>
            <button className="wiz-btn icon-btn" onClick={() => setShowAddSong(false)}><X size={16} /></button>
          </div>
          <div className="wiz-add-track-body">
            <div className="wiz-dropzone" onClick={() => document.getElementById("song-upload-input")?.click()}>
              <div><UploadCloud size={26} /><b>Дууны файл хуулах</b><span>Файлаа энд чирэх эсвэл компьютерээс сонгох</span></div>
            </div>
            <input id="song-upload-input" type="file" accept="audio/*" multiple={!isSingle} style={{ display: "none" }}
              onChange={e => {
                const files = [...(e.target.files || [])];
                const chosen = isSingle ? files.slice(0, 1) : files;
                const newUploads = chosen.map((f, n) => {
                  const t = makeNewTrack(pendingUploads.length + n + 1);
                  t.sourceName = f.name; t.fileFormat = (f.name.split(".").pop() || "audio").toUpperCase();
                  t.titles.mn = f.name.replace(/\.[^.]+$/, ""); t.title = t.titles.mn;
                  return t;
                });
                setPendingUploads(prev => [...prev, ...newUploads]);
                e.target.value = "";
              }} />
            {pendingUploads.length > 0 && (
              <div className="wiz-uploaded-queue">
                {pendingUploads.map((t, i) => (
                  <div key={t.assetId} className="wiz-uploaded-item">
                    <FileAudio size={15} />
                    <span><b>{t.titles.mn || t.title}</b><span>Шинэ файл</span></span>
                    <button className="wiz-btn icon-btn" onClick={() => setPendingUploads(prev => prev.filter((_, j) => j !== i))}><X size={13} /></button>
                  </div>
                ))}
              </div>
            )}
            {!isSingle && (
              <>
                <div className="wiz-or-divider">эсвэл</div>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 9 }}>Өмнө гарсан дуунууд</div>
                <div style={{ position: "relative", marginBottom: 8 }}><Search size={15} style={{ position: "absolute", left: 11, top: 12, color: "#999" }} /><input className="wiz-input" style={{ paddingLeft: 36 }} value={addSongSearch} onChange={e => setAddSongSearch(e.target.value)} placeholder="Нэр, артист, ISRC-аар хайх" /></div>
                <div className="wiz-song-list">
                  {libFiltered.map(s => {
                    const alreadyAdded = addedIds.has(s.assetId), selected = addSongSel.has(s.assetId);
                    return (
                      <div key={s.assetId} className={`wiz-song-item ${selected ? "selected" : ""}`} style={alreadyAdded ? { opacity: .48, cursor: "default" } : {}}
                        onClick={() => { if (alreadyAdded) return; setAddSongSel(prev => { const n = new Set(prev); if (n.has(s.assetId)) n.delete(s.assetId); else n.add(s.assetId); return n; }); }}>
                        <input type="checkbox" className="wiz-song-check" readOnly checked={selected} disabled={alreadyAdded} />
                        <span className="wiz-song-icon"><Music2 size={15} /></span>
                        <span className="wiz-song-info"><b>{s.titles?.mn || s.title}</b><span>{s.primaryArtists[0]?.name} · {s.duration} · {s.isrc}</span></span>
                        <span className="wiz-song-right">{alreadyAdded ? "Нэмэгдсэн" : (s.usages?.length ? `${s.usages.length} цомогт` : s.isrc)}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
{/* "Add Existing Single" is album/EP-only — not shown in single mode */}
          </div>
          <div className="wiz-add-track-footer">
            <button className="wiz-btn" onClick={() => setShowAddSong(false)}>Болих</button>
            <button className="wiz-btn primary" disabled={totalSel === 0} onClick={confirmAddSongs}>{totalSel > 0 ? `Нэмэх (${totalSel})` : "Нэмэх"}</button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════ main render ══════════════════════════════════════════════
  const stageContent = stage === 1 ? Stage1() : stage === 2 ? Stage2() : stage === 3 ? Stage3() : stage === 4 ? Stage4() : Stage5();
  const shellTitle = titlesMn.trim() || (editRelease
    ? (isSingle ? "Дуу засах" : "Цомог засах")
    : mode ? (isSingle ? "Дуу үүсгэх" : "Цомог үүсгэх") : "Контент нэмэх");
  const shellSubtitle = primary.length > 0
    ? primary.map(a => a.name).join(", ") + (isSingle && featured.length > 0 ? ` feat. ${featured.map(a => a.name).join(", ")}` : "")
    : "Дуу, цомгийн мэдээлэл";

  return (
    <Shell title={shellTitle} subtitle={shellSubtitle}>
      {/* Mode selection modal — shown until user picks single/album */}
      {!mode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => navigate(-1)} />
          <div className="relative bg-card rounded-2xl shadow-2xl border border-border w-full max-w-[580px] overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-7 pt-6 pb-5">
              <div>
                <h2 className="text-lg font-extrabold text-foreground m-0">Дуу, Цомог үүсгэх</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Контентын төрлийг сонгоно уу</p>
              </div>
              <button type="button" onClick={() => navigate(-1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors flex-shrink-0">
                <X size={16} />
              </button>
            </div>

            {/* 3-column card grid */}
            <div className="grid grid-cols-3 gap-3 px-7 pb-3">
              <button type="button" onClick={() => chooseMode("single")}
                className="group flex flex-col items-start p-4 rounded-xl border-2 border-border bg-background hover:border-primary/40 hover:bg-muted/30 text-left transition-all">
                <div className="w-11 h-11 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
                  <Headphones size={20} className="text-muted-foreground group-hover:text-primary" />
                </div>
                <p className="font-extrabold text-sm text-foreground leading-tight">Single</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Зөвхөн нэг дуу гаргах</p>
              </button>

              <button type="button" onClick={() => chooseMode("album")}
                className="group flex flex-col items-start p-4 rounded-xl border-2 border-border bg-background hover:border-primary/40 hover:bg-muted/30 text-left transition-all">
                <div className="w-11 h-11 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
                  <Disc3 size={20} className="text-muted-foreground group-hover:text-primary" />
                </div>
                <p className="font-extrabold text-sm text-foreground leading-tight">Album / EP</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Олон дуу багтаасан цомог үүсгэх</p>
              </button>

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
              <button type="button" onClick={() => navigate(-1)}
                className="h-9 px-4 rounded-xl text-sm font-semibold border border-border bg-card text-foreground/70 hover:bg-muted/40 transition-colors">
                Болих
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wizard content — rendered inside Shell */}
      {mode && (
        <div className="wiz-in-shell" onClick={() => { setRelLangOpen(false); setTrackLangOpenIdx(null); }}>
          {isRevisionEdit && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <TriangleAlert size={14} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-700">Засвар шаардлагатай</p>
                {editRelease?.statusReason && (
                  <p className="text-xs text-red-600/80 mt-1 leading-relaxed whitespace-pre-line">{editRelease.statusReason}</p>
                )}
              </div>
            </div>
          )}
          <div className="wiz-layout">
            <div className="wiz-content">
              <div className="wiz-steps"
                style={{ "--wiz-pct": `${((stage - 1) / (STEPS.length - 1)) * 80}%` } as React.CSSProperties}>
                {STEPS.map((s, i) => (
                  <div key={s} className={`wiz-step ${stage === i + 1 ? "active" : stage > i + 1 ? "done" : ""}`} onClick={() => goStage((i + 1) as Stage)}>
                    <span className="wiz-step-num">{stage > i + 1 ? <Check size={11} /> : i + 1}</span>
                    <span className="wiz-step-label-text">{s}</span>
                  </div>
                ))}
              </div>
              <div className="wiz-form">
                {stageContent}
              </div>
              <div className="wiz-footer">
                <button className="wiz-btn" onClick={handleBack}><ArrowLeft size={15} />Өмнөх</button>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {draftSavedAt && (
                    <span style={{ fontSize: 12, color: "#9d9ab5", display: "flex", alignItems: "center", gap: 5 }}>
                      <Check size={11} />Ноорог хадгалагдсан · {draftSavedAt}
                    </span>
                  )}
                  <button className="wiz-btn primary" disabled={stage === 5 && !reviewConfirmed} onClick={handleNext}>
                    {stage === 5 ? <><Send size={14} />{isRevisionEdit ? "Дахин илгээх" : "Илгээх"}</> : <>Үргэлжлүүлэх<ArrowRight size={14} /></>}
                  </button>
                </div>
              </div>
            </div>
            {GuidePanel()}
          </div>
        </div>
      )}

      {ArtistSearchModal()}
      {ContribModal()}
      {CreateContribModal()}
      {AddSongModal()}
    </Shell>
  );
}
