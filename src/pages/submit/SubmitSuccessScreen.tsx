import { useNavigate } from "react-router";
import { CheckCircle2 } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";

export default function SubmitSuccessScreen() {
  const navigate = useNavigate();
  return (
    <Shell title="Амжилттай Илгээгдлээ">
      <div className="max-w-lg">
        <Card className="p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Амжилттай Илгээгдлээ!</h2>
          <p className="text-zinc-500 text-sm mb-8">Таны бүтээл хянагдаж байна. 1–3 ажлын өдрийн дотор хариу мэдэгдэл авна.</p>
          <div className="bg-zinc-50 rounded-xl p-4 mb-8 text-left space-y-2">
            {[
              ["Бүтээл", "Минь сэтгэл"],
              ["Статус", ""],
              ["Илгээсэн огноо", "2025-01-15"],
            ].map(([k, v], i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">{k}</span>
                {k === "Статус" ? <StatusBadge status="reviewing" /> : <span className="font-medium text-zinc-900">{v}</span>}
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Btn variant="secondary" full onClick={() => navigate("/catalog")}>Миний Каталог</Btn>
            <Btn full onClick={() => navigate("/submit")}>Дахин Үүсгэх</Btn>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

