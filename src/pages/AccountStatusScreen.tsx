import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  User, CreditCard, AlertCircle, Clock, CheckCircle2,
  Building2, Shield, Tag, BadgeCheck, Lock, FileText,
  ChevronRight, Receipt, Pencil, ArrowUpRight, MessageSquare, Send,
  Music2, Film, BookOpen, X, Download, Eye, Check,
} from "lucide-react";

const BANKS = ["Хаан банк","ТДБ","Голомт банк","Капитал банк","Богд банк","Иргэний банк","Зоос банк","Хас банк"];

function BankSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <SelectInput value={value} onChange={onChange} options={BANKS} placeholder="Банк сонгох" />;
}
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { SelectInput } from "@/components/ui/SelectInput";
import { Btn } from "@/components/ui/Btn";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import * as Dialog from "@radix-ui/react-dialog";
import { OB_CONTRACTS } from "@/data/agreements";
import { CMS_AGREEMENTS } from "@/data/cms-agreements";
import { getAccountState, patchAccountState } from "@/data/ob-state";

type AccountTab = "info" | "agreements" | "bank" | "security";

function AccountDialog({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <Dialog.Root open onOpenChange={open => { if (!open) onClose(); }}><Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-sm" />
    <Dialog.Content className="fixed left-1/2 top-1/2 z-[201] max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl outline-none">
      <Dialog.Title className="sr-only">{title}</Dialog.Title>
      <Dialog.Description className="sr-only">Хүсэлтийн мэдээллээ бөглөөд илгээнэ үү.</Dialog.Description>
      <Dialog.Close aria-label="Цонх хаах" className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"><X size={17} /></Dialog.Close>
      {children}
    </Dialog.Content>
  </Dialog.Portal></Dialog.Root>;
}

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
  const [searchParams] = useSearchParams();
  const accState = getAccountState();

  const [demoAccType, setDemoAccType] = useState<"individual" | "org">(() => getAccountState().accountType || "individual");
  const [mongoVerified, setMongoVerified]       = useState(() => getAccountState().kycVerified);
  const [showLabelRequest, setShowLabelRequest] = useState(() => ["music", "film", "audiobook"].includes(searchParams.get("setup") ?? ""));
  const initialTab = (searchParams.get("tab") as AccountTab | null) ?? "info";
  const [tab, setTab] = useState<AccountTab>(
    TABS.some(t => t.id === initialTab) ? initialTab : "info"
  );
  const [vatPayer, setVatPayer] = useState(() => getAccountState().vatPayer);

  const [bankHolderName, setBankHolderName] = useState("");
  const [bankNumber, setBankNumber]         = useState("");
  const [bankName, setBankName]             = useState("");
  const [bankSubmitted, setBankSubmitted]   = useState(false);

  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportReason, setSupportReason]       = useState("");
  const [supportSent, setSupportSent]           = useState(false);

  const [showPdfModal, setShowPdfModal]     = useState(false);
  const [pdfContractId, setPdfContractId]   = useState<string | null>(null);
  const [labelReqType, setLabelReqType]     = useState(() => searchParams.get("setup") ?? "");
  const [labelReqName, setLabelReqName]     = useState("");
  const [labelReqSent, setLabelReqSent]     = useState(false);

  type LabelReqStatus = "pending" | "active";
  interface LabelRequest { id: string; name: string; status: LabelReqStatus; }
  const [labelRequests, setLabelRequests] = useState<LabelRequest[]>([]);

  const [signedCmsIds] = useState<string[]>(() => {
    try {
      const saved = Object.keys(getAccountState().signatures ?? {}).filter(id => CMS_AGREEMENTS.some(contract => contract.id === id));
      return Array.isArray(saved) ? saved.filter((value): value is string => typeof value === "string") : [];
    } catch { return []; }
  });

  const isOrg = demoAccType === "org";
  const accInfo = isOrg
    ? { initials: "SR", name: accState.accountType === "org" ? accState.partyName || "Steppe Records ХХК" : "Steppe Records ХХК", register: accState.accountType === "org" ? accState.partyRegister || "1234567" : "1234567", taxNo: "7711223344" }
    : { initials: "БЖ", name: [accState.lastName, accState.firstName].filter(Boolean).join(" ") || "Болд Жаргал", register: accState.accountType === "individual" ? accState.partyRegister || "УН12345678" : "УН12345678", taxNo: "9900112233" };
  const switchAccountType = () => {
    const nextType = isOrg ? "individual" : "org";
    patchAccountState({ accountType: nextType, partyName: nextType === "org" ? "Steppe Records ХХК" : [accState.lastName, accState.firstName].filter(Boolean).join(" ") || "Болд Жаргал", partyRegister: nextType === "org" ? "1234567" : "УН12345678" });
    setDemoAccType(nextType);
  };

  const bankNameMismatch = bankHolderName.trim() !== "" && bankHolderName.trim() !== accInfo.name;
  const setupSteps: { label: string; done: boolean; target: AccountTab }[] = [
    { label: "Баталгаажуулалт", done: mongoVerified, target: "info" },
    { label: "Гэрээ", done: accState.signedContracts.length > 0, target: "agreements" },
    { label: "Банкны данс", done: bankSubmitted, target: "bank" },
  ];
  const completionPct = Math.round(setupSteps.filter(step => step.done).length / setupSteps.length * 100);

  const tabStatus: Record<AccountTab, "ok" | "warn" | "none"> = {
    info:       mongoVerified ? "ok" : "warn",
    agreements: accState.signedContracts.length > 0 ? "ok" : "warn",
    bank:       bankSubmitted ? "ok" : "warn",
    security:   "none",
  };

  // Signed contracts from account state (fallback: demo shows music signed)
  const signedIds: string[] = accState.signedContracts;

  const printContract = (title: string, text: string, signedDate: string) => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>
  body { font-family: 'Segoe UI', sans-serif; font-size: 11px; color: #1a1a1a; margin: 40px; line-height: 1.7; }
  h1 { font-size: 16px; font-weight: 800; margin-bottom: 4px; }
  .meta { font-size: 10px; color: #666; margin-bottom: 24px; }
  .party { background: #f8f8f8; border: 1px solid #ddd; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; }
  .party-label { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #999; letter-spacing: 0.08em; margin-bottom: 4px; }
  .party-name { font-size: 13px; font-weight: 700; }
  .party-reg { font-size: 10px; color: #555; margin-top: 2px; }
  pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; font-size: 11px; line-height: 1.7; }
  .footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 16px; font-size: 10px; color: #888; }
  @media print { body { margin: 20px; } }
</style></head><body>
<h1>${title}</h1>
<div class="meta">Зурагдсан огноо: ${signedDate} &nbsp;·&nbsp; Buteel Platform</div>
<div class="party">
  <div class="party-label">Гэрээ байгуулах этгээд</div>
  <div class="party-name">${accInfo.name}</div>
  <div class="party-reg">Регистр / ТТД: ${accInfo.register}</div>
</div>
<pre>${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
<div class="footer">© Buteel Platform · ${new Date().getFullYear()} · Хэвлэгдсэн: ${new Date().toLocaleString("mn-MN")}</div>
</body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); }, 400);
  };

  // Setup data from account state
  const musicSetup = accState.setups?.["music"];
  const filmSetup  = accState.setups?.["film"];
  const abSetup    = accState.setups?.["audiobook"];

  return (
    <Shell title="Аккаунтын тохиргоо">
      {/* Support modal */}
      {showSupportModal && supportSent && <SuccessDialog open title="Хүсэлт илгээгдсэн" description="Таны мэдээлэл өөрчлөх хүсэлтийг 1–3 ажлын өдрийн дотор хянана." onContinue={() => { setShowSupportModal(false); setSupportSent(false); setSupportReason(""); }} />}
      {showSupportModal && !supportSent && (
        <AccountDialog title="Мэдээлэл өөрчлөх хүсэлт" onClose={() => setShowSupportModal(false)}>
          <div className="p-5 pt-7 sm:p-6 sm:pt-7">
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
                    <p className="text-xs text-muted-foreground mt-1">Өөрчлөх мэдээлэл болон шалтгаанаа бичнэ үү.</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 mb-4 leading-relaxed">
                  Баталгаажсан мэдээллийн өөрчлөлтийг хүсэлтээр хянуулна.
                </p>
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">
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
        </AccountDialog>
      )}

      {showLabelRequest && (() => {
        const options = [
          { id: "music", label: "Лейбл", icon: Music2, example: "Steppe Records" },
          { id: "film", label: "Продакшн", icon: Film, example: "Nomad Films" },
          { id: "audiobook", label: "Нийтлэгч", icon: BookOpen, example: "Heritage Books" },
        ].filter(option => signedIds.includes(option.id));
        const selected = options.find(option => option.id === labelReqType);
        if (labelReqSent) return <SuccessDialog open title="Хүсэлт илгээгдсэн" description={`${labelReqName} · Хүсэлтийг зөвшөөрсний дараа идэвхтэй болно.`} onContinue={() => { setShowLabelRequest(false); setLabelReqSent(false); }} />;
        return <AccountDialog title="Нэмэх хүсэлт" onClose={() => setShowLabelRequest(false)}>
          <div className="p-5 sm:p-6">
            <div className="mb-5 border-b border-border/50 pb-4 pr-8">
              <h3 className="text-base font-semibold text-foreground">{labelReqSent ? "Хүсэлт илгээгдсэн" : selected ? selected.label + " нэмэх хүсэлт" : "Нэмэх хүсэлт"}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{labelReqSent ? "Хүсэлтийг зөвшөөрсний дараа нэр идэвхтэй болно." : "Гэрээний төрөлдөө тохирох нэрийг бүртгүүлнэ үү."}</p>
            </div>
            {labelReqSent ? <>
              <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4"><CheckCircle2 size={20} className="shrink-0 text-green-600" /><div className="min-w-0"><p className="break-words text-sm font-medium text-green-900">{labelReqName}</p><p className="mt-1 text-xs text-green-700">{selected?.label} · Хүсэлт илгээгдсэн</p></div></div>
              <div className="mt-5 flex justify-end"><Btn onClick={() => { setShowLabelRequest(false); setLabelReqSent(false); }}>Хаах</Btn></div>
            </> : <>
              <p className="mb-2 text-sm font-medium text-foreground">Төрөл</p>
              <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {options.map(option => <button key={option.id} type="button" aria-pressed={labelReqType === option.id} onClick={() => setLabelReqType(option.id)} className={"flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-xs font-medium " + (labelReqType === option.id ? "border-primary/40 bg-primary/5 text-primary" : "border-border text-muted-foreground hover:bg-muted/30")}><option.icon size={16} className="shrink-0" />{option.label}{labelReqType === option.id && <Check size={13} className="ml-auto shrink-0" />}</button>)}
              </div>
              <label htmlFor="account-setup-name" className="mb-2 block text-sm font-medium">{selected?.label || "Бүртгүүлэх"} нэр <span className="text-destructive">*</span></label>
              <input id="account-setup-name" required value={labelReqName} onChange={event => setLabelReqName(event.target.value)} placeholder={selected ? "Жишээ: " + selected.example : "Нэр оруулах"} className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
              <div className="mt-6 flex justify-end gap-3 border-t border-border/50 pt-4"><Btn variant="secondary" onClick={() => setShowLabelRequest(false)}>Болих</Btn><Btn disabled={!selected || !labelReqName.trim()} icon={<Send size={14} />} onClick={() => {
                if (!selected || !labelReqName.trim()) return;
                setLabelRequests(previous => [...previous.filter(request => request.id !== labelReqType), { id: labelReqType, name: labelReqName.trim(), status: "pending" }]);
                setLabelReqSent(true);
              }}>Хүсэлт илгээх</Btn></div>
            </>}
          </div>
        </AccountDialog>;
      })()}

      {/* PDF Viewer Modal */}
      {showPdfModal && (() => {
        const ob  = OB_CONTRACTS.find(c => c.id === pdfContractId);
        const cms = CMS_AGREEMENTS.find(c => c.id === pdfContractId);
        const title = ob?.name ?? cms?.name ?? "";
        const text  = ob?.contractText ?? cms?.contractText ?? "";
        const icon  = ob?.icon ?? FileText;
        const iconBg = ob?.iconBg ?? "bg-blue-600";
        const signedDate = accState.signedDates?.[ob?.id ?? cms?.id ?? ""] ?? "—";
        const contractId = ob?.id ?? cms?.id ?? "";
        const signature = accState.signatures?.[contractId];
        const party = accState.contractParties?.[contractId] ?? { name: accInfo.name, register: accInfo.register };
        const Icon = icon;
        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
            onClick={() => setShowPdfModal(false)}>
            <div className="bg-card rounded-t-3xl sm:rounded-2xl shadow-2xl border border-border w-full sm:w-[calc(100%-48px)] sm:max-w-4xl h-[90dvh] max-h-[90dvh] flex flex-col"
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
                  <p className="text-xs text-green-600 mt-0.5">{party.name} · {party.register || "—"}</p>
                  {party.accountType === "org" && <p className="mt-1 text-xs text-muted-foreground">Байгууллагыг төлөөлж гарын үсэг зурсан: {party.signerName || "—"}</p>}
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto mx-5 mb-4 mt-2">
                <div className="bg-muted/20 border border-border rounded-xl p-5 sm:p-8 text-sm text-foreground/80 leading-7 whitespace-pre-wrap">
                  {text}
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border p-4"><p className="text-sm font-medium">Гарын үсэг зурсан хэрэглэгч</p><p className="mt-1 text-xs text-muted-foreground">{party.signerName || party.name}</p>{signature && <img src={signature} alt="Хэрэглэгчийн зурсан гарын үсэг" className="mt-3 h-24 w-full object-contain" />}</div>
                  {accState.platformSignature && <div className="rounded-xl border border-border p-4"><p className="text-sm font-medium">Түгээгчийн гарын үсэг</p><img src={accState.platformSignature} alt="Түгээгчийн баталсан гарын үсэг" className="mt-3 h-24 w-full object-contain" /></div>}
                </div>
              </div>
              <div className="flex gap-3 px-5 pb-5 flex-shrink-0 border-t border-border pt-4">
                <button type="button"
                  onClick={() => printContract(title, text, signedDate)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
                  <Download size={14} />Хэвлэх / PDF
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

      <div className="max-w-3xl space-y-5 [&_input]:text-sm [&_textarea]:text-sm">
        <Card className="overflow-hidden">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:p-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary sm:h-20 sm:w-20">{isOrg ? <Building2 size={30} strokeWidth={1.5} /> : <User size={30} strokeWidth={1.5} />}</div>
            <div className="min-w-0 flex-1">
              <p className="break-words text-base font-semibold leading-relaxed text-foreground">{accInfo.name}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button type="button" onClick={switchAccountType} title="Аккаунтын төрөл солих" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-2 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary">{isOrg ? <Building2 size={12} /> : <User size={12} />}{isOrg ? "Байгууллага" : "Хувь хүн"}</button>
                <span className={"inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs " + (mongoVerified ? "border-green-200 bg-green-50 text-green-700" : "border-border bg-muted/30 text-muted-foreground")}><BadgeCheck size={12} className="shrink-0" />E-Mongolia{!mongoVerified && " · Баталгаажаагүй"}</span>
              </div>
            </div>
            <div className="col-span-2 ml-auto w-36 text-right sm:col-span-1 sm:self-start">
              <p className="text-xs text-muted-foreground">Тохиргооны явц</p>
              <p className="mt-1 text-base font-semibold tabular-nums text-primary">{completionPct}%</p>
              <progress value={completionPct} max={100} aria-label="Аккаунтын тохиргооны явц" className="mt-2 block h-1.5 w-full overflow-hidden rounded-full appearance-none [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-primary" />
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div role="group" aria-label="Аккаунтын хэсгүүд" className="grid grid-cols-2 gap-1.5 bg-muted/30 p-1.5 rounded-2xl border border-border sm:grid-cols-4">
          {TABS.map(t => {
            const st = tabStatus[t.id];
            const active = tab === t.id;
            const Icon = t.icon;
            return (
              <button key={t.id} type="button" onClick={() => setTab(t.id)} aria-label={t.label} aria-pressed={active}
                className={`min-w-0 flex items-center justify-center gap-2 px-2 py-3 rounded-xl text-xs font-semibold transition-all focus-visible:outline-primary ${
                  active ? "bg-card text-primary shadow-sm ring-1 ring-border" : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                }`}>
                <Icon size={15} className="shrink-0" />
                <span>{t.label}</span>
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
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4 mb-5">
                <div>
                  <p className="font-bold text-sm text-foreground">Аккаунтын мэдээлэл</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {"Татварын болон бүртгэлийн мэдээлэл"}
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 mb-5">
                {[
                  [isOrg ? "Байгууллагын нэр" : "Овог нэр", accInfo.name, ""],
                  ["Регистр дугаар", accInfo.register, ""],
                  ["ТТД дугаар",     accInfo.taxNo,    ""],
                ].map(([k, v, span]) => (
                  <div key={k} className={`min-w-0 border-b border-border/60 pb-4 last:border-b-0 last:pb-0 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6 sm:last:border-r-0 sm:last:pr-0 ${span}`}>
                    <p className="text-xs text-muted-foreground mb-1.5">{k}</p>
                    <p className="text-sm font-medium text-foreground break-words">{v}</p>
                  </div>
                ))}
              </div>

              {/* VAT toggle row — locked once E-Mongolia verified */}
              <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border mb-5 ${mongoVerified ? "bg-zinc-50 border-border/40 opacity-70" : "bg-muted/30 border-border/50"}`}>
                <span className="text-xs text-foreground flex-1">НӨАТ төлөгч эсэх</span>
                {mongoVerified && <Lock size={10} className="text-zinc-400 flex-shrink-0" />}
                <span className={`text-xs font-semibold ${vatPayer ? "text-primary" : "text-muted-foreground"}`}>
                  {vatPayer ? "Тийм" : "Үгүй"}
                </span>
                <button type="button"
                  disabled={mongoVerified}
                  onClick={() => setVatPayer(v => { const next = !v; patchAccountState({ vatPayer: next }); return next; })}
                  className={`relative inline-flex w-9 h-5 rounded-full transition-colors duration-200 ${vatPayer ? "bg-primary" : "bg-border"} ${mongoVerified ? "cursor-not-allowed" : "cursor-pointer"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${vatPayer ? "translate-x-4" : ""}`} />
                </button>
              </div>

              {/* E-Mongolia section (inlined) */}
              <div className="border-t border-border/60 pt-4">
                <div className={`rounded-xl border p-4 transition-colors ${mongoVerified ? "bg-green-50/50 border-green-200" : "bg-card border-border"}`}>
                  {mongoVerified ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <CheckCircle2 size={18} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">E-Mongolia</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Баталгаажуулсан огноо: {accState.kycVerifiedAt ? new Date(accState.kycVerifiedAt).toLocaleDateString("mn-MN") : "—"}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#1155CC] flex items-center justify-center flex-shrink-0 shadow-sm">
                          <BadgeCheck size={15} className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">E-Mongolia баталгаажуулалт</p>
                          <p className="text-xs text-zinc-500 mt-0.5">Орлого авах болон банкны данс нэмэхийн өмнө шаардлагатай</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 rounded-xl border border-amber-200/60 bg-amber-50/60 px-3.5 py-3">
                        <AlertCircle size={15} className="mt-0.5 shrink-0 text-amber-600" />
                        <p className="text-xs leading-relaxed text-amber-800/80">Аккаунтын мэдээлэл E-Mongolia-тай таарахгүй бол баталгаажуулалт амжилтгүй болж болно.</p>
                      </div>
                      <button type="button" onClick={() => { setMongoVerified(true); patchAccountState({ kycVerified: true, kycVerifiedAt: new Date().toISOString() }); }}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                        style={{ background: "linear-gradient(135deg,#1565C0,#0D47A1)" }}>
                        <Shield size={13} />E-Mongolia-аар баталгаажуулах
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Гэрээний тохиргоо */}
            {(signedIds.includes("music") || signedIds.includes("film") || signedIds.includes("audiobook")) && (() => {
              const TYPE_META: Record<string, { label: string; Icon: React.ElementType; iconBg: string; rowBg: string; rowBorder: string }> = {
                music:     { label: "Хөгжмийн лейбл", Icon: Music2,   iconBg: "bg-primary",    rowBg: "bg-primary/5",  rowBorder: "border-primary/20"   },
                film:      { label: "Продакшн",        Icon: Film,     iconBg: "bg-rose-600",   rowBg: "bg-rose-50",    rowBorder: "border-rose-100"     },
                audiobook: { label: "Нийтлэгч",        Icon: BookOpen, iconBg: "bg-violet-600", rowBg: "bg-violet-50",  rowBorder: "border-violet-100"   },
              };

              // Onboarding-аас үүссэн идэвхтэй тохиргоо
              const activeSetups = [
                signedIds.includes("music")     && musicSetup?.name ? { id: "music",     name: musicSetup.name } : null,
                signedIds.includes("film")      && filmSetup?.name  ? { id: "film",      name: filmSetup.name  } : null,
                signedIds.includes("audiobook") && abSetup?.name    ? { id: "audiobook", name: abSetup.name    } : null,
              ].filter(Boolean) as { id: string; name: string }[];

              const activeIds = new Set(activeSetups.map(s => s.id));

              // Шинэ хүсэлтүүд (onboarding-аас давхардахгүй)
              const pendingOrNew = labelRequests.filter(r => !activeIds.has(r.id));

              const allRows = [
                ...activeSetups.map(s => ({ ...s, status: "active" as const })),
                ...pendingOrNew,
              ];

              return (
                <Card className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4 mb-4">
                    <div>
                      <p className="font-semibold text-sm text-foreground">Лейбл, продакшн, нийтлэгч</p>
                      <p className="text-xs text-muted-foreground mt-1">Контент оруулахад ашиглах үндсэн нэрүүд</p>
                    </div>
                    <button type="button" onClick={() => setTab("agreements")}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 flex-shrink-0">
                      Гэрээнүүд <ChevronRight size={11} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {allRows.length === 0 ? (
                      <div className="py-5 text-center">
                        <p className="text-sm text-muted-foreground">Тохиргоо үүсгэгдээгүй байна</p>
                      </div>
                    ) : allRows.map((row) => {
                      const meta = TYPE_META[row.id];
                      if (!meta) return null;
                      const isActive = row.status === "active";
                      return (
                        <div key={row.id} className="grid grid-cols-[36px_minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-xl border border-border/60 bg-muted/15 px-4 py-3 sm:grid-cols-[36px_minmax(0,1fr)_auto]">
                          <div className={`w-9 h-9 rounded-xl ${meta.iconBg} flex items-center justify-center flex-shrink-0`}>
                            <meta.Icon size={14} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground break-words">{row.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{meta.label}</p>
                          </div>
                          <div className="col-start-2 flex items-center gap-2 sm:col-start-auto sm:justify-end">
                            {isActive ? (
                              <span className="text-[11px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-lg">Идэвхтэй</span>
                            ) : (
                              <>
                                <span className="text-[11px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                                  <Clock size={9} />Хүсэлт илгээгдсэн
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <button type="button"
                      onClick={() => { setLabelReqType(""); setLabelReqName(""); setLabelReqSent(false); setShowLabelRequest(true); }}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold text-primary border border-primary/25 bg-primary/5 hover:bg-primary/10 transition-colors mt-1">
                      + Нэмэх хүсэлт
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
                  <div key={c.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white ${c.iconBg}`}>
                      <c.icon size={15} />
                    </div>
                    <div className="min-w-0 flex-[1_1_calc(100%-52px)] sm:flex-1">
                      <p className="text-sm font-medium text-foreground break-words">{c.name}</p>
                      {isSigned
                        ? <p className="text-xs text-green-700 mt-0.5 flex items-center gap-1">
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
                          onClick={() => printContract(c.name, c.contractText, signDate || "—")}
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
                  <div key={c.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <FileText size={15} className="text-white" />
                    </div>
                    <div className="min-w-0 flex-[1_1_calc(100%-52px)] sm:flex-1">
                      <p className="text-sm font-medium text-foreground break-words">{c.name}</p>
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
                        <button type="button" onClick={() => printContract(c.name, c.contractText, "—")}
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
                        <p className="text-[10px] font-bold normal-case text-muted-foreground">{k}</p>
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
                    <label className="text-sm font-medium text-muted-foreground block mb-2">
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
                      <label className="text-sm font-medium text-muted-foreground block mb-2">Банк <span className="text-red-500">*</span></label>
                      <BankSelect value={bankName} onChange={setBankName} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-2">Дансны дугаар <span className="text-red-500">*</span></label>
                      <input value={bankNumber} onChange={e => setBankNumber(e.target.value)}
                        placeholder="IBAN дугаар"
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

        {tab === "security" && (
          <Card className="p-5">
            <h2 className="text-sm font-semibold">Үйл ажиллагааны бүртгэл</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Аккаунттай холбоотой үйлдэл, өөрчлөлтийн түүх</p>
            <ol className="mt-4 space-y-2">
              {ACCOUNT_LOG.map(entry => <li key={entry.time} className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-3.5 py-3">
                <span className={"flex h-8 w-8 shrink-0 items-center justify-center rounded-lg " + entry.bg}><entry.icon size={15} className={entry.color} /></span>
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-medium leading-relaxed text-foreground">{entry.label}</p>
                  <p className="mt-0.5 break-words text-xs leading-relaxed text-muted-foreground">{entry.detail}</p>
                </div>
                <time dateTime={entry.time.replace(" ", "T")} className="shrink-0 text-right text-[11px] leading-relaxed tabular-nums text-muted-foreground">
                  <span className="block">{entry.time.split(" ")[0]}</span>
                  <span className="mt-0.5 block">{entry.time.split(" ")[1]}</span>
                </time>
              </li>)}
            </ol>
          </Card>
        )}
      </div>
    </Shell>
  );
}
