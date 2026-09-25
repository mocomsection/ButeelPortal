import { useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router";
import {
  Music2, ArrowLeft, ExternalLink, Globe, ChevronDown,
  Play, Pause, Pencil, MessageSquare, Send, CheckCircle2,
  AlertCircle, Clock, Disc3, Radio, Signal, Copy, Check,
  CalendarDays, Hash, Mic2,
  LayoutList, UserCheck, Tags, ScrollText, ShieldAlert,
  Globe2, Film, PlayCircle, UsersRound, Headphones, BookOpen,
  AudioWaveform, Building2,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RELEASES } from "@/data/releases";
import { AUDIOBOOKS } from "@/data/audiobooks";
import { MOVIES } from "@/data/movies";
const ALL_RELEASES = [...RELEASES, ...AUDIOBOOKS, ...MOVIES];
import type { ReleaseData } from "@/types";

// ── hero gradient ─────────────────────────────────────────────────────────────
function titleGradient(title: string) {
  let h = 0;
  for (let i = 0; i < title.length; i++) { h = title.charCodeAt(i) + ((h << 5) - h); h |= 0; }
  const hue = Math.abs(h) % 360;
  return `linear-gradient(135deg, hsl(${hue},62%,10%) 0%, hsl(${(hue+28)%360},50%,18%) 100%)`;
}

// ── lang code abbreviation ────────────────────────────────────────────────────
const LANG_CODES: Record<string, string> = {
  "Монгол": "MN", "English / Latin": "EN", "Japanese": "JA",
  "Korean": "KO", "Chinese": "ZH", "Russian": "RU",
};
function langCode(lang: string) {
  return LANG_CODES[lang] ?? lang.slice(0, 2).toUpperCase();
}

// ── waveform bars visual ──────────────────────────────────────────────────────
function WaveBars({ seed = 0, size = "md" }: { seed?: number; size?: "sm" | "md" }) {
  const h = [8,14,20,11,24,17,10,22,28,16,12,25,18,9,21,27,14,19,8,24,13,29,17,11,22,15,26,10,20,14];
  const maxH = size === "sm" ? 14 : 22;
  return (
    <div className="flex items-center gap-[2px]">
      {h.slice(0, size === "sm" ? 20 : 30).map((v, i) => (
        <div key={i} className="bg-primary/40 rounded-sm w-[2px] flex-shrink-0"
          style={{ height: Math.max(3, Math.round(((v + (seed + i) % 7) / 36) * maxH)) + "px" }} />
      ))}
    </div>
  );
}

// ── release title translations ────────────────────────────────────────────────
type TitleTrans = { lang: string; title: string };
const RELEASE_TITLES: Record<string, TitleTrans[]> = {
  "47382910": [{ lang:"Монгол", title:"Говийн Оргил"  }, { lang:"English / Latin", title:"Peak of the Gobi"  }],
  "82719304": [{ lang:"Монгол", title:"Нэгэн Цаг"     }, { lang:"English / Latin", title:"One Moment"        }],
  "63047291": [{ lang:"Монгол", title:"Гал Сэтгэл"    }, { lang:"English / Latin", title:"Burning Heart"     }],
  "19485720": [{ lang:"Монгол", title:"Хайр"          }, { lang:"English / Latin", title:"Love"              }],
  "36204817": [{ lang:"Монгол", title:"Мөнгөн Шөнө"   }, { lang:"English / Latin", title:"Silver Night"      }],
  "85920374": [{ lang:"Монгол", title:"Хот Дуусгавар" }, { lang:"English / Latin", title:"City's End"        }],
};

// ── audiobook extras (mock data not in ReleaseData type) ─────────────────────
type AbExtras = { author: string; narrator: string; language: string; isbn?: string; isAbridged: boolean; ageRating: string };
const AB_EXTRAS: Record<string, AbExtras> = {
  "57312840": { author: "Болд Жаргал", narrator: "Болд Жаргал", language: "Монгол", isAbridged: false, ageRating: "Бүгдэд тохиромжтой" },
  "28473910": { author: "Д. Мөнхбат",  narrator: "Д. Мөнхбат",  language: "Монгол", isbn: "978-99929-3-084-7", isAbridged: false, ageRating: "12+" },
  "42918305": { author: "Б. Дашдорж",  narrator: "Б. Дашдорж",  language: "Монгол", isAbridged: false, ageRating: "Бүгдэд тохиромжтой" },
};
const DEFAULT_AB_EXTRAS: AbExtras = { author: "—", narrator: "—", language: "Монгол", isAbridged: false, ageRating: "Бүгдэд тохиромжтой" };

// ── track extras ──────────────────────────────────────────────────────────────
type TrackExtras = {
  composers: string[]; lyricists: string[]; hasLyrics: boolean;
  otherCredits: { role: string; name: string }[];
  language: string; genre: string; subGenre: string;
  titleTranslations: TitleTrans[];
};
const TRACK_EXTRAS: Record<number, TrackExtras> = {
  1: {
    composers:["Д.Баяр"], lyricists:["Энхтайван"], hasLyrics:true,
    otherCredits:[{role:"Producer",name:"Д.Баяр"},{role:"Mastering Engineer",name:"SoundLab MN"}],
    language:"Монгол", genre:"Traditional", subGenre:"Нутгийн дуу",
    titleTranslations:[{lang:"Монгол",title:"Говийн Оргил"},{lang:"English / Latin",title:"Peak of the Gobi"}],
  },
  2: {
    composers:["Энхтайван","Д.Баяр"], lyricists:["Энхтайван"], hasLyrics:true,
    otherCredits:[{role:"Producer",name:"Д.Баяр"},{role:"Mixing Engineer",name:"DJ Greko"}],
    language:"Монгол", genre:"Traditional", subGenre:"Ардын дуу",
    titleTranslations:[{lang:"Монгол",title:"Цагаан Хад"},{lang:"English / Latin",title:"White Rock"}],
  },
  3: {
    composers:["Энхтайван"], lyricists:[], hasLyrics:false,
    otherCredits:[{role:"Recording Engineer",name:"SoundLab MN"}],
    language:"Монгол", genre:"Traditional", subGenre:"Instrumental",
    titleTranslations:[{lang:"Монгол",title:"Нутгийн Дуу"},{lang:"English / Latin",title:"Homeland Song"}],
  },
  4: {
    composers:["Д.Баяр"], lyricists:["Энхтайван","Дорж"], hasLyrics:true,
    otherCredits:[{role:"Producer",name:"DJ Greko"},{role:"Mixing Engineer",name:"Д.Баяр"}],
    language:"Монгол", genre:"Traditional", subGenre:"Нутгийн дуу",
    titleTranslations:[{lang:"Монгол",title:"Хангайн Салхи"},{lang:"English / Latin",title:"Wind of Khangai"}],
  },
  5: {
    composers:["Энхтайван"], lyricists:["Энхтайван"], hasLyrics:true,
    otherCredits:[{role:"Producer",name:"Д.Баяр"},{role:"Mastering Engineer",name:"SoundLab MN"}],
    language:"Монгол", genre:"Traditional", subGenre:"Нутгийн дуу",
    titleTranslations:[{lang:"Монгол",title:"Мөнхийн Зам"},{lang:"English / Latin",title:"Eternal Road"}],
  },
};

// ── services ──────────────────────────────────────────────────────────────────
type SvcStatus = "live" | "pending" | "processing";
type SvcEntry = { name: string; status: SvcStatus; since: string; category: string };

const ALL_SVC_META: Record<string, { status: SvcStatus; since: string; category: string }> = {
  "Sonsy Music":       { status:"live",       since:"2026-09-02", category:"Дотоодын үйлчилгээ" },
  "M Music":           { status:"live",       since:"2026-09-02", category:"Дотоодын үйлчилгээ" },
  "Egshig":            { status:"live",       since:"2026-09-02", category:"Дотоодын үйлчилгээ" },
  "Spotify":           { status:"live",       since:"2026-09-03", category:"Олон улсын"          },
  "Apple Music":       { status:"live",       since:"2026-09-03", category:"Олон улсын"          },
  "YouTube Music":     { status:"live",       since:"2026-09-04", category:"Олон улсын"          },
  "Deezer":            { status:"live",       since:"2026-09-04", category:"Олон улсын"          },
  "Hitone":            { status:"live",       since:"2026-09-02", category:"PRBT"                },
  "Unimusic":          { status:"live",       since:"2026-09-02", category:"PRBT"                },
  "SkyMelody":         { status:"processing", since:"—",          category:"PRBT"                },
  "GTone":             { status:"processing", since:"—",          category:"PRBT"                },
  "Audible":           { status:"live",       since:"2025-04-05", category:"Аудио ном"           },
  "Apple Books":       { status:"live",       since:"2025-04-05", category:"Аудио ном"           },
  "Google Play Books": { status:"live",       since:"2025-04-07", category:"Аудио ном"           },
  "Netflix":           { status:"processing", since:"—",          category:"Түрээс"              },
  "Vimeo":             { status:"processing", since:"—",          category:"Түрээс"              },
  "Apple TV+":         { status:"pending",    since:"—",          category:"Түрээс"              },
};

const SVC_STATUS_ORDER: Record<SvcStatus, number> = { live:0, processing:1, pending:2 };
const SVC_STATUS_CFG: Record<SvcStatus, { label: string; badgeCls: string }> = {
  live:       { label:"Идэвхтэй",             badgeCls:"text-green-700 bg-green-50 border-green-200"  },
  pending:    { label:"Хүлээгдэж байна",       badgeCls:"text-amber-700 bg-amber-50 border-amber-200"  },
  processing: { label:"Боловсруулагдаж байна", badgeCls:"text-blue-700 bg-blue-50 border-blue-200"     },
};

function buildServices(names: string[]): SvcEntry[] {
  return names
    .map(n => ({ name: n, ...(ALL_SVC_META[n] ?? { status:"pending" as SvcStatus, since:"—", category:"Бусад" }) }))
    .sort((a, b) => SVC_STATUS_ORDER[a.status] - SVC_STATUS_ORDER[b.status]);
}

// ── PRBT data ─────────────────────────────────────────────────────────────────
const SEG_TEMPLATES = [
  [{ name:"Эхлэл" },{ name:"Дахилт" },{ name:"Баттулгын хэсэг" }],
  [{ name:"Эхлэл" },{ name:"Дэнчин" }],
  [{ name:"Эхлэл" },{ name:"Дахилт" },{ name:"Дуусгавар" }],
];
const PRBT_PROVIDERS = ["Hitone","Unimusic","SkyMelody","GTone"];
const PRBT_PREFIXES: Record<string,string> = { Hitone:"HT", Unimusic:"UM", SkyMelody:"SM", GTone:"GT" };

function buildPrbtData(tracks: { title: string }[]) {
  return PRBT_PROVIDERS.map((provider, pi) => ({
    provider,
    tracks: tracks.map((t, ti) => ({
      song: t.title,
      segs: pi < 2
        ? SEG_TEMPLATES[(ti + pi) % SEG_TEMPLATES.length].map((s, si) => ({
            name: s.name,
            code: `${PRBT_PREFIXES[provider]}${String((pi+1)*2000 + ti*10 + si + 1).padStart(4,"0")}`,
          }))
        : [] as { name:string; code:string }[],
    })),
  }));
}

// ── copy code ─────────────────────────────────────────────────────────────────
function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code]);
  return (
    <button type="button" onClick={copy}
      className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl border transition-all ${
        copied ? "bg-green-50 border-green-200 text-green-700" : "bg-muted/50 border-border hover:bg-muted hover:border-primary/30 text-foreground"
      }`}>
      {code}
      {copied ? <Check size={11} /> : <Copy size={11} className="text-muted-foreground" />}
    </button>
  );
}

// ── preview player ────────────────────────────────────────────────────────────
function TrackPreview({ title }: { title: string }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playing) { if (ref.current) clearInterval(ref.current); setPlaying(false); }
    else {
      setPlaying(true);
      ref.current = setInterval(() => setProgress(p => {
        if (p >= 100) { clearInterval(ref.current!); setPlaying(false); return 0; }
        return p + 1;
      }), 120);
    }
  };
  return (
    <button type="button" onClick={toggle} title={`Preview: ${title}`}
      className={`flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-semibold border transition-all flex-shrink-0 ${
        playing ? "bg-primary border-primary text-white" : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
      }`}>
      {playing ? <Pause size={10} /> : <Play size={10} />}
      {playing
        ? <span className="w-10 h-[3px] bg-white/30 rounded-full overflow-hidden inline-block">
            <span className="h-full bg-white rounded-full block" style={{ width:`${progress}%` }} />
          </span>
        : "Preview"}
    </button>
  );
}

// ── KV row ────────────────────────────────────────────────────────────────────
function KV({ label, value, icon }: { label: string; value?: string; icon?: React.ElementType }) {
  if (!value?.trim()) return null;
  const Icon = icon;
  return (
    <div className="flex items-baseline gap-3 py-2 border-b border-border/30 last:border-0">
      <span className="text-xs text-muted-foreground min-w-[160px] flex-shrink-0 flex items-center gap-1.5">
        {Icon && <Icon size={11} className="flex-shrink-0 opacity-60" />}
        {label}
      </span>
      <span className="text-sm text-foreground font-medium">{value}</span>
    </div>
  );
}

// ── section heading ───────────────────────────────────────────────────────────
function SectionHead({ icon: Icon, label, muted = false }: { icon: React.ElementType; label: string; muted?: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${muted ? "bg-muted" : "bg-primary/10"}`}>
        <Icon size={12} className={muted ? "text-muted-foreground" : "text-primary"} />
      </div>
      <p className="text-[11px] font-bold uppercase text-muted-foreground">{label}</p>
    </div>
  );
}

// ── track card ────────────────────────────────────────────────────────────────
type TrackItem = (typeof RELEASES)[0]["tracks"][0];

function TrackCard({ t }: { t: TrackItem }) {
  const [open, setOpen] = useState(false);
  const extras: TrackExtras = TRACK_EXTRAS[t.no] ?? TRACK_EXTRAS[1];
  const isrc = (t.isrc || "").replace(/-/g, "");
  const hasContribs = extras.composers.length > 0 || (extras.hasLyrics && extras.lyricists.length > 0) || extras.otherCredits.length > 0;
  const hasTrans = extras.titleTranslations.length > 0;

  return (
    <div className={`rounded-2xl border transition-all overflow-hidden ${open ? "border-primary/25 shadow-sm" : "border-border hover:border-border/80"}`}>
      {/* Row header */}
      <div className="w-full flex items-center gap-3 px-5 py-3.5 text-left bg-white cursor-pointer select-none"
        onClick={() => setOpen(v => !v)}>
        <span className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground flex-shrink-0">{t.no}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground truncate">{t.title}</span>
            {t.explicit && <span className="text-[10px] bg-zinc-800 text-white px-1.5 py-0.5 rounded font-black flex-shrink-0">E</span>}
          </div>
          <div className="mt-0.5">
            <span className="text-xs text-muted-foreground">{t.primaryArtist}{t.featArtists.length ? ` ft. ${t.featArtists.join(", ")}` : ""}</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0 text-xs text-muted-foreground tabular-nums">
          {isrc && <><span>{isrc}</span><span className="opacity-40">·</span></>}
          <span>{t.duration}</span>
        </div>
        <div onClick={e => e.stopPropagation()}><TrackPreview title={t.title} /></div>
        <ChevronDown size={14} className={`text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </div>

      {/* Expanded detail */}
      {open && (
        <div className="bg-muted/15 border-t border-border/50 px-5 py-5 space-y-5">

          {/* 1. Title language variants */}
          {hasTrans && (
            <div className="pb-4 border-b border-border/30">
              <SectionHead icon={Globe2} label="Нэрний хэлний хувилбар" />
              <div className="flex flex-wrap gap-3">
                {extras.titleTranslations.map(tr => (
                  <div key={tr.lang} className="flex items-center gap-2 bg-white border border-border/50 rounded-lg px-3 py-1.5">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded flex-shrink-0">
                      {langCode(tr.lang)}
                    </span>
                    <span className="text-sm font-medium text-foreground">{tr.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Track technical info */}
          <div className="pb-4 border-b border-border/30">
            <SectionHead icon={Disc3} label="Дууны мэдээлэл" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
              <div>
                <KV icon={Hash}       label="ISRC"                  value={isrc || "—"} />
                <KV icon={Globe2}     label="Дуулагдаж байгаа хэл" value={extras.language} />
                <KV icon={LayoutList} label="Үндсэн жанр"           value={extras.genre} />
                <KV icon={Tags}       label="Дэд жанр"              value={extras.subGenre} />
              </div>
              <div>
                <KV icon={Clock}       label="Хугацаа"     value={t.duration} />
                <KV icon={ScrollText}  label="Үг агуулсан" value={extras.hasLyrics ? "Тийм" : "Үгүй / Instrumental"} />
                <KV icon={ShieldAlert} label="Explicit"    value={t.explicit ? "Explicit" : "Not explicit"} />
              </div>
            </div>
          </div>

          {/* 3. Artists + Contributors */}
          <div className="pb-4 border-b border-border/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
              <div>
                <SectionHead icon={Mic2} label="Артистууд" />
                <KV label="Үндсэн артист"   value={t.primaryArtist} />
                {t.featArtists.length > 0 && <KV label="Хамтарсан артист" value={t.featArtists.join(", ")} />}
              </div>
              {hasContribs && (
                <div>
                  <SectionHead icon={UserCheck} label="Оролцогчид" />
                  {extras.composers.length > 0 && <KV label="Ая зохиогч"  value={extras.composers.join(", ")} />}
                  {extras.hasLyrics && extras.lyricists.length > 0 && <KV label="Үг зохиогч" value={extras.lyricists.join(", ")} />}
                  {extras.otherCredits.map(c => <KV key={c.role} label={c.role} value={c.name} />)}
                </div>
              )}
            </div>
          </div>

          {/* 4. Audio file */}
          <div>
            <SectionHead icon={AudioWaveform} label="Аудио файл" />
            <div className="rounded-xl border border-border bg-white overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <button type="button" onClick={e => e.stopPropagation()}
                  className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0 hover:bg-muted/80">
                  <Play size={10} className="text-foreground ml-0.5" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{t.fileName}</p>
                  <p className="text-xs text-primary">Track source</p>
                </div>
                <span className="text-sm text-muted-foreground tabular-nums flex-shrink-0">{t.duration}</span>
                <div className="hidden sm:block flex-shrink-0">
                  <WaveBars seed={t.no * 7} size="sm" />
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-t border-border/50">
                <span className="text-xs text-muted-foreground">{t.fileSize}</span>
                {t.bitrate && <><span className="text-border text-xs">·</span><span className="text-xs text-muted-foreground">{t.bitrate}</span></>}
                <div className="flex items-center gap-1.5 ml-auto">
                  {[t.audioFormat, t.sampleRate, t.bitDepth].filter(Boolean).map(v => (
                    <span key={v} className="text-[11px] font-bold px-2 py-0.5 rounded border border-border bg-white text-foreground">{v}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// ── chapter card (audiobook — no music-specific sections) ────────────────────
function ChapterCard({ t, releaseId }: { t: TrackItem; releaseId: string }) {
  const [open, setOpen] = useState(false);
  const chapterTitles = RELEASE_TITLES[`CH-${t.no}`] ?? [];
  const isrc = t.isrc || generateISRC(releaseId, t.no);

  return (
    <div className={`rounded-2xl border transition-all overflow-hidden ${open ? "border-primary/25 shadow-sm" : "border-border hover:border-border/80"}`}>
      <div className="w-full flex items-center gap-3 px-5 py-3.5 text-left bg-white cursor-pointer select-none"
        onClick={() => setOpen(v => !v)}>
        <span className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground flex-shrink-0">{t.no}</span>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-sm text-foreground block truncate">{t.title}</span>
          <span className="text-xs text-muted-foreground">{t.primaryArtist}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0 text-xs text-muted-foreground tabular-nums">
          <span>{isrc}</span>
          <span className="opacity-40">·</span>
          <span>{t.duration}</span>
        </div>
        <div onClick={e => e.stopPropagation()}><TrackPreview title={t.title} /></div>
        <ChevronDown size={14} className={`text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </div>

      {open && (
        <div className="bg-muted/15 border-t border-border/50 px-5 py-5">

          {/* Title language variants */}
          {chapterTitles.length > 0 && (
            <div className="mb-4 pb-4 border-b border-border/30">
              <SectionHead icon={Globe2} label="Нэрний хэлний хувилбар" />
              <div className="flex flex-wrap gap-3">
                {chapterTitles.map(tr => (
                  <div key={tr.lang} className="flex items-center gap-2 bg-white border border-border/50 rounded-lg px-3 py-1.5">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded flex-shrink-0">{langCode(tr.lang)}</span>
                    <span className="text-sm font-medium text-foreground">{tr.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ISRC */}
          <div className="mb-4 pb-4 border-b border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash size={13} className="text-muted-foreground" />
              <span className="text-xs font-bold uppercase text-muted-foreground">ISRC</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground tracking-wide">{isrc}</span>
              {!t.isrc && (
                <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">Системээс оноосон</span>
              )}
            </div>
          </div>

          {/* Audio file */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <SectionHead icon={AudioWaveform} label="Аудио файл" />
              <span className="text-[10px] text-muted-foreground -mt-3">Source файл ба техникийн мэдээлэл</span>
            </div>
            <div className="rounded-xl border border-border bg-white overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <button type="button" onClick={e => e.stopPropagation()}
                  className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0 hover:bg-muted/80">
                  <Play size={10} className="text-foreground ml-0.5" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{t.fileName}</p>
                  <p className="text-xs text-primary">Track source</p>
                </div>
                <span className="text-sm text-muted-foreground tabular-nums flex-shrink-0">{t.duration}</span>
                <div className="hidden sm:block flex-shrink-0"><WaveBars seed={t.no * 7} size="sm" /></div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-t border-border/50">
                <span className="text-xs text-muted-foreground">{t.fileSize}</span>
                {t.bitrate && <><span className="text-border text-xs">·</span><span className="text-xs text-muted-foreground">{t.bitrate}</span></>}
                <div className="flex items-center gap-1.5 ml-auto">
                  {t.audioFormat && <span className="text-[11px] font-bold px-2 py-0.5 rounded border border-border bg-white text-foreground">{t.audioFormat}</span>}
                  {t.sampleRate  && <span className="text-[11px] font-bold px-2 py-0.5 rounded border border-border bg-white text-foreground">{t.sampleRate}</span>}
                  {t.bitDepth    && <span className="text-[11px] font-bold px-2 py-0.5 rounded border border-border bg-white text-foreground">{t.bitDepth}</span>}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// ── audiobook detail ──────────────────────────────────────────────────────────
function AudiobookDetail({ r }: { r: ReleaseData }) {
  const ab = AB_EXTRAS[r.id] ?? DEFAULT_AB_EXTRAS;
  const year = r.releaseDate?.split("-")[0] ?? "—";
  const relTitles = RELEASE_TITLES[r.id] ?? [];

  return (
    <>
      <Card className="p-5">
        <SectionHead icon={BookOpen} label="Үндсэн мэдээлэл" />

        {relTitles.length > 0 && (
          <div className="mb-4 pb-4 border-b border-border/30">
            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2.5 flex items-center gap-1.5">
              <Globe2 size={10} className="opacity-60" />Нэрний хэлний хувилбар
            </p>
            <div className="flex flex-wrap gap-3">
              {relTitles.map(t => (
                <div key={t.lang} className="flex items-center gap-2 bg-muted/40 border border-border/40 rounded-lg px-3 py-1.5">
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded flex-shrink-0">{langCode(t.lang)}</span>
                  <span className="text-sm font-medium text-foreground">{t.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
          <div>
            <KV icon={Hash}         label="UPC"               value={r.upc || "—"} />
            <KV icon={CalendarDays} label="Гарах огноо"       value={r.releaseDate} />
            <KV icon={LayoutList}   label="Үндсэн жанр"       value={r.genre} />
            {r.subGenre           && <KV icon={Tags}       label="Дэд жанр"      value={r.subGenre} />}
            <KV icon={Headphones}   label="Уншигч / Нарратор" value={ab.narrator} />
            <KV icon={Mic2}         label="Зохиолч"           value={ab.author} />
          </div>
          <div>
            <KV label="Зохиогчийн эрх ©" value={`© ${year} ${r.label || "Steppe Records"}`} />
            <KV icon={Globe2}       label="Хэл"               value={ab.language} />
            <KV icon={BookOpen}     label="Бүлэг тоо"         value={`${r.tracks.length} бүлэг`} />
            <KV icon={ShieldAlert}  label="Насны тохиромж"    value={r.ageRating ?? ab.ageRating} />
            <KV icon={ScrollText}   label="Хувилбар"          value={ab.isAbridged ? "Товчилсон" : "Бүтэн"} />
            {ab.isbn              && <KV icon={Hash}       label="ISBN"          value={ab.isbn} />}
          </div>
        </div>

        {r.synopsis && (
          <div className="mt-4 pt-4 border-t border-border/40">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
              <ScrollText size={11} className="opacity-60" />Тайлбар
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">{r.synopsis}</p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-border/40">
          <a href="#" className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold border border-border text-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors">
            <Globe size={13} />Номын холбоос<ExternalLink size={11} className="text-muted-foreground" />
          </a>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-1">
          <SectionHead icon={BookOpen} label="Бүлгүүд" />
          <span className="text-[11px] font-bold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">{r.tracks.length}</span>
        </div>
        <div className="space-y-2">
          {r.tracks.map(t => <ChapterCard key={t.no} t={t} releaseId={r.id} />)}
        </div>
      </Card>
    </>
  );
}

// ── PRBT song accordion ───────────────────────────────────────────────────────
function PrbtSongRow({ song, segs }: { song: string; segs: { name: string; code: string }[] }) {
  const hasCodes = segs.length > 0;
  const [open, setOpen] = useState(hasCodes);
  return (
    <div className={`rounded-xl border transition-all overflow-hidden ${hasCodes ? "border-border" : "border-border/40 opacity-55"}`}>
      <button type="button" disabled={!hasCodes}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left ${hasCodes ? "hover:bg-muted/30 cursor-pointer" : "cursor-default"}`}
        onClick={() => { if (hasCodes) setOpen(v => !v); }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <Disc3 size={12} className="text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium text-foreground truncate">{song}</span>
          <span className="text-xs text-muted-foreground flex-shrink-0">{hasCodes ? `${segs.length} код` : "Код оруулаагүй"}</span>
        </div>
        {hasCodes && <ChevronDown size={13} className={`text-muted-foreground flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />}
      </button>
      {hasCodes && open && (
        <div className="border-t border-border/50">
          {segs.map((seg, i) => (
            <div key={seg.code} className="flex items-center gap-3 px-4 py-2.5 bg-muted/10 hover:bg-muted/20 transition-colors border-b border-border/30 last:border-0">
              <span className="w-5 text-sm text-muted-foreground/50 tabular-nums flex-shrink-0 text-right">{i + 1}</span>
              <span className="text-sm text-foreground flex-1">{seg.name}</span>
              <CopyCode code={seg.code} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── film detail section ───────────────────────────────────────────────────────
const AVATAR_HUE = [258, 217, 189, 158, 38, 12, 280, 330];
function avatarHue(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) { h = name.charCodeAt(i) + ((h << 5) - h); h |= 0; }
  return AVATAR_HUE[Math.abs(h) % AVATAR_HUE.length];
}
function nameInitials(name: string) {
  return name.split(" ").map(w => w[0] ?? "").join("").toUpperCase().slice(0, 2) || "?";
}

// Auto-generate ISRC for a chapter when none is stored yet.
// Format: MN + 3-char label code from releaseId hash + 2-digit year + 5-digit chapter seq.
function generateISRC(releaseId: string, chapterNo: number): string {
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let h = 0;
  for (let i = 0; i < releaseId.length; i++) { h = releaseId.charCodeAt(i) + ((h << 5) - h); h |= 0; }
  const reg = [0, 1, 2].map(i => CHARS[Math.abs((h >> (i * 5)) & 0x1f) % CHARS.length]).join("");
  const year = new Date().getFullYear().toString().slice(2);
  const seq  = String(chapterNo).padStart(5, "0");
  return `MN${reg}${year}${seq}`;
}

// Roles that represent on-screen acting — get circular photo-style avatars
const ACTOR_ROLE_KEYWORDS = ["дүр", "жүжигч"];
function isActorRole(role: string) {
  const lower = role.toLowerCase();
  return ACTOR_ROLE_KEYWORDS.some(k => lower.includes(k));
}

function ActorChip({ name }: { name: string }) {
  const hue = avatarHue(name);
  return (
    <div className="flex items-center gap-2 bg-muted/40 border border-border/30 rounded-full px-2 py-1 flex-shrink-0">
      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
        style={{ background: `hsl(${hue},16%,85%)`, color: `hsl(${hue},20%,40%)` }}>
        {nameInitials(name)}
      </div>
      <span className="text-xs font-medium text-foreground whitespace-nowrap pr-0.5">{name}</span>
    </div>
  );
}

function FilmDetail({ r }: { r: ReleaseData }) {
  const year = r.releaseDate?.split("-")[0] ?? "—";

  const directorNames = r.cast?.filter(c => c.role === "Найруулагч").map(c => c.name) ?? [];
  const producerNames = r.cast?.filter(c => c.role === "Продюсер").map(c => c.name) ?? [];
  const writerNames   = r.cast?.filter(c => c.role === "Зохиолч").map(c => c.name) ?? [];

  // Split remaining cast into actor groups (with avatars) and crew groups (text only)
  const MAIN_ROLES = new Set(["Найруулагч", "Продюсер", "Зохиолч"]);
  const others = r.cast?.filter(c => !MAIN_ROLES.has(c.role)) ?? [];

  const actorGroups = new Map<string, string[]>();
  const crewGroups  = new Map<string, string[]>();
  others.forEach(c => {
    if (isActorRole(c.role)) {
      if (!actorGroups.has(c.role)) actorGroups.set(c.role, []);
      actorGroups.get(c.role)!.push(c.name);
    } else {
      if (!crewGroups.has(c.role)) crewGroups.set(c.role, []);
      crewGroups.get(c.role)!.push(c.name);
    }
  });

  const mainCrewLine = [
    ...directorNames.map(n => ({ label: "Найруулагч", name: n })),
    ...producerNames.map(n => ({ label: "Продюсер",   name: n })),
    ...writerNames.map(n =>   ({ label: "Зохиолч",    name: n })),
  ];

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <SectionHead icon={Film} label="Киноны мэдээлэл" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 mb-4">
          {[
            { label:"Гарсан он",         value: year,                  icon: CalendarDays },
            { label:"Үргэлжлэх хугацаа", value: r.filmDuration ?? "—", icon: Clock        },
            { label:"Насны ангилал",      value: r.ageRating ?? "—",    icon: ShieldAlert  },
            { label:"Жанр",              value: r.genre,               icon: Tags         },
          ].map(m => (
            <div key={m.label} className="bg-muted/40 rounded-xl px-3 py-2.5 border border-border/40">
              <div className="flex items-center gap-1 mb-0.5">
                <m.icon size={10} className="text-muted-foreground flex-shrink-0" />
                <p className="text-[10px] font-bold uppercase text-muted-foreground">{m.label}</p>
              </div>
              <p className="text-sm font-semibold text-foreground">{m.value}</p>
            </div>
          ))}
        </div>

        {mainCrewLine.length > 0 && (
          <div className="flex bg-muted/30 rounded-xl border border-border/30 divide-x divide-border/30 overflow-hidden mb-4">
            {mainCrewLine.map(({ label, name }) => (
              <div key={`${label}-${name}`} className="flex-1 px-3 py-2.5 min-w-0">
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-foreground truncate">{name}</p>
              </div>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-border/30">
          <a href="#"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-semibold border border-border text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors">
            <Globe size={12} />Киноны холбоос<ExternalLink size={10} />
          </a>
        </div>
      </Card>

      {r.synopsis && (
        <Card className="p-5">
          <SectionHead icon={ScrollText} label="Тайлбар" />
          <p className="text-sm text-foreground/80 leading-relaxed">{r.synopsis}</p>
        </Card>
      )}

      {(actorGroups.size > 0 || crewGroups.size > 0 || r.label) && (
        <Card className="p-5">
          <SectionHead icon={UsersRound} label="Баг хамт олон" muted />

          {/* Actor sections — horizontal pills, one row per role group */}
          {actorGroups.size > 0 && (
            <div className="mt-3 space-y-3 mb-3">
              {Array.from(actorGroups.entries()).map(([role, names]) => (
                <div key={role}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{role}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {names.map(name => <ActorChip key={name} name={name} />)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Other crew — compact rows */}
          {crewGroups.size > 0 && (
            <div className={`${actorGroups.size > 0 ? "pt-3 mt-1 border-t border-border/30" : "mt-3"}`}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Бусад баг</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                {Array.from(crewGroups.entries()).map(([role, names]) => (
                  <div key={role} className="flex items-baseline gap-2 py-1 border-b border-border/15 last:border-0">
                    <span className="text-[11px] text-muted-foreground w-[120px] flex-shrink-0">{role}</span>
                    <span className="text-[13px] font-semibold text-foreground">{names.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {r.label && (
            <div className={`flex items-center gap-2.5 ${(actorGroups.size > 0 || crewGroups.size > 0) ? "mt-3 pt-3 border-t border-border/30" : "mt-3"}`}>
              <div className="w-7 h-7 rounded-lg bg-muted border border-border/60 flex items-center justify-center flex-shrink-0">
                <Building2 size={13} className="text-muted-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">{r.label}</span>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

// ── edit request modal ────────────────────────────────────────────────────────
function EditRequestModal({ onClose }: { onClose: () => void }) {
  const [reason, setReason] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => { if (!sent) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-xl border border-border max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
        {sent ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={22} className="text-green-600" /></div>
            <p className="font-bold text-zinc-900 text-sm mb-1">Хүсэлт илгээгдлээ</p>
            <p className="text-xs text-zinc-500 leading-relaxed">1–3 ажлын өдрийн дотор хянана.</p>
            <button type="button" onClick={onClose} className="mt-5 w-full py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background:"linear-gradient(135deg,var(--primary),color-mix(in srgb,var(--primary) 80%,#000))" }}>Хаах</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0"><MessageSquare size={16} className="text-violet-700" /></div>
              <div><p className="font-bold text-zinc-900 text-sm">Засах хүсэлт</p><p className="text-xs text-zinc-500 mt-0.5">Нийтлэгдсэн контентыг шууд засах боломжгүй</p></div>
            </div>
            <p className="text-xs text-zinc-500 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2.5 mb-4 leading-relaxed">
              Шалтгааны тайлбарыг бичиж Support-д илгээнэ үү.
            </p>
            <label className="text-xs font-bold text-zinc-500 uppercase block mb-1.5">Шалтгаан <span className="text-red-500">*</span></label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={4}
              placeholder="Жишээ: Дуулагчийн нэр алдаатай байна..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-background resize-none" />
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors">Болих</button>
              <button type="button" disabled={!reason.trim()} onClick={() => { if (reason.trim()) setSent(true); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background:"linear-gradient(135deg,var(--primary),color-mix(in srgb,var(--primary) 80%,#000))" }}>
                <Send size={13} />Илгээх
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────
type Tab = "info" | "services" | "ringtone";

export default function ReleaseDetailScreen() {
  const navigate   = useNavigate();
  const [params]   = useSearchParams();
  const { id: pathId } = useParams<{ id?: string }>();
  const id         = pathId ?? params.get("id");
  const r          = (id ? ALL_RELEASES.find(x => x.id === id) : null) ?? ALL_RELEASES[0];

  const [tab,           setTab]           = useState<Tab>("info");
  const [prbtTab,       setPrbtTab]       = useState(PRBT_PROVIDERS[0]);
  const [showEditModal, setShowEditModal] = useState(false);

  const isFilm        = r.contentType === "film";
  const isAudiobook   = r.contentType === "audiobook";
  const isMusic       = r.contentType === "music";
  const isDraft       = r.status === "draft";
  const isRevision    = r.status === "revision";
  const canDirectEdit = isDraft || isRevision;
  const year          = r.releaseDate?.split("-")[0] ?? "2026";

  const svcList       = buildServices(r.services);
  const prbtData      = buildPrbtData(r.tracks);
  const relTitles     = RELEASE_TITLES[r.id] ?? [];

  const typeLabel = isAudiobook ? "Аудио ном" : isFilm ? "Кино" : r.type;

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id:"info",     label:"Үндсэн мэдээлэл", icon: isFilm ? Film : isAudiobook ? BookOpen : Disc3 },
    { id:"services", label:"Үйлчилгээ",        icon:Signal },
    ...(isMusic ? [{ id:"ringtone" as Tab, label:"Ring Tone Code", icon:Radio }] : []),
  ];

  const currentPrbt = prbtData.find(p => p.provider === prbtTab) ?? prbtData[0]!;

  const goEdit = () => {
    if (isFilm)      navigate(`/movies/${r.id}/edit`);
    else if (isAudiobook) navigate(`/audiobooks/${r.id}/edit`);
    else navigate(`/releases/${r.id}/edit`);
  };

  const catalogPath = isFilm ? "/movies" : isAudiobook ? "/audiobooks" : "/releases";

  return (
    <Shell title="">
      {showEditModal && <EditRequestModal onClose={() => setShowEditModal(false)} />}

      <div className="max-w-4xl">

        {/* Back */}
        <button type="button" onClick={() => navigate(catalogPath)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
          <ArrowLeft size={14} />Каталогт буцах
        </button>

        {/* ── Hero ── */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-lg"
          style={{ background: titleGradient(r.title) }}>
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-10 pointer-events-none"
            style={{ background:"radial-gradient(circle,white,transparent 70%)" }} />

          <div className="relative px-5 sm:px-7 py-6 flex gap-5 sm:gap-6 items-center">
            <div className={`w-28 sm:w-32 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shadow-2xl flex-shrink-0 backdrop-blur-sm self-stretch overflow-hidden relative ${isFilm ? "aspect-[2/3]" : "h-28 sm:h-32"}`}>
              {r.cover
                ? <img src={r.cover} alt={r.title} className="absolute inset-0 w-full h-full object-cover" />
                : isFilm      ? <Film     size={36} className="text-white/25" />
                : isAudiobook ? <BookOpen size={36} className="text-white/25" />
                : <Music2 size={36} className="text-white/25" />}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="text-[11px] font-bold text-white/50 uppercase bg-white/10 px-2 py-0.5 rounded-md">{typeLabel}</span>
                  <StatusBadge status={r.status} />
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight drop-shadow">{r.title}</h1>
                <p className="text-sm text-white/55 mt-1">
                  {r.primaryArtist}{r.featArtists.length ? ` feat. ${r.featArtists.join(", ")}` : ""}
                </p>
                {isFilm && r.filmDuration && (
                  <p className="flex items-center gap-1.5 text-xs text-white/35 mt-1">
                    <Clock size={10} />{r.filmDuration}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2.5 flex-wrap">
                {r.label && (
                  <span className="flex items-center gap-1 text-xs text-white/35">
                    <Building2 size={11} className="flex-shrink-0" />
                    {r.label}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-xs text-white/30">
                  <Clock size={10} />Нэмэгдсэн: {r.createdAt}
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 self-start pt-0.5">
              {canDirectEdit ? (
                <button type="button" onClick={goEdit}
                  className="flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-bold bg-white text-zinc-900 hover:bg-white/90 shadow-sm transition-colors">
                  <Pencil size={13} />Засах
                </button>
              ) : (
                <button type="button" onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-bold bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm transition-colors">
                  <MessageSquare size={13} />Засах хүсэлт
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Revision notice ── */}
        {isRevision && r.statusReason && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2.5 px-4 py-3 bg-red-100/60 border-b border-red-200">
              <AlertCircle size={14} className="text-red-600 flex-shrink-0" />
              <p className="text-sm font-bold text-red-700">Засвар шаардлагатай</p>
            </div>
            <div className="px-5 py-4">
              <div className="text-xs text-red-700 leading-relaxed whitespace-pre-line">{r.statusReason}</div>
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-muted/40 p-1 rounded-2xl border border-border mt-3 mb-4">
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} type="button" onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active ? "bg-white text-foreground shadow-sm border border-border/60" : "text-muted-foreground hover:text-foreground"
                }`}>
                <Icon size={12} className={active ? "text-primary" : ""} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* ══════════ ҮНДСЭН МЭДЭЭЛЭЛ ══════════ */}
        {tab === "info" && (
          <div className="space-y-4">
            {isFilm ? (
              <FilmDetail r={r} />
            ) : isAudiobook ? (
              <AudiobookDetail r={r} />
            ) : (
              <>
                <Card className="p-5">
                  <div className="mb-3">
                    <SectionHead icon={Disc3} label="Үндсэн мэдээлэл" />
                  </div>

                  {/* Title language variants */}
                  {relTitles.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-border/30">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2.5 flex items-center gap-1.5">
                        <Globe2 size={10} className="opacity-60" />Нэрний хэлний хувилбар
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {relTitles.map(t => (
                          <div key={t.lang} className="flex items-center gap-2 bg-muted/40 border border-border/40 rounded-lg px-3 py-1.5">
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded flex-shrink-0">
                              {langCode(t.lang)}
                            </span>
                            <span className="text-sm font-medium text-foreground">{t.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
                    <div>
                      <KV icon={Hash}         label="UPC"          value={r.upc || "—"} />
                      <KV icon={CalendarDays} label="Гарах огноо"  value={r.releaseDate} />
                      <KV icon={LayoutList}   label="Үндсэн жанр"  value={r.genre} />
                      <KV icon={Tags}         label="Дэд жанр"     value={r.subGenre} />
                    </div>
                    <div>
                      <KV label="Зохиогчийн эрх ©" value={`© ${year} ${r.label || "Steppe Records"}`} />
                      <KV label="Бичлэгийн эрх ℗"  value={`℗ ${year} ${r.label || "Steppe Records"}`} />
                    </div>
                  </div>

                  {r.synopsis && (
                    <div className="mt-4 pt-4 border-t border-border/40">
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                        <ScrollText size={11} className="opacity-60" />Тайлбар
                      </p>
                      <p className="text-sm text-foreground/80 leading-relaxed">{r.synopsis}</p>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-border/30">
                    <a href="#" className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-semibold border border-border text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors">
                      <Globe size={12} />Цомгийн холбоос<ExternalLink size={10} />
                    </a>
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <SectionHead icon={Music2} label="Дуунууд" />
                    <span className="text-[11px] font-bold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">{r.tracks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {r.tracks.map(t => <TrackCard key={t.no} t={t} />)}
                  </div>
                </Card>
              </>
            )}
          </div>
        )}

        {/* ══════════ ҮЙЛЧИЛГЭЭ ══════════ */}
        {tab === "services" && (
          <Card className="overflow-hidden">
            <div className="grid grid-cols-[28px_1fr_auto_auto_auto] sm:grid-cols-[28px_1fr_110px_160px_160px] gap-x-3 items-center px-5 py-2.5 border-b border-border bg-muted/40">
              <span />
              <span className="text-[11px] font-bold uppercase text-muted-foreground">Үйлчилгээ нэр</span>
              <span className="text-[11px] font-bold uppercase text-muted-foreground hidden sm:block">Гарах огноо</span>
              <span className="text-[11px] font-bold uppercase text-muted-foreground hidden sm:block">Үйлчилгээний төрөл</span>
              <span className="text-[11px] font-bold uppercase text-muted-foreground">Төлөв</span>
            </div>
            <div className="divide-y divide-border/40">
              {svcList.map((svc, i) => {
                const cfg = SVC_STATUS_CFG[svc.status];
                return (
                  <div key={svc.name}
                    className="grid grid-cols-[28px_1fr_auto_auto_auto] sm:grid-cols-[28px_1fr_110px_160px_160px] gap-x-3 items-center px-5 py-3 hover:bg-muted/20 transition-colors">
                    <span className="text-sm text-muted-foreground/40 tabular-nums text-right">{i + 1}</span>
                    <span className="text-sm font-medium text-foreground truncate">{svc.name}</span>
                    <span className="text-xs text-muted-foreground tabular-nums hidden sm:block">{svc.since}</span>
                    <span className="text-xs text-muted-foreground hidden sm:block truncate">{svc.category}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border w-fit ${cfg.badgeCls}`}>{cfg.label}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* ══════════ RING TONE CODE ══════════ */}
        {tab === "ringtone" && isMusic && (
          <div className="space-y-3">
            <div className="flex gap-1.5 overflow-x-auto pb-0.5">
              {prbtData.map(p => {
                const total = p.tracks.reduce((n, t) => n + t.segs.length, 0);
                const active = prbtTab === p.provider;
                return (
                  <button key={p.provider} type="button" onClick={() => setPrbtTab(p.provider)}
                    className={`flex items-center gap-2 h-9 px-4 rounded-xl text-xs font-semibold border flex-shrink-0 transition-all ${
                      active ? "bg-primary text-white border-primary shadow-sm" : "bg-white border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                    }`}>
                    <Radio size={11} />
                    {p.provider}
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${active ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>{total}</span>
                  </button>
                );
              })}
            </div>

            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <SectionHead icon={Radio} label={prbtTab} />
                <span className="text-xs text-muted-foreground -mt-3">{currentPrbt.tracks.reduce((n,t)=>n+t.segs.length,0)} нийт код</span>
              </div>
              <div className="space-y-2">
                {currentPrbt.tracks.map(tr => <PrbtSongRow key={tr.song} song={tr.song} segs={tr.segs} />)}
              </div>
              {currentPrbt.tracks.every(t => t.segs.length === 0) && (
                <div className="text-center py-8">
                  <Radio size={28} className="mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">{prbtTab}-д кодууд оруулаагүй байна</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Боловсруулагдаж байна</p>
                </div>
              )}
            </Card>
          </div>
        )}

      </div>
    </Shell>
  );
}
