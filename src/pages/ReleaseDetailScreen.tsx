import { Children, type ReactNode, useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { getCatalogSnapshot, subscribeCatalog } from "@/data/catalog-store";
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
import * as Dialog from "@radix-ui/react-dialog";
import { Btn } from "@/components/ui/Btn";
import { X, Maximize2 } from "lucide-react";
import { RELEASES } from "@/data/releases";
import type { ReleaseData } from "@/types";

// ── hero gradient ─────────────────────────────────────────────────────────────
const DEFAULT_COVER_GRADIENT = "linear-gradient(135deg, #181824 0%, #292938 100%)";

function useCoverGradient(cover?: string) {
  const [palette, setPalette] = useState<{ source: string; gradient: string } | null>(null);
  useEffect(() => {
    if (!cover) return;
    let cancelled = false;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) return;
        context.drawImage(image, 0, 0, 32, 32);
        const pixels = context.getImageData(0, 0, 32, 32).data;
        const buckets = new Map<string, { red: number; green: number; blue: number; weight: number }>();
        for (let offset = 0; offset < pixels.length; offset += 4) {
          if (pixels[offset + 3] < 128) continue;
          const red = pixels[offset];
          const green = pixels[offset + 1];
          const blue = pixels[offset + 2];
          const highest = Math.max(red, green, blue);
          const lowest = Math.min(red, green, blue);
          const weight = 1 + (highest - lowest) / 128;
          const key = `${Math.floor(red / 48)}-${Math.floor(green / 48)}-${Math.floor(blue / 48)}`;
          const bucket = buckets.get(key) || { red: 0, green: 0, blue: 0, weight: 0 };
          bucket.red += red * weight;
          bucket.green += green * weight;
          bucket.blue += blue * weight;
          bucket.weight += weight;
          buckets.set(key, bucket);
        }
        const dominant = [...buckets.values()].sort((first, second) => second.weight - first.weight)[0];
        if (!dominant) return;
        const channels = [dominant.red, dominant.green, dominant.blue].map(channel => channel / dominant.weight);
        const dark = channels.map(channel => Math.round(channel * 0.17 + 8)).join(", ");
        const light = channels.map(channel => Math.round(channel * 0.3 + 12)).join(", ");
        setPalette({ source: cover, gradient: `linear-gradient(135deg, rgb(${dark}) 0%, rgb(${light}) 100%)` });
      } catch {
        setPalette({ source: cover, gradient: DEFAULT_COVER_GRADIENT });
      }
    };
    image.onerror = () => { if (!cancelled) setPalette({ source: cover, gradient: DEFAULT_COVER_GRADIENT }); };
    image.src = cover;
    return () => { cancelled = true; image.onload = null; image.onerror = null; };
  }, [cover]);
  return palette && palette.source === cover ? palette.gradient : DEFAULT_COVER_GRADIENT;
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
type SvcStatus = "pending" | "rejected" | "take_down" | "delivered";
type SvcEntry = { name: string; status: SvcStatus; deliveryDate: string; category: string };

const ALL_SVC_META: Record<string, { status: SvcStatus; deliveryDate: string; category: string }> = {
  "Sonsy Music":       { status:"delivered",       deliveryDate:"2026-09-02", category:"Дотоодын үйлчилгээ" },
  "M Music":           { status:"delivered",       deliveryDate:"2026-09-02", category:"Дотоодын үйлчилгээ" },
  "Egshig":            { status:"delivered",       deliveryDate:"2026-09-02", category:"Дотоодын үйлчилгээ" },
  "Spotify":           { status:"delivered",       deliveryDate:"2026-09-03", category:"Олон улсын"          },
  "Apple Music":       { status:"delivered",       deliveryDate:"2026-09-03", category:"Олон улсын"          },
  "YouTube Music":     { status:"delivered",       deliveryDate:"2026-09-04", category:"Олон улсын"          },
  "Deezer":            { status:"delivered",       deliveryDate:"2026-09-04", category:"Олон улсын"          },
  "Hitone":            { status:"delivered",       deliveryDate:"2026-09-02", category:"PRBT"                },
  "Unimusic":          { status:"delivered",       deliveryDate:"2026-09-02", category:"PRBT"                },
  "SkyMelody":         { status:"pending", deliveryDate:"—",          category:"PRBT"                },
  "GTone":             { status:"pending", deliveryDate:"—",          category:"PRBT"                },
  "Audible":           { status:"delivered",       deliveryDate:"2025-04-05", category:"Аудио ном"           },
  "Apple Books":       { status:"delivered",       deliveryDate:"2025-04-05", category:"Аудио ном"           },
  "Google Play Books": { status:"delivered",       deliveryDate:"2025-04-07", category:"Аудио ном"           },
  "Netflix":           { status:"pending", deliveryDate:"—",          category:"Түрээс"              },
  "Vimeo":             { status:"pending", deliveryDate:"—",          category:"Түрээс"              },
  "Apple TV+":         { status:"pending",    deliveryDate:"—",          category:"Түрээс"              },
};

const SVC_STATUS_ORDER: Record<SvcStatus, number> = { delivered:0, pending:1, rejected:2, take_down:3 };
const SVC_STATUS_CFG: Record<SvcStatus, { label: string; badgeCls: string }> = {
  pending: { label:"Хүлээгдэж буй", badgeCls:"text-amber-700 bg-amber-50 border-amber-200" },
  rejected: { label:"Татгалзсан", badgeCls:"text-red-700 bg-red-50 border-red-200" },
  take_down: { label:"Татан буулгасан", badgeCls:"text-zinc-600 bg-zinc-100 border-zinc-200" },
  delivered: { label:"Хүргэгдсэн", badgeCls:"text-green-700 bg-green-50 border-green-200" },
};

function buildServices(names: string[]): SvcEntry[] {
  return names
    .map(n => ({ name: n, ...(ALL_SVC_META[n] ?? { status:"pending" as SvcStatus, deliveryDate:"—", category:"Бусад" }) }))
    .sort((a, b) => SVC_STATUS_ORDER[a.status] - SVC_STATUS_ORDER[b.status]);
}

// ── PRBT data ─────────────────────────────────────────────────────────────────
const SEG_TEMPLATES = [
  [{ name:"Эхлэл" },{ name:"Дахилт" },{ name:"Баттулгын хэсэг" }],
  [{ name:"Эхлэл" },{ name:"Дэнчин" }],
  [{ name:"Эхлэл" },{ name:"Дахилт" },{ name:"Дуусгавар" }],
];
const PRBT_PROVIDERS = ["Hitone","Unimusic","SkyMelody","GTone"];

function buildPrbtData(tracks: { title: string }[]) {
  return PRBT_PROVIDERS.map((provider, pi) => ({
    provider,
    tracks: tracks.map((t, ti) => ({
      song: t.title,
      segs: pi < 2
        ? SEG_TEMPLATES[(ti + pi) % SEG_TEMPLATES.length].map((s, si) => ({
            name: s.name,
            code: String((pi + 1) * 10 ** (5 + si % 3) + ti * 10 + si + 1),
          }))
        : [] as { name:string; code:string }[],
    })),
  }));
}

// ── copy code ─────────────────────────────────────────────────────────────────
function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const copy = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopyError(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopyError(true);
      setCopied(false);
    }
  }, [code]);
  return (
    <div className="shrink-0 text-right"><button type="button" onClick={copy} aria-label={`${code} код хуулах`} title={copied ? "Хуулсан" : "Код хуулах"}
      className={`inline-flex min-h-9 items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg border transition-all focus-visible:outline-primary ${
        copied ? "bg-green-50 border-green-200 text-green-700" : "bg-muted/50 border-border hover:bg-muted hover:border-primary/30 text-foreground"
      }`}>
      <span className="font-medium tabular-nums">{code}</span>
      {copied ? <Check size={11} /> : <Copy size={11} className="text-muted-foreground" />}
    </button><span aria-live="polite" className={copyError ? "mt-1 block max-w-40 text-xs text-destructive" : "sr-only"}>{copyError ? "Хуулж чадсангүй. Кодыг сонгон хуулна уу." : copied ? "Код хуулсан" : ""}</span></div>
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
function BalancedInfoColumns({ children }: { children: ReactNode }) {
  const fields = Children.toArray(children);
  const midpoint = Math.ceil(fields.length / 2);
  return <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
    <div className="min-w-0">{fields.slice(0, midpoint)}</div>
    <div className="min-w-0">{fields.slice(midpoint)}</div>
  </div>;
}

function KV({ label, value, icon }: { label: string; value?: string; icon?: React.ElementType }) {
  if (!value?.trim()) return null;
  const Icon = icon;
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-2 border-b border-border/30 last:border-0">
      <span className="text-xs text-muted-foreground sm:min-w-[160px] flex-shrink-0 flex items-center gap-1.5">
        {Icon && <Icon size={11} className="flex-shrink-0 opacity-60" />}
        {label}
      </span>
      <span className="text-sm text-foreground font-medium min-w-0 break-words">{value}</span>
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
      <p className="text-[11px] font-bold normal-case text-muted-foreground">{label}</p>
    </div>
  );
}

// ── track card ────────────────────────────────────────────────────────────────
type TrackItem = (typeof RELEASES)[0]["tracks"][0];

function AudioFileCard({ track }: { track: TrackItem }) {
  const sampleRate = track.sampleRate?.replace(/^([\d,]+) Hz$/, (_, rate) => `${Number(rate.replaceAll(",", "")) / 1000} kHz`);
  return (
    <div className="overflow-hidden rounded-2xl border border-primary/15 bg-card">
      <div className="flex items-center gap-3 px-4 py-4 sm:gap-4 sm:px-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-primary/5" aria-hidden="true"><Play size={14} className="text-foreground" /></span>
        <p className="min-w-0 flex-1 break-all text-sm font-medium leading-relaxed text-foreground">{track.fileName || "Файл оруулаагүй"}</p>
        <span className="shrink-0 text-sm tabular-nums text-muted-foreground">{track.duration || "—"}</span>
        <div className="hidden shrink-0 sm:block"><WaveBars seed={track.no * 7} size="sm" /></div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-primary/10 bg-primary/[0.025] px-4 py-3 sm:px-5">
        <span className="text-xs text-muted-foreground">{track.fileSize || "—"}</span>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2 text-xs text-muted-foreground">
          {track.audioFormat && <span className="rounded border border-primary/15 bg-card px-2 py-1 font-semibold text-foreground">{track.audioFormat}</span>}
          {sampleRate && <span>{sampleRate}</span>}
          {track.bitDepth && <span>{track.bitDepth.replace(/-bit$/, " bits")}</span>}
        </div>
      </div>
      {track.uploadedAt && <p className="border-t border-border/50 px-4 py-2 text-xs text-muted-foreground sm:px-5">Хуулсан огноо: {new Date(track.uploadedAt).toLocaleString("mn-MN")}</p>}
    </div>
  );
}

function TrackCard({ t }: { t: TrackItem }) {
  const [open, setOpen] = useState(false);
  const fallback = TRACK_EXTRAS[t.no] ?? TRACK_EXTRAS[1];
  const extras: TrackExtras = {
    ...fallback,
    composers: t.credits ? t.credits.composer.map(person => person.name) : fallback.composers,
    lyricists: t.credits ? t.credits.lyricist.map(person => person.name) : fallback.lyricists,
    otherCredits: t.credits ? t.credits.other.map(person => ({ role: person.role, name: person.name })) : fallback.otherCredits,
    hasLyrics: t.hasLyrics ?? fallback.hasLyrics,
    language: t.vocalLanguage ? (({ mn: "Монгол", en: "English / Latin", ru: "Орос", zh: "Хятад", ko: "Солонгос", ja: "Япон" } as Record<string, string>)[t.vocalLanguage] || t.vocalLanguage) : fallback.language,
    titleTranslations: t.titles ? Object.entries(t.titles).filter(([, title]) => !!title.trim()).map(([lang, title]) => ({ lang: lang === "mn" ? "Монгол" : lang === "en" ? "English / Latin" : lang, title })) : fallback.titleTranslations,
  };
  const isrc = (t.isrc || "").replace(/-/g, "");
  const hasContribs = extras.composers.length > 0 || (extras.hasLyrics && extras.lyricists.length > 0) || extras.otherCredits.length > 0;
  const hasTrans = extras.titleTranslations.length > 0;

  return (
    <div className={`rounded-2xl border transition-all overflow-hidden ${open ? "border-primary/25 shadow-sm" : "border-border hover:border-border/80"}`}>
      {/* Row header */}
      <div className="w-full flex items-center gap-3 px-4 py-3 text-left bg-white cursor-pointer select-none"
        onClick={() => setOpen(v => !v)}>
        <span className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground flex-shrink-0">{t.no}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 leading-tight">
            <span className="font-semibold text-sm text-foreground truncate leading-[1.2]">{t.title}</span>
            {t.explicit && <span className="text-[10px] bg-zinc-800 text-white px-1.5 py-0.5 rounded font-black flex-shrink-0">E</span>}
          </div>
          <span className="text-xs text-muted-foreground leading-[1.2]">{t.primaryArtist}{t.featArtists.length ? ` ft. ${t.featArtists.join(", ")}` : ""}</span>
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

          <div className="pb-4 border-b border-border/30">
            <SectionHead icon={Disc3} label="Дууны мэдээлэл" />
            <BalancedInfoColumns>
              {extras.titleTranslations.map(title => <KV key={title.lang} icon={Globe2} label={title.lang + " нэр"} value={title.title} />)}
              {!hasTrans && <KV label="Дууны нэр" value={t.title} />}
              <KV icon={Hash} label="ISRC" value={isrc || "Илгээсний дараа оноогдоно"} />
              <KV icon={Hash} label="ISWC" value={t.iswc || "—"} />
              <KV icon={Globe2} label="Дуулагдаж байгаа хэл" value={extras.language} />
              <KV icon={Clock} label="Хугацаа" value={t.duration} />
              <KV icon={LayoutList} label="Үндсэн жанр" value={extras.genre} />
              <KV icon={Tags} label="Дэд жанр" value={extras.subGenre} />
              <KV icon={ScrollText} label="Үгтэй эсэх" value={extras.hasLyrics ? "Үгтэй" : "Үггүй"} />
              <KV icon={ShieldAlert} label="Explicit контент" value={t.explicit ? "Тийм, байгаа" : "Үгүй, байхгүй"} />
              {t.originalDate && <KV icon={CalendarDays} label="Анх гарсан огноо" value={t.originalDate} />}
            </BalancedInfoColumns>
          </div>

          {/* 3. Artists + Contributors */}
          {t.lyrics?.trim() && <div className="border-b border-border/30 pb-4">
            <SectionHead icon={ScrollText} label="Дууны үг" />
            <p className="whitespace-pre-wrap break-words rounded-xl border border-border bg-card p-3 text-sm leading-relaxed text-foreground">{t.lyrics}</p>
          </div>}
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
                  {[...new Set(extras.otherCredits.map(person => person.role))].map(role => <KV key={role} label={role} value={extras.otherCredits.filter(person => person.role === role).map(person => person.name).join(", ")} />)}
                  {t.credits && [...t.credits.composer, ...t.credits.lyricist].filter((person, index, people) => person.affiliation && people.findIndex(item => item.id === person.id) === index).map(person => <KV key={person.id} label={`${person.name} · Эрхийн байгууллага`} value={person.affiliation} />)}
                </div>
              )}
            </div>
          </div>

          {/* 4. Audio file */}
          <div>
            <SectionHead icon={AudioWaveform} label="Аудио файл" />
            <AudioFileCard track={t} />
          </div>

        </div>
      )}
    </div>
  );
}

// ── chapter card (audiobook — no music-specific sections) ────────────────────
function ChapterCard({ t }: { t: TrackItem; releaseId: string }) {
  const [open, setOpen] = useState(false);
  const chapterTitles = t.titles ? Object.entries(t.titles).filter(([, title]) => title.trim()).map(([lang, title]) => ({ lang: lang === "mn" ? "Монгол" : lang === "en" ? "English / Latin" : lang, title })) : [];
  const isrc = t.isrc || "Илгээсний дараа оноогдоно";

  return (
    <div className={`rounded-2xl border transition-all overflow-hidden ${open ? "border-primary/25 shadow-sm" : "border-border hover:border-border/80"}`}>
      <div className="w-full flex items-center gap-3 px-4 py-3 text-left bg-white cursor-pointer select-none"
        onClick={() => setOpen(v => !v)}>
        <span className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground flex-shrink-0">{t.no}</span>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-sm text-foreground block truncate leading-[1.2]">{t.title}</span>
          <span className="text-xs text-muted-foreground leading-[1.2]">{t.primaryArtist}</span>
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

          {/* Audio file */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <SectionHead icon={AudioWaveform} label="Аудио файл" />
              <span className="hidden sm:inline text-[10px] text-muted-foreground -mt-3">Source файл ба техникийн мэдээлэл</span>
            </div>
            <AudioFileCard track={t} />
          </div>

        </div>
      )}
    </div>
  );
}

// ── audiobook detail ──────────────────────────────────────────────────────────
function AudiobookDetail({ r }: { r: ReleaseData }) {
  const fallback = AB_EXTRAS[r.id] ?? DEFAULT_AB_EXTRAS;
  const ab = { ...fallback, author: r.authors?.join(", ") || fallback.author, narrator: r.narrators?.join(", ") || fallback.narrator, language: r.language || fallback.language, isbn: r.isbn || fallback.isbn, isAbridged: r.isAbridged ?? fallback.isAbridged };
  const year = r.releaseDate?.split("-")[0] ?? "—";
  const relTitles = r.titles ? Object.entries(r.titles).filter(([, title]) => title.trim()).map(([lang, title]) => ({ lang: lang === "mn" ? "Монгол" : lang === "en" ? "English / Latin" : lang, title })) : RELEASE_TITLES[r.id] ?? [];

  return (
    <>
      <Card className="p-5">
        <SectionHead icon={BookOpen} label="Үндсэн мэдээлэл" />

        {relTitles.length > 0 && (
          <div className="mb-4 pb-4 border-b border-border/30">
            <p className="text-[10px] font-bold normal-case text-muted-foreground mb-2.5 flex items-center gap-1.5">
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
            <KV icon={CalendarDays} label="Нийтлэх огноо"     value={r.releaseDate} />
            <KV icon={LayoutList}   label="Үндсэн жанр"       value={r.genre} />
            {r.subGenre           && <KV icon={Tags}       label="Дэд жанр"      value={r.subGenre} />}
            <KV icon={Headphones}   label="Уншигч / Нарратор" value={ab.narrator} />
            <KV icon={Mic2}         label="Зохиолч"           value={ab.author} />
          </div>
          <div>
            <KV label="Зохиогчийн эрх ©" value={r.copyrightOwner ? `© ${r.copyrightYear || "—"} ${r.copyrightOwner}` : "—"} />
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
    <div className={`rounded-xl border transition-all overflow-hidden ${hasCodes ? "border-border" : "border-border/40"}`}>
      <button type="button" disabled={!hasCodes}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left ${hasCodes ? "hover:bg-muted/30 cursor-pointer" : "cursor-default"}`}
        onClick={() => { if (hasCodes) setOpen(v => !v); }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary"><Music2 size={16} /></span>
          <div className="min-w-0"><p className="break-words text-sm font-medium text-foreground">{song}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{hasCodes ? `${segs.length} код` : "Код оруулаагүй"}</p></div>
        </div>
        {hasCodes && <ChevronDown size={13} className={`text-muted-foreground flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />}
      </button>
      {hasCodes && open && (
        <div className="border-t border-border/50">
          {segs.map((seg, i) => (
            <div key={seg.code} className="flex items-center gap-3 px-4 py-2.5 bg-muted/10 hover:bg-muted/20 transition-colors border-b border-border/30 last:border-0">
              <span className="hidden w-5 text-xs text-muted-foreground/50 tabular-nums flex-shrink-0 text-right sm:block">{i + 1}</span>
              <span className="min-w-0 break-words text-xs text-foreground flex-1">{seg.name}</span>
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


// Roles that represent on-screen acting — get circular photo-style avatars
const ACTOR_ROLE_KEYWORDS = ["дүр", "жүжигч"];
function isActorRole(role: string) {
  const lower = role.toLowerCase();
  return ACTOR_ROLE_KEYWORDS.some(k => lower.includes(k));
}

function ActorChip({ name }: { name: string }) {
  const hue = avatarHue(name);
  return (
    <div className="flex min-w-0 max-w-full items-center gap-2 bg-muted/40 border border-border/30 rounded-full px-2 py-1">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
        style={{ background: `hsl(${hue},16%,85%)`, color: `hsl(${hue},20%,40%)` }}>
        {nameInitials(name)}
      </div>
      <span className="min-w-0 break-words text-sm font-medium text-foreground pr-1">{name}</span>
    </div>
  );
}

function filmDurationInMinutes(value?: string): string {
  if (!value?.trim()) return "—";
  const duration = value.trim();
  if (/^\d+(?:\.\d+)?$/.test(duration)) return `${Number(duration)} минут`;
  const hours = duration.match(/(\d+)\s*(?:цаг|ц|h)/i);
  const minutes = duration.match(/(\d+)\s*(?:минут|мин|м|m)/i);
  if (hours || minutes) return `${Number(hours?.[1] || 0) * 60 + Number(minutes?.[1] || 0)} минут`;
  const clock = duration.match(/^(\d+):(\d{2})(?::(\d{2}))?$/);
  if (clock) return `${Number(clock[1]) * 60 + Number(clock[2]) + (Number(clock[3] || 0) >= 30 ? 1 : 0)} минут`;
  return "—";
}

function FilmDetail({ r }: { r: ReleaseData }) {
  const teamGroups = new Map<string, string[]>();
  (r.cast || []).forEach(person => {
    const names = teamGroups.get(person.role) || [];
    if (!names.includes(person.name)) names.push(person.name);
    teamGroups.set(person.role, names);
  });
  return (
    <div className="space-y-4">
      <Card className="p-5">
        <SectionHead icon={Film} label="Үндсэн мэдээлэл" />
        <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
          <div>
            <KV icon={Hash} label="UPC" value={r.upc || "Илгээсний дараа оноогдоно"} />
            <KV icon={CalendarDays} label="Нийтлэх огноо" value={r.releaseDate || "—"} />
            <KV icon={Tags} label="Үндсэн жанр" value={r.genre || "—"} />
            {r.subGenre && <KV icon={Tags} label="Дэд жанр" value={r.subGenre} />}
            <KV icon={Globe2} label="Хэл" value={r.language || "—"} />
          </div>
          <div>
            <KV icon={Clock} label="Үргэлжлэх хугацаа" value={filmDurationInMinutes(r.filmDuration)} />
            <KV icon={ShieldAlert} label="Нас хязгаарлалт" value={r.ageRating || "—"} />
            <KV label="Зохиогчийн эрх ©" value={r.copyrightOwner ? ["©", r.copyrightYear || "—", r.copyrightOwner].join(" ") : "—"} />
          </div>
        </div>
        {r.titles && <div className="mt-4 flex flex-wrap gap-2 border-t border-border/40 pt-4">{Object.entries(r.titles).filter(([, title]) => title.trim()).map(([lang, title]) => <span key={lang} className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"><b className="mr-2 text-xs text-primary">{lang.toUpperCase()}</b>{title}</span>)}</div>}
        {r.synopsis && <div className="mt-4 border-t border-border/40 pt-4"><SectionHead icon={ScrollText} label="Тайлбар / Агуулга" /><p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">{r.synopsis}</p></div>}
        {r.filmUrl && <div className="mt-4 border-t border-border/40 pt-4"><a href={r.filmUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary"><Globe size={14} />Киноны холбоос<ExternalLink size={12} /></a></div>}
      </Card>
      {(teamGroups.size > 0 || !!r.collaboratingStudios?.length) && (
        <Card className="p-5">
          <div className="[&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0"><SectionHead icon={UsersRound} label="Баг хамт олон" muted /></div>
          <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {Array.from(teamGroups.entries()).map(([role, names]) => (
              <div key={role} className="min-w-0 border-b border-border/50 py-3">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">{role}</p>
                <div className="flex flex-wrap gap-2">{names.map(name => <ActorChip key={name} name={name} />)}</div>
              </div>
            ))}
          </div>
          {!!r.collaboratingStudios?.length && <div className="mt-4 border-t border-border/40 pt-4">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Building2 size={16} />Хамтарсан студи / Продакшн</p>
            <div className="flex flex-wrap gap-2">{r.collaboratingStudios.map(name => <span key={name} className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm font-medium">{name}</span>)}</div>
          </div>}
        </Card>
      )}
    </div>
  );
}

// ── edit request modal ────────────────────────────────────────────────────────
function EditRequestModal({ onClose }: { onClose: () => void }) {
  const [reason, setReason] = useState("");
  const [sent, setSent] = useState(false);
  return <Dialog.Root open onOpenChange={open => { if (!open) onClose(); }}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-sm" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-[201] flex max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-start gap-3 border-b border-border px-5 py-5 sm:px-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><MessageSquare size={20} /></div>
          <div className="min-w-0 flex-1">
            <Dialog.Title className="text-base font-bold text-foreground">{sent ? "Хүсэлт илгээгдсэн" : "Засах хүсэлт"}</Dialog.Title>
            <Dialog.Description className="mt-1 text-sm leading-relaxed text-muted-foreground">{sent ? "Таны хүсэлтийг хүлээн авлаа." : "Өөрчлөх шаардлагатай мэдээллээ тодорхой бичнэ үү."}</Dialog.Description>
          </div>
          <Dialog.Close aria-label="Цонх хаах" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"><X size={18} /></Dialog.Close>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          {sent ? <div className="rounded-xl border border-green-200 bg-green-50 p-4"><p className="flex items-center gap-2 text-sm font-semibold text-green-800"><CheckCircle2 size={18} />Хүсэлт амжилттай илгээгдсэн</p><p className="mt-2 text-sm text-green-800/80">Хүсэлтийг 1–3 ажлын өдрийн дотор хянана.</p></div> : <>
            <label htmlFor="edit-request-reason" className="mb-2 block text-sm font-semibold">Өөрчлөлтийн тайлбар <span className="text-destructive">*</span></label>
            <textarea id="edit-request-reason" required value={reason} onChange={event => setReason(event.target.value)} rows={5} placeholder="Ямар мэдээллийг хэрхэн өөрчлөхөө бичнэ үү..." className="w-full resize-y rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Нийтлэгдсэн контентын өөрчлөлтийг хүсэлтээр хянуулна.</p>
          </>}
        </div>
        <div className="flex flex-wrap justify-end gap-3 border-t border-border bg-muted/20 px-5 py-4 sm:px-6">
          {sent ? <Btn onClick={onClose}>Хаах</Btn> : <><Btn variant="secondary" onClick={onClose}>Болих</Btn><Btn disabled={!reason.trim()} onClick={() => setSent(true)} icon={<Send size={15} />}>Хүсэлт илгээх</Btn></>}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

// ── main ──────────────────────────────────────────────────────────────────────
type Tab = "info" | "services" | "ringtone";

export default function ReleaseDetailScreen() {
  const navigate   = useNavigate();
  const [params]   = useSearchParams();
  const { id: pathId } = useParams<{ id?: string }>();
  const id         = pathId ?? params.get("id");
  const catalogProducts = useSyncExternalStore(subscribeCatalog, getCatalogSnapshot);
  const r = id ? catalogProducts.find(product => product.id === id) : catalogProducts[0];
  const coverGradient = useCoverGradient(r?.cover);

  const [tab,           setTab]           = useState<Tab>("info");
  const [prbtTab,       setPrbtTab]       = useState(PRBT_PROVIDERS[0]);
  const [showEditModal, setShowEditModal] = useState(false);

  if (!r) return <Shell title="Бүтээл олдсонгүй"><div className="rounded-xl border border-border bg-card p-6"><p className="text-sm text-muted-foreground">Энэ бүтээл устсан эсвэл олдсонгүй.</p><button type="button" className="mt-4 text-sm font-medium text-primary" onClick={() => navigate("/releases")}>Каталог руу буцах</button></div></Shell>;

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
    { id:"services", label:"Түгээлт",        icon:Signal },
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
          style={{ background: coverGradient }}>
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-10 pointer-events-none"
            style={{ background:"radial-gradient(circle,white,transparent 70%)" }} />

          <div className={`relative px-4 sm:px-7 py-5 sm:py-6 grid sm:flex sm:flex-wrap xl:flex-nowrap gap-4 sm:gap-6 sm:items-center ${isFilm ? "grid-cols-[112px_minmax(0,1fr)]" : "grid-cols-[128px_minmax(0,1fr)]"}`}>
            <Dialog.Root>
            <Dialog.Trigger asChild>
            <button type="button" disabled={!r.cover} aria-label={`${r.title} · Ковер зураг томруулж харах`} className={`group rounded-xl sm:rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shadow-2xl flex-shrink-0 backdrop-blur-sm self-start overflow-hidden relative outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-default ${r.cover ? "cursor-zoom-in" : ""} ${isFilm ? "w-28 sm:w-44 aspect-[2/3]" : "w-32 sm:w-48 aspect-square"}`}>
              {r.cover
                ? <img src={r.cover} alt={r.title} className="absolute inset-0 w-full h-full object-cover" />
                : isFilm      ? <Film     size={36} className="text-white/25" />
                : isAudiobook ? <BookOpen size={36} className="text-white/25" />
                : <Music2 size={36} className="text-white/25" />}
              {r.cover && <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/50 text-white transition-colors group-hover:bg-black/70"><Maximize2 size={14} /></span>}
            </button>
            </Dialog.Trigger>
            {r.cover && <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm" />
              <Dialog.Content className="fixed left-1/2 top-1/2 z-[301] flex max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-white/15 bg-zinc-950 shadow-2xl outline-none">
                <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                  <Dialog.Title className="min-w-0 truncate text-sm font-semibold text-white">{r.title}</Dialog.Title>
                  <Dialog.Description className="sr-only">Ковер зургийг бүтнээр нь томруулж харуулж байна.</Dialog.Description>
                  <Dialog.Close aria-label="Зураг хаах" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white/80 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"><X size={20} /></Dialog.Close>
                </div>
                <div className="min-h-0 overflow-auto p-3 sm:p-5"><img src={r.cover} alt={r.title} className="mx-auto max-h-[calc(100dvh-140px)] w-auto max-w-full object-contain" /></div>
              </Dialog.Content>
            </Dialog.Portal>}
            </Dialog.Root>

            <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="text-[11px] font-bold text-white/50 normal-case bg-white/10 px-2 py-0.5 rounded-md">{typeLabel}</span>
                  <StatusBadge status={r.status} />
                </div>
                <h1 className="text-lg sm:text-2xl font-extrabold text-white leading-snug sm:leading-tight break-words drop-shadow">{r.title}</h1>
                <p className="text-xs sm:text-sm text-white/55 mt-1 break-words">
                  {r.primaryArtist}{r.featArtists.length ? ` feat. ${r.featArtists.join(", ")}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 mt-2.5 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs text-white/70 min-w-0 break-words">
                    <Building2 size={11} className="flex-shrink-0" />
                    <span><span className="text-white/45">{isFilm ? "Үндсэн продакшн" : isAudiobook ? "Нийтлэгч" : "Лейбл"}: </span>{r.label || "Тохируулаагүй"}</span>
                </span>
                <span className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-white/50">
                  <Clock size={10} />Нэмэгдсэн: {r.createdAt}
                </span>
              </div>
            </div>

            <div className="col-span-2 flex-shrink-0 sm:basis-full xl:basis-auto self-start pt-0.5 [&>button]:w-full sm:[&>button]:w-auto [&>button]:justify-center">
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
        <div className="flex gap-1 bg-muted/40 p-1 rounded-2xl border border-border mt-3 mb-4 overflow-x-auto overscroll-x-contain">
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} type="button" onClick={() => setTab(t.id)} aria-pressed={active}
                className={`flex-shrink-0 sm:flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active ? "bg-white text-foreground shadow-sm border border-border/60" : "text-muted-foreground hover:text-foreground"
                }`}>
                <Icon size={12} className={active ? "text-primary" : ""} />
                <span>{t.label}</span>
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


                  <BalancedInfoColumns>
                    <KV icon={Globe2} label="Монгол нэр" value={r.titles?.mn || relTitles.find(title => title.lang === "Монгол")?.title || r.title} />
                    <KV icon={Globe2} label="English / Latin нэр" value={r.titles?.en || relTitles.find(title => title.lang === "English / Latin")?.title || "—"} />
                    <KV icon={Hash} label="UPC" value={r.upc || "—"} />
                    <KV icon={CalendarDays} label="Нийтлэх огноо" value={r.releaseDate} />
                    <KV icon={LayoutList} label="Үндсэн жанр" value={r.genre} />
                    <KV icon={Tags} label="Дэд жанр" value={r.subGenre || "—"} />
                    {r.originalDate && <KV icon={CalendarDays} label="Анх гарсан огноо" value={r.originalDate} />}
                    <KV label="Зохиогчийн эрх ©" value={`© ${year} ${r.label || "Steppe Records"}`} />
                    <KV label="Бичлэгийн эрх ℗" value={`℗ ${year} ${r.label || "Steppe Records"}`} />
                  </BalancedInfoColumns>

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

        {tab === "services" && (
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-5 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Signal size={20} /></span>
                  <div><h2 className="text-base font-semibold text-foreground">Түгээлт</h2><p className="mt-1 text-xs text-muted-foreground">Платформ тус бүрийн хүргэлт болон төлөв</p></div>
                </div>
                <span className="shrink-0 rounded-lg border border-border bg-muted/30 px-2.5 py-1.5 text-xs font-medium text-muted-foreground">{svcList.length} платформ</span>
              </div>
              <div className="hidden grid-cols-[minmax(0,1fr)_140px_210px] gap-4 border-b border-border/50 bg-muted/25 px-6 py-2.5 text-xs font-medium text-muted-foreground md:grid">
                <span className="pl-[52px]">Платформ</span><span className="text-center">Хүргэлтийн огноо</span><span className="text-right">Төлөв</span>
              </div>
              <div className="divide-y divide-border/50">
                {svcList.map(svc => {
                  const cfg = SVC_STATUS_CFG[svc.status];
                  const PlatformIcon = /Books|Audible/i.test(svc.name) ? BookOpen : /TV|Netflix|Vimeo/i.test(svc.name) ? PlayCircle : /Hitone|Unimusic|SkyMelody|GTone/i.test(svc.name) ? Radio : /YouTube/i.test(svc.name) ? PlayCircle : Music2;
                  return <div key={svc.name} className="grid grid-cols-2 items-end gap-x-3 gap-y-3 px-4 py-4 transition-colors hover:bg-muted/20 sm:px-6 md:grid-cols-[minmax(0,1fr)_140px_210px] md:items-center md:gap-4">
                    <div className="col-span-2 flex min-w-0 items-center gap-3 md:col-span-1">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/5 text-primary"><PlatformIcon size={19} /></span>
                      <p className="min-w-0 break-words text-sm font-semibold text-foreground">{svc.name}</p>
                    </div>
                    <div className="min-w-0 self-center text-xs leading-relaxed tabular-nums text-muted-foreground md:text-center"><span className="mb-1 block text-[11px] text-muted-foreground/80 md:hidden">Хүргэлтийн огноо</span>{svc.deliveryDate === "—" ? "Хүргэгдээгүй" : svc.deliveryDate}</div>
                    <span className={"inline-flex max-w-full items-center justify-center justify-self-end gap-1.5 rounded-full border px-2.5 py-1.5 text-center text-[11px] font-semibold leading-relaxed sm:text-xs " + cfg.badgeCls}><span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" /><span className="min-w-0 break-words">{cfg.label}</span></span>
                  </div>;
                })}
                {svcList.length === 0 && <div className="px-6 py-10 text-center text-sm text-muted-foreground">Түгээх платформ сонгоогүй байна.</div>}
              </div>
            </Card>
          </div>
        )}

        {/* ══════════ RING TONE CODE ══════════ */}
        {tab === "ringtone" && isMusic && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {prbtData.map(p => {
                const total = p.tracks.reduce((n, t) => n + t.segs.length, 0);
                const active = prbtTab === p.provider;
                return (
                  <button key={p.provider} type="button" onClick={() => setPrbtTab(p.provider)}
                    className={`flex min-w-0 items-center justify-center gap-2 h-10 px-3 rounded-xl text-xs font-medium border transition-all ${
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
              <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-4 mb-4">
                <div className="flex items-center gap-2 text-primary"><Radio size={18} /><h2 className="text-sm font-semibold text-foreground">{prbtTab}</h2></div>
                <span className="text-xs text-muted-foreground">{currentPrbt.tracks.reduce((n,t)=>n+t.segs.length,0)} код</span>
              </div>
              <div className="space-y-2">
                {currentPrbt.tracks.some(track => track.segs.length > 0) && currentPrbt.tracks.map((tr, index) => <PrbtSongRow key={`${prbtTab}-${index}`} song={tr.song} segs={tr.segs} />)}
              </div>
              {currentPrbt.tracks.every(t => t.segs.length === 0) && (
                <div className="text-center py-8">
                  <Radio size={28} className="mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">{prbtTab}-д кодууд оруулаагүй байна</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Код оноогдсоны дараа энд харагдана.</p>
                </div>
              )}
            </Card>
          </div>
        )}

      </div>
    </Shell>
  );
}
