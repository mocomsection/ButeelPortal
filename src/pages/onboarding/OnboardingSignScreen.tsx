import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import buteelLogo from "@/imports/Artboard_1.png";
import { Check, Upload, Pencil, RotateCcw, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { OnboardingProgress } from "@/pages/onboarding/OnboardingProgress";
import { OB_CONTRACTS } from "@/data/agreements";
import { getObState, patchObState } from "@/data/ob-state";

export default function OnboardingSignScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const idx = parseInt(params.get("idx") ?? "0", 10);

  const state = getObState();
  const contract = OB_CONTRACTS.find(c => c.id === state.contracts[idx]);

  const [tab, setTab] = useState<"draw" | "upload">("draw");
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState<string>("");
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!contract) navigate("/onboarding/contracts");
  }, [contract, navigate]);

  useEffect(() => {
    setAgreed(false);
    setSignature("");
    setUploadPreview("");
    setScrolledToBottom(false);
    setTab("draw");
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [idx]);

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    lastPosRef.current = getCanvasPos(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
    lastPosRef.current = pos;
  };

  const stopDraw = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) setSignature(canvas.toDataURL());
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current!;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    setSignature("");
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setUploadPreview(url);
      setSignature(url);
    };
    reader.readAsDataURL(file);
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      setScrolledToBottom(true);
    }
  };

  const effectiveSignature = tab === "draw" ? signature : uploadPreview;
  const canSubmit = agreed && !!effectiveSignature;

  const handleNext = () => {
    if (!canSubmit || !contract) return;
    const current = getObState();
    patchObState({ signed: { ...current.signed, [contract.id]: effectiveSignature } });
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
            style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, #000) 100%)" }}>
            <img src={buteelLogo} alt="Buteel" className="w-8 h-8 object-contain" />
          </div>
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
                  <p className="text-[11px] text-white/70 font-semibold uppercase tracking-wide mb-0.5">
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
            {/* Contract text */}
            <p className="text-xs font-bold uppercase text-zinc-400 mb-2 tracking-wide">Гэрээний агуулга</p>
            <div className="relative mb-4">
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="h-[380px] overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-700 leading-relaxed whitespace-pre-wrap select-text"
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
            <p className="text-xs font-bold uppercase text-zinc-400 mb-2 tracking-wide">Гарын үсэг</p>
            <div className="border border-zinc-200 rounded-xl overflow-hidden mb-4">
              <div className="flex border-b border-zinc-200">
                {(["draw", "upload"] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors ${
                      tab === t ? "bg-white text-zinc-900 border-b-2 border-primary" : "bg-zinc-50 text-zinc-500 hover:text-zinc-700"
                    }`}>
                    {t === "draw" ? <><Pencil size={13} /> Хулганаар зурах</> : <><Upload size={13} /> Зураг оруулах</>}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {tab === "draw" && (
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={160}
                      className={`w-full rounded-lg border-2 cursor-crosshair transition-colors select-none ${
                        signature ? "border-primary bg-white" : "border-dashed border-zinc-300 bg-zinc-50"
                      }`}
                      style={{ height: 108, touchAction: "none" }}
                      onMouseDown={startDraw}
                      onMouseMove={draw}
                      onMouseUp={stopDraw}
                      onMouseLeave={stopDraw}
                    />
                    {!signature && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-1.5">
                        <Pencil size={18} className="text-zinc-300" />
                        <p className="text-xs text-zinc-400">Энд хулганаар гарын үсгээ зурна уу</p>
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
                )}

                {tab === "upload" && (
                  <div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    {uploadPreview ? (
                      <div className="relative rounded-lg border-2 border-primary overflow-hidden bg-white" style={{ height: 108 }}>
                        <img src={uploadPreview} alt="signature" className="w-full h-full object-contain" />
                        <button onClick={() => { setUploadPreview(""); setSignature(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                          className="absolute top-2 right-2 flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 bg-white border border-zinc-200 rounded-lg px-2 py-1">
                          <RotateCcw size={11} /> Солих
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => fileInputRef.current?.click()}
                        className="w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 hover:border-primary hover:bg-primary/5 transition-colors"
                        style={{ height: 108 }}>
                        <Upload size={18} className="text-zinc-400" />
                        <div className="text-center">
                          <p className="text-sm font-semibold text-zinc-700">Гарын үсгийн зураг оруулах</p>
                          <p className="text-xs text-zinc-400 mt-0.5">PNG, JPG — цагаан дэвсгэртэй</p>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Agree checkbox */}
            <label className={`flex items-start gap-3 p-3.5 rounded-xl border transition-colors cursor-pointer mb-5 ${
              !scrolledToBottom
                ? "opacity-50 pointer-events-none border-zinc-200 bg-zinc-50"
                : agreed
                  ? "border-primary/30 bg-primary/5"
                  : "border-zinc-200 hover:border-zinc-300 bg-white"
            }`}>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                agreed ? "bg-primary border-primary" : "border-zinc-300 bg-white"
              }`}>
                {agreed && <Check size={11} className="text-white" />}
              </div>
              <input type="checkbox" className="sr-only" checked={agreed} disabled={!scrolledToBottom}
                onChange={e => setAgreed(e.target.checked)} />
              <span className="text-sm text-zinc-700 leading-snug">
                Би <span className="font-semibold text-zinc-900">{contract.name}</span>-ийн агуулгыг анхааралтай уншиж, бүрэн ойлгосон бөгөөд зөвшөөрч байна.
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
                {idx < total - 1 ? "Дараагийн гэрээ →" : "Тохиргоо руу →"}
              </Btn>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
