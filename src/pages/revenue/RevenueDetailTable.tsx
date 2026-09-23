import { useState } from "react";
import { Search, Check, BarChart2, Disc3, Music2, BookOpen, Film, Tag, User, Calendar, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { TRACK_ROWS, ALBUM_ROWS, SERVICE_ROWS, LABEL_ROWS, ARTIST_ROWS } from "@/data/revenue";
import { PAGE_SIZE, fmtMoney, thCls, thRCls, tdCls, tdRCls, tdBoldR } from "./revenueUtils";

function computeDateRange(period: string, customStart: string, customEnd: string): string {
  const today = new Date();
  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const t = fmt(today);
  if (period === "1m") { const d = new Date(today); d.setMonth(d.getMonth()-1); return `${fmt(d)} – ${t}`; }
  if (period === "3m") { const d = new Date(today); d.setMonth(d.getMonth()-3); return `${fmt(d)} – ${t}`; }
  if (period === "1y") { const d = new Date(today); d.setFullYear(d.getFullYear()-1); return `${fmt(d)} – ${t}`; }
  return `${customStart} – ${customEnd}`;
}

interface RevenueDetailTableProps {
  revenueContentType: "music" | "audiobook" | "film";
  detailPeriod: "1m" | "3m" | "1y" | "custom";
  setDetailPeriod: (v: "1m" | "3m" | "1y" | "custom") => void;
  customStart: string;
  setCustomStart: (v: string) => void;
  customEnd: string;
  setCustomEnd: (v: string) => void;
  grouping: "track" | "album" | "service" | "label" | "artist";
  setGrouping: (v: "track" | "album" | "service" | "label" | "artist") => void;
  searchQ: string;
  setSearchQ: (v: string) => void;
  detailPage: number;
  setDetailPage: (v: number | ((prev: number) => number)) => void;
  onSongClick: (t: typeof TRACK_ROWS[0]) => void;
  onAlbumClick: (a: typeof ALBUM_ROWS[0]) => void;
}

export function RevenueDetailTable({
  revenueContentType,
  detailPeriod, setDetailPeriod,
  customStart, setCustomStart,
  customEnd, setCustomEnd,
  grouping, setGrouping,
  searchQ, setSearchQ,
  detailPage, setDetailPage,
  onSongClick, onAlbumClick,
}: RevenueDetailTableProps) {
  const [showPeriodDrop, setShowPeriodDrop] = useState(false);

  const PERIOD_LABEL: Record<string, string> = {
    "1m": "Сүүлийн 1 сар", "3m": "Сүүлийн 3 сар",
    "1y": "Сүүлийн 1 жил", "custom": `${customStart} – ${customEnd}`,
  };

  const SEARCH_PH: Record<string, string> = {
    track:"Дуу хайх...", album:"Цомог хайх...", service:"Үйлчилгээ хайх...", label:"Лейбл хайх...", artist:"Артист хайх..."
  };

  const trackFiltered = TRACK_ROWS.filter(t => !searchQ || t.title.toLowerCase().includes(searchQ.toLowerCase()) || t.artist.toLowerCase().includes(searchQ.toLowerCase()));
  const albumFiltered = ALBUM_ROWS.filter(a => !searchQ || a.title.toLowerCase().includes(searchQ.toLowerCase()));
  const serviceFiltered = SERVICE_ROWS.filter(s => !searchQ || s.name.toLowerCase().includes(searchQ.toLowerCase()));
  const labelFiltered = LABEL_ROWS.filter(l => !searchQ || l.label.toLowerCase().includes(searchQ.toLowerCase()));
  const artistFiltered = ARTIST_ROWS.filter(a => !searchQ || a.artist.toLowerCase().includes(searchQ.toLowerCase()));

  const totalPages = grouping === "track" ? Math.ceil(trackFiltered.length / PAGE_SIZE) : 1;
  const pagedTracks = trackFiltered.slice((detailPage-1)*PAGE_SIZE, detailPage*PAGE_SIZE);

  return (
    <Card className="overflow-hidden">
      {/* Row 1: Title + period selector */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart2 size={14} className="text-primary" />
              <h3 className="font-bold text-zinc-900 text-sm">Орлогын дэлгэрэнгүй</h3>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">Сонгосон хугацааны орлогын задаргаа</p>
          </div>
          {/* Period selector — prominent, right-aligned */}
          <div className="relative flex-shrink-0">
            <button type="button" onClick={() => setShowPeriodDrop(v => !v)}
              className={`flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-bold transition-colors border ${showPeriodDrop ? "border-primary bg-violet-50 text-primary" : "border-primary/30 bg-violet-50/70 text-primary hover:bg-violet-100"}`}>
              <Calendar size={13} />
              <span>{PERIOD_LABEL[detailPeriod]}</span>
              <ChevronDown size={13} className={`transition-transform ${showPeriodDrop ? "rotate-180" : ""}`} />
            </button>
            <p className="text-xs text-zinc-400 text-right mt-1 font-medium">
              {computeDateRange(detailPeriod, customStart, customEnd)}
            </p>
            {showPeriodDrop && (
              <div className="absolute top-11 right-0 z-20 bg-white rounded-2xl shadow-xl border border-border py-1.5 min-w-[210px]">
                {(["1m","3m","1y","custom"] as const).map(p => (
                  <button key={p} type="button"
                    onClick={() => { setDetailPeriod(p); if (p !== "custom") setShowPeriodDrop(false); setDetailPage(1); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted/40 ${detailPeriod === p ? "text-primary" : "text-zinc-700"}`}>
                    {{ "1m":"Сүүлийн 1 сар", "3m":"Сүүлийн 3 сар", "1y":"Сүүлийн 1 жил", "custom":"Хугацаа сонгох" }[p]}
                    {detailPeriod === p && <Check size={13} />}
                  </button>
                ))}
                {detailPeriod === "custom" && (
                  <div className="px-4 pb-3 pt-1 space-y-2 border-t border-border mt-1">
                    <div>
                      <label className="text-xs font-bold uppercase text-zinc-400 block mb-1">Эхлэх</label>
                      <input type="month" value={customStart} min="2023-09" max={customEnd}
                        onChange={e => setCustomStart(e.target.value)}
                        className="w-full h-8 text-xs px-2.5 rounded-xl border border-border outline-none focus:ring-2 focus:ring-violet-400/25 focus:border-violet-400 bg-white" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-zinc-400 block mb-1">Дуусах</label>
                      <input type="month" value={customEnd} min={customStart} max="2026-08"
                        onChange={e => setCustomEnd(e.target.value)}
                        className="w-full h-8 text-xs px-2.5 rounded-xl border border-border outline-none focus:ring-2 focus:ring-violet-400/25 focus:border-violet-400 bg-white" />
                    </div>
                    <button type="button" onClick={() => setShowPeriodDrop(false)}
                      className="w-full h-8 rounded-xl bg-primary text-white text-xs font-bold hover:bg-[#5B3FE0] transition-colors">
                      Хэрэглэх
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Grouping tabs + search — dynamic based on content type */}
      <div className="px-5 py-3 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3">
        {/* grouping segmented control */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400 flex-shrink-0">Харах:</span>
          <div className="flex gap-1 bg-zinc-100 p-0.5 rounded-xl overflow-x-auto">
            {revenueContentType === "music" && (["track","album","service","label","artist"] as const).map(g => (
              <button key={g} type="button"
                onClick={() => { setGrouping(g); setDetailPage(1); setSearchQ(""); }}
                className={`px-3.5 h-7 rounded-[10px] text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${grouping === g ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}>
                {{ track:"Дуу", album:"Цомог", service:"Үйлчилгээ", label:"Лейбл", artist:"Артист" }[g]}
              </button>
            ))}
            {revenueContentType === "audiobook" && (["track","album","service"] as const).map(g => (
              <button key={g} type="button"
                onClick={() => { setGrouping(g); setDetailPage(1); setSearchQ(""); }}
                className={`px-3.5 h-7 rounded-[10px] text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${grouping === g ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}>
                {{ track:"Ном", album:"Бүлэг", service:"Үйлчилгээ" }[g]}
              </button>
            ))}
            {revenueContentType === "film" && (["track","service"] as const).map(g => (
              <button key={g} type="button"
                onClick={() => { setGrouping(g); setDetailPage(1); setSearchQ(""); }}
                className={`px-3.5 h-7 rounded-[10px] text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${grouping === g ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}>
                {{ track:"Кино", service:"Платформ" }[g]}
              </button>
            ))}
          </div>
        </div>
        {/* search — standalone, right side */}
        <div className="relative sm:ml-auto sm:w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input type="text" placeholder={SEARCH_PH[grouping]} value={searchQ}
            onChange={e => { setSearchQ(e.target.value); setDetailPage(1); }}
            className="w-full h-9 pl-8 pr-3 text-sm rounded-xl border border-border bg-white outline-none focus:ring-2 focus:ring-violet-400/25 focus:border-violet-400 placeholder-zinc-400" />
        </div>
      </div>

      {/* ══ MUSIC TABLES ══ */}
      {revenueContentType === "music" && grouping === "track" && (
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50/60 border-b border-border">
              <th className={thCls}>Дуу</th>
              <th className="text-left text-xs font-bold text-zinc-400 uppercase px-5 py-3 hidden sm:table-cell">Артист</th>
              <th className="text-left text-xs font-bold text-zinc-400 uppercase px-5 py-3 hidden lg:table-cell">Лейбл</th>
              <th className={thRCls + " hidden md:table-cell"}>Сонсолт</th>
              <th className={thRCls + " hidden xl:table-cell"}>Таталт</th>
              <th className={thRCls}>Орлого</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {pagedTracks.map(t => (
              <tr key={t.id} className="hover:bg-muted/40/60 transition-colors cursor-pointer"
                onClick={() => onSongClick(t)}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center flex-shrink-0">
                      <Music2 size={13} className="text-white" />
                    </div>
                    <p className="font-semibold text-sm text-zinc-900 truncate max-w-[140px]">{t.title}</p>
                  </div>
                </td>
                <td className={tdCls + " hidden sm:table-cell"}>{t.artist}</td>
                <td className={tdCls + " hidden lg:table-cell"}>{t.label}</td>
                <td className={tdRCls + " hidden md:table-cell"}>{t.streams.toLocaleString()}</td>
                <td className={tdRCls + " hidden xl:table-cell"}>{t.downloads.toLocaleString()}</td>
                <td className={tdBoldR}>{fmtMoney(t.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {revenueContentType === "music" && grouping === "album" && (
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50/60 border-b border-border">
              <th className={thCls}>Цомог</th>
              <th className="text-left text-xs font-bold text-zinc-400 uppercase px-5 py-3 hidden sm:table-cell">Артист</th>
              <th className={thRCls + " hidden md:table-cell"}>Дууны тоо</th>
              <th className={thRCls + " hidden lg:table-cell"}>Сонсолт</th>
              <th className={thRCls + " hidden xl:table-cell"}>Таталт</th>
              <th className={thRCls}>Орлого</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {albumFiltered.map(a => (
              <tr key={a.id} className="hover:bg-muted/40/60 transition-colors cursor-pointer"
                onClick={() => onAlbumClick(a)}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Disc3 size={13} className="text-white" />
                    </div>
                    <p className="font-semibold text-sm text-zinc-900 truncate max-w-[140px]">{a.title}</p>
                  </div>
                </td>
                <td className={tdCls + " hidden sm:table-cell"}>{a.artist}</td>
                <td className={tdRCls + " hidden md:table-cell"}>{a.trackCount}</td>
                <td className={tdRCls + " hidden lg:table-cell"}>{a.streams.toLocaleString()}</td>
                <td className={tdRCls + " hidden xl:table-cell"}>{a.downloads.toLocaleString()}</td>
                <td className={tdBoldR}>{fmtMoney(a.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {revenueContentType === "music" && grouping === "service" && (
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50/60 border-b border-border">
              <th className={thCls}>Үйлчилгээ</th>
              <th className={thRCls + " hidden sm:table-cell"}>Сонсолт</th>
              <th className={thRCls + " hidden md:table-cell"}>Таталт</th>
              <th className={thRCls}>Орлого</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {serviceFiltered.map(s => (
              <tr key={s.id} className="hover:bg-muted/40/40 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-sm text-zinc-900">{s.name}</p>
                </td>
                <td className={tdRCls + " hidden sm:table-cell"}>{s.streams.toLocaleString()}</td>
                <td className={tdRCls + " hidden md:table-cell"}>{s.downloads.toLocaleString()}</td>
                <td className={tdBoldR}>{fmtMoney(s.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {revenueContentType === "music" && grouping === "label" && (
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50/60 border-b border-border">
              <th className={thCls}>Лейбл</th>
              <th className={thRCls + " hidden sm:table-cell"}>Дуу / Цомог</th>
              <th className={thRCls + " hidden md:table-cell"}>Сонсолт</th>
              <th className={thRCls + " hidden lg:table-cell"}>Таталт</th>
              <th className={thRCls}>Орлого</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {labelFiltered.map(l => (
              <tr key={l.id} className="hover:bg-muted/40/40 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Tag size={13} className="text-primary" />
                    </div>
                    <p className="font-semibold text-sm text-zinc-900">{l.label}</p>
                  </div>
                </td>
                <td className={tdRCls + " hidden sm:table-cell"}>{l.releases}</td>
                <td className={tdRCls + " hidden md:table-cell"}>{l.streams.toLocaleString()}</td>
                <td className={tdRCls + " hidden lg:table-cell"}>{l.downloads.toLocaleString()}</td>
                <td className={tdBoldR}>{fmtMoney(l.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ── ARTIST TABLE ── */}
      {revenueContentType === "music" && grouping === "artist" && (
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50/60 border-b border-border">
              <th className={thCls}>Артист</th>
              <th className={thRCls + " hidden sm:table-cell"}>Дуу / Цомог</th>
              <th className={thRCls + " hidden md:table-cell"}>Сонсолт</th>
              <th className={thRCls + " hidden lg:table-cell"}>Таталт</th>
              <th className={thRCls}>Орлого</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {artistFiltered.map(a => (
              <tr key={a.id} className="hover:bg-muted/40/40 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <User size={13} className="text-white" />
                    </div>
                    <p className="font-semibold text-sm text-zinc-900">{a.artist}</p>
                  </div>
                </td>
                <td className={tdRCls + " hidden sm:table-cell"}>{a.releases}</td>
                <td className={tdRCls + " hidden md:table-cell"}>{a.streams.toLocaleString()}</td>
                <td className={tdRCls + " hidden lg:table-cell"}>{a.downloads.toLocaleString()}</td>
                <td className={tdBoldR}>{fmtMoney(a.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ══ AUDIOBOOK TABLES ══ */}
      {revenueContentType === "audiobook" && grouping === "track" && (
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50/60 border-b border-border">
              <th className={thCls}>Номын нэр</th>
              <th className="text-left text-xs font-bold text-zinc-400 uppercase px-5 py-3 hidden sm:table-cell">Зохиолч</th>
              <th className={thRCls + " hidden md:table-cell"}>Бүлгийн тоо</th>
              <th className={thRCls + " hidden lg:table-cell"}>Сонсолт</th>
              <th className={thRCls}>Орлого</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {[
              { id:"AB001", title:"Нутгийн тэмдэглэл", author:"Болд Жаргал", chapters:12, streams:8400, amount:fmtMoney(63000) },
              { id:"AB002", title:"Монгол нутгаар аялал", author:"Цэрэн Доржийн", chapters:8, streams:5200, amount:fmtMoney(39000) },
              { id:"AB003", title:"Бизнесийн үндэс", author:"Батбаяр Д.", chapters:15, streams:3100, amount:fmtMoney(23250) },
            ].map(r => (
              <tr key={r.id} className="hover:bg-muted/40/60 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={13} className="text-white" />
                    </div>
                    <p className="font-semibold text-sm text-zinc-900 truncate max-w-[140px]">{r.title}</p>
                  </div>
                </td>
                <td className={tdCls + " hidden sm:table-cell"}>{r.author}</td>
                <td className={tdRCls + " hidden md:table-cell"}>{r.chapters}</td>
                <td className={tdRCls + " hidden lg:table-cell"}>{r.streams.toLocaleString()}</td>
                <td className={tdBoldR}>{r.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {revenueContentType === "audiobook" && grouping === "album" && (
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50/60 border-b border-border">
              <th className={thCls}>Бүлгийн нэр</th>
              <th className="text-left text-xs font-bold text-zinc-400 uppercase px-5 py-3 hidden sm:table-cell">Ном</th>
              <th className={thRCls + " hidden md:table-cell"}>Сонсолт</th>
              <th className={thRCls}>Орлого</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {[
              { id:"ABT001", ch:"1-р бүлэг: Эхлэл",       book:"Нутгийн тэмдэглэл", streams:2100, amount:fmtMoney(15750) },
              { id:"ABT002", ch:"2-р бүлэг: Зам мөр",     book:"Нутгийн тэмдэглэл", streams:1850, amount:fmtMoney(13875) },
              { id:"ABT003", ch:"3-р бүлэг: Буцах замд",   book:"Нутгийн тэмдэглэл", streams:1600, amount:fmtMoney(12000) },
              { id:"ABT004", ch:"1-р хэсэг: Гарал",        book:"Монгол нутгаар аялал", streams:1400, amount:fmtMoney(10500) },
            ].map(r => (
              <tr key={r.id} className="hover:bg-muted/40/60 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-sm text-zinc-900">{r.ch}</p>
                </td>
                <td className={tdCls + " hidden sm:table-cell"}>{r.book}</td>
                <td className={tdRCls + " hidden md:table-cell"}>{r.streams.toLocaleString()}</td>
                <td className={tdBoldR}>{r.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {revenueContentType === "audiobook" && grouping === "service" && (
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50/60 border-b border-border">
              <th className={thCls}>Үйлчилгээ</th>
              <th className={thRCls + " hidden sm:table-cell"}>Сонсолт</th>
              <th className={thRCls}>Орлого</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {[
              { id:"AS001", name:"Audible",           streams:9200, amount:fmtMoney(69000) },
              { id:"AS002", name:"Apple Books",       streams:4300, amount:fmtMoney(32250) },
              { id:"AS003", name:"Google Play Books", streams:3200, amount:fmtMoney(24000) },
            ].map(s => (
              <tr key={s.id} className="hover:bg-muted/40/40 transition-colors">
                <td className="px-5 py-3.5"><p className="font-semibold text-sm text-zinc-900">{s.name}</p></td>
                <td className={tdRCls + " hidden sm:table-cell"}>{s.streams.toLocaleString()}</td>
                <td className={tdBoldR}>{s.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ══ FILM TABLES ══ */}
      {revenueContentType === "film" && grouping === "track" && (
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50/60 border-b border-border">
              <th className={thCls}>Киноны нэр</th>
              <th className={thRCls + " hidden sm:table-cell"}>Rent тоо</th>
              <th className={thRCls}>Орлого</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {[
              { id:"FM001", title:"Говийн Салхи", rents:3200, amount:fmtMoney(14400) },
              { id:"FM002", title:"Нутгийн Дуу",  rents:1850, amount:fmtMoney(8325)  },
              { id:"FM003", title:"Хөлийн Мөр",   rents:1100, amount:fmtMoney(4950)  },
            ].map(r => (
              <tr key={r.id} className="hover:bg-muted/40/60 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                      <Film size={13} className="text-white" />
                    </div>
                    <p className="font-semibold text-sm text-zinc-900 truncate max-w-[200px]">{r.title}</p>
                  </div>
                </td>
                <td className={tdRCls + " hidden sm:table-cell"}>{r.rents.toLocaleString()}</td>
                <td className={tdBoldR}>{r.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {revenueContentType === "film" && grouping === "service" && (
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50/60 border-b border-border">
              <th className={thCls}>Платформ</th>
              <th className={thRCls + " hidden sm:table-cell"}>Rent тоо</th>
              <th className={thRCls}>Орлого</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {[
              { id:"FS001", name:"Netflix", rents:3800, amount:fmtMoney(17100) },
              { id:"FS002", name:"Vimeo",   rents:2350, amount:fmtMoney(10575) },
            ].map(s => (
              <tr key={s.id} className="hover:bg-muted/40/40 transition-colors">
                <td className="px-5 py-3.5"><p className="font-semibold text-sm text-zinc-900">{s.name}</p></td>
                <td className={tdRCls + " hidden sm:table-cell"}>{s.rents.toLocaleString()}</td>
                <td className={tdBoldR}>{s.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination (music track only) */}
      {revenueContentType === "music" && grouping === "track" && totalPages > 1 && (
        <div className="px-5 py-3.5 border-t border-border flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs text-zinc-400 font-medium">
            {(detailPage-1)*PAGE_SIZE+1}–{Math.min(detailPage*PAGE_SIZE, trackFiltered.length)} / {trackFiltered.length.toLocaleString()}
          </p>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setDetailPage(p => Math.max(1,p-1))} disabled={detailPage===1}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-border text-zinc-400 hover:text-zinc-700 disabled:opacity-30 disabled:pointer-events-none transition-colors">
              <ChevronDown size={13} className="rotate-90" />
            </button>
            {Array.from({length: totalPages}, (_,i) => i+1).map(n => (
              <button key={n} type="button" onClick={() => setDetailPage(n)}
                className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-semibold border transition-all ${detailPage===n ? "bg-primary text-white border-transparent shadow-sm" : "border-border text-zinc-500 hover:border-zinc-300"}`}>
                {n}
              </button>
            ))}
            <button type="button" onClick={() => setDetailPage(p => Math.min(totalPages,p+1))} disabled={detailPage===totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-border text-zinc-400 hover:text-zinc-700 disabled:opacity-30 disabled:pointer-events-none transition-colors">
              <ChevronDown size={13} className="-rotate-90" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
