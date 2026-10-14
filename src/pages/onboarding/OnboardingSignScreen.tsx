import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import buteelLogo from "@/imports/Artboard_1.png";
import { Check, Pencil, RotateCcw, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { ContractPartyInfo } from "@/components/ui/ContractPartyInfo";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { OnboardingProgress } from "@/pages/onboarding/OnboardingProgress";
import { OB_CONTRACTS } from "@/data/agreements";
import { getObState, patchObState, getAccountState } from "@/data/ob-state";

export default function OnboardingSignScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const idx = parseInt(params.get("idx") ?? "0", 10);

  const state = getObState();
  const contract = OB_CONTRACTS.find(c => c.id === state.contracts[idx]);

  const [agreed, setAgreed] = useState(false);
  const [signedSuccess, setSignedSuccess] = useState(false);
  const [signature, setSignature] = useState<string>("");
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const hasInkRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contract) navigate("/onboarding/contracts");
  }, [contract, navigate]);

  useEffect(() => {
    setAgreed(false);
    setSignature("");
    setScrolledToBottom(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [idx]);

  const getCanvasPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!e.isPrimary || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    hasInkRef.current = false;
    isDrawingRef.current = true;
    lastPosRef.current = getCanvasPos(e);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getCanvasPos(e);
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

  const stopDraw = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas && hasInkRef.current) setSignature(canvas.toDataURL());
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current!;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    setSignature("");
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      setScrolledToBottom(true);
    }
  };

  const effectiveSignature = signature;
  const user = getAccountState();
  const signerName = [user.lastName, user.firstName].filter(Boolean).join(" ");
  const canSubmit = agreed && !!effectiveSignature && !!signerName;

  const handleNext = () => {
    if (!canSubmit || !contract) return;
    const current = getObState();
    patchObState({ signed: { ...current.signed, [contract.id]: effectiveSignature }, signerName });
    setSignedSuccess(true);
  };

  const continueAfterSigning = () => {
    setSignedSuccess(false);
    const nextIdx = idx + 1;
    if (nextIdx < state.contracts.length) {
      navigate(`/onboarding/sign?idx=${nextIdx}`);
    } else {
      navigate("/onboarding/setup?idx=0");
    }
  };

  if (!contract) return null;

  const total = state.contracts.length;
  const subLabel = total > 1 ? `${idx + 1}/${total}` : undefined;

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-4 py-10 sm:py-12">
      <SuccessDialog open={signedSuccess} title="Гэрээ амжилттай баталгаажлаа" description={`${contract.name}-д таны гарын үсэг хадгалагдлаа. ${idx < state.contracts.length - 1 ? "Дараагийн гэрээтэй танилцаж бүртгэлээ үргэлжлүүлнэ үү." : "Дараагийн алхамд шилжиж бүртгэлээ үргэлжлүүлнэ үү."}`} buttonLabel="Үргэлжлүүлэх" onContinue={continueAfterSigning} />
      <div className="w-full max-w-3xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
            style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, #000) 100%)" }}>
            <img src={buteelLogo} alt="Buteel" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-xl font-extrabold text-foreground">Buteel Portal</h1>
        </div>

        <OnboardingProgress step={2} subLabel={subLabel} />

        <Card className="overflow-hidden p-0">
          {/* Contract identity banner */}
          <div className={`px-6 py-4 ${contract.iconBg}`}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <contract.icon size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                {total > 1 && (
                  <p className="text-[11px] text-white/70 font-semibold normal-case tracking-wide mb-0.5">
                    Гэрээ {idx + 1} / {total}
                  </p>
                )}
                <h2 className="text-base font-bold text-white leading-tight">{contract.name}</h2>
                <p className="text-xs text-white/70 mt-0.5 truncate">{contract.desc}</p>
              </div>
              <div className="bg-white/20 rounded-lg px-2.5 py-1.5 flex-shrink-0 text-center">
                <p className="text-lg font-bold text-white leading-none">{contract.services.length}</p>
                <p className="text-[10px] text-white/70 leading-none mt-0.5">платформ</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Party info */}
            <div className="mb-4"><ContractPartyInfo isOrg={state.accountType === "org"} name={state.partyName} register={state.partyRegister} signerName={signerName} /></div>

            {/* Contract text */}
            <p className="mb-3 text-sm font-medium text-foreground">Гэрээтэй танилцах</p>
            <div className="relative mb-4">
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="h-[min(68dvh,680px)] overflow-y-auto rounded-xl border border-border bg-muted/20 p-4 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap select-text"
              >
                {contract.contractText}
              </div>
              {!scrolledToBottom && (
                <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-zinc-100 to-transparent rounded-b-xl flex items-end justify-center pb-2.5 pointer-events-none">
                  <span className="flex items-center gap-1 text-[11px] text-zinc-500 font-semibold bg-white/90 px-2.5 py-1 rounded-full border border-zinc-200 shadow-sm">
                    <ChevronDown size={11} className="animate-bounce" /> гүйлгэн бүрэн уншина уу
                  </span>
                </div>
              )}
              {scrolledToBottom && (
                <div className="absolute bottom-2 right-2">
                  <span className="flex items-center gap-1 text-[11px] text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                    <Check size={10} /> Уншсан
                  </span>
                </div>
              )}
            </div>

            {/* Signature section */}
            <p className="text-xs font-bold normal-case text-zinc-400 mb-2 tracking-wide">Гарын үсэг</p>
            <div className="border border-zinc-200 rounded-xl overflow-hidden mb-4">
              <div className="border-b border-border bg-muted/20 px-4 py-3"><p className="flex items-center gap-2 text-sm font-medium text-foreground"><Pencil size={15} />Гарын үсэг зурах</p><p className="mt-1 text-xs text-muted-foreground">Хулгана эсвэл хуруугаараа доорх талбарт зурна уу.</p></div>
<div className="p-4">
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={240}
                      className={`w-full rounded-lg border-2 cursor-crosshair transition-colors select-none ${
                        signature ? "border-primary bg-white" : "border-dashed border-zinc-300 bg-zinc-50"
                      }`}
                      style={{ height: 160, touchAction: "none" }}
                      onPointerDown={startDraw}
                      onPointerMove={draw}
                      onPointerUp={stopDraw}
                      onPointerCancel={stopDraw}
                    />
                    {!signature && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-1.5">
                        <Pencil size={18} className="text-zinc-300" />
                        <p className="text-xs text-zinc-400">Энд гарын үсгээ зурна уу</p>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-8 right-8 h-px bg-zinc-200 pointer-events-none" />
                    {signature && (
                      <button onClick={clearCanvas}
                        className="absolute top-2 right-2 flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 bg-white border border-zinc-200 rounded-lg px-2 py-1 transition-colors">
                        <RotateCcw size={11} /> Устгах
                      </button>
                    )}
                  </div>

              </div>
            </div>

            {/* Agree checkbox */}
            <label className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors cursor-pointer mb-5 ${
              !scrolledToBottom
                ? "opacity-50 pointer-events-none border-zinc-200 bg-zinc-50"
                : agreed
                  ? "border-primary/30 bg-primary/5"
                  : "border-zinc-200 hover:border-zinc-300 bg-white"
            }`}>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                agreed ? "bg-primary border-primary" : "border-zinc-300 bg-white"
              }`}>
                {agreed && <Check size={11} className="text-white" />}
              </div>
              <input type="checkbox" className="sr-only" checked={agreed} disabled={!scrolledToBottom}
                onChange={e => setAgreed(e.target.checked)} />
              <span className="text-sm text-zinc-700 leading-snug">
                Би, <span className="font-semibold text-zinc-900">{signerName || "овог нэрээ бүртгэлийн мэдээлэлд оруулна уу"}</span>, {state.accountType === "org" && <><span className="font-semibold">{state.partyName}</span>-ийг төлөөлж, </>}<span className="font-semibold text-zinc-900">{contract.name}</span>-тэй бүрэн танилцаж, нөхцөлийг зөвшөөрч байна.
              </span>
            </label>

            {!scrolledToBottom && (
              <p className="text-xs text-zinc-400 mb-4 -mt-2 pl-1 flex items-center gap-1">
                <ChevronDown size={11} /> Гэрээг бүрэн уншсаны дараа зөвшөөрөх боломжтой
              </p>
            )}

            <div className="flex gap-3">
              <Btn variant="secondary"
                onClick={() => idx > 0 ? navigate(`/onboarding/sign?idx=${idx - 1}`) : navigate("/onboarding/contracts")}>
                Буцах
              </Btn>
              <Btn full size="lg" disabled={!canSubmit} onClick={handleNext}>
                {idx < total - 1 ? "Дараагийн гэрээ →" : "Баталгаажуулах →"}
              </Btn>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
