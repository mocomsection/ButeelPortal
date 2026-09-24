import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  CheckCircle2, ArrowLeft, ChevronDown, ChevronUp,
  Check, Pencil, Upload, RotateCcw,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { Input } from "@/components/ui/Input";
import { OB_CONTRACTS } from "@/data/agreements";
import { getAccountState, addSignedContract } from "@/data/ob-state";
import type { ContractId } from "@/data/ob-state";

type SignStep = "read" | "sign" | "setup";

interface SignState {
  step: SignStep;
  scrolledToBottom: boolean;
  agreed: boolean;
  tab: "draw" | "upload";
  signature: string;
  uploadPreview: string;
  setupName: string;
}

function defaultSignState(): SignState {
  return { step: "read", scrolledToBottom: false, agreed: false, tab: "draw", signature: "", uploadPreview: "", setupName: "" };
}

export default function DistributionAgreementScreen() {
  const navigate = useNavigate();
  const [accState, setAccState] = useState(() => getAccountState());
  const [expanded, setExpanded] = useState<ContractId | null>(null);
  const [signing, setSigning] = useState<ContractId | null>(null);
  const [signStates, setSignStates] = useState<Partial<Record<ContractId, SignState>>>({});

  const scrollRefs = useRef<Partial<Record<ContractId, HTMLDivElement | null>>>({});
  const canvasRefs = useRef<Partial<Record<ContractId, HTMLCanvasElement | null>>>({});
  const fileInputRefs = useRef<Partial<Record<ContractId, HTMLInputElement | null>>>({});
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const signedIds = accState.signedContracts.length > 0 ? accState.signedContracts : ["music"];

  const getSignState = (id: ContractId): SignState => signStates[id] ?? defaultSignState();

  const patchSign = (id: ContractId, patch: Partial<SignState>) => {
    setSignStates(prev => ({ ...prev, [id]: { ...(prev[id] ?? defaultSignState()), ...patch } }));
  };

  const startSigning = (id: ContractId) => {
    setSigning(id);
    setExpanded(null);
    if (!signStates[id]) patchSign(id, defaultSignState());
  };

  const cancelSigning = () => setSigning(null);

  // Canvas helpers (per-contract)
  const getCanvasPos = (id: ContractId, e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRefs.current[id]!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDraw = (id: ContractId, e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    lastPosRef.current = getCanvasPos(id, e);
  };

  const draw = (id: ContractId, e: React.MouseEvent<HTMLCanvasElement>) => {
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
    lastPosRef.current = pos;
  };

  const stopDraw = useCallback((id: ContractId) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = canvasRefs.current[id];
    if (canvas) patchSign(id, { signature: canvas.toDataURL() });
  }, []);

  const clearCanvas = (id: ContractId) => {
    const canvas = canvasRefs.current[id]!;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    patchSign(id, { signature: "" });
  };

  const handleUpload = (id: ContractId, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      patchSign(id, { uploadPreview: url, signature: url });
    };
    reader.readAsDataURL(file);
  };

  const handleScroll = (id: ContractId) => {
    const el = scrollRefs.current[id];
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      patchSign(id, { scrolledToBottom: true });
    }
  };

  const handleSubmit = (id: ContractId) => {
    const ss = getSignState(id);
    const effectiveSig = ss.tab === "draw" ? ss.signature : ss.uploadPreview;
    if (!ss.agreed || !effectiveSig || !ss.setupName.trim()) return;
    addSignedContract(id, ss.setupName.trim());
    setAccState(getAccountState());
    setSigning(null);
    setSignStates(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  return (
    <Shell title="Гэрээнүүд">
      <div className="max-w-2xl space-y-5">
        <button type="button" onClick={() => navigate("/account")}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700">
          <ArrowLeft size={16} />Аккаунтад буцах
        </button>

        {/* Summary */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/40 border border-border">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{signedIds.length} идэвхтэй гэрээ</p>
            <p className="text-xs text-muted-foreground mt-0.5">{OB_CONTRACTS.length - signedIds.length} гэрээ байгуулагдаагүй</p>
          </div>
          {signedIds.length === OB_CONTRACTS.length && (
            <span className="flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-lg">
              <CheckCircle2 size={12} />Бүгд зурагдсан
            </span>
          )}
        </div>

        <div className="space-y-3">
          {OB_CONTRACTS.map(c => {
            const isSigned = signedIds.includes(c.id);
            const isExpanded = expanded === c.id;
            const isSigning = signing === c.id;
            const ss = getSignState(c.id);
            const setup = accState.setups?.[c.id];
            const signedDate = accState.signedDates?.[c.id];
            const effectiveSig = ss.tab === "draw" ? ss.signature : ss.uploadPreview;
            const canSubmit = ss.agreed && !!effectiveSig && !!ss.setupName.trim();

            return (
              <Card key={c.id} className="overflow-hidden p-0">
                {/* Header */}
                <div className={`px-5 py-4 flex items-center gap-4 ${isSigned ? "bg-green-50/40" : "bg-white"}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.iconBg} text-white`}>
                    <c.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-zinc-900">{c.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">
                      {isSigned && setup?.name ? `${setup.name}${signedDate ? ` · ${signedDate}` : ""}` : c.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isSigned ? (
                      <>
                        <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                          <CheckCircle2 size={11} />Зурагдсан
                        </span>
                        <button type="button" onClick={() => setExpanded(isExpanded ? null : c.id)}
                          className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors">
                          {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                      </>
                    ) : (
                      <>
                        {!isSigning && (
                          <Btn size="sm" onClick={() => startSigning(c.id)}>Гэрээ хийх</Btn>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Signed: expand contract text + services */}
                {isSigned && isExpanded && (
                  <div className="px-5 py-4 border-t border-zinc-100 bg-zinc-50/40 space-y-4">
                    {setup?.name && (
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-zinc-100">
                        <div className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center flex-shrink-0`}>
                          <c.setupIcon size={13} className="text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">{c.setupLabel}</p>
                          <p className="text-sm font-semibold text-zinc-900">{setup.name}</p>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold uppercase text-zinc-400 mb-2">Нээгдсэн платформууд</p>
                      <div className="flex flex-wrap gap-1.5">
                        {c.services.map(s => (
                          <span key={s} className={`text-xs px-2 py-0.5 rounded-md font-medium ${c.badgeBg}`}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-zinc-400 mb-2">Гэрээний агуулга</p>
                      <div className="h-48 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-600 leading-relaxed font-mono whitespace-pre-wrap">
                        {c.contractText}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sign flow — inline */}
                {isSigning && (
                  <div className="border-t border-zinc-200">
                    {/* Step indicator */}
                    <div className="flex border-b border-zinc-100">
                      {(["read", "sign", "setup"] as const).map((s, si) => {
                        const stepIdx = ["read", "sign", "setup"].indexOf(ss.step);
                        const done = si < stepIdx;
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
                            {s === "read" ? "Унших" : s === "sign" ? "Гарын үсэг" : "Тохиргоо"}
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Step 1: Read */}
                      {ss.step === "read" && (
                        <>
                          <div className="relative">
                            <div
                              ref={el => { scrollRefs.current[c.id] = el; }}
                              onScroll={() => handleScroll(c.id)}
                              className="h-[340px] overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-700 leading-relaxed font-mono whitespace-pre-wrap">
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
                              Гарын үсэг зурах →
                            </Btn>
                          </div>
                        </>
                      )}

                      {/* Step 2: Sign */}
                      {ss.step === "sign" && (
                        <>
                          <div className="border border-zinc-200 rounded-xl overflow-hidden">
                            <div className="flex border-b border-zinc-200">
                              {(["draw", "upload"] as const).map(t => (
                                <button key={t} onClick={() => patchSign(c.id, { tab: t })}
                                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors ${
                                    ss.tab === t ? "bg-white text-zinc-900 border-b-2 border-primary" : "bg-zinc-50 text-zinc-500 hover:text-zinc-700"
                                  }`}>
                                  {t === "draw" ? <><Pencil size={13} /> Хулганаар зурах</> : <><Upload size={13} /> Зураг оруулах</>}
                                </button>
                              ))}
                            </div>
                            <div className="p-4">
                              {ss.tab === "draw" && (
                                <div className="relative">
                                  <canvas
                                    ref={el => { canvasRefs.current[c.id] = el; }}
                                    width={800} height={160}
                                    className={`w-full rounded-lg border-2 cursor-crosshair select-none transition-colors ${
                                      ss.signature ? "border-primary bg-white" : "border-dashed border-zinc-300 bg-zinc-50"
                                    }`}
                                    style={{ height: 108, touchAction: "none" }}
                                    onMouseDown={e => startDraw(c.id, e)}
                                    onMouseMove={e => draw(c.id, e)}
                                    onMouseUp={() => stopDraw(c.id)}
                                    onMouseLeave={() => stopDraw(c.id)}
                                  />
                                  {!ss.signature && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-1.5">
                                      <Pencil size={18} className="text-zinc-300" />
                                      <p className="text-xs text-zinc-400">Энд хулганаар гарын үсгээ зурна уу</p>
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
                              )}
                              {ss.tab === "upload" && (
                                <>
                                  <input
                                    ref={el => { fileInputRefs.current[c.id] = el; }}
                                    type="file" accept="image/*" className="hidden"
                                    onChange={e => handleUpload(c.id, e)} />
                                  {ss.uploadPreview ? (
                                    <div className="relative rounded-lg border-2 border-primary overflow-hidden bg-white" style={{ height: 108 }}>
                                      <img src={ss.uploadPreview} alt="signature" className="w-full h-full object-contain" />
                                      <button onClick={() => { patchSign(c.id, { uploadPreview: "", signature: "" }); if (fileInputRefs.current[c.id]) fileInputRefs.current[c.id]!.value = ""; }}
                                        className="absolute top-2 right-2 flex items-center gap-1 text-xs text-zinc-500 bg-white border border-zinc-200 rounded-lg px-2 py-1">
                                        <RotateCcw size={11} /> Солих
                                      </button>
                                    </div>
                                  ) : (
                                    <button onClick={() => fileInputRefs.current[c.id]?.click()}
                                      className="w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 hover:border-primary hover:bg-primary/5 transition-colors"
                                      style={{ height: 108 }}>
                                      <Upload size={18} className="text-zinc-400" />
                                      <p className="text-sm font-semibold text-zinc-700">Гарын үсгийн зураг оруулах</p>
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          <label className={`flex items-start gap-3 p-3.5 rounded-xl border transition-colors cursor-pointer ${
                            ss.agreed ? "border-primary/30 bg-primary/5" : "border-zinc-200 hover:border-zinc-300 bg-white"
                          }`}>
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                              ss.agreed ? "bg-primary border-primary" : "border-zinc-300 bg-white"
                            }`}>
                              {ss.agreed && <Check size={11} className="text-white" />}
                            </div>
                            <input type="checkbox" className="sr-only" checked={ss.agreed}
                              onChange={e => patchSign(c.id, { agreed: e.target.checked })} />
                            <span className="text-sm text-zinc-700 leading-snug">
                              Би <span className="font-semibold">{c.name}</span>-ийн агуулгыг анхааралтай уншиж, бүрэн зөвшөөрч байна.
                            </span>
                          </label>

                          <div className="flex gap-3">
                            <Btn variant="secondary" onClick={() => patchSign(c.id, { step: "read" })}>Буцах</Btn>
                            <Btn full disabled={!ss.agreed || !effectiveSig}
                              onClick={() => patchSign(c.id, { step: "setup" })}>
                              Тохиргоо руу →
                            </Btn>
                          </div>
                        </>
                      )}

                      {/* Step 3: Setup */}
                      {ss.step === "setup" && (
                        <>
                          <div className={`rounded-xl px-4 py-3 flex items-center gap-3 mb-1 ${c.badgeBg}`}>
                            <div className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center flex-shrink-0`}>
                              <c.setupIcon size={13} className="text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-zinc-500">{c.name}</p>
                              <p className="text-sm font-semibold text-zinc-900">{c.setupLabel}</p>
                            </div>
                          </div>
                          <Input
                            label={c.setupLabel}
                            placeholder={c.setupPlaceholder}
                            value={ss.setupName}
                            onChange={v => patchSign(c.id, { setupName: v })}
                            helper={c.setupHelper}
                          />
                          <div className="flex gap-3">
                            <Btn variant="secondary" onClick={() => patchSign(c.id, { step: "sign" })}>Буцах</Btn>
                            <Btn full disabled={!canSubmit} onClick={() => handleSubmit(c.id)}>
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
