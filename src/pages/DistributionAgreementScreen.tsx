import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  CheckCircle2, ArrowLeft, ChevronDown, ChevronUp,
  Check, Pencil, RotateCcw, FileText,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { ContractPartyInfo } from "@/components/ui/ContractPartyInfo";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { OB_CONTRACTS } from "@/data/agreements";
import { CMS_AGREEMENTS } from "@/data/cms-agreements";
import { getAccountState, addSignedContract, patchAccountState } from "@/data/ob-state";
import type { ContractId } from "@/data/ob-state";

type SignStep = "read" | "sign";

interface SignState {
  step: SignStep;
  scrolledToBottom: boolean;
  agreed: boolean;
  signature: string;
}

function defaultSignState(): SignState {
  return { step: "read", scrolledToBottom: false, agreed: false, signature: "" };
}

// Normalise OB + CMS contracts to a single shape for rendering
type DisplayContract = {
  id: string;
  name: string;
  desc: string;
  contractText: string;
  iconBg: string;
  Icon: React.ElementType;
  isCms: boolean;
  signedDate?: string;
  setupName?: string;
};

export default function DistributionAgreementScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contractParam = searchParams.get("contract");

  const [accState, setAccState] = useState(() => getAccountState());
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [signing, setSigning]     = useState<string | null>(null);
  const [signedSuccess, setSignedSuccess] = useState<DisplayContract | null>(null);
  const signerName = [accState.lastName, accState.firstName].filter(Boolean).join(" ");
  const contractParty = {
    name: accState.accountType === "org" ? accState.partyName || "Steppe Records ХХК" : signerName,
    register: accState.partyRegister || "",
    signerName,
    accountType: accState.accountType ?? "individual" as const,
  };
  const [signStates, setSignStates] = useState<Record<string, SignState>>({});
  const [signedCmsIds, setSignedCmsIds] = useState<string[]>(() =>
    Object.keys(getAccountState().signatures ?? {}).filter(id => CMS_AGREEMENTS.some(contract => contract.id === id))
  );

  const scrollRefs   = useRef<Record<string, HTMLDivElement | null>>({});
  const canvasRefs   = useRef<Record<string, HTMLCanvasElement | null>>({});
  const isDrawingRef  = useRef(false);
  const hasInkRef = useRef(false);
  const lastPosRef    = useRef({ x: 0, y: 0 });

  const obSignedIds = accState.signedContracts;

  // Build normalised list
  const allContracts: DisplayContract[] = [
    ...OB_CONTRACTS.map(c => ({
      id: c.id,
      name: c.name,
      desc: c.desc,
      contractText: c.contractText,
      iconBg: c.iconBg,
      Icon: c.icon,
      isCms: false,
      signedDate: accState.signedDates?.[c.id],
      setupName: accState.setups?.[c.id]?.name,
    })),
    ...CMS_AGREEMENTS.map(c => ({
      id: c.id,
      name: c.name,
      desc: c.desc,
      contractText: c.contractText,
      iconBg: "bg-blue-500",
      Icon: FileText,
      isCms: true,
    })),
  ];

  const isSingleMode = !!contractParam;
  const visibleContracts = contractParam
    ? allContracts.filter(c => c.id === contractParam)
    : allContracts.filter(c => !c.isCms); // full list shows only OB contracts

  const isContractSigned = (c: DisplayContract) =>
    c.isCms ? signedCmsIds.includes(c.id) : obSignedIds.includes(c.id as ContractId);

  const getSignState = (id: string): SignState => signStates[id] ?? defaultSignState();

  const patchSign = (id: string, patch: Partial<SignState>) => {
    setSignStates(prev => ({ ...prev, [id]: { ...(prev[id] ?? defaultSignState()), ...patch } }));
  };

  const startSigning = (id: string) => {
    setSigning(id);
    setExpanded(null);
    if (!signStates[id]) patchSign(id, defaultSignState());
  };

  const cancelSigning = () => {
    setSigning(null);
    setSignedSuccess(null);
  };

  // Auto-start if ?contract= provided and not yet signed
  useEffect(() => {
    if (!contractParam) return;
    const target = allContracts.find(c => c.id === contractParam);
    if (target && !isContractSigned(target)) {
      startSigning(contractParam);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCanvasPos = (id: string, e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRefs.current[id]!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDraw = (id: string, e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!e.isPrimary || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    hasInkRef.current = false;
    isDrawingRef.current = true;
    lastPosRef.current = getCanvasPos(id, e);
  };

  const draw = (id: string, e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRefs.current[id]!;
    const ctx = canvas.getContext("2d")!;
    const pos = getCanvasPos(id, e);
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#18181b";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    hasInkRef.current = true;
    lastPosRef.current = pos;
  };

  const stopDraw = (id: string) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = canvasRefs.current[id];
    if (canvas && hasInkRef.current) patchSign(id, { signature: canvas.toDataURL() });
  };

  const clearCanvas = (id: string) => {
    const canvas = canvasRefs.current[id]!;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    patchSign(id, { signature: "" });
  };

  const handleScroll = (id: string) => {
    const el = scrollRefs.current[id];
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      patchSign(id, { scrolledToBottom: true });
    }
  };

  const handleSubmit = (c: DisplayContract) => {
    const ss = getSignState(c.id);
    const effectiveSig = ss.signature;
    if (!ss.agreed || !effectiveSig || !signerName.trim()) return;

    if (c.isCms) {
      const updated = [...signedCmsIds, c.id];
      sessionStorage.setItem("signedCms", JSON.stringify(updated));
      setSignedCmsIds(updated);
      patchAccountState({ signatures: { ...accState.signatures, [c.id]: effectiveSig }, contractParties: { ...accState.contractParties, [c.id]: contractParty }, signedDates: { ...accState.signedDates, [c.id]: new Date().toISOString().split("T")[0] } });
      setAccState(getAccountState());
    } else {
      addSignedContract(c.id as ContractId, "", effectiveSig, contractParty);
      setAccState(getAccountState());
    }

    setSigning(null);
    setSignStates(prev => { const n = { ...prev }; delete n[c.id]; return n; });

    setSignedSuccess(c);
  };

  const signedCount = obSignedIds.length + signedCmsIds.length;

  return (
    <Shell title={isSingleMode ? (visibleContracts[0]?.name ?? "Гэрээ") : "Гэрээнүүд"}>
      <SuccessDialog open={!!signedSuccess} title="Гэрээ амжилттай байгууллаа" description={`${signedSuccess?.name ?? "Гэрээ"}-д гарын үсэг зурж баталгаажууллаа. ${signedSuccess?.isCms ? "Баталгаажсан гэрээг гэрээний хэсгээс харах боломжтой." : `Одоо аккаунтын мэдээлэл хэсэгт ${signedSuccess?.id === "music" ? "лейбл" : signedSuccess?.id === "film" ? "продакшн" : "нийтлэгч"} нэмэх хүсэлтээ үүсгэнэ үү.`}`} buttonLabel={signedSuccess?.isCms ? "Дуусгах" : "Мэдээлэл хэсэгт очих"} onContinue={() => { const contract = signedSuccess; setSignedSuccess(null); navigate(contract?.isCms ? "/account?tab=agreements" : `/account?tab=info&setup=${contract?.id}`); }} />
      <div className="max-w-3xl space-y-5">
        <button type="button" onClick={() => navigate("/account")}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors">
          <ArrowLeft size={16} />Аккаунтад буцах
        </button>

        {/* Summary — only on full list mode */}
        {!isSingleMode && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/40 border border-border">
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{signedCount} идэвхтэй гэрээ</p>
              <p className="text-xs text-muted-foreground mt-0.5">{OB_CONTRACTS.length - obSignedIds.length} гэрээ байгуулагдаагүй</p>
            </div>
            {obSignedIds.length === OB_CONTRACTS.length && (
              <span className="flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-lg">
                <CheckCircle2 size={12} />Бүгд зурагдсан
              </span>
            )}
          </div>
        )}

        <div className="space-y-3">
          {visibleContracts.map(c => {
            const isSigned   = isContractSigned(c);
            const isExpanded = expanded === c.id;
            const isSigning  = signing === c.id;
            const ss         = getSignState(c.id);
            const effectiveSig = ss.signature;
            const canSubmit  = ss.agreed && !!effectiveSig;
            const { Icon }   = c;

            return (
              <Card key={c.id} className="overflow-hidden p-0">
                {/* Header */}
                <div className="px-5 py-4 flex flex-wrap items-center gap-3 bg-card">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.iconBg} text-white`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-[1_1_calc(100%-56px)] sm:flex-1">
                    <p className="font-semibold text-sm text-zinc-900">{c.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 break-words">
                      {isSigned && c.signedDate ? `${c.setupName ? c.setupName + " · " : ""}${c.signedDate}` : c.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isSigned ? (
                      <>
                        <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                          <CheckCircle2 size={11} />Зурагдсан
                        </span>
                        {!isSingleMode && (
                          <button type="button" onClick={() => setExpanded(isExpanded ? null : c.id)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors">
                            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                          </button>
                        )}
                      </>
                    ) : (
                      !isSigning && (
                        <Btn size="sm" onClick={() => startSigning(c.id)}>Гэрээ хийх</Btn>
                      )
                    )}
                  </div>
                </div>

                {/* Signed: expandable details (full list mode only) */}
                {!isSingleMode && isSigned && isExpanded && (
                  <div className="px-5 py-4 border-t border-zinc-100 bg-zinc-50/40 space-y-4">
                    {c.setupName && (
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-zinc-100">
                        <div className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={13} className="text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Нэр</p>
                          <p className="text-sm font-semibold text-zinc-900">{c.setupName}</p>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold normal-case text-zinc-400 mb-2">Гэрээний агуулга</p>
                      <div className="h-72 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap">
                        {c.contractText}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sign flow — inline */}
                {isSigning && (
                  <div className="border-t border-zinc-200">
                    {/* Step indicator */}
                    {(() => {
                      const stepIdx = ss.step === "sign" ? 1 : 0;
                      return (
                        <div className="flex border-b border-zinc-100">
                          {(["read", "sign"] as const).map((s, si) => {
                            const done   = si < stepIdx;
                            const active = s === ss.step;
                            return (
                              <div key={s} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                                active ? "border-primary text-primary bg-primary/5"
                                : done ? "border-transparent text-green-600"
                                : "border-transparent text-zinc-400"
                              }`}>
                                {done
                                  ? <Check size={11} className="text-green-600" />
                                  : <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border ${active ? "bg-primary text-white border-primary" : "border-zinc-300 text-zinc-400"}`}>{si + 1}</span>
                                }
                                {s === "read" ? "Унших" : "Гарын үсэг"}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}

                    <div className="p-5 space-y-4">
                      <ContractPartyInfo isOrg={contractParty.accountType === "org"} name={contractParty.name} register={contractParty.register} signerName={signerName} />
                      <div className="grid grid-cols-2 gap-2">
                        {[{ key: "read", label: "Гэрээтэй танилцах" }, { key: "sign", label: "Гарын үсэг зурах" }].map((step, index) => <div key={step.key} className={"flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium " + (ss.step === step.key ? "border-primary/30 bg-primary/5 text-primary" : "border-border bg-muted/20 text-muted-foreground")}><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[10px]">{index + 1}</span>{step.label}</div>)}
                      </div>
                      {/* Step 1: Read */}
                      {ss.step === "read" && (
                        <>
                          <div className="relative">
                            <div
                              ref={el => { scrollRefs.current[c.id] = el; }}
                              onScroll={() => handleScroll(c.id)}
                              className="h-[min(68dvh,680px)] overflow-y-auto rounded-xl border border-border bg-muted/20 p-4 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                              {c.contractText}
                            </div>
                            {!ss.scrolledToBottom && (
                              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-zinc-100 to-transparent rounded-b-xl flex items-end justify-center pb-2 pointer-events-none">
                                <span className="flex items-center gap-1 text-[11px] text-zinc-500 font-semibold bg-white/90 px-2.5 py-1 rounded-full border border-zinc-200 shadow-sm">
                                  <ChevronDown size={11} className="animate-bounce" /> гүйлгэн бүрэн уншина уу
                                </span>
                              </div>
                            )}
                            {ss.scrolledToBottom && (
                              <div className="absolute bottom-2 right-2">
                                <span className="flex items-center gap-1 text-[11px] text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                                  <Check size={10} /> Уншсан
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-3">
                            <Btn variant="secondary" onClick={cancelSigning}>Болих</Btn>
                            <Btn full disabled={!ss.scrolledToBottom} onClick={() => patchSign(c.id, { step: "sign" })}>
                              Гарын үсэг зурах
                            </Btn>
                          </div>
                        </>
                      )}

                      {/* Step 2: Sign */}
                      {ss.step === "sign" && (
                        <>
                          <div className="border border-zinc-200 rounded-xl overflow-hidden">
                            <div className="border-b border-border bg-muted/20 px-4 py-3"><p className="flex items-center gap-2 text-sm font-medium text-foreground"><Pencil size={15} />Гарын үсэг зурах</p><p className="mt-1 text-xs text-muted-foreground">Хулгана эсвэл хуруугаараа доорх талбарт зурна уу.</p></div>
<div className="p-4">
                                <div className="relative">
                                  <canvas
                                    ref={el => { canvasRefs.current[c.id] = el; }}
                                    width={800} height={260}
                                    className={`w-full rounded-lg border-2 cursor-crosshair select-none transition-colors ${
                                      ss.signature ? "border-primary bg-white" : "border-dashed border-zinc-300 bg-zinc-50"
                                    }`}
                                    style={{ height: 180, touchAction: "none" }}
                                    onPointerDown={e => startDraw(c.id, e)}
                                    onPointerMove={e => draw(c.id, e)}
                                    onPointerUp={() => stopDraw(c.id)}
                                    onPointerCancel={() => stopDraw(c.id)}
                                  />
                                  {!ss.signature && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-1.5">
                                      <Pencil size={18} className="text-zinc-300" />
                                      <p className="text-xs text-zinc-400">Энд гарын үсгээ зурна уу</p>
                                    </div>
                                  )}
                                  <div className="absolute bottom-4 left-8 right-8 h-px bg-zinc-200 pointer-events-none" />
                                  {ss.signature && (
                                    <button onClick={() => clearCanvas(c.id)}
                                      className="absolute top-2 right-2 flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 bg-white border border-zinc-200 rounded-lg px-2 py-1">
                                      <RotateCcw size={11} /> Устгах
                                    </button>
                                  )}
                                </div>
                            </div>
                          </div>

                          {!signerName && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">Гэрээнд гарын үсэг зурахын өмнө профайлын овог, нэрээ бүрэн оруулна уу.</p>}
                          <label className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors cursor-pointer ${
                            ss.agreed ? "border-primary/30 bg-primary/5" : "border-zinc-200 hover:border-zinc-300 bg-white"
                          }`}>
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              ss.agreed ? "bg-primary border-primary" : "border-zinc-300 bg-white"
                            }`}>
                              {ss.agreed && <Check size={11} className="text-white" />}
                            </div>
                            <input type="checkbox" className="sr-only" checked={ss.agreed}
                              onChange={e => patchSign(c.id, { agreed: e.target.checked })} />
                            <span className="text-sm text-zinc-700 leading-snug">
                              Би, <span className="font-semibold">{signerName.trim() || "овог нэрээ оруулна уу"}</span>, {accState.accountType === "org" && <><span className="font-semibold">{accState.partyName || "Steppe Records ХХК"}</span>-ийг төлөөлж, </>}<span className="font-semibold">{c.name}</span>-тэй бүрэн танилцаж, нөхцөлийг зөвшөөрч байна.
                            </span>
                          </label>

                          <div className="flex gap-3">
                            <Btn variant="secondary" onClick={() => patchSign(c.id, { step: "read" })}>Буцах</Btn>
                            <Btn full disabled={!canSubmit || !signerName.trim()} onClick={() => handleSubmit(c)}>
                              Гэрээ баталгаажуулах
                            </Btn>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
