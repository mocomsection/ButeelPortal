import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, ArrowLeft, Upload, Check, X, RefreshCw, Trash2, CircleCheck, CircleX } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { Stepper } from "@/components/ui/Stepper";
import { RELEASE_STEPS } from "@/data/content";

interface CoverState {
  name: string;
  dataUrl: string;
  width: number;
  height: number;
  size: number;
}

const EMPTY_COVER: CoverState = { name: "", dataUrl: "", width: 0, height: 0, size: 0 };

function fmtSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function validateCover(file: File, w: number, h: number): string {
  if (!["image/jpeg", "image/png"].includes(file.type)) return "JPG эсвэл PNG формат байх ёстой.";
  if (file.size > 20 * 1024 * 1024) return "Файлын хэмжээ 20 MB-аас их байж болохгүй.";
  if (w !== h) return "1:1 харьцаатай, төгс квадрат зураг байх ёстой.";
  if (w < 1500) return `Хамгийн багадаа 1500 × 1500 px байх ёстой (одоо ${w} × ${h}).`;
  if (w > 6000) return `Хамгийн ихдээ 6000 × 6000 px байх ёстой.`;
  return "";
}

export default function SubmitCoverArtScreen() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [cover, setCover] = useState<CoverState>(EMPTY_COVER);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const processFile = (file: File) => {
    setError("");
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("JPG эсвэл PNG формат байх ёстой."); return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("Файлын хэмжээ 20 MB-аас их байж болохгүй."); return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const err = validateCover(file, img.naturalWidth, img.naturalHeight);
        if (err) { setError(err); return; }
        setCover({ name: file.name, dataUrl: reader.result as string, width: img.naturalWidth, height: img.naturalHeight, size: file.size });
      };
      img.onerror = () => setError("Зургийн файлыг унших боломжгүй.");
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (f) processFile(f); e.target.value = "";
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files?.[0]; if (f) processFile(f);
  };

  const hasCover = !!cover.name;

  const prohibitedRules = [
    "Артист нэр болон дуу/цомгийн нэрээс бусад текст",
    "URL, вэб хаяг эсвэл QR код",
    "Social media лого, username, handle",
    "Брэнд, сурталчилгааны лавлагаа",
    "Порнографик зураг эсвэл контент",
    "Лицензгүй зураг, хуулбарласан контент",
    "Өөр дуу/цомогт ашигласан яг ижил artwork",
  ];

  const techRules = [
    { ok: true,  text: "1:1 харьцаатай — төгс квадрат зураг" },
    { ok: true,  text: "Хамгийн багадаа 1500 × 1500 px, хамгийн ихдээ 6000 × 6000 px" },
    { ok: true,  text: "JPG эсвэл PNG формат" },
    { ok: true,  text: "Файлын хэмжээ 20 MB-аас ихгүй" },
    { ok: false, text: "Бүдгэрсэн, pixelated, эргүүлсэн зураг байж болохгүй" },
  ];

  return (
    <Shell title="Шинэ Хөгжим Нэмэх">
      <div className="max-w-5xl">
        <div className="mb-6"><Stepper steps={RELEASE_STEPS} current={2} /></div>

        {error && (
          <div className="flex items-center gap-3 p-3.5 mb-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <CircleX size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Upload zone */}
          <div>
            <div
              className={`relative aspect-square rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
                dragging ? "border-primary bg-violet-50/40 scale-[0.99]" :
                hasCover ? "border-violet-300" : "border-dashed border-zinc-200 hover:border-violet-300 hover:bg-violet-50/20"
              }`}
              onClick={() => !hasCover && fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}>
              {hasCover ? (
                <>
                  <img src={cover.dataUrl} alt="Cover preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-end p-3">
                    <div className="w-full bg-black/60 backdrop-blur-sm rounded-xl p-2.5 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{cover.name}</p>
                        <p className="text-white/70 text-xs">{cover.width} × {cover.height} px · {fmtSize(cover.size)}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                        <button type="button" title="Дахин сонгох" onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                          className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"><RefreshCw size={12} /></button>
                        <button type="button" title="Устгах" onClick={e => { e.stopPropagation(); setCover(EMPTY_COVER); setError(""); }}
                          className="p-1.5 bg-white/20 hover:bg-red-500/60 rounded-lg text-white transition-colors"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                      <Check size={10} />Шаардлага хангасан
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
                    <Upload size={24} className="text-zinc-400" />
                  </div>
                  <p className="text-sm font-bold text-zinc-700 mb-1">Ковер зургаа оруулах</p>
                  <p className="text-xs text-zinc-400 mb-4">Зургаа энд чирэх эсвэл компьютерээс сонгох</p>
                  <button type="button" onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                    className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                    Зураг сонгох
                  </button>
                  <p className="text-xs text-zinc-300 mt-3">PNG · JPG · Max 20 MB</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleInput} />

            {hasCover && (
              <div className="flex gap-2 mt-3">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-zinc-600 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors">
                  <RefreshCw size={13} />Дахин сонгох
                </button>
                <button type="button" onClick={() => { setCover(EMPTY_COVER); setError(""); }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                  <Trash2 size={13} />Устгах
                </button>
              </div>
            )}
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <Card className="p-5">
              <p className="text-sm font-bold text-zinc-800 mb-3">Зураг дээр агуулагдаж болохгүй</p>
              <div className="space-y-2">
                {prohibitedRules.map((r, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CircleX size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-zinc-600">{r}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <p className="text-sm font-bold text-zinc-800 mb-3">Файлын техникийн шаардлага</p>
              <div className="space-y-2 mb-3">
                {techRules.map((r, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CircleCheck size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-zinc-600">{r.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["1:1", "1500–6000 px", "JPG / PNG", "≤ 20 MB"].map(b => (
                  <span key={b} className="text-xs font-semibold bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-lg">{b}</span>
                ))}
              </div>
              {hasCover && (
                <div className="flex items-center gap-2 mt-3 p-2.5 bg-green-50 border border-green-200 rounded-xl">
                  <Check size={13} className="text-green-600 flex-shrink-0" />
                  <p className="text-xs font-semibold text-green-700">Техникийн шаардлага хангасан · {cover.width} × {cover.height} px · {fmtSize(cover.size)}</p>
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className="flex justify-between mt-5">
          <Btn variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate("/submit/tracks")}>Буцах</Btn>
          <div className="flex gap-2">
            <Btn variant="secondary">Ноорог Хадгалах</Btn>
            <Btn disabled={!hasCover} onClick={() => navigate("/submit/settings")}>Дараагийн <ChevronRight size={16} /></Btn>
          </div>
        </div>
      </div>
    </Shell>
  );
}

