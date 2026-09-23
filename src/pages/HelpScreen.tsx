import { useState } from "react";
import { ExternalLink, BookOpen, Headphones, MessageSquare, ChevronDown } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";

export default function HelpScreen() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    { q: "Бүтээл илгээхэд хэр удаан болдог вэ?",     a: "Ихэвчлэн 1-3 ажлын өдрийн дотор хянагдана. Тавцнуудад гарахад нэмж 1-5 хоног шаардагдана." },
    { q: "Орлогоо хэзээ авч болох вэ?",              a: "Орлогыг улирал тутам нэгтгэж, eBarimt баталгаажсаны дараа таны банкны данс руу шилжүүлнэ." },
    { q: "Хавтасны зурагт ямар шаардлага тавигддаг вэ?", a: "3000x3000 пиксел, JPEG/PNG формат, RGB өнгийн орон зай, 72 DPI+" },
    { q: "ISRC код гэж юу вэ?",                      a: "ISRC (International Standard Recording Code) нь дуу бүрд олгогддог олон улсын стандарт код юм. Хэрэв байхгүй бол Buteel автоматаар олгоно." },
    { q: "Бүтээлээ засах боломжтой юу?",             a: "Тараагдаагүй, ноорог болон засвар шаардлагатай бүтээлүүдийг засах боломжтой. Тараагдсан бүтээлийн зарим мэдээллийг засахад тусдаа хүсэлт шаардагдана." },
  ];
  return (
    <Shell title="Тусламж">
      <div className="max-w-2xl space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: BookOpen,     label: "Заавар",        sub: "Бүрэн гарын авлага",  href: false },
            { icon: MessageSquare,label: "Тикет үүсгэх", sub: "ClickUp формоор",      href: true },
            { icon: Headphones,   label: "Холбоо барих", sub: "support@buteel.mn",    href: false },
          ].map((l, i) => (
            <Card key={i} className="p-4 hover:border-zinc-300 cursor-pointer transition-all group">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center mb-3 group-hover:bg-zinc-200 transition-colors">
                <l.icon size={18} className="text-zinc-700" />
              </div>
              <p className="font-medium text-sm text-zinc-900">{l.label}</p>
              <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                {l.sub}{l.href && <ExternalLink size={10} />}
              </p>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100">
            <h3 className="font-bold text-zinc-900">Түгээмэл асуулт</h3>
          </div>
          <div className="divide-y divide-zinc-50">
            {faqs.map((f, i) => (
              <div key={i}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-50/50 transition-colors">
                  <span className="text-sm font-medium text-zinc-900">{f.q}</span>
                  <ChevronDown size={16} className={`text-zinc-400 flex-shrink-0 ml-3 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-zinc-600 leading-relaxed">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold text-zinc-900 mb-4">Мессеж илгээх</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Сэдэв</label>
              <select className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-white text-zinc-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                <option>Бүтээл илгээх</option>
                <option>Орлого / Тайлан</option>
                <option>Аккаунт</option>
                <option>Техникийн асуудал</option>
                <option>Бусад</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Мессеж</label>
              <textarea rows={4} className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-white text-zinc-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none placeholder-zinc-400" placeholder="Асуултаа дэлгэрэнгүй бичнэ үү..." />
            </div>
            <Btn full>Илгээх</Btn>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
