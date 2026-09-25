import { useState } from "react";
import { useNavigate } from "react-router";
import {
  User, CreditCard, AlertCircle, Clock, CheckCircle2,
  Building2, Shield, Tag, BadgeCheck, Lock, FileText,
  ChevronRight, Receipt, Pencil, ArrowUpRight, MessageSquare, Send,
  Music2, Film, BookOpen, X, Download, Eye,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { OB_CONTRACTS } from "@/data/agreements";
import { CMS_AGREEMENTS } from "@/data/cms-agreements";
import { getAccountState } from "@/data/ob-state";

type AccountTab = "info" | "agreements" | "bank" | "security";

const TABS: { id: AccountTab; label: string; icon: React.ElementType }[] = [
  { id: "info",       label: "Мэдээлэл",      icon: User      },
  { id: "agreements", label: "Гэрээ",          icon: FileText  },
  { id: "bank",       label: "Банк",           icon: CreditCard},
  { id: "security",   label: "Үйл ажиллагаа", icon: Shield    },
];

const ACCOUNT_LOG = [
  { icon: BadgeCheck, label: "E-Mongolia баталгаажуулалт хийгдсэн", detail: "Болд Жаргал · УН12345678", time: "2026-09-15 10:12", color: "text-green-600", bg: "bg-green-50" },
  { icon: CreditCard, label: "Банкны данс нэмэгдсэн",               detail: "Хаан банк · ****7890",     time: "2026-09-10 14:33", color: "text-blue-600",  bg: "bg-blue-50"  },
  { icon: Receipt,    label: "ТТД мэдээлэл шинэчлэгдсэн",           detail: "9900112233",               time: "2026-08-28 09:21", color: "text-violet-600",bg: "bg-violet-50"},
  { icon: Tag,        label: "Лейбл нэмэгдсэн",                      detail: "Steppe Records",           time: "2026-08-20 11:05", color: "text-amber-600", bg: "bg-amber-50" },
  { icon: FileText,   label: "Дуу түгээх гэрээ зурагдсан",           detail: "Buteel × Steppe Records",  time: "2026-07-01 15:44", color: "text-green-600", bg: "bg-green-50" },
  { icon: User,       label: "Аккаунт үүсгэгдсэн",                   detail: "Бүртгэл дууссан",          time: "2026-06-15 09:00", color: "text-zinc-500",  bg: "bg-zinc-100" },
];

export default function AccountStatusScreen() {
  const navigate = useNavigate();
  const accState = getAccountState();

  const [demoAccType, setDemoAccType] = useState<"individual" | "org">("individual");
  const [mongoVerified, setMongoVerified]       = useState(false);
  const [showLabelRequest, setShowLabelRequest] = useState(false);
  const [tab, setTab] = useState<AccountTab>("info");
  const [vatPayer, setVatPayer] = useState(false);

  const [bankHolderName, setBankHolderName] = useState("");
  const [bankNumber, setBankNumber]         = useState("");
  const [bankName, setBankName]             = useState("");
  const [bankSubmitted, setBankSubmitted]   = useState(false);

  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportReason, setSupportReason]       = useState("");
  const [supportSent, setSupportSent]           = useState(false);

  const [showPdfModal, setShowPdfModal]     = useState(false);
  const [pdfContractId, setPdfContractId]   = useState<string | null>(null);
  const [labelReqType, setLabelReqType]     = useState("");
  const [labelReqName, setLabelReqName]     = useState("");
  const [labelReqSent, setLabelReqSent]     = useState(false);

  const [signedCmsIds] = useState<string[]>(() =>
    JSON.parse(sessionStorage.getItem("signedCms") || "[]")
  );

  const isOrg = demoAccType === "org";
  const accInfo = isOrg
    ? { initials: "SR", name: "Steppe Records ХХК", register: "1234567",    taxNo: "7711223344" }
    : { initials: "БЖ", name: "Болд Жаргал",        register: "УН12345678", taxNo: "9900112233" };

  const bankNameMismatch = bankHolderName.trim() !== "" && bankHolderName.trim() !== accInfo.name;
  const completionPct = Math.round(((mongoVerified ? 1 : 0) + (mongoVerified ? 1 : 0) + 1 + (bankSubmitted ? 1 : 0)) / 4 * 100);

  const tabStatus: Record<AccountTab, "ok" | "warn" | "none"> = {
    info:       mongoVerified ? "ok" : "warn",
    agreements: accState.signedContracts.length > 0 ? "ok" : "warn",
    bank:       bankSubmitted ? "ok" : "warn",
    security:   "none",
  };

  // Signed contracts from account state (fallback: demo shows music signed)
  const signedIds: string[] = accState.signedContracts.length > 0
    ? accState.signedContracts
    : ["music"]; // demo fallback

  // Setup data from account state
  const musicSetup = accState.setups?.["music"] ?? { name: "Steppe Records" };
  const filmSetup  = accState.setups?.["film"];
  const abSetup    = accState.setups?.["audiobook"];

  return (
    <Shell title="Аккаунтын Тохиргоо">
      {/* Support modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => { if (!supportSent) setShowSupportModal(false); }}>
          <div className="bg-white rounded-2xl shadow-xl border border-border max-w-sm w-full p-6"
            onClick={e => e.stopPropagation()}>
            {supportSent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={22} className="text-green-600" />
                </div>
                <p className="font-bold text-zinc-900 text-sm mb-1">Хүсэлт илгээгдлээ</p>
                <p className="text-xs text-zinc-500 leading-relaxed">Таны хүсэлтийг 1–3 ажлын өдрийн дотор хянах болно.</p>
                <button type="button" onClick={() => { setShowSupportModal(false); setSupportSent(false); setSupportReason(""); }}
                  className="mt-5 w-full py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))" }}>
                  Хаах
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={16} className="text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 text-sm">Мэдээлэл өөрчлөх хүсэлт</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Support-д шалтгаанаа тайлбарлана уу</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 mb-4 leading-relaxed">
                  E-Mongolia-аар баталгаажсан мэдээллийг шууд засах боломжгүй. Өөрчлөлт хийх шаардлага байвал шалтгааныхаа тайлбарыг бичиж Support-д хүсэлт гаргана уу.
                </p>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase block mb-1.5">
                    Шалтгааны тайлбар <span className="text-red-500">*</span>
                  </label>
                  <textarea value={supportReason} onChange={e => setSupportReason(e.target.value)}
                    placeholder="Жишээ: Нэрийн алдаа засах, гэрлэлтийн улмаас овог солигдсон..."
                    rows={4}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-background resize-none" />
                </div>
                <div className="flex gap-3 mt-5">
                  <button type="button" onClick={() => setShowSupportModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors">
                    Болих
                  </button>
                  <button type="button" disabled={!supportReason.trim()}
                    onClick={() => { if (supportReason.trim()) setSupportSent(true); }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))" }}>
                    <Send size={13} />Илгээх
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Label / Production / Publisher request modal */}
      {showLabelRequest && (() => {
        const opts = [
          ...(signedIds.includes("music")     ? [{ id: "music",     label: "Хөгжмийн лейбл",    icon: Music2,   color: "text-primary",    bg: "bg-primary/5",    border: "border-primary/30" }] : []),
          ...(signedIds.includes("film")      ? [{ id: "film",      label: "Продакшн",           icon: Film,     color: "text-rose-600",   bg: "bg-rose-50",      border: "border-rose-200"   }] : []),
          ...(signedIds.includes("audiobook") ? [{ id: "audiobook", label: "Нийтлэгч",           icon: BookOpen, color: "text-violet-600", bg: "bg-violet-50",    border: "border-violet-200" }] : []),
        ];
        const canSend = !!labelReqType && labelReqName.trim().length > 0;
        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { if (!labelReqSent) setShowLabelRequest(false); }}>
            <div className="bg-white rounded-2xl shadow-xl border border-border max-w-sm w-full p-6"
              onClick={e => e.stopPropagation()}>
              {labelReqSent ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={22} className="text-green-600" />
                  </div>
                  <p className="font-bold text-zinc-900 text-sm mb-1">Хүсэлт илгээгдлээ</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">1–3 ажлын өдрийн дотор шалгаж баталгаажуулна.</p>
                  <button type="button"
                    onClick={() => { setShowLabelRequest(false); setLabelReqSent(false); setLabelReqType(""); setLabelReqName(""); }}
                    className="mt-5 w-full py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
                    style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))" }}>
                    Хаах
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Tag size={16} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 text-sm">Лейбл нэмэх</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">1–3 ажлын өдрийн дотор баталгаажна</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Төрөл сонгох</p>
                    <div className="space-y-2">
                      {opts.map(o => {
                        const OIcon = o.icon;
                        const selected = labelReqType === o.id;
                        return (
                          <button key={o.id} type="button"
                            onClick={() => setLabelReqType(o.id)}
                            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-colors text-left ${
                              selected ? `${o.bg} ${o.border}` : "bg-white border-border hover:border-zinc-300"
                            }`}>
                            <OIcon size={15} className={selected ? o.color : "text-muted-foreground"} />
                            <span className={`text-sm font-semibold ${selected ? o.color : "text-zinc-700"}`}>{o.label}</span>
                            {selected && <CheckCircle2 size={13} className={`ml-auto flex-shrink-0 ${o.color}`} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="text-xs font-bold text-zinc-500 uppercase block mb-1.5">
                      Нэр <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={labelReqName}
                      onChange={e => setLabelReqName(e.target.value)}
                      placeholder="Жишээ нь: Steppe Records, Nomad Films..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-background"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="button"
                      onClick={() => { setShowLabelRequest(false); setLabelReqType(""); setLabelReqName(""); }}
                      className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors">
                      Болих
                    </button>
                    <button type="button" disabled={!canSend}
                      onClick={() => { if (canSend) setLabelReqSent(true); }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))" }}>
                      Илгээх
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })()}

      {/* PDF Viewer Modal */}
      {showPdfModal && (() => {
        const ob  = OB_CONTRACTS.find(c => c.id === pdfContractId);
        const cms = CMS_AGREEMENTS.find(c => c.id === pdfContractId);
        const title = ob?.name ?? cms?.name ?? "";
        const text  = ob?.contractText ?? cms?.contractText ?? "";
        const icon  = ob?.icon ?? FileText;
        const iconBg = ob?.iconBg ?? "bg-blue-600";
        const signedDate = (ob ? accState.signedDates?.[ob.id] ?? "2026-07-01" : "2026-08-20");
        const Icon = icon;
        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
            onClick={() => setShowPdfModal(false)}>
            <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-border w-full sm:max-w-lg max-h-[88vh] flex flex-col"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-shrink-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${iconBg}`}>
                  <Icon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">{title}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 size={9} />Зурагдсан · {signedDate}
                  </p>
                </div>
                <button type="button" onClick={() => setShowPdfModal(false)}
                  className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors flex-shrink-0">
                  <X size={14} className="text-muted-foreground" />
                </button>
              </div>
              <div className="mx-5 mt-4 mb-2 bg-green-50 border border-green-200 rounded-xl px-3.5 py-2.5 flex items-start gap-2.5 flex-shrink-0">
                <CheckCircle2 size={13} className="text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-green-800">Гэрээ баталгаажсан</p>
                  <p className="text-xs text-green-600 mt-0.5">{accInfo.name} · Buteel Platform</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto mx-5 mb-4 mt-2">
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-4 text-[11px] text-zinc-600 leading-relaxed whitespace-pre-wrap">
                  {text}
                </div>
              </div>
              <div className="flex gap-3 px-5 pb-5 flex-shrink-0 border-t border-border pt-4">
                <button type="button"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
                  <Download size={14} />PDF татах
                </button>
                <button type="button" onClick={() => setShowPdfModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))" }}>
                  Хаах
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="max-w-2xl space-y-5">
        {/* Profile summary card */}
        <div className="relative overflow-hidden rounded-2xl border border-violet-100 shadow-sm"
          style={{ background: "linear-gradient(135deg,#F5F3FF 0%,#EEF2FF 100%)" }}>
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full opacity-[0.07] pointer-events-none"
            style={{ background: "var(--primary)" }} />
          <div className="px-5 py-4 flex items-center gap-4 relative">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-md"
              style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 72%, #000))" }}>
              {accInfo.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-zinc-900 text-base leading-tight">{accInfo.name}</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${isOrg ? "bg-blue-100 text-blue-700" : "bg-violet-100 text-violet-700"}`}>
                  {isOrg ? <><Building2 size={9} />Байгууллага</> : <><User size={9} />Хувь хүн</>}
                </span>
                {mongoVerified && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                    <CheckCircle2 size={9} />E-Mongolia
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 mt-1">Регистр: {accInfo.register}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-white/70 rounded-full overflow-hidden border border-violet-200">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${completionPct}%`, background: "linear-gradient(90deg, var(--primary), #818CF8)" }} />
                </div>
                <span className="text-xs font-bold text-violet-600">{completionPct}%</span>
              </div>
              <span className="text-[11px] text-zinc-400">Профайл бэлэн</span>
            </div>
          </div>
          <div className="px-5 pb-3 flex items-center gap-2 border-t border-violet-100/60 pt-2.5">
            <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded">DEMO</span>
            <button type="button" onClick={() => setDemoAccType(t => t === "individual" ? "org" : "individual")}
              className="text-xs font-semibold text-primary hover:underline">
              {isOrg ? "→ Хувь хүн болгох" : "→ Байгууллага болгох"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted/40 p-1 rounded-2xl border border-border">
          {TABS.map(t => {
            const st = tabStatus[t.id];
            const active = tab === t.id;
            const Icon = t.icon;
            return (
              <button key={t.id} type="button" onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active ? "bg-white text-foreground shadow-sm border border-border/60" : "text-muted-foreground hover:text-foreground"
                }`}>
                <Icon size={13} className={active ? "text-primary" : ""} />
                <span className="hidden sm:inline">{t.label}</span>
                {st === "ok"   && <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />}
                {st === "warn" && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* ══ МЭДЭЭЛЭЛ ══ */}
        {tab === "info" && (
          <div className="space-y-4">
            <Card className="p-5">
              {/* Header row */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="font-bold text-sm text-foreground">Аккаунтын мэдээлэл</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {mongoVerified
                      ? <span className="flex items-center gap-1 text-green-600"><CheckCircle2 size={10} />E-Mongolia баталгаажсан</span>
                      : "Татварын болон бүртгэлийн мэдээлэл"}
                  </p>
                </div>
                {mongoVerified
                  ? <button type="button" onClick={() => setShowSupportModal(true)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 border border-amber-200 bg-amber-50 px-3 h-8 rounded-xl hover:bg-amber-100 transition-colors">
                      <MessageSquare size={11} />Өөрчлөх хүсэлт
                    </button>
                  : <button type="button" onClick={() => navigate(`/account/tax?type=${isOrg ? "org" : "individual"}`)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/20 bg-primary/5 px-3 h-8 rounded-xl hover:bg-primary/10 transition-colors">
                      <Pencil size={11} />Засах
                    </button>
                }
              </div>

              {/* Fields grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
                {[
                  [isOrg ? "Байгууллагын нэр" : "Овог нэр", accInfo.name, "col-span-2 sm:col-span-1"],
                  ["Регистр дугаар", accInfo.register, ""],
                  ["ТТД дугаар",     accInfo.taxNo,    ""],
                ].map(([k, v, span]) => (
                  <div key={k} className={`bg-muted/40 rounded-xl px-3.5 py-2.5 border border-border/50 ${span}`}>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wide mb-1">{k}</p>
                    <p className="text-sm font-semibold text-foreground truncate">{v}</p>
                  </div>
                ))}
              </div>

              {/* VAT toggle row — locked once E-Mongolia verified */}
              <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border mb-5 ${mongoVerified ? "bg-zinc-50 border-border/40 opacity-70" : "bg-muted/30 border-border/50"}`}>
                <Receipt size={12} className="text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-foreground flex-1">НӨАТ төлөгч эсэх</span>
                {mongoVerified && <Lock size={10} className="text-zinc-400 flex-shrink-0" />}
                <span className={`text-xs font-semibold ${vatPayer ? "text-primary" : "text-muted-foreground"}`}>
                  {vatPayer ? "Тийм" : "Үгүй"}
                </span>
                <button type="button"
                  disabled={mongoVerified}
                  onClick={() => setVatPayer(v => !v)}
                  className={`relative inline-flex w-9 h-5 rounded-full transition-colors duration-200 ${vatPayer ? "bg-primary" : "bg-border"} ${mongoVerified ? "cursor-not-allowed" : "cursor-pointer"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${vatPayer ? "translate-x-4" : ""}`} />
                </button>
              </div>

              {/* E-Mongolia section (inlined) */}
              <div className="border-t border-border/60 pt-4">
                <div className={`rounded-xl border p-4 transition-colors ${mongoVerified ? "bg-green-50 border-green-200" : "bg-blue-50/60 border-blue-200"}`}>
                  {mongoVerified ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <CheckCircle2 size={18} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-green-800">E-Mongolia баталгаажсан</p>
                        <p className="text-xs text-green-600 mt-0.5 truncate">{accInfo.name} · {accInfo.register}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-green-200/80 text-green-800 flex-shrink-0">БАТАЛГААЖСАН</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#1155CC] flex items-center justify-center flex-shrink-0 shadow-sm">
                          <BadgeCheck size={15} className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-800">E-Mongolia баталгаажуулах</p>
                          <p className="text-xs text-zinc-500 mt-0.5">Орлого авах болон банкны данс нэмэхийн өмнө шаардлагатай</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 leading-relaxed">
                        Аккаунтын мэдээлэл E-Mongolia-тай таарахгүй бол баталгаажуулалт амжилтгүй болж болно.
                      </p>
                      <button type="button" onClick={() => setMongoVerified(true)}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                        style={{ background: "linear-gradient(135deg,#1565C0,#0D47A1)" }}>
                        <Shield size={13} />E-Mongolia-аар Баталгаажуулах
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Гэрээний тохиргоо - shown only when at least one contract is signed */}
            {(signedIds.includes("music") || signedIds.includes("film") || signedIds.includes("audiobook")) && (() => {
              const activeSetups = [
                signedIds.includes("music") && musicSetup?.name ? { name: musicSetup.name, label: "Хөгжмийн лейбл", Icon: Music2, iconBg: "bg-primary", rowBg: "bg-primary/5", rowBorder: "border-primary/20" } : null,
                signedIds.includes("film")  && filmSetup?.name  ? { name: filmSetup.name,  label: "Продакшн",       Icon: Film,   iconBg: "bg-rose-600",  rowBg: "bg-rose-50",   rowBorder: "border-rose-100"  } : null,
                signedIds.includes("audiobook") && abSetup?.name ? { name: abSetup.name,   label: "Нийтлэгч",       Icon: BookOpen, iconBg: "bg-violet-600", rowBg: "bg-violet-50", rowBorder: "border-violet-100" } : null,
              ].filter(Boolean) as { name: string; label: string; Icon: React.ElementType; iconBg: string; rowBg: string; rowBorder: string }[];
              return (
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-bold text-sm text-foreground">Гэрээний тохиргоо</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Зурсан гэрээний дагуу лейбл болон продакшн үүсгэх</p>
                    </div>
                    <button type="button" onClick={() => setTab("agreements")}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 flex-shrink-0">
                      Гэрээнүүд <ChevronRight size={11} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {activeSetups.length === 0 ? (
                      <div className="py-5 text-center">
                        <p className="text-sm text-muted-foreground">Тохиргоо үүсгэгдээгүй байна</p>
                      </div>
                    ) : activeSetups.map((s, i) => (
                      <div key={i} className={`flex items-center gap-3 px-4 py-3 ${s.rowBg} border ${s.rowBorder} rounded-xl`}>
                        <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center flex-shrink-0`}>
                          <s.Icon size={14} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{s.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                        </div>
                        <span className="text-[11px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-lg flex-shrink-0">Идэвхтэй</span>
                      </div>
                    ))}
                    <button type="button"
                      onClick={() => { setLabelReqType(""); setShowLabelRequest(true); }}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold text-primary border border-primary/25 bg-primary/5 hover:bg-primary/10 transition-colors mt-1">
                      + Үүсгэх хүсэлт
                    </button>
                  </div>
                </Card>
              );
            })()}
          </div>
        )}

        {/* ══ ГЭРЭЭ ══ */}
        {tab === "agreements" && (
          <div className="space-y-4">
            {/* Status summary */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="font-bold text-sm text-foreground">Гэрээнүүд</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {signedIds.length + signedCmsIds.length} гэрээ зурагдсан
                </p>
              </div>
              {(signedIds.length + signedCmsIds.length) >= (OB_CONTRACTS.length + CMS_AGREEMENTS.length) && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                  Бүгд зурагдсан
                </span>
              )}
            </div>

            {/* All agreements — OB contracts + CMS mixed in one list */}
            <Card className="divide-y divide-border/60 overflow-hidden p-0">
              {OB_CONTRACTS.map(c => {
                const isSigned = signedIds.includes(c.id);
                const setup    = accState.setups?.[c.id];
                const signDate = accState.signedDates?.[c.id] ?? (isSigned ? "2026-07-01" : null);
                return (
                  <div key={c.id} className={`flex items-center gap-3 px-5 py-4 ${isSigned ? "bg-green-50/40" : "bg-white"}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white ${c.iconBg}`}>
                      <c.icon size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                      {isSigned
                        ? <p className="text-xs text-green-700 mt-0.5 truncate flex items-center gap-1">
                            <CheckCircle2 size={9} className="flex-shrink-0" />
                            {setup?.name ? `${setup.name} · ` : ""}{signDate}
                          </p>
                        : <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{c.desc}</p>
                      }
                    </div>
                    {isSigned ? (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button type="button"
                          onClick={() => { setPdfContractId(c.id); setShowPdfModal(true); }}
                          className="flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/20 bg-primary/5 px-2.5 h-7 rounded-lg hover:bg-primary/10 transition-colors">
                          <Eye size={11} />Харах
                        </button>
                        <button type="button"
                          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 border border-border bg-white px-2.5 h-7 rounded-lg hover:bg-muted/60 transition-colors">
                          <Download size={11} />PDF
                        </button>
                      </div>
                    ) : (
                      <button type="button"
                        onClick={() => navigate(`/account/agreement?contract=${c.id}`)}
                        className="flex items-center gap-1.5 text-xs font-bold text-amber-700 border border-amber-200 bg-amber-50 px-3 h-7 rounded-lg hover:bg-amber-100 transition-colors flex-shrink-0">
                        Гэрээ байгуулах
                      </button>
                    )}
                  </div>
                );
              })}
              {CMS_AGREEMENTS.map(c => {
                const isSigned = signedCmsIds.includes(c.id);
                return (
                  <div key={c.id} className={`flex items-center gap-3 px-5 py-4 ${isSigned ? "bg-green-50/40" : "bg-white"}`}>
                    <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <FileText size={15} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                      {isSigned
                        ? <p className="text-xs text-green-700 mt-0.5 flex items-center gap-1">
                            <CheckCircle2 size={9} className="flex-shrink-0" />Зурагдсан
                          </p>
                        : <p className="text-xs text-muted-foreground mt-0.5">{c.createdAt}-нд илгээгдсэн</p>
                      }
                    </div>
                    {isSigned ? (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button type="button"
                          onClick={() => { setPdfContractId(c.id); setShowPdfModal(true); }}
                          className="flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/20 bg-primary/5 px-2.5 h-7 rounded-lg hover:bg-primary/10 transition-colors">
                          <Eye size={11} />Харах
                        </button>
                        <button type="button"
                          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 border border-border bg-white px-2.5 h-7 rounded-lg hover:bg-muted/60 transition-colors">
                          <Download size={11} />PDF
                        </button>
                      </div>
                    ) : (
                      <button type="button"
                        onClick={() => navigate(`/account/agreement?contract=${c.id}`)}
                        className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 border border-border bg-white px-3 h-7 rounded-lg hover:bg-muted/60 transition-colors flex-shrink-0">
                        Гэрээ байгуулах
                      </button>
                    )}
                  </div>
                );
              })}
            </Card>
          </div>
        )}

        {/* ══ БАНК ══ */}
        {tab === "bank" && (
          !mongoVerified ? (
            <Card className="p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Lock size={22} className="text-muted-foreground" />
              </div>
              <p className="font-bold text-foreground mb-2">Баталгаажуулалт шаардлагатай</p>
              <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto leading-relaxed">
                Банкны мэдээлэл нэмэхийн өмнө <strong>Мэдээлэл</strong> хэсэгт E-Mongolia-аар баталгаажуулна уу.
              </p>
              <button type="button" onClick={() => setTab("info")}
                className="inline-flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))" }}>
                Мэдээлэл хэсэгт очих <ArrowUpRight size={14} />
              </button>
            </Card>
          ) : (
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-secondary border border-border/60 flex items-center justify-center flex-shrink-0">
                  <CreditCard size={17} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">Банкны данс</p>
                  {bankSubmitted
                    ? <p className="text-xs text-amber-600 flex items-center gap-1 mt-0.5"><Clock size={10} />Хянагдаж байна · 1–3 өдөр</p>
                    : <p className="text-xs text-muted-foreground mt-0.5">Орлого авах дансны мэдээлэл</p>}
                </div>
              </div>

              {bankSubmitted ? (
                <div className="space-y-3">
                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center gap-2.5">
                    <Clock size={13} className="text-amber-500 flex-shrink-0" />
                    <p className="text-xs text-amber-700">Дансны мэдээлэл хянагдаж байна — 1–3 ажлын өдөр.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[["Эзэмшигч", bankHolderName || "—"], ["Банк", bankName || "—"], ["Данс", bankNumber || "—"]].map(([k, v]) => (
                      <div key={k} className="bg-muted/40 rounded-xl px-3.5 py-2.5 border border-border/60">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">{k}</p>
                        <p className="text-sm font-semibold mt-0.5 truncate text-foreground">{v}</p>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => setBankSubmitted(false)}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    <Pencil size={11} />Засах
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase block mb-1.5">
                      Дансны эзэмшигчийн нэр <span className="text-red-500">*</span>
                    </label>
                    <input value={bankHolderName} onChange={e => setBankHolderName(e.target.value)}
                      placeholder={accInfo.name}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none focus:ring-2 transition-colors bg-background ${bankNameMismatch ? "border-red-400 bg-red-50/20 focus:ring-red-400/20 focus:border-red-400" : "border-border focus:ring-primary/20 focus:border-primary"}`} />
                    {bankNameMismatch ? (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle size={11} />Нэр «{accInfo.name}» байх ёстой</p>
                    ) : bankHolderName.trim() ? (
                      <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1"><CheckCircle2 size={11} />Нэр таарч байна</p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">Аккаунтын нэртэй яг таарах ёстой: <strong>{accInfo.name}</strong></p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase block mb-1.5">Банк <span className="text-red-500">*</span></label>
                      <select value={bankName} onChange={e => setBankName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer">
                        <option value="">Банк сонгох</option>
                        {["Хаан банк","ТДБ","Голомт банк","Капитал банк","Богд банк","Иргэний банк","Зоос банк","Хас банк"].map(b => (
                          <option key={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase block mb-1.5">Дансны дугаар <span className="text-red-500">*</span></label>
                      <input value={bankNumber} onChange={e => setBankNumber(e.target.value)}
                        placeholder="0000000000"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background" />
                    </div>
                  </div>
                  <button type="button"
                    disabled={!bankHolderName.trim() || bankNameMismatch || !bankNumber.trim() || !bankName}
                    onClick={() => setBankSubmitted(true)}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))" }}>
                    Дансны мэдээлэл илгээх
                  </button>
                </div>
              )}
            </Card>
          )
        )}

        {/* ══ ҮЙЛ АЖИЛЛАГАА ══ */}
        {tab === "security" && (
          <Card className="p-5">
            <div className="mb-4">
              <p className="font-bold text-sm text-foreground">Аккаунтын өөрчлөлтүүд</p>
              <p className="text-xs text-muted-foreground mt-0.5">Аккаунтад хийгдсэн бүх өөрчлөлтийн бүртгэл</p>
            </div>
            <div className="space-y-2">
              {ACCOUNT_LOG.map((entry, i) => {
                const Icon = entry.icon;
                return (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/50">
                    <div className={`w-8 h-8 rounded-xl ${entry.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon size={13} className={entry.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-tight">{entry.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{entry.detail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground/70 flex-shrink-0 whitespace-nowrap text-right">{entry.time}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </Shell>
  );
}
