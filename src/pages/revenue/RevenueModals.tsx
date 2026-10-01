import { X, Clock, Check, AlertCircle, ExternalLink, CheckCircle2, Download, Info } from "lucide-react";
import { useState as useLocalState, useRef } from "react";
import { getAccountState } from "@/data/ob-state";
import { ALL_MONTHLY, SERVICE_ROWS, WITHDRAW_STATUS, TIMELINE_STAGES, STATUS_ORDER } from "@/data/revenue";
import type { TRACK_ROWS, ALBUM_ROWS, WITHDRAWALS_DATA } from "@/data/revenue";
import { CURRENT_MONTH_KEY, AVAILABLE_BALANCE, LIFETIME_TOTAL, fmtMoney, formatMonthFull, thCls, thRCls } from "./revenueUtils";

// ════════════════ MONTHLY MODAL ════════════════

interface MonthlyModalProps {
  open: boolean;
  onClose: () => void;
}

export function MonthlyModal({ open, onClose }: MonthlyModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-xl border border-border w-full max-w-lg max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="font-bold text-zinc-900">Сар бүрийн орлого</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Нийт хугацааны баталгаажсан орлого</p>
          </div>
          <button type="button" onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-zinc-100 text-zinc-400 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-border bg-zinc-50/60">
                <th className={thCls}>Он сар</th>
                <th className={thRCls}>Орлого</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase">Төлөв</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {[...ALL_MONTHLY].reverse().map(m => (
                <tr key={m.key} className={`hover:bg-background/40 transition-colors ${m.key === CURRENT_MONTH_KEY ? "bg-violet-50/30" : ""}`}>
                  <td className="px-5 py-3.5 text-sm font-semibold text-zinc-900">{formatMonthFull(m.key)}</td>
                  <td className="px-5 py-3.5 text-right text-sm tabular-nums font-bold text-zinc-900">{fmtMoney(m.amount)}</td>
                  <td className="px-5 py-3.5">
                    {m.key === CURRENT_MONTH_KEY && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 ring-1 ring-violet-200">
                        <Clock size={9} />Одоогийн сар
                      </span>
                    )}
                    {m.key < CURRENT_MONTH_KEY && m.amount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 ring-1 ring-green-200">
                        <Check size={9} />Баталгаажсан
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ════════════════ SONG DETAIL MODAL ════════════════

interface SongDetailModalProps {
  song: typeof TRACK_ROWS[0] | null;
  onClose: () => void;
  periodLabel: string;
}

export function SongDetailModal({ song, onClose, periodLabel }: SongDetailModalProps) {
  if (!song) return null;
  const totalStreams = song.stores.reduce((n, s) => n + s.streams, 0);
  const totalDownloads = song.stores.reduce((n, s) => n + s.downloads, 0);
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-xl border border-border w-full max-w-lg max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase text-zinc-400 tracking-wide mb-0.5">Орлогын дэлгэрэнгүй</p>
            <h3 className="font-extrabold text-zinc-900 text-base leading-snug truncate">{song.title}</h3>
            <p className="text-xs text-zinc-500 mt-0.5">{song.artist} · {song.label}</p>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-zinc-100 text-zinc-400 transition-colors flex items-center justify-center flex-shrink-0">
            <X size={16} />
          </button>
        </div>
        {/* Stats bar */}
        <div className="px-6 py-3 bg-zinc-50/60 border-b border-border grid grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase text-zinc-400">Хугацаа</p>
            <p className="text-xs font-semibold text-zinc-700 mt-0.5">{periodLabel}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-zinc-400">Нийт сонсолт</p>
            <p className="text-xs font-semibold text-zinc-700 mt-0.5">{totalStreams.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-zinc-400">Нийт таталт</p>
            <p className="text-xs font-semibold text-zinc-700 mt-0.5">{totalDownloads.toLocaleString()}</p>
          </div>
        </div>
        {/* Table */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full">
            <thead className="sticky top-0">
              <tr className="border-b border-border bg-zinc-50/90">
                <th className={thCls}>Үйлчилгээ</th>
                <th className={thRCls}>Сонсолт</th>
                <th className={thRCls}>Таталт</th>
                <th className={thRCls}>Орлого</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {song.stores.map(s => (
                <tr key={s.name} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="px-5 py-3 text-sm font-semibold text-zinc-900">{s.name}</td>
                  <td className="px-5 py-3 text-right text-sm tabular-nums text-zinc-500">{s.streams.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-sm tabular-nums text-zinc-500">{s.downloads.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-sm tabular-nums font-bold text-zinc-900">{fmtMoney(s.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-zinc-50/80">
                <td colSpan={3} className="px-5 py-3.5 text-xs font-bold text-zinc-500">Нийт</td>
                <td className="px-5 py-3.5 text-right text-sm font-extrabold text-zinc-900 tabular-nums">{fmtMoney(song.amount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

// ════════════════ ALBUM DETAIL MODAL ════════════════

interface AlbumDetailModalProps {
  album: typeof ALBUM_ROWS[0] | null;
  onClose: () => void;
  periodLabel: string;
}

export function AlbumDetailModal({ album, onClose, periodLabel }: AlbumDetailModalProps) {
  if (!album) return null;
  const ratio = album.amount / LIFETIME_TOTAL;
  const totalStreams = Math.round(SERVICE_ROWS.slice(0,5).reduce((n,s) => n + s.streams, 0) * ratio);
  const totalDownloads = Math.round(SERVICE_ROWS.slice(0,5).reduce((n,s) => n + s.downloads, 0) * ratio);
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-xl border border-border w-full max-w-lg max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase text-zinc-400 tracking-wide mb-0.5">Орлогын дэлгэрэнгүй</p>
            <h3 className="font-extrabold text-zinc-900 text-base leading-snug truncate">{album.title}</h3>
            <p className="text-xs text-zinc-500 mt-0.5">{album.artist} · {album.trackCount} дуу</p>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-zinc-100 text-zinc-400 transition-colors flex items-center justify-center flex-shrink-0">
            <X size={16} />
          </button>
        </div>
        {/* Stats bar */}
        <div className="px-6 py-3 bg-zinc-50/60 border-b border-border grid grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase text-zinc-400">Хугацаа</p>
            <p className="text-xs font-semibold text-zinc-700 mt-0.5">{periodLabel}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-zinc-400">Нийт сонсолт</p>
            <p className="text-xs font-semibold text-zinc-700 mt-0.5">{totalStreams.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-zinc-400">Нийт таталт</p>
            <p className="text-xs font-semibold text-zinc-700 mt-0.5">{totalDownloads.toLocaleString()}</p>
          </div>
        </div>
        {/* Table */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full">
            <thead className="sticky top-0">
              <tr className="border-b border-border bg-zinc-50/90">
                <th className={thCls}>Үйлчилгээ</th>
                <th className={thRCls}>Сонсолт</th>
                <th className={thRCls}>Таталт</th>
                <th className={thRCls}>Орлого</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {SERVICE_ROWS.slice(0,5).map(s => {
                const sAmt = s.amount * ratio;
                const sSt  = Math.round(s.streams * ratio);
                const sDl  = Math.round(s.downloads * ratio);
                return (
                  <tr key={s.name} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="px-5 py-3 text-sm font-semibold text-zinc-900">{s.name}</td>
                    <td className="px-5 py-3 text-right text-sm tabular-nums text-zinc-500">{sSt.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-sm tabular-nums text-zinc-500">{sDl.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-sm tabular-nums font-bold text-zinc-900">{fmtMoney(sAmt)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-zinc-50/80">
                <td colSpan={3} className="px-5 py-3.5 text-xs font-bold text-zinc-500">Нийт</td>
                <td className="px-5 py-3.5 text-right text-sm font-extrabold text-zinc-900 tabular-nums">{fmtMoney(album.amount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

// ════════════════ WITHDRAWAL DETAIL MODAL ════════════════

interface WithdrawalDetailModalProps {
  withdrawal: typeof WITHDRAWALS_DATA[0] | null;
  onClose: () => void;
}

export function WithdrawalDetailModal({ withdrawal, onClose }: WithdrawalDetailModalProps) {
  if (!withdrawal) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-xl border border-border w-full max-w-md"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="font-bold text-zinc-900">Таталтын дэлгэрэнгүй</h3>
            <p className="text-xs text-zinc-400 mt-0.5">{withdrawal.id}</p>
          </div>
          <button type="button" onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-zinc-100 text-zinc-400 transition-colors"><X size={18} /></button>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-semibold text-zinc-400">Татах дүн</p>
              <p className="text-2xl font-extrabold text-zinc-900">{fmtMoney(withdrawal.amount)}</p>
            </div>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${WITHDRAW_STATUS[withdrawal.status]?.cls || ""}`}>
              {WITHDRAW_STATUS[withdrawal.status]?.label}
            </span>
          </div>

          {/* exception: returned */}
          {withdrawal.status === "returned" && withdrawal.note && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5 flex gap-2.5">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-700 mb-1">Баримт буцаагдсан</p>
                <p className="text-xs text-red-600 leading-relaxed">{withdrawal.note}</p>
                <button type="button" className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 underline">
                  <ExternalLink size={11} />eBarimt дахин нээх
                </button>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-0">
            {TIMELINE_STAGES.map((stage, idx) => {
              const isReturned = withdrawal.status === "returned";
              const currentOrder = isReturned ? 0 : (STATUS_ORDER[withdrawal.status] ?? 0);
              const stageOrder = STATUS_ORDER[stage.key] ?? idx;
              const isDone = isReturned ? false : stageOrder < currentOrder;
              const isCurrent = isReturned ? stageOrder === 0 : stageOrder === currentOrder;
              const isFuture = !isDone && !isCurrent;
              const isLast = idx === TIMELINE_STAGES.length - 1;

              return (
                <div key={stage.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all
                      ${isDone ? "bg-primary border-primary" : isCurrent ? "bg-white border-primary ring-4 ring-violet-100" : "bg-white border-zinc-200"}`}>
                      {isDone
                        ? <Check size={14} className="text-white" strokeWidth={2.5} />
                        : isCurrent
                          ? <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                          : <div className="w-2 h-2 rounded-full bg-zinc-300" />
                      }
                    </div>
                    {!isLast && <div className={`w-0.5 flex-1 my-1 rounded-full min-h-[28px] ${isDone ? "bg-primary" : "bg-zinc-200"}`} />}
                  </div>
                  <div className={`pb-5 flex-1 ${isLast ? "" : ""}`}>
                    <p className={`text-sm font-bold leading-none mt-1.5 ${isFuture ? "text-zinc-300" : isDone ? "text-zinc-600" : "text-zinc-900"}`}>
                      {stage.label}
                    </p>
                    {(isDone || isCurrent) && (
                      <>
                        <p className="text-xs text-zinc-400 mt-1">{withdrawal.modifiedAt}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{stage.sub}</p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════ WITHDRAWAL REQUEST MODAL ════════════════

interface WithdrawalRequestModalProps {
  step: "form" | "success" | null;
  onClose: () => void;
  onSubmit: () => void;
  copiedField: string | null;
  onCopy: (val: string, field: string) => void;
}

export function WithdrawalRequestModal({ step, onClose, onSubmit, copiedField, onCopy }: WithdrawalRequestModalProps) {
  const [showInfo, setShowInfo] = useLocalState(false);
  const [demoVat, setDemoVat] = useLocalState(false);
  const [demoOrg, setDemoOrg] = useLocalState(false);
  const infoRef = useRef<HTMLButtonElement>(null);
  const [infoPos, setInfoPos] = useLocalState({ top: 0, left: 0 });
  const vatPayer = demoVat;

  const BASE        = AVAILABLE_BALANCE;
  const ROYALTY     = Math.round(BASE * 0.10);
  const TRANSFER    = BASE - ROYALTY;
  const EBARIMT     = BASE;
  const BASE_NO_VAT = Math.round(BASE / 1.10);

  if (!step) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={() => step === "form" && onClose()}>
      <div className="bg-card rounded-2xl shadow-xl border border-border w-full max-w-md"
        onClick={e => e.stopPropagation()}>

        {step === "form" && (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-bold text-zinc-900 text-lg">Татах хүсэлт</h3>
              <button type="button" onClick={onClose}
                className="w-8 h-8 rounded-xl hover:bg-zinc-100 text-zinc-400 flex items-center justify-center transition-colors"><X size={16} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {/* balance banner */}
              <div className="rounded-xl px-5 py-5 relative overflow-hidden" style={{ background:"linear-gradient(135deg,#0f0825,#2d1060,var(--primary))" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                      <p className="text-white/60 text-xs font-semibold uppercase tracking-wide">Боломжтой үлдэгдэл</p>
                    </div>
                    <p className="text-2xl font-extrabold text-white mt-1 tabular-nums">{fmtMoney(AVAILABLE_BALANCE)}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <button type="button" onClick={() => setDemoOrg(v => !v)}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors"
                      style={{ background: demoOrg ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.07)", color: demoOrg ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)" }}>
                      {demoOrg ? "Байгууллага" : "Хувь хүн"}
                    </button>
                    <button type="button" onClick={() => setDemoVat(v => !v)}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors"
                      style={{ background: demoVat ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.07)", color: demoVat ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)" }}>
                      НӨАТ • {demoVat ? "Тийм" : "Үгүй"}
                    </button>
                  </div>
                </div>
                <div className="border-t border-white/15 mt-3 pt-2.5">
                  <p className="text-white/35 text-[11px]">Татварын тооцоо болон шилжүүлгийн мэдээлэл</p>
                </div>
              </div>

              {/* calculation */}
              <div className="rounded-xl border border-border overflow-visible">
                {/* Үлдэгдэл дүн */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <p className="text-xs text-zinc-500">Үлдэгдэл дүн</p>
                  <p className="text-sm font-semibold text-zinc-800 tabular-nums">{fmtMoney(BASE)}</p>
                </div>

                {/* НӨАТ-гүй дүн — зөвхөн НӨАТ төлөгчид */}
                {vatPayer && (
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <p className="text-xs text-zinc-500">НӨАТ-гүй дүн</p>
                    <p className="text-sm font-semibold text-zinc-800 tabular-nums">{fmtMoney(BASE_NO_VAT)}</p>
                  </div>
                )}

                {/* Эрхийн шимтгэл */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs text-zinc-500">Эрхийн шимтгэл</p>
                    <div className="relative">
                      <button ref={infoRef} type="button"
                        onMouseEnter={() => {
                          const r = infoRef.current?.getBoundingClientRect();
                          if (r) setInfoPos({ top: r.top - 8, left: r.left });
                          setShowInfo(true);
                        }}
                        onMouseLeave={() => setShowInfo(false)}
                        className="text-zinc-400 hover:text-zinc-600 transition-colors flex items-center">
                        <Info size={13} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-zinc-800 tabular-nums">− {fmtMoney(ROYALTY)}</p>
                </div>

                {/* Шилжүүлэх дүн */}
                <div className="flex items-center justify-between px-4 py-3.5 bg-violet-50/60 border-b border-border">
                  <p className="text-sm font-bold text-zinc-900">Шилжүүлэх дүн</p>
                  <p className="text-sm font-extrabold text-primary tabular-nums">{fmtMoney(TRANSFER)}</p>
                </div>

                {/* И-Баримт шивэх дүн */}
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-50/60 rounded-b-xl">
                  <p className="text-sm text-zinc-500">И-Баримт шивэх дүн</p>
                  <p className="text-sm font-semibold text-zinc-700 tabular-nums">{fmtMoney(EBARIMT)}</p>
                </div>
              </div>

              {/* account info */}
              <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
                {[["Шилжүүлэх данс","Хаан Банк ••••4521"],["Хүлээн авагч","Болд Жаргал"]].map(([k,v]) => (
                  <div key={k} className="flex items-center justify-between px-4 py-3">
                    <p className="text-xs font-semibold text-zinc-400">{k}</p>
                    <p className="text-sm font-semibold text-zinc-800">{v}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={onClose}
                  className="flex-1 h-10 rounded-xl border border-border text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors">Болих</button>
                <button type="button" onClick={onSubmit}
                  className="flex-1 h-10 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background:"linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))" }}>Хүсэлт илгээх</button>
              </div>
            </div>
          </>
        )}

        {/* Info tooltip — fixed, outside all overflow containers */}
        {showInfo && step === "form" && (
          <div className="fixed z-[300] w-60 bg-zinc-900 text-white text-xs rounded-xl px-3 py-2.5 leading-relaxed shadow-2xl pointer-events-none"
            style={{ top: infoPos.top, left: infoPos.left, transform: "translateY(-100%) translateX(-8px)" }}>
            {vatPayer
              ? (demoOrg
                  ? "ААНОАТ хуулийн 24.1-д зааснаар эрхийн шимтгэлийг НӨАТ-гүй дүнгээс хасаж тооцоолж суутгана."
                  : "ХХОАТ хуулийн 25.1-д зааснаар суутган төлөгч эрхийн шимтгэлийг НӨАТ-гүй дүнгээс хасаж суутгаж төсөвт шилжүүлнэ.")
              : (demoOrg
                  ? "ААНОАТ хуулийн 24.1-д зааснаар эрхийн шимтгэлийн орлогыг тооцоолж суутгана."
                  : "ХХОАТ хуулийн 25.1-д зааснаар суутган төлөгч эрхийн шимтгэлийн орлогыг суутгаж төсөвт шилжүүлнэ. Хуулийг баримтлан тооцоолно.")
            }
            <div className="absolute left-4 bottom-0 w-2 h-2 bg-zinc-900 rotate-45 translate-y-1" />
          </div>
        )}

        {step === "success" && (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-bold text-zinc-900 text-lg">Хүсэлт үүслээ</h3>
              <button type="button" onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-zinc-100 text-zinc-400 transition-colors"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl p-4">
                <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-green-800">Хүсэлт амжилттай бүртгэгдлээ</p>
                  <p className="text-xs text-green-700 mt-0.5">Одоо eBarimt баримтаа илгээнэ үү</p>
                </div>
              </div>

              <div className="bg-zinc-50 border border-border rounded-xl p-4 space-y-1">
                <p className="text-sm font-bold text-zinc-900 mb-2">eBarimt дээр баримт үүсгэх</p>
                <p className="text-xs text-zinc-500 leading-relaxed mb-3">Доорх регистр, төлбөрийн утга, дүнг ашиглаад баримтаа манай байгууллага руу илгээнэ.</p>
                {[
                  { key:"РЕГИСТР",          val:"2030957",           field:"reg" },
                  { key:"ТӨЛБӨРИЙН УТГА",   val:"Эрхийн шимтгэлийн орлого", field:"ref" },
                  { key:"И-БАРИМТ ШИВЭХ ДҮН",        val:fmtMoney(EBARIMT), field:"amt" },
                ].map(row => (
                  <div key={row.key} className="flex items-center justify-between py-2.5 border-b border-zinc-200/60 last:border-0">
                    <div>
                      <p className="text-xs font-bold uppercase text-zinc-400">{row.key}</p>
                      <p className="text-sm font-bold text-zinc-900 mt-0.5">{row.val}</p>
                    </div>
                    <button type="button" onClick={() => onCopy(row.val, row.field)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-[#5B3FE0] bg-violet-50 hover:bg-violet-100 px-2.5 h-7 rounded-lg transition-colors">
                      {copiedField === row.field ? <><Check size={11} />Хуулагдлаа</> : <><Download size={11} />Хуулах</>}
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button type="button"
                  className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
                  onClick={onClose}>
                  Хаах
                </button>
                <button type="button"
                  className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background:"linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))" }}>
                  <ExternalLink size={14} />eBarimt нээх
                </button>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed text-center">
                Баримт санхүүд ирсний дараа хүсэлтийн статус автоматаар шинэчлэгдэнэ. Та дахин ямар нэг товч дарах шаардлагагүй.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
