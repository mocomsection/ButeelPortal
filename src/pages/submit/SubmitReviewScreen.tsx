import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Music2, Check, ArrowLeft, Disc3, RefreshCw, Image, Info, ListMusic, RadioTower, ClipboardCheck, Send, ChevronDown, Shield } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { Stepper } from "@/components/ui/Stepper";
import { RELEASE_STEPS } from "@/data/content";

function ReviewPanel({ icon: Icon, title, onEdit, children }: {
  icon: React.ElementType; title: string; onEdit?: () => void; children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-zinc-200 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50/70 border-b border-zinc-200">
        <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
          <Icon size={13} className="text-violet-600" />
        </div>
        <p className="font-bold text-sm text-zinc-800 flex-1">{title}</p>
        {onEdit && (
          <button type="button" onClick={onEdit} className="text-xs font-semibold text-primary hover:text-primary/80">Засах</button>
        )}
      </div>
      <div className="px-4 py-4">{children}</div>
    </section>
  );
}

function DataGrid({ items }: { items: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      {items.map(([k, v], i) => (
        <div key={i} className="flex flex-col gap-0.5">
          <span className="text-xs text-zinc-400 uppercase font-semibold">{k}</span>
          <span className="text-sm font-semibold text-zinc-800">{v || "—"}</span>
        </div>
      ))}
    </div>
  );
}

export default function SubmitReviewScreen() {
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedTrack, setExpandedTrack] = useState<number | null>(0);

  const handleSubmit = () => {
    if (!confirmed) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); navigate("/submit/success"); }, 1400);
  };

  const mockTracks = [
    { title: "Минь Сэтгэл", titleEn: "Minh Setgel", artists: "Болд", duration: "3:42", isrc: "Автоматаар үүснэ", hasLyrics: true, explicit: false, vocalLang: "Монгол", audio: "track_01.wav", composers: "Болд Жаргал" },
    { title: "Зүрхний Дуу", titleEn: "Zürhiin Duu",  artists: "Болд",  duration: "4:05", isrc: "Автоматаар үүснэ", hasLyrics: true, explicit: false, vocalLang: "Монгол", audio: "track_02.wav", composers: "Болд Жаргал" },
  ];
  const selectedServices = ["Sonsy Music", "M Music", "Spotify", "Apple Music", "YouTube Music", "Deezer", "Egshig", "Hitone", "Unimusic", "SkyMelody", "GTone"];

  return (
    <Shell title="Шинэ Хөгжим Нэмэх">
      <div className="max-w-5xl">
        <div className="mb-5"><Stepper steps={RELEASE_STEPS} current={4} /></div>

        {/* Hero */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-zinc-900">Шалгах & Илгээх</h2>
            <p className="text-sm text-zinc-500 mt-0.5">Илгээхийн өмнө бүх мэдээллээ нэг удаа шалгана уу.</p>
          </div>
          <span className="flex items-center gap-2 px-3 py-2 bg-zinc-100 rounded-xl text-xs font-semibold text-zinc-600">
            <ClipboardCheck size={13} />Илгээхэд бэлэн эсэхийг шалгах
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left column */}
          <div className="space-y-4">
            {/* Release info */}
            <ReviewPanel icon={Info} title="Үндсэн мэдээлэл" onEdit={() => navigate("/submit/release-info")}>
              <DataGrid items={[
                ["Төрөл", "EP"],
                ["Монгол нэр", "Минь Сэтгэл"],
                ["English / Latin", "Minh Setgel"],
                ["Үндсэн артист", "Болд"],
                ["Жанр", "Pop"],
                ["Label", "Steppe Records"],
                ["UPC", "Автоматаар үүснэ"],
                ["© Эзэмшигч", "Болд Жаргал"],
              ]} />
            </ReviewPanel>

            {/* Tracks */}
            <ReviewPanel icon={ListMusic} title={`Дууны мэдээлэл (${mockTracks.length} дуу)`} onEdit={() => navigate("/submit/tracks")}>
              <div className="space-y-1.5">
                {mockTracks.map((t, i) => {
                  const isOpen = expandedTrack === i;
                  return (
                    <div key={i} className="rounded-xl border border-zinc-200 overflow-hidden">
                      <button type="button" onClick={() => setExpandedTrack(isOpen ? null : i)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50/50 transition-colors text-left">
                        <span className="w-6 h-6 rounded-lg bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500 flex-shrink-0">{i+1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-zinc-800 truncate">{t.title}</p>
                          <p className="text-xs text-zinc-400">{t.artists} · {t.duration}</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="text-xs bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded font-semibold">ISRC↗</span>
                          {t.explicit && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">E</span>}
                        </div>
                        <ChevronDown size={13} className={`text-zinc-400 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isOpen && (
                        <div className="px-3 pb-3 bg-zinc-50/40 border-t border-zinc-100">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-2.5">
                            {[
                              ["ISRC", t.isrc], ["Аудио", t.audio],
                              ["Үг", t.hasLyrics ? "Үгтэй" : "Үггүй"], ["Хэл", t.vocalLang],
                              ["Ая зохиогч", t.composers], ["Explicit", t.explicit ? "Explicit" : "Not explicit"],
                            ].map(([k, v], j) => (
                              <div key={j}>
                                <p className="text-xs text-zinc-400 uppercase font-semibold">{k}</p>
                                <p className="text-xs font-semibold text-zinc-700">{String(v) || "—"}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ReviewPanel>

            {/* Distribution */}
            <ReviewPanel icon={RadioTower} title="Нийтлэх & Түгээх" onEdit={() => navigate("/submit/settings")}>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-zinc-400 uppercase font-semibold">Нийтлэх хугацаа</span>
                  <span className="text-sm font-semibold text-zinc-800">Аль болох хурдан (2–3 өдөр)</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-zinc-400 uppercase font-semibold">Сувгийн тоо</span>
                  <span className="text-sm font-semibold text-zinc-800">{selectedServices.length}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedServices.map(s => (
                    <span key={s} className="text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            </ReviewPanel>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Cover art */}
            <ReviewPanel icon={Image} title="Ковер зураг" onEdit={() => navigate("/submit/cover-art")}>
              <div className="aspect-square rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-3">
                <Music2 size={40} className="text-white/40" />
              </div>
              <DataGrid items={[
                ["Файл", "cover.jpg"],
                ["Хэмжээс", "3000 × 3000 px"],
                ["Формат", "JPG"],
                ["Хэмжээ", "4.2 MB"],
              ]} />
            </ReviewPanel>

            {/* Copyright summary */}
            <ReviewPanel icon={Shield} title="Зохиогчийн Эрх" onEdit={() => navigate("/submit/release-info")}>
              <DataGrid items={[
                ["© Эзэмшигч", "Болд Жаргал"],
                ["© Он", "2026"],
                ["℗ Эзэмшигч", "Steppe Records"],
                ["℗ Он", "2026"],
              ]} />
            </ReviewPanel>

            {/* Confirm & submit */}
            <div className={`rounded-xl border-2 p-4 transition-all cursor-pointer ${confirmed ? "border-primary bg-violet-50/50" : "border-zinc-200 hover:border-zinc-300"}`}
              onClick={() => setConfirmed(v => !v)}>
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 mt-0.5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${confirmed ? "bg-primary border-primary" : "border-zinc-300 bg-white"}`}>
                  {confirmed && <Check size={13} className="text-white" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-800">Мэдээллээ шалгасан</p>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">Оруулсан бүх мэдээлэл зөв болохыг, шаардлагатай бүх эрхийг эзэмшиж байгаагаа баталгаажуулна уу.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Btn full disabled={!confirmed || submitting} onClick={handleSubmit}>
                {submitting
                  ? <><RefreshCw size={14} className="animate-spin" />Илгээж байна...</>
                  : <><Send size={14} />Илгээх</>}
              </Btn>
              <div className="flex gap-2">
                <Btn variant="secondary" icon={<ArrowLeft size={14} />} onClick={() => navigate("/submit/settings")}>Буцах</Btn>
                <Btn variant="secondary">Ноорог Хадгалах</Btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

