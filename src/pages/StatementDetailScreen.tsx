import { useNavigate } from "react-router";
import { ArrowLeft, Download } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function StatementDetailScreen() {
  const navigate = useNavigate();
  const rows = [
    { release: "Минь сэтгэл", track: "Минь сэтгэл", service: "Spotify",      type: "Stream",   amount: "₮ 122,350" },
    { release: "Минь сэтгэл", track: "Хайрын дуу",  service: "Spotify",      type: "Stream",   amount: "₮ 98,200" },
    { release: "Нутаг EP",    track: "Нутаг",        service: "Apple Music",  type: "Download", amount: "₮ 54,000" },
    { release: "Нутаг EP",    track: "Зам",          service: "YouTube Music",type: "Stream",   amount: "₮ 38,000" },
  ];
  return (
    <Shell title="Тайлангийн дэлгэрэнгүй">
      <div className="max-w-3xl space-y-5">
        <button onClick={() => navigate("/revenue")} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700">
          <ArrowLeft size={16} />Тайланд буцах
        </button>
        <Card className="p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm text-zinc-500">Тайлангийн үе</p>
              <p className="text-2xl font-bold text-zinc-900">2024 Q4</p>
              <p className="text-sm text-zinc-500 mt-0.5">2024-10-01 — 2024-12-31</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-500">Нийт дүн</p>
              <p className="text-2xl font-bold text-zinc-900">₮ 312,500</p>
              <StatusBadge status="paid" />
            </div>
          </div>
        </Card>
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="font-semibold text-zinc-900">Дэлгэрэнгүй жагсаалт</h3>
            <Btn variant="secondary" size="sm" icon={<Download size={14} />}>CSV</Btn>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50">
                  {["Бүтээл", "Дуу", "Платформ", "Төрөл", "Дүн"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-zinc-500 uppercase px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {rows.map((r, i) => (
                  <tr key={i} className="hover:bg-zinc-50/50">
                    <td className="px-4 py-3 text-zinc-900 font-medium">{r.release}</td>
                    <td className="px-4 py-3 text-zinc-600">{r.track}</td>
                    <td className="px-4 py-3 text-zinc-600">{r.service}</td>
                    <td className="px-4 py-3"><span className="bg-zinc-100 text-zinc-600 text-xs px-2 py-0.5 rounded font-medium">{r.type}</span></td>
                    <td className="px-4 py-3 font-semibold text-zinc-900">{r.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

