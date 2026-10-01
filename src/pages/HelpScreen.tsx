import { useState, useMemo } from "react";
import {
  ExternalLink, BookOpen, Headphones, MessageSquare, ChevronDown,
  Search, Send, CheckCircle2, ArrowUpRight,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";

const FAQS = [
  {
    category: "Контент",
    q: "Бүтээл илгээхэд хэр удаан болдог вэ?",
    a: "Ихэвчлэн 1–3 ажлын өдрийн дотор хянагдана. Тавцнуудад гарахад нэмж 1–5 хоног шаардагдана. Яаралтай хүсэлтийг support@buteel.mn-д мэдэгдэнэ үү.",
  },
  {
    category: "Контент",
    q: "Бүтээлээ засах боломжтой юу?",
    a: "Ноорог болон засвар шаардлагатай бүтээлүүдийг бүрэн засах боломжтой. Тараагдсан бүтээлийн нэр, артист зэрэг гол мэдээллийг засахад дэмжлэгийн тусдаа хүсэлт шаардагдана.",
  },
  {
    category: "Контент",
    q: "Хавтасны зурагт ямар шаардлага тавигддаг вэ?",
    a: "1500×1500 px-ээс дээш (зөвлөмж 3000×3000 px), JPEG эсвэл PNG формат, RGB өнгийн орон зай. Текст, лого, вэбсайт хаяг агуулж болохгүй.",
  },
  {
    category: "Орлого",
    q: "Орлогоо хэзээ авч болох вэ?",
    a: "Орлогыг улирал тутам нэгтгэж, eBarimt баталгаажсаны дараа таны банкны данс руу шилжүүлнэ. Таталт хийх хамгийн бага дүн ₮100,000.",
  },
  {
    category: "Орлого",
    q: "Ямар тавцнуудаас орлого орох вэ?",
    a: "Spotify, Apple Music, YouTube Music, Deezer, GTone, Egshig болон бусад 30 гаруй үйлчилгээнээс орлого тооцогдоно. Тайлан хэсгээс дэлгэрэнгүй харах боломжтой.",
  },
  {
    category: "Аккаунт",
    q: "ISRC код гэж юу вэ?",
    a: "ISRC (International Standard Recording Code) нь дуу бүрд олгогддог олон улсын стандарт танигч код. Өмнөх код байхгүй бол Buteel нийтлэх үед автоматаар олгоно.",
  },
  {
    category: "Аккаунт",
    q: "E-Mongolia баталгаажуулалт яагаад шаардлагатай вэ?",
    a: "Орлого авах болон банкны данс нэмэхийн тулд таны биеийн байцаалтыг баталгаажуулах шаардлагатай. Энэ нь татварын зохицуулалт болон санхүүгийн аюулгүй байдлын шаардлага юм.",
  },
  {
    category: "Аккаунт",
    q: "Байгууллагын нэрийн өмнөөс бүртгэл хийх боломжтой юу?",
    a: "Тийм. Аккаунтын тохиргооноос байгууллагын бүртгэл сонгон, ХЗД-ийн улсын бүртгэл болон ТТД-ийг оруулж баталгаажуулна.",
  },
];

const CATEGORIES = ["Бүгд", ...Array.from(new Set(FAQS.map(f => f.category)))];

const QUICK_ACTIONS = [
  {
    icon: BookOpen,
    label: "Заавар",
    sub: "Бүрэн гарын авлага унших",
    gradient: "linear-gradient(135deg, #6C4DF6 0%, #9B79FF 100%)",
    iconBg: "bg-white/20",
    link: false,
  },
  {
    icon: MessageSquare,
    label: "Тикет үүсгэх",
    sub: "ClickUp формоор хүсэлт илгээх",
    gradient: "linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)",
    iconBg: "bg-white/20",
    link: true,
  },
  {
    icon: Headphones,
    label: "Холбоо барих",
    sub: "support@buteel.mn",
    gradient: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
    iconBg: "bg-white/20",
    link: false,
  },
];

const TOPICS = [
  { value: "", label: "Сэдэв сонгох..." },
  { value: "submit", label: "Бүтээл илгээх" },
  { value: "revenue", label: "Орлого / Тайлан" },
  { value: "account", label: "Аккаунт / KYC" },
  { value: "contract", label: "Гэрээ / Тохиргоо" },
  { value: "tech", label: "Техникийн асуудал" },
  { value: "other", label: "Бусад" },
];

export default function HelpScreen() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Бүгд");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return FAQS.filter(f =>
      (category === "Бүгд" || f.category === category) &&
      (!q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
    );
  }, [search, category]);

  function handleSend() {
    if (!topic || !message.trim()) return;
    setSent(true);
    setTopic("");
    setMessage("");
  }

  return (
    <Shell title="Тусламж">
      <div className="max-w-2xl space-y-6">

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((a, i) => (
            <div key={i}
              className="relative rounded-2xl p-4 cursor-pointer overflow-hidden group transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: a.gradient }}>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${a.iconBg} backdrop-blur-sm flex items-center justify-center`}>
                    <a.icon size={17} className="text-white" />
                  </div>
                  {a.link && <ArrowUpRight size={14} className="text-white/60 group-hover:text-white/90 transition-colors" />}
                </div>
                <p className="font-bold text-sm text-white leading-tight">{a.label}</p>
                <p className="text-[11px] text-white/70 mt-1 leading-relaxed">{a.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setOpenFaq(null); }}
            placeholder="Түгээмэл асуултаас хайх..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        {/* FAQ */}
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
            <h3 className="font-bold text-foreground text-sm">Түгээмэл асуулт</h3>
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => { setCategory(c); setOpenFaq(null); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    category === c
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Search size={22} className="text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">"{search}" — олдсонгүй</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filtered.map((f, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-start justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className={`mt-0.5 flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        f.category === "Контент" ? "bg-primary/10 text-primary" :
                        f.category === "Орлого"  ? "bg-emerald-100 text-emerald-700" :
                        "bg-violet-100 text-violet-700"
                      }`}>{f.category}</span>
                      <span className="text-sm font-medium text-foreground leading-snug">{f.q}</span>
                    </div>
                    <ChevronDown size={15} className={`text-muted-foreground flex-shrink-0 mt-0.5 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 pt-0 bg-muted/20">
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Contact form */}
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-bold text-foreground text-sm">Дэмжлэг хүсэх</h3>
            <p className="text-xs text-muted-foreground mt-0.5">FAQ-д хариулт олдохгүй бол шууд бидэнд бичнэ үү.</p>
          </div>
          <div className="p-5 space-y-4">
            {sent ? (
              <div className="py-8 flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <CheckCircle2 size={22} className="text-emerald-500" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">Хүсэлт илгээгдлээ</p>
                  <p className="text-xs text-muted-foreground mt-1">1–4 цагийн дотор имэйлээр хариу явуулна.</p>
                </div>
                <button onClick={() => setSent(false)}
                  className="text-xs font-semibold text-primary hover:underline mt-1">
                  Дахин илгээх
                </button>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">Сэдэв <span className="text-destructive">*</span></label>
                  <select value={topic} onChange={e => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-card text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
                    {TOPICS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">Мессеж <span className="text-destructive">*</span></label>
                  <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)}
                    placeholder="Асуултаа дэлгэрэнгүй бичнэ үү..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-card text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none placeholder-muted-foreground/50" />
                </div>
                <button onClick={handleSend}
                  disabled={!topic || !message.trim()}
                  className="w-full h-10 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:opacity-90">
                  <Send size={14} />Илгээх
                </button>
              </>
            )}
          </div>
        </Card>

      </div>
    </Shell>
  );
}
