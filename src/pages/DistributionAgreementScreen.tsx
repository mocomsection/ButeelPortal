import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, ArrowLeft, ChevronDown } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { OB_AGREEMENTS } from "@/data/agreements";

export default function DistributionAgreementScreen() {
  const navigate = useNavigate();
  const [signingId, setSigningId] = useState<string | null>(null);
  const [signedIds, setSignedIds] = useState<string[]>(["distribution"]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleSign = (id: string) => {
    setSignedIds(prev => [...prev, id]);
    setSigningId(null);
  };

  return (
    <Shell title="Гэрээнүүд">
      <div className="max-w-2xl space-y-5">
        <button type="button" onClick={() => navigate("/account")} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700">
          <ArrowLeft size={16} />Аккаунтад Буцах
        </button>

        <div className="space-y-4">
          {OB_AGREEMENTS.map(ag => {
            const isSigned = signedIds.includes(ag.id);
            const isExpanded = expanded === ag.id;
            const isSigning = signingId === ag.id;
            return (
              <Card key={ag.id} className="overflow-hidden">
                {/* Header */}
                <div className={`p-5 border-b border-zinc-100 flex items-start gap-4 ${isSigned ? "bg-green-50/40" : "bg-white"}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${ag.iconBg} text-white`}>
                    <ag.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-sm text-zinc-900">{ag.name}</p>
                      {ag.required && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold">Заавал</span>}
                    </div>
                    <p className="text-xs text-zinc-500">{ag.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isSigned ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                        <CheckCircle2 size={11} />Гарын үсэг зурсан
                      </span>
                    ) : (
                      <Btn size="sm" onClick={() => setSigningId(ag.id)}>Гэрээ Хийх</Btn>
                    )}
                    <button type="button" onClick={() => setExpanded(isExpanded ? null : ag.id)}
                      className="p-1 text-zinc-400 hover:text-zinc-600">
                      <ChevronDown size={15} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Signing form */}
                {isSigning && (
                  <div className="p-5 bg-violet-50/50 border-b border-zinc-100 space-y-4">
                    <div className="h-40 overflow-y-auto bg-white rounded-xl p-4 text-sm text-zinc-600 leading-relaxed border border-zinc-100 space-y-3">
                      <p className="font-semibold text-zinc-900">Нэг. Гэрээний зорилго</p>
                      <p>Энэхүү гэрээгээр Buteel платформ нь артистын бүтээлийг цахим хөгжмийн тавцнуудад тараах эрхийг авна.</p>
                      <p className="font-semibold text-zinc-900">Хоёр. Орлогын хуваарилалт</p>
                      <p>Тараалтаас орсон орлогын 85%-ийг артистад, 15%-ийг платформын үйлчилгээний хөлс болгон суутгана.</p>
                    </div>
                    <div className="flex gap-3">
                      <Btn variant="secondary" onClick={() => setSigningId(null)}>Цуцлах</Btn>
                      <Btn full onClick={() => handleSign(ag.id)}>Гэрээнд Гарын Үсэг Зурах</Btn>
                    </div>
                  </div>
                )}

                {/* Expanded services */}
                {isExpanded && (
                  <div className="px-5 py-4">
                    <p className="text-xs font-bold uppercase text-zinc-400 mb-2">Нээгдэх Үйлчилгээнүүд</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ag.services.map(s => (
                        <span key={s} className={`text-xs px-2 py-0.5 rounded-md font-medium ${ag.badge}`}>{s}</span>
                      ))}
                    </div>
                    {isSigned && (
                      <p className="text-xs text-green-600 mt-3 font-semibold">Гарын үсэг зурсан огноо: 2024-11-15</p>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
