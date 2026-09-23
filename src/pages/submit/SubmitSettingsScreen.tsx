import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, ArrowLeft, Zap, CalendarDays, RadioTower, Check, Info } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { Stepper } from "@/components/ui/Stepper";
import { RELEASE_STEPS } from "@/data/content";

type ServiceName = string;

const SERVICE_GROUPS = [
  {
    id: "domestic",
    title: "Дотоодын хөгжмийн үйлчилгээ",
    sub: "Монголын хөгжмийн платформууд",
    locked: false,
    services: ["Sonsy Music", "M Music"] as ServiceName[],
  },
  {
    id: "prbt",
    title: "PRBT",
    sub: "Сонгосноор доорх бүх PRBT үйлчилгээнд хүргэнэ.",
    locked: false,
    services: ["Hitone", "Unimusic", "SkyMelody", "GTone"] as ServiceName[],
  },
  {
    id: "international",
    title: "Олон улсын хөгжмийн үйлчилгээнүүд",
    sub: "Дэлхийн томоохон стриминг платформууд",
    locked: false,
    services: ["Egshig", "Apple Music", "Spotify", "YouTube Music", "Deezer"] as ServiceName[],
  },
  {
    id: "radio",
    title: "Сурталчилгааны радио цацалт",
    sub: "Promotional airplay — royalty тооцоолдоггүй",
    locked: false,
    services: ["Sonsy FM 78.9 & 100.1"] as ServiceName[],
    note: "Энэ радио цацалт нь сурталчилгааны зорилготой. Buteel энэ цацалтын royalty орлогыг тооцож хуваарилахгүй.",
  },
];

function svcInitial(name: string) {
  const map: Record<string, string> = {
    "Sonsy Music": "S", "M Music": "M", "Hitone": "H", "Unimusic": "U",
    "SkyMelody": "SM", "GTone": "G", "Egshig": "E", "Apple Music": "AM",
    "Spotify": "SP", "YouTube Music": "YT", "Deezer": "DZ", "Sonsy FM 78.9 & 100.1": "FM",
  };
  return map[name] || name[0];
}

function minDate() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split("T")[0];
}

export default function SubmitSettingsScreen() {
  const navigate = useNavigate();
  const [scheduleMode, setScheduleMode] = useState<"asap" | "date">("asap");
  const [releaseDate, setReleaseDate] = useState("");

  const allServiceNames = SERVICE_GROUPS.flatMap(g => g.services);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(allServiceNames));

  const toggleService = (name: string) => {
    setSelected(s => { const n = new Set(s); n.has(name) ? n.delete(name) : n.add(name); return n; });
  };
  const toggleGroup = (services: string[]) => {
    const allOn = services.every(n => selected.has(n));
    setSelected(s => {
      const n = new Set(s);
      services.forEach(name => allOn ? n.delete(name) : n.add(name));
      return n;
    });
  };

  const publishLabel = scheduleMode === "asap"
    ? "Аль болох хурдан · 2–3 ажлын өдөр"
    : (releaseDate ? `Нийтлэх огноо · ${releaseDate}` : "Нийтлэх огноо сонгоогүй");

  return (
    <Shell title="Шинэ Хөгжим Нэмэх">
      <div className="max-w-5xl">
        <div className="mb-5"><Stepper steps={RELEASE_STEPS} current={3} /></div>

        {/* Summary bar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-100 rounded-xl text-xs font-semibold text-zinc-600">
            <CalendarDays size={13} />
            {publishLabel}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-100 rounded-xl text-xs font-semibold text-zinc-600">
            <RadioTower size={13} />
            {selected.size} суваг сонгосон
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">

            {/* Schedule */}
            <Card className="p-5">
              <div className="mb-4">
                <h3 className="font-bold text-zinc-900">Нийтлэх хугацаа</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Бэлэн болмогц нийтлэх эсвэл тодорхой өдөр төлөвлөнө.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {([
                  { id: "asap" as const, icon: Zap, label: "Аль болох хурдан", sub: "Шалгалт дуусмагц нийтэлнэ. Ойролцоогоор 2–3 ажлын өдөр." },
                  { id: "date" as const, icon: CalendarDays, label: "Огноо төлөвлөх", sub: "Өнөөдрөөс дор хаяж 7 хоногийн дараа." },
                ]).map(opt => (
                  <label key={opt.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${scheduleMode === opt.id ? "border-primary bg-violet-50/50" : "border-zinc-200 hover:border-zinc-300"}`}>
                    <input type="radio" name="schedule" checked={scheduleMode === opt.id} onChange={() => setScheduleMode(opt.id)} className="hidden" />
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${scheduleMode === opt.id ? "bg-primary" : "bg-zinc-100"}`}>
                      <opt.icon size={16} className={scheduleMode === opt.id ? "text-white" : "text-zinc-500"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${scheduleMode === opt.id ? "text-primary" : "text-zinc-800"}`}>{opt.label}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{opt.sub}</p>
                    </div>
                    {scheduleMode === opt.id && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={11} className="text-white" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
              {scheduleMode === "date" && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700 block">Нийтлэх огноо <span className="text-red-500">*</span></label>
                  <input type="date" min={minDate()} value={releaseDate} onChange={e => setReleaseDate(e.target.value)}
                    className="w-full max-w-xs px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" />
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Info size={11} />
                    Хамгийн эрт боломжит огноо: <strong>{minDate()}</strong>
                  </div>
                </div>
              )}
            </Card>

            {/* Distribution services */}
            <Card className="p-5">
              <div className="mb-5">
                <h3 className="font-bold text-zinc-900">Түгээх үйлчилгээнүүд</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Бүх сонголт анхнаасаа идэвхтэй. Хүсвэл аль нэг бүлгийг хасаж болно.</p>
              </div>
              <div className="space-y-5">
                {SERVICE_GROUPS.map(group => {
                  const groupAllOn = group.services.every(n => selected.has(n));
                  return (
                    <div key={group.id} className="rounded-xl border border-zinc-200 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 bg-zinc-50/70 border-b border-zinc-200">
                        <div>
                          <p className="text-sm font-bold text-zinc-800">{group.title}</p>
                          <p className="text-xs text-zinc-400 mt-0.5">{group.sub}</p>
                        </div>
                        <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 cursor-pointer text-xs font-semibold transition-all ${groupAllOn ? "border-primary bg-violet-50 text-primary" : "border-zinc-200 text-zinc-500 hover:border-zinc-300"}`}>
                          <input type="checkbox" className="hidden" checked={groupAllOn} onChange={() => toggleGroup(group.services)} />
                          {groupAllOn && <Check size={11} />}
                          Бүгдийг {groupAllOn ? "болиулах" : "сонгох"}
                        </label>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {group.services.map(name => {
                            const on = selected.has(name);
                            return (
                              <button key={name} type="button" onClick={() => toggleService(name)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${on ? "border-primary bg-violet-50/60 text-violet-700" : "border-zinc-200 text-zinc-500 hover:border-zinc-300"}`}>
                                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${on ? "bg-primary text-white" : "bg-zinc-100 text-zinc-400"}`}>{svcInitial(name)}</span>
                                {name}
                                {on && <Check size={12} className="text-primary" />}
                              </button>
                            );
                          })}
                        </div>
                        {group.note && (
                          <div className="flex items-start gap-2 mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                            <Info size={12} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700">{group.note}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Nav */}
            <div className="flex justify-between pt-1">
              <Btn variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate("/submit/cover-art")}>Буцах</Btn>
              <div className="flex gap-2">
                <Btn variant="secondary">Ноорог Хадгалах</Btn>
                <Btn onClick={() => navigate("/submit/review")}>Шалгах <ChevronRight size={16} /></Btn>
              </div>
            </div>
          </div>

          {/* Right guide */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-3">
              <Card className="p-4">
                <p className="text-xs font-bold uppercase text-zinc-400 mb-3">Нийтлэлтийн тухай</p>
                <div className="space-y-2.5 text-xs text-zinc-500">
                  <p>• ASAP: шалгалт дуусмагц (~2–3 өдөр)</p>
                  <p>• Огноо: хамгийн багадаа 7 хоногийн дараа</p>
                  <p>• Огноог дараа нь өөрчлөх боломжтой</p>
                </div>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-bold uppercase text-zinc-400 mb-3">Сонгосон сувгууд</p>
                <div className="flex flex-wrap gap-1.5">
                  {[...selected].map(name => (
                    <span key={name} className="flex items-center gap-1 text-xs font-semibold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                      <span className="w-3.5 h-3.5 rounded bg-violet-300 flex items-center justify-center text-[7px] font-bold text-white">{svcInitial(name)}</span>
                      {name}
                    </span>
                  ))}
                </div>
                {selected.size === 0 && <p className="text-xs text-zinc-400 italic">Ямар ч суваг сонгоогүй</p>}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

