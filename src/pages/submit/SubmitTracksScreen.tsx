import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Plus, ChevronRight, ChevronDown, ArrowLeft, UploadCloud, Fingerprint, Mic2, Users, Activity, Music2, RefreshCw, Trash2, Sparkles, Lock, X, GripVertical, Check } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { Stepper } from "@/components/ui/Stepper";
import { MOCK_ARTISTS } from "@/data/artists";
import { RELEASE_STEPS } from "@/data/content";
import { TrackData, ArtistRef, ContribRef, OtherContribRef, makeTrack } from "./track/types";

const GENRES = ["Pop", "Rock", "Hip-Hop", "Electronic", "Traditional", "Folk", "Classical", "Jazz", "R&B", "Alternative", "Country", "Indie", "Dance", "Soul", "Бусад"];
const VOCAL_LANGS = ["Монгол", "English", "Буриад", "Казах", "Хятад", "Орос", "Япон", "Солонгос", "Инструментал", "Бусад"];
const OTHER_ROLES = [
  { id: "producer",           label: "Producer" },
  { id: "mixing_engineer",    label: "Mixing Engineer" },
  { id: "mastering_engineer", label: "Mastering Engineer" },
  { id: "recording_engineer", label: "Recording Engineer" },
];

const RELEASE_PRIMARY = [MOCK_ARTISTS[0]];
const RELEASE_FEATURED: ArtistRef[] = [];

function initials(name: string) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

function SectionLabel({ title, sub, required }: { title: string; sub?: string; required?: boolean }) {
  return (
    <div className="mb-2">
      <p className="text-sm font-semibold text-zinc-700">
        {title}{required && <span className="text-red-500 ml-0.5">*</span>}
      </p>
      {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function SubmitTracksScreen() {
  const navigate = useNavigate();

  // isSingle mirrors what was selected in Stage 1 — toggle here for demo
  const [isSingle, setIsSingle] = useState(false);

  const [tracks, setTracks] = useState<TrackData[]>([
    makeTrack(1, RELEASE_PRIMARY),
    makeTrack(2, RELEASE_PRIMARY),
  ]);
  const [expandedTrack, setExpandedTrack] = useState<number | null>(0);
  const uploadRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const updateTrack = (id: string, patch: Partial<TrackData>) =>
    setTracks(ts => ts.map(t => t.id === id ? { ...t, ...patch } : t));

  const addTrack = () => {
    const n = tracks.length + 1;
    setTracks(ts => [...ts, makeTrack(n, RELEASE_PRIMARY)]);
    setExpandedTrack(tracks.length);
  };

  const removeTrack = (id: string) => {
    setTracks(ts => ts.filter(t => t.id !== id));
    setExpandedTrack(null);
  };

  const simulateUpload = (trackId: string, fileName: string) => {
    updateTrack(trackId, { uploading: true, uploadProgress: 0, audioName: fileName });
    let progress = 0;
    const timer = setInterval(() => {
      progress = Math.min(100, progress + 15);
      updateTrack(trackId, { uploadProgress: progress });
      if (progress >= 100) {
        clearInterval(timer);
        const ext = fileName.split(".").pop()?.toUpperCase() || "AUDIO";
        updateTrack(trackId, {
          uploading: false, hasAudio: true, uploadProgress: 100,
          fileFormat: ext, sampleRate: "44.1 kHz", bitDepth: "24-bit",
          duration: `${2 + Math.floor(Math.random() * 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
        });
      }
    }, 200);
  };

  // ── Artist picker (album-mode track metadata) ──
  function TrackArtistPicker({ track, field }: { track: TrackData; field: "primary" | "featured" }) {
    const isPrimary = field === "primary";
    const artists = isPrimary ? track.trackPrimary : track.trackFeatured;
    const searchVal = isPrimary ? track.trackPrimarySearch : track.trackFeatSearch;
    const showDrop = isPrimary ? track.showTrackPrimaryDrop : track.showTrackFeatDrop;
    const otherArtists = isPrimary ? track.trackFeatured : track.trackPrimary;
    const excluded = new Set([...artists, ...otherArtists].map(a => a.id));
    const suggestions = MOCK_ARTISTS.filter(a =>
      a.name.toLowerCase().includes(searchVal.toLowerCase()) && !excluded.has(a.id)
    );

    const addArtist = (a: ArtistRef) =>
      updateTrack(track.id, isPrimary
        ? { trackPrimary: [...artists, a], trackPrimarySearch: "", showTrackPrimaryDrop: false }
        : { trackFeatured: [...artists, a], trackFeatSearch: "", showTrackFeatDrop: false });

    const removeArtist = (id: string) =>
      updateTrack(track.id, isPrimary
        ? { trackPrimary: artists.filter(a => a.id !== id) }
        : { trackFeatured: artists.filter(a => a.id !== id) });

    const setSearch = (v: string) => updateTrack(track.id, isPrimary
      ? { trackPrimarySearch: v, showTrackPrimaryDrop: true }
      : { trackFeatSearch: v, showTrackFeatDrop: true });

    const setShowDrop = (v: boolean) => updateTrack(track.id, isPrimary
      ? { showTrackPrimaryDrop: v }
      : { showTrackFeatDrop: v });

    return (
      <div className="relative">
        {artists.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {artists.map(a => (
              <span key={a.id} className="flex items-center gap-1.5 bg-violet-100 text-violet-700 px-2 py-0.5 rounded-lg text-xs font-semibold">
                <div className="w-3.5 h-3.5 rounded-full bg-violet-400 flex items-center justify-center text-[7px] font-bold text-white">{a.name[0]}</div>
                {a.name}
                <button type="button" onClick={() => removeArtist(a.id)} className="hover:text-violet-900 ml-0.5"><X size={9} /></button>
              </span>
            ))}
          </div>
        )}
        <input value={searchVal}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setShowDrop(true)}
          onBlur={() => setTimeout(() => setShowDrop(false), 150)}
          className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
          placeholder="Артист хайх..." />
        {showDrop && searchVal.length > 0 && (
          <div className="absolute z-30 left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-zinc-100 overflow-hidden">
            {suggestions.map(a => (
              <button key={a.id} type="button" onMouseDown={() => addArtist(a)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-violet-50/60 transition-colors text-left">
                <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-xs font-bold flex-shrink-0">{initials(a.name)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-zinc-900">{a.name}</p>
                  <p className="text-xs text-zinc-400 font-mono">{a.id}</p>
                </div>
                <Plus size={12} className="text-zinc-400" />
              </button>
            ))}
            <button type="button" onMouseDown={() => addArtist({ id: `NEW-${Date.now()}`, name: searchVal, tags: "" })}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-green-50 transition-colors text-left border-t border-zinc-100">
              <div className="w-7 h-7 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0"><Plus size={13} className="text-green-600" /></div>
              <p className="font-semibold text-sm text-green-700">"{searchVal}" — Шинэ артист</p>
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Inline contributor add form ──
  function ContribAddForm({ label, onSave, onCancel }: {
    label: string; onSave: (name: string, affil: string) => void; onCancel: () => void;
  }) {
    const [name, setName] = useState("");
    const [affil, setAffil] = useState("");
    return (
      <div className="mt-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
        <p className="text-xs font-semibold text-zinc-600">{label}</p>
        <div className="grid grid-cols-2 gap-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Бүтэн нэр *"
            className="px-3 py-2 text-sm rounded-lg border border-zinc-200 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" />
          <input value={affil} onChange={e => setAffil(e.target.value)} placeholder="Байгууллага (ASCAP, BMI...)"
            className="px-3 py-2 text-sm rounded-lg border border-zinc-200 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" />
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onCancel}
            className="text-xs text-zinc-500 hover:text-zinc-700 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors">Болих</button>
          <button type="button" disabled={!name.trim()} onClick={() => { if (name.trim()) onSave(name.trim(), affil.trim()); }}
            className="text-xs font-semibold bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary/90 disabled:opacity-40 transition-colors">Нэмэх</button>
        </div>
      </div>
    );
  }

  function OtherContribAddForm({ onSave, onCancel }: { onSave: (name: string, role: string) => void; onCancel: () => void }) {
    const [name, setName] = useState("");
    const [role, setRole] = useState("producer");
    return (
      <div className="mt-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
        <p className="text-xs font-semibold text-zinc-600">Contributor нэмэх</p>
        <div className="grid grid-cols-2 gap-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Нэр *"
            className="px-3 py-2 text-sm rounded-lg border border-zinc-200 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" />
          <select value={role} onChange={e => setRole(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white outline-none focus:border-violet-500">
            {OTHER_ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onCancel}
            className="text-xs text-zinc-500 hover:text-zinc-700 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors">Болих</button>
          <button type="button" disabled={!name.trim()} onClick={() => { if (name.trim()) onSave(name.trim(), role); }}
            className="text-xs font-semibold bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary/90 disabled:opacity-40 transition-colors">Нэмэх</button>
        </div>
      </div>
    );
  }

  // ── Contributor list row ──
  function ContribRow({ name, sub, color, onRemove }: { name: string; sub?: string; color: string; onRemove: () => void }) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-2 bg-white rounded-xl border border-zinc-200">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${color}`}>{initials(name)}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-800">{name}</p>
          {sub && <p className="text-xs text-zinc-400">{sub}</p>}
        </div>
        <button type="button" onClick={onRemove}
          className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"><X size={12} /></button>
      </div>
    );
  }

  // ── Inline add trigger button ──
  function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
    return (
      <button type="button" onClick={onClick}
        className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-semibold py-1.5 transition-colors">
        <Plus size={14} />{label}
      </button>
    );
  }

  // ── Track body ──
  function renderTrackBody(track: TrackData, _idx: number) {
    const sec = "px-5 py-5 border-b border-zinc-100 last:border-b-0";
    const lyricistsDisabled = track.hasLyrics !== true;

    return (
      <div className="border-t border-zinc-100 divide-y divide-zinc-100">

        {/* 1. Audio file */}
        <div className={sec}>
          <p className="text-xs font-bold uppercase text-zinc-400 mb-3 flex items-center gap-1.5">
            <Activity size={11} />Аудио файл
          </p>
          {track.uploading ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="font-medium truncate">{track.audioName}</span>
                <span className="flex-shrink-0 ml-2">{track.uploadProgress}%</span>
              </div>
              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-200" style={{ width: `${track.uploadProgress}%` }} />
              </div>
            </div>
          ) : track.hasAudio ? (
            <div>
              <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Music2 size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-800 truncate">{track.audioName}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{track.fileFormat} · {track.sampleRate} · {track.bitDepth} · {track.duration}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button type="button" title="Дахин хуулах" onClick={() => uploadRefs.current[track.id]?.click()}
                    className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors">
                    <RefreshCw size={13} />
                  </button>
                  <button type="button" title="Устгах"
                    onClick={() => updateTrack(track.id, { hasAudio: false, audioName: "", duration: "", fileFormat: "", sampleRate: "", bitDepth: "" })}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="flex items-end gap-0.5 h-8 mt-2 px-1 opacity-40">
                {Array.from({ length: 60 }, (_, i) => {
                  const h = [8,14,20,11,24,17,10,22,28,16,12,25,18,9,21,27,14,19,8,24,13,29,17,11,22,15,26,10,20,14][i % 30];
                  return <div key={i} className="flex-1 rounded-full bg-primary" style={{ height: `${h}px` }} />;
                })}
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-zinc-200 rounded-xl p-6 flex flex-col items-center gap-3 hover:border-violet-300 hover:bg-violet-50/20 transition-all cursor-pointer"
              onClick={() => uploadRefs.current[track.id]?.click()}>
              <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                <UploadCloud size={20} className="text-zinc-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-zinc-700">Аудио файл оруулаагүй</p>
                <p className="text-xs text-zinc-400 mt-0.5">Зурвас дээр дарж эсвэл чирж тавих</p>
                <p className="text-xs text-zinc-300 mt-1.5">WAV · FLAC · Max 500 MB</p>
              </div>
              <button type="button"
                className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                onClick={e => { e.stopPropagation(); uploadRefs.current[track.id]?.click(); }}>
                <UploadCloud size={13} className="inline mr-1.5" />Файл хуулах
              </button>
            </div>
          )}
          <input ref={el => { uploadRefs.current[track.id] = el; }} type="file" accept="audio/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) simulateUpload(track.id, f.name); e.target.value = ""; }} />
        </div>

        {/* 2. Track metadata — album mode only. Single inherits from Stage 1, don't repeat. */}
        {!isSingle && (
          <div className={sec}>
            <p className="text-xs font-bold uppercase text-zinc-400 mb-4 flex items-center gap-1.5">
              <Music2 size={11} />Дууны үндсэн мэдээлэл
            </p>

            {/* Title with attached language toggle */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-zinc-700 block mb-1.5">Дууны нэр <span className="text-red-500">*</span></label>
              <div className="flex items-stretch rounded-xl border border-zinc-200 overflow-hidden focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-500">
                <input
                  value={track.titleLang === "mn" ? track.titleMn : track.titleEn}
                  onChange={e => updateTrack(track.id, track.titleLang === "mn" ? { titleMn: e.target.value } : { titleEn: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 text-sm outline-none bg-transparent min-w-0"
                  placeholder={track.titleLang === "mn" ? "Монгол нэр" : "English / Latin title"} />
                <div className="flex items-stretch border-l border-zinc-200 flex-shrink-0">
                  <button type="button" onClick={() => updateTrack(track.id, { titleLang: "mn" })}
                    className={`px-3 text-xs font-semibold transition-colors ${track.titleLang === "mn" ? "bg-primary text-white" : "text-zinc-500 hover:bg-zinc-50"}`}>MN</button>
                  <button type="button" onClick={() => updateTrack(track.id, { titleLang: "en" })}
                    className={`px-3 text-xs font-semibold transition-colors border-l border-zinc-200 ${track.titleLang === "en" ? "bg-primary text-white" : "text-zinc-500 hover:bg-zinc-50"}`}>EN</button>
                </div>
              </div>
              <div className="flex gap-3 mt-1.5">
                <span className={`text-xs flex items-center gap-1 ${track.titleMn ? "text-green-600" : "text-zinc-400"}`}>
                  {track.titleMn ? <Check size={9} /> : "○"} Монгол
                </span>
                <span className={`text-xs flex items-center gap-1 ${track.titleEn ? "text-green-600" : "text-zinc-400"}`}>
                  {track.titleEn ? <Check size={9} /> : "○"} English / Latin
                </span>
              </div>
            </div>

            {/* Artists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-zinc-600 block mb-1.5">Үндсэн артист <span className="text-red-500">*</span></label>
                <TrackArtistPicker track={track} field="primary" />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-600 block mb-1.5">Хамтарсан артист</label>
                <TrackArtistPicker track={track} field="featured" />
              </div>
            </div>

            {/* Genre */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-600 block mb-1.5">Үндсэн жанр <span className="text-red-500">*</span></label>
                <select value={track.trackGenre} onChange={e => updateTrack(track.id, { trackGenre: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 bg-white outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500">
                  <option value="">Жанр сонгох</option>
                  {GENRES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-600 block mb-1.5">Secondary genre</label>
                <select value={track.trackSecondaryGenre} onChange={e => updateTrack(track.id, { trackSecondaryGenre: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 bg-white outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500">
                  <option value="">Нэмэлт жанр</option>
                  {GENRES.filter(g => g !== track.trackGenre).map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 3. ISRC */}
        <div className={sec}>
          <p className="text-xs font-bold uppercase text-zinc-400 mb-3 flex items-center gap-1.5">
            <Fingerprint size={11} />ISRC
          </p>
          <p className="text-sm font-semibold text-zinc-700 mb-2">Энэ бичлэг өмнө нь гарч байсан уу? <span className="text-red-500">*</span></p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {([
              { id: "generate" as const, label: "Үгүй", sub: "ISRC автоматаар үүснэ" },
              { id: "existing" as const, label: "Тийм", sub: "Өмнөх ISRC код оруулна" },
            ]).map(opt => (
              <label key={opt.id} className={`flex items-start gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${track.isrcMode === opt.id ? "border-primary bg-violet-50/50" : "border-zinc-200 hover:border-zinc-300"}`}>
                <input type="radio" name={`isrc-${track.id}`} checked={track.isrcMode === opt.id}
                  onChange={() => updateTrack(track.id, { isrcMode: opt.id, isrc: "" })}
                  className="mt-0.5 accent-[var(--primary)] flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-zinc-800">{opt.label}</p>
                  <p className="text-xs text-zinc-500">{opt.sub}</p>
                </div>
              </label>
            ))}
          </div>
          {track.isrcMode === "generate" ? (
            <div className="flex items-center gap-2.5 p-3 bg-violet-50 rounded-xl border border-violet-200">
              <Sparkles size={14} className="text-violet-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-violet-700">ISRC автоматаар үүснэ</p>
                <p className="text-xs text-violet-500">Илгээхийн өмнө энэ бичлэгт ISRC код онооно.</p>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-sm font-semibold text-zinc-700 block mb-1.5">Өмнөх ISRC код <span className="text-red-500">*</span></label>
              <input value={track.isrc} onChange={e => updateTrack(track.id, { isrc: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 font-mono outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                placeholder="CC-XXX-YY-NNNNN" />
            </div>
          )}
        </div>

        {/* 4. Lyrics & content */}
        <div className={sec}>
          <p className="text-xs font-bold uppercase text-zinc-400 mb-3 flex items-center gap-1.5">
            <Mic2 size={11} />Дууны үг & контент
          </p>
          <p className="text-sm font-semibold text-zinc-700 mb-2">Энэ дуу үгтэй юу? <span className="text-red-500">*</span></p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {([
              { val: true,  label: "Үгтэй" },
              { val: false, label: "Үггүй / Instrumental" },
            ]).map(opt => (
              <label key={String(opt.val)} className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${track.hasLyrics === opt.val ? "border-primary bg-violet-50/50" : "border-zinc-200 hover:border-zinc-300"}`}>
                <input type="radio" name={`lyrics-${track.id}`} checked={track.hasLyrics === opt.val}
                  onChange={() => updateTrack(track.id, {
                    hasLyrics: opt.val,
                    ...(opt.val === false ? { explicitStatus: "not_explicit", vocalLanguage: "", lyrics: "", lyricists: [], showAddLyricist: false } : {}),
                  })}
                  className="accent-[var(--primary)]" />
                <p className="text-sm font-semibold text-zinc-800">{opt.label}</p>
              </label>
            ))}
          </div>

          {track.hasLyrics === true && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-zinc-700 mb-2">Explicit контент <span className="text-red-500">*</span></p>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { id: "not_explicit" as const, label: "Not explicit" },
                    { id: "explicit"     as const, label: "Explicit" },
                  ]).map(opt => (
                    <label key={opt.id} className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${track.explicitStatus === opt.id ? "border-primary bg-violet-50/50" : "border-zinc-200 hover:border-zinc-300"}`}>
                      <input type="radio" name={`explicit-${track.id}`} checked={track.explicitStatus === opt.id}
                        onChange={() => updateTrack(track.id, { explicitStatus: opt.id })}
                        className="accent-[var(--primary)]" />
                      <div className="flex items-center gap-2">
                        {opt.id === "explicit" && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">E</span>}
                        <p className="text-sm font-semibold text-zinc-800">{opt.label}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700 block mb-1.5">Дуулагдаж буй үндсэн хэл <span className="text-red-500">*</span></label>
                <select value={track.vocalLanguage} onChange={e => updateTrack(track.id, { vocalLanguage: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 bg-white outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500">
                  <option value="">Хэл сонгох</option>
                  {VOCAL_LANGS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700 block mb-1.5">Дууны үг</label>
                <textarea value={track.lyrics} onChange={e => updateTrack(track.id, { lyrics: e.target.value })}
                  rows={5}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none"
                  placeholder="Дууны үгийг мөр мөрөөр нь бүтнээр оруулна..." />
                <p className="text-xs text-zinc-400 mt-1 text-right">{track.lyrics.length} тэмдэгт</p>
              </div>
            </div>
          )}
        </div>

        {/* 5. Contributors */}
        <div className={sec}>
          <p className="text-xs font-bold uppercase text-zinc-400 mb-4 flex items-center gap-1.5">
            <Users size={11} />Оролцогчид
          </p>

          {/* Үндсэн оролцогчид */}
          <p className="text-xs font-bold uppercase text-zinc-300 mb-3">Үндсэн оролцогчид</p>

          {/* Aya zoiogch — multiple */}
          <div className="mb-4">
            <SectionLabel title="Ая зохиогч" sub="Хууль ёсны бүтэн нэр" required />
            {track.composers.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {track.composers.map(c => (
                  <ContribRow key={c.id} name={c.name} sub={c.affiliation || undefined} color="bg-violet-100 text-violet-700"
                    onRemove={() => updateTrack(track.id, { composers: track.composers.filter(x => x.id !== c.id) })} />
                ))}
              </div>
            )}
            {track.composers.length === 0 && !track.showAddComposer && (
              <p className="text-xs text-zinc-400 italic mb-1">Ая зохиогч нэмээгүй байна</p>
            )}
            {track.showAddComposer ? (
              <ContribAddForm label="Ая зохиогч нэмэх"
                onSave={(name, affil) => {
                  const c: ContribRef = { id: `C-${Date.now()}`, name, affiliation: affil };
                  updateTrack(track.id, { composers: [...track.composers, c], showAddComposer: false });
                }}
                onCancel={() => updateTrack(track.id, { showAddComposer: false })} />
            ) : (
              <AddBtn label="Ая зохиогч нэмэх" onClick={() => updateTrack(track.id, { showAddComposer: true })} />
            )}
          </div>

          {/* Ug zoiogch — multiple, disabled when Уггүй */}
          <div className="mb-5">
            <SectionLabel
              title="Үг зохиогч"
              sub={lyricistsDisabled ? "Үггүй дуу дээр үг зохиогч нэмэх боломжгүй" : "Хууль ёсны бүтэн нэр"}
            />
            {lyricistsDisabled ? (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                <Lock size={11} className="text-zinc-300 flex-shrink-0" />
                <span className="text-xs text-zinc-400">"Үгтэй" гэж сонгосон үед л нэмэх боломжтой</span>
              </div>
            ) : (
              <>
                {track.lyricists.length > 0 && (
                  <div className="space-y-1.5 mb-2">
                    {track.lyricists.map(c => (
                      <ContribRow key={c.id} name={c.name} sub={c.affiliation || undefined} color="bg-blue-100 text-blue-700"
                        onRemove={() => updateTrack(track.id, { lyricists: track.lyricists.filter(x => x.id !== c.id) })} />
                    ))}
                  </div>
                )}
                {track.lyricists.length === 0 && !track.showAddLyricist && (
                  <p className="text-xs text-zinc-400 italic mb-1">Үг зохиогч нэмээгүй байна</p>
                )}
                {track.showAddLyricist ? (
                  <ContribAddForm label="Үг зохиогч нэмэх"
                    onSave={(name, affil) => {
                      const c: ContribRef = { id: `L-${Date.now()}`, name, affiliation: affil };
                      updateTrack(track.id, { lyricists: [...track.lyricists, c], showAddLyricist: false });
                    }}
                    onCancel={() => updateTrack(track.id, { showAddLyricist: false })} />
                ) : (
                  <AddBtn label="Үг зохиогч нэмэх" onClick={() => updateTrack(track.id, { showAddLyricist: true })} />
                )}
              </>
            )}
          </div>

          {/* Бусад contributor */}
          <div className="pt-4 border-t border-zinc-100">
            <p className="text-xs font-bold uppercase text-zinc-300 mb-3">Бусад оролцогчид</p>
            <SectionLabel title="Бусад contributor" sub="Producer, Mixing, Mastering, Recording" />
            {track.otherContribs.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {track.otherContribs.map((c, ci) => (
                  <div key={`${c.id}-${ci}`} className="flex items-center gap-2.5 px-3 py-2 bg-white rounded-xl border border-zinc-200">
                    <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-semibold flex-shrink-0">
                      {OTHER_ROLES.find(r => r.id === c.role)?.label || c.role}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 text-xs font-bold flex-shrink-0">{initials(c.name)}</div>
                    <span className="text-sm font-semibold text-zinc-800 flex-1 min-w-0 truncate">{c.name}</span>
                    <button type="button" onClick={() => updateTrack(track.id, { otherContribs: track.otherContribs.filter((_, i) => i !== ci) })}
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
            {track.otherContribs.length === 0 && !track.showAddOther && (
              <p className="text-xs text-zinc-400 italic mb-1">Producer, Engineer нэмээгүй байна</p>
            )}
            {track.showAddOther ? (
              <OtherContribAddForm
                onSave={(name, role) => {
                  const c: OtherContribRef = { id: `O-${Date.now()}`, name, role };
                  updateTrack(track.id, { otherContribs: [...track.otherContribs, c], showAddOther: false });
                }}
                onCancel={() => updateTrack(track.id, { showAddOther: false })} />
            ) : (
              <AddBtn label="Contributor нэмэх" onClick={() => updateTrack(track.id, { showAddOther: true })} />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Completeness ──
  const trackDone = (t: TrackData) => {
    const hasTitle = isSingle || t.titleMn.trim().length > 0;
    const hasArtist = isSingle || t.trackPrimary.length > 0;
    const hasGenre = isSingle || !!t.trackGenre;
    return t.hasAudio && hasTitle && hasArtist && hasGenre && t.hasLyrics !== null && t.composers.length > 0;
  };

  const totalDuration = () => {
    const total = tracks.reduce((s, t) => {
      if (!t.duration) return s;
      const [m, sec] = t.duration.split(":").map(Number);
      return s + m * 60 + (sec || 0);
    }, 0);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return total > 0 ? `${m}:${String(s).padStart(2, "0")}` : "—";
  };

  return (
    <Shell title="Шинэ Хөгжим Нэмэх">
      <div className="max-w-5xl">
        <div className="mb-5"><Stepper steps={RELEASE_STEPS} current={1} /></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold bg-violet-100 text-violet-700 px-2.5 py-0.5 rounded-full">
                  {isSingle ? "Дуу" : tracks.length <= 6 ? "EP" : "Цомог"} · {tracks.length} дуу{!isSingle && ` · ${totalDuration()}`}
                </span>
                {/* Mode toggle (reflects Stage 1 selection) */}
                <div className="flex rounded-lg border border-zinc-200 overflow-hidden text-xs font-semibold">
                  <button type="button" onClick={() => setIsSingle(true)}
                    className={`px-2.5 py-1 transition-colors ${isSingle ? "bg-primary text-white" : "text-zinc-500 hover:bg-zinc-50"}`}>Дуу</button>
                  <button type="button" onClick={() => { setIsSingle(false); if (tracks.length < 2) addTrack(); }}
                    className={`px-2.5 py-1 transition-colors border-l border-zinc-200 ${!isSingle ? "bg-primary text-white" : "text-zinc-500 hover:bg-zinc-50"}`}>Цомог</button>
                </div>
              </div>
              {!isSingle && (
                <button type="button" onClick={addTrack}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                  <Plus size={14} />Дуу нэмэх
                </button>
              )}
            </div>

            {!isSingle && (
              <p className="text-xs text-zinc-400 mb-3">Дуунуудыг нэгийг нэгийн дараа нээгээд бөглөнө.</p>
            )}

            {/* Track list */}
            <div className="space-y-2">
              {tracks.map((track, idx) => {
                const isOpen = expandedTrack === idx;
                const displayTitle = isSingle
                  ? "Дуу"
                  : (track.titleMn || track.titleEn || `Дуу #${idx + 1}`);
                const artistText = isSingle
                  ? RELEASE_PRIMARY.map(a => a.name).join(", ")
                  : (track.trackPrimary.map(a => a.name).join(", ") || "Артист сонгоогүй");
                const done = trackDone(track);

                return (
                  <Card key={track.id} className="overflow-hidden">
                    <div
                      className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-zinc-50/50 transition-colors ${isOpen ? "border-b border-zinc-100" : ""}`}
                      onClick={() => setExpandedTrack(isOpen ? null : idx)}>
                      {!isSingle && (
                        <div className="cursor-grab p-1 text-zinc-300 hover:text-zinc-400 flex-shrink-0" onClick={e => e.stopPropagation()}>
                          <GripVertical size={14} />
                        </div>
                      )}
                      <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500 flex-shrink-0">{idx + 1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-zinc-900 truncate">{displayTitle}</p>
                        <p className="text-xs text-zinc-400 truncate">{artistText}{track.duration ? ` · ${track.duration}` : ""}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {track.isrcMode === "existing" && track.isrc && (
                          <span className="text-xs font-mono bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded">{track.isrc.replace(/-/g, "")}</span>
                        )}
                        {track.isrcMode === "generate" && track.hasAudio && (
                          <span className="text-xs bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded font-semibold">ISRC↗</span>
                        )}
                        {track.hasLyrics === true && <span className="text-xs bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded">Үгтэй</span>}
                        {track.hasLyrics === false && <span className="text-xs bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded">Үггүй</span>}
                        {track.explicitStatus === "explicit" && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">E</span>}
                        {track.hasAudio && <div className="w-2 h-2 rounded-full bg-green-500" title="Аудио бэлэн" />}
                        {done && <div className="w-2 h-2 rounded-full bg-primary" title="Бэлэн" />}
                      </div>
                      {!isSingle && tracks.length > 1 && (
                        <button type="button" onClick={e => { e.stopPropagation(); removeTrack(track.id); }}
                          className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                          <Trash2 size={12} />
                        </button>
                      )}
                      <ChevronDown size={14} className={`text-zinc-400 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                    {isOpen && renderTrackBody(track, idx)}
                  </Card>
                );
              })}
            </div>

            {!isSingle && (
              <button type="button" onClick={addTrack}
                className="w-full mt-2 py-3.5 rounded-xl border-2 border-dashed border-zinc-200 hover:border-violet-400 hover:bg-violet-50/20 transition-all flex items-center justify-center gap-2 text-sm font-semibold text-zinc-400 hover:text-violet-600">
                <Plus size={16} />Дуу нэмэх
              </button>
            )}

            <div className="flex justify-between pt-4">
              <Btn variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate("/submit/release-info")}>Буцах</Btn>
              <div className="flex gap-2">
                <Btn variant="secondary">Ноорог Хадгалах</Btn>
                <Btn onClick={() => navigate("/submit/cover-art")}>Дараагийн <ChevronRight size={16} /></Btn>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-3">
              <Card className="p-4">
                <p className="text-xs font-bold uppercase text-zinc-400 mb-3">Шалгах Жагсаалт</p>
                <div className="space-y-1.5">
                  {tracks.map((t, i) => {
                    const items = [
                      { label: isSingle ? "Аудио файл"  : `Дуу ${i+1} — аудио`,   ok: t.hasAudio },
                      { label: isSingle ? "ISRC"         : `Дуу ${i+1} — ISRC`,    ok: t.isrcMode === "generate" || !!t.isrc },
                      { label: isSingle ? "Үг/үггүй"    : `Дуу ${i+1} — үг`,      ok: t.hasLyrics !== null },
                      { label: isSingle ? "Ая зохиогч"  : `Дуу ${i+1} — зохиогч`, ok: t.composers.length > 0 },
                    ];
                    return items.map((item, j) => (
                      <div key={`${i}-${j}`} className={`flex items-center gap-2 py-1 px-2 rounded-lg ${item.ok ? "text-green-600" : "text-zinc-400"}`}>
                        {item.ok
                          ? <div className="w-3 h-3 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /></div>
                          : <div className="w-3 h-3 rounded-full border-2 border-zinc-300 flex-shrink-0" />}
                        <span className="text-xs">{item.label}</span>
                      </div>
                    ));
                  })}
                </div>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-bold uppercase text-zinc-400 mb-3">Аудио Шаардлага</p>
                <div className="space-y-1.5 text-xs text-zinc-500">
                  <p>• WAV эсвэл FLAC формат</p>
                  <p>• 44.1 kHz эсвэл 48 kHz</p>
                  <p>• 16-bit эсвэл 24-bit</p>
                  <p>• Хамгийн ихдээ 500 MB</p>
                  <p>• Чимээгүй эхлэл/төгсгөлгүй байх</p>
                </div>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-bold uppercase text-zinc-400 mb-2">Credits</p>
                <div className="space-y-1.5 text-xs text-zinc-500">
                  <p>• Ая зохиогч заавал шаардлагатай</p>
                  <p>• Хэд хэдэн зохиогч нэмж болно</p>
                  <p>• Үгтэй дуунд үг зохиогч бүртгэнэ</p>
                  <p>• Producer хууль нэр биш ч болно</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
