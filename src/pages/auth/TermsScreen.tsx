import { useState } from "react";
import { useNavigate } from "react-router";
import { Check, FileText } from "lucide-react";
import { Btn } from "@/components/ui/Btn";
import { Card } from "@/components/ui/Card";

export default function TermsScreen() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
              <FileText size={20} className="text-zinc-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Үйлчилгээний нөхцөл</h2>
              <p className="text-sm text-zinc-500">Уншиж, зөвшөөрнө үү</p>
            </div>
          </div>
          <div className="h-64 overflow-y-auto bg-zinc-50 rounded-xl p-5 text-sm text-zinc-600 leading-relaxed border border-zinc-200 mb-6 space-y-3">
            <p className="font-semibold text-zinc-900">1. Ерөнхий заалт</p>
            <p>Buteel Creator Portal нь хөгжимчдэд тэдний бүтээлийг дижитал тавцнуудад тараахад туслах платформ юм. Энэхүү нөхцөлийг зөвшөөрснөөр та дараах үүргийг хүлээнэ.</p>
            <p className="font-semibold text-zinc-900">2. Оюуны өмч</p>
            <p>Та илгээж буй бүтээлдээ бүрэн эрхтэй байх, эсвэл зохих зөвшөөрлийг авсан байх ёстой. Авторын эрхийн зөрчил гарсан тохиолдолд Buteel хариуцлага хүлээхгүй.</p>
            <p className="font-semibold text-zinc-900">3. Орлогын хуваарилалт</p>
            <p>Тараалтаас орж буй орлогыг платформын тарифын дагуу хуваарилна. Дэлгэрэнгүй тарифыг тусдаа гэрээнд тусгана.</p>
            <p className="font-semibold text-zinc-900">4. Хувийн мэдээлэл хамгаалал</p>
            <p>Таны мэдээллийг Монгол Улсын хуулийн дагуу хамгаална. Гуравдагч этгээдэд зарахгүй, шилжүүлэхгүй.</p>
            <p className="font-semibold text-zinc-900">5. Гэрээ цуцлах</p>
            <p>Аль ч тал 30 хоногийн урьдчилсан мэдэгдлээр гэрээг цуцлах эрхтэй.</p>
          </div>
          <label className="flex items-center gap-3 cursor-pointer mb-6 select-none">
            <div onClick={() => setAgreed(!agreed)}
              className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${agreed ? "bg-primary border-primary" : "border-zinc-300"}`}>
              {agreed && <Check size={12} className="text-white" />}
            </div>
            <span className="text-sm text-zinc-700">Үйлчилгээний нөхцөлтэй танилцаж, зөвшөөрч байна</span>
          </label>
          <div className="flex gap-3">
            <Btn variant="secondary" onClick={() => navigate("/register")}>Буцах</Btn>
            <Btn full disabled={!agreed} onClick={() => navigate("/revenue")}>Зөвшөөрч үргэлжлүүлэх</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}
