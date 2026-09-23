import { useNavigate } from "react-router";
import { ArrowDownToLine, Settings, Check, X, AlertCircle, RefreshCw, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { WITHDRAWALS_DATA, WITHDRAW_STATUS, STATUS_ORDER } from "@/data/revenue";
import { AVAILABLE_BALANCE, fmtMoney, thCls, thRCls, tdBoldR, tdRCls } from "./revenueUtils";

interface WithdrawTabProps {
  onWithdrawRequest: () => void;
  onDetailClick: (w: typeof WITHDRAWALS_DATA[0]) => void;
}

export function WithdrawTab({ onWithdrawRequest, onDetailClick }: WithdrawTabProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">

      {/* Withdrawal summary card */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-6 items-start">
          {/* left: balance */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 mb-1">Боломжтой үлдэгдэл</p>
            <p className="text-3xl font-extrabold text-primary">{fmtMoney(AVAILABLE_BALANCE)}</p>
            <p className="text-xs text-zinc-400 mt-1.5">Хамгийн бага ₮100,000.00</p>
          </div>
          <div className="w-px bg-border self-stretch hidden sm:block" />
          {/* center: account info */}
          <div className="space-y-2">
            <div>
              <p className="text-xs font-semibold text-zinc-400">Хүлээн авах данс</p>
              <p className="text-sm font-bold text-zinc-900 mt-0.5">Хаан Банк ••••4521</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-400">Хүлээн авагч</p>
              <p className="text-sm font-bold text-zinc-900 mt-0.5">Болд Жаргал</p>
            </div>
          </div>
          {/* right: actions */}
          <div className="sm:ml-auto flex flex-col gap-2 self-center">
            <button type="button" onClick={() => navigate("/account/payment")}
              className="flex items-center gap-2 h-9 px-4 rounded-xl border border-border text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors">
              <Settings size={14} />Тохиргоо
            </button>
            <button type="button"
              onClick={() => AVAILABLE_BALANCE >= 100000 && onWithdrawRequest()}
              disabled={AVAILABLE_BALANCE < 100000}
              className="flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-bold text-white transition-all shadow-[0_2px_8px_0_rgba(108,77,246,0.35)] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background:"linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))" }}>
              <ArrowDownToLine size={14} />Татах хүсэлт
            </button>
          </div>
        </div>
      </Card>

      {/* Withdrawal history */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ArrowDownToLine size={14} className="text-primary" />
            <h3 className="font-bold text-zinc-900 text-sm">Таталтын түүх</h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">Одоогийн төлөв, сүүлийн өөрчлөлт</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50/60 border-b border-border">
                <th className={thCls}>Хүсэлт</th>
                <th className="text-left text-xs font-bold text-zinc-400 uppercase px-5 py-3">Статус</th>
                <th className={thRCls + " hidden sm:table-cell"}>Татах дүн</th>
                <th className={thRCls + " hidden md:table-cell"}>Хүлээн авах</th>
                <th className="text-left text-xs font-bold text-zinc-400 uppercase px-5 py-3 hidden lg:table-cell">Шинэчлэгдсэн</th>
                <th className="px-5 py-3 text-xs font-bold text-zinc-400 uppercase">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {WITHDRAWALS_DATA.map(w => {
                const st = WITHDRAW_STATUS[w.status] || { label:w.status, cls:"bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200" };
                const statusIdx = STATUS_ORDER[w.status] ?? 0;
                const receiveAmt = w.amount * 0.9;
                return (
                  <tr key={w.id} className="hover:bg-muted/40/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-zinc-900">{w.requestedDate}</p>
                      <p className="text-xs text-zinc-300 font-mono mt-0.5">{w.id}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${st.cls}`}>
                        {w.status === "receipt_pending" && <AlertCircle size={9} />}
                        {w.status === "reviewing" && <RefreshCw size={9} />}
                        {w.status === "paid" && <Check size={9} />}
                        {w.status === "returned" && <X size={9} />}
                        {w.status === "created" && <Clock size={9} />}
                        {st.label}
                      </span>
                    </td>
                    <td className={tdBoldR + " hidden sm:table-cell"}>{fmtMoney(w.amount)}</td>
                    <td className={tdRCls + " hidden md:table-cell"}>{fmtMoney(receiveAmt)}</td>
                    <td className="px-5 py-3.5 text-xs text-zinc-400 hidden lg:table-cell">{w.modifiedAt}</td>
                    <td className="px-5 py-3.5 text-center">
                      <button type="button" onClick={() => onDetailClick(w)}
                        className="text-xs font-semibold text-primary hover:text-[#5B3FE0] bg-violet-50 hover:bg-violet-100 px-2.5 h-7 rounded-lg transition-colors">
                        Дэлгэрэнгүй
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
