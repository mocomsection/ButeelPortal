import { useRef, useState } from "react";
import { Check, CircleCheckBig, CircleX, Image, LoaderCircle, RefreshCw, Trash2, X } from "lucide-react";
import { readImageDensity } from "@/utils/imageDensity";

export type ContentCover = { name: string; dataUrl: string; width: number; height: number; size: number; dpi: number };
export type CoverContentKind = "audiobook" | "film";

export function validateContentCover(kind: CoverContentKind, width: number, height: number, size: number, dpi: { x: number; y: number } | null) {
  if (size > 20 * 1024 * 1024) return "Зургийн хэмжээ 20MB-аас их байж болохгүй.";
  if (kind === "audiobook") {
    if (width !== height) return "Аудио номын ковер 1:1 харьцаатай квадрат байх ёстой.";
    if (width < 1400) return "Ковер хамгийн багадаа 1400 × 1400 px байх ёстой.";
  } else {
    if (width * 3 !== height * 2) return "Киноны постер 2:3 харьцаатай босоо зураг байх ёстой.";
    if (width < 1000 || height < 1500) return "Постер хамгийн багадаа 1000 × 1500 px байх ёстой.";
  }
  if (!dpi) return "DPI мэдээлэл олдсонгүй. Зургаа 72 DPI эсвэл түүнээс дээш нягтралтай хадгалаад дахин оруулна уу.";
  if (dpi.x < 71.9 || dpi.y < 71.9) return "Зураг 72 DPI эсвэл түүнээс дээш нягтралтай байх ёстой.";
  return "";
}

export function ContentCoverUpload({ kind, value, onChange }: { kind: CoverContentKind; value: ContentCover | null; onChange: (cover: ContentCover | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const film = kind === "film";
  const title = film ? "Постер зураг" : "Ковер зураг";
  const metadata = value ? `${value.width} × ${value.height} px · ${Math.round(value.dpi)} DPI · ${(value.size / 1048576).toFixed(1)} MB` : "";

  async function upload(file: File) {
    const request = ++requestRef.current;
    setError("");
    onChange(null);
    if (!["image/jpeg", "image/png"].includes(file.type)) { setError("Зураг JPG эсвэл PNG форматтай байх ёстой."); setLoading(false); return; }
    if (file.size > 20 * 1024 * 1024) { setError("Зургийн хэмжээ 20MB-аас их байж болохгүй."); setLoading(false); return; }
    setLoading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("Файлыг уншиж чадсангүй."));
        reader.onload = () => resolve(String(reader.result));
        reader.readAsDataURL(file);
      });
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const preview = new window.Image();
        preview.onload = () => resolve(preview);
        preview.onerror = () => reject(new Error("Зургийг нээж чадсангүй. Өөр файл сонгоно уу."));
        preview.src = dataUrl;
      });
      const dpi = await readImageDensity(file);
      if (request !== requestRef.current) return;
      const problem = validateContentCover(kind, image.naturalWidth, image.naturalHeight, file.size, dpi);
      if (problem) { setError(problem); return; }
      onChange({ name: file.name, dataUrl, width: image.naturalWidth, height: image.naturalHeight, size: file.size, dpi: dpi!.x });
    } catch (problem) {
      if (request === requestRef.current) setError(problem instanceof Error ? problem.message : "Зургийг уншиж чадсангүй. Дахин оролдоно уу.");
    } finally {
      if (request === requestRef.current) setLoading(false);
    }
  }

  return (
    <>
      <h2>{title}</h2>
      <p className="mb-4 text-sm text-muted-foreground">{film ? "Киноны онцлогийг илэрхийлэх босоо постероо оруулна уу." : "Номын нэр, зохиолчийг танихад хялбар ковероо оруулна уу."}</p>
      {error && <div role="alert" className="wiz-cover-validation-error"><CircleX size={15} /><span>{error}</span></div>}
      <div className="wiz-cover-layout">
        <div className={film ? "w-full max-w-[320px] justify-self-center sm:justify-self-start" : ""}>
          <div className={`wiz-cover-drop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${film ? "aspect-[2/3]!" : "aspect-square!"} ${dragging ? "drag" : ""}`} role="button" tabIndex={0} aria-label={`${title} сонгох`} aria-busy={loading}
            onClick={() => inputRef.current?.click()}
            onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); inputRef.current?.click(); } }}
            onDragOver={event => { event.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={event => { event.preventDefault(); setDragging(false); const file = event.dataTransfer.files[0]; if (file) void upload(file); }}>
            {loading ? <div className="wiz-cover-content" role="status"><LoaderCircle size={30} className="animate-spin" /><b>Зургийг шалгаж байна…</b><span>Хэмжээ, харьцаа болон нягтралыг уншиж байна</span></div>
              : value ? <><img src={value.dataUrl} alt={title} /><div className="wiz-cover-overlay"><div className="min-w-0"><b className="break-all">{value.name}</b><span>{metadata}</span></div><RefreshCw size={16} className="shrink-0" /></div></>
              : <div className="wiz-cover-content"><Image size={34} /><b>{film ? "Постер оруулах" : "Ковер зургаа оруулах"}</b><span>Зургаа энд чирэх эсвэл компьютерээс сонгох</span><span className="text-xs">PNG, JPG · 20MB-аас ихгүй</span><span className="wiz-btn primary mt-3">Зураг сонгох</span></div>}
          </div>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={event => { const file = event.target.files?.[0]; if (file) void upload(file); event.target.value = ""; }} />
          {value && <div className="mt-3 flex flex-wrap gap-2"><button type="button" className="wiz-btn" onClick={() => inputRef.current?.click()}><RefreshCw size={13} />Дахин сонгох</button><button type="button" className="wiz-btn" onClick={() => { requestRef.current++; onChange(null); setError(""); setLoading(false); }}><Trash2 size={13} />Устгах</button></div>}
        </div>
        <div className="wiz-cover-req-box">
          <h3>{film ? "Постер зургийн шаардлага" : "Ковер зургийн шаардлага"}</h3>
          <p>Зургаа оруулахаас өмнө дараах шаардлагыг шалгана уу.</p>
          <div className="wiz-cover-req-group"><h4>Контентын онцлог</h4><div className="wiz-cover-rule-list">
            {(film ? ["Киноны нэр, постерын дизайн болон оролцогчдын нэр байж болно", "Киноны агуулга, насны ангилалд тохирсон зураг ашиглана"] : ["Номын нэр, зохиолч болон уншигчийн нэр байж болно", "Жижиг дэлгэцэд нэр нь гаргацтай, номын агуулгад тохирсон байна"]).map(rule => <div key={rule} className="wiz-cover-rule"><Check size={13} /><span>{rule}</span></div>)}
          </div></div>
          <div className="wiz-cover-req-group"><h4>Зураг дээр агуулагдаж болохгүй</h4><div className="wiz-cover-rule-list">{["URL, QR code, сурталчилгааны холбоос", "Контентод хамааралгүй сурталчилгаа, сошиал хаяг", "Зөвшөөрөлгүй зураг, зохиогчийн эрх зөрчсөн материал"].map(rule => <div key={rule} className="wiz-cover-rule"><X size={13} /><span>{rule}</span></div>)}</div></div>
          <div className="wiz-cover-req-group"><h4>Файлын техникийн шаардлага</h4><div className="wiz-cover-rule-list">{[film ? "2:3 харьцаатай босоо постер" : "1:1 харьцаатай квадрат ковер", film ? "Хамгийн багадаа 1000 × 1500 px" : "Хамгийн багадаа 1400 × 1400 px", "72 DPI эсвэл түүнээс дээш нягтрал", "JPG эсвэл PNG формат", "Файлын хэмжээ 20MB-аас ихгүй"].map(rule => <div key={rule} className="wiz-cover-rule"><Check size={13} /><span>{rule}</span></div>)}</div></div>
          {value && <div className="wiz-id-auto mt-3"><CircleCheckBig size={16} /><div><b>Техникийн шаардлага хангасан</b><span>{metadata}</span></div></div>}
        </div>
      </div>
    </>
  );
}
