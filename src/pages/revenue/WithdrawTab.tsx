import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowDownToLine, Settings, Check, X, AlertCircle, RefreshCw, Clock, ShieldAlert, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { WITHDRAWALS_DATA, WITHDRAW_STATUS } from "@/data/revenue";
import { AVAILABLE_BALANCE, fmtMoney, thCls, thRCls, tdBoldR, tdRCls } from "./revenueUtils";

// Demo: KYC not completed yet
const KYC_VERIFIED = false;

interface WithdrawTabProps {
  onWithdrawRequest: () => void;
  onDetailClick: (w: typeof WITHDRAWALS_DATA[0]) => void;
}

function KycModal({ onClose, onGoAccount }: { onClose: () => void; onGoAccount: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl border border-border max-w-sm w-full p-6"
        onClick={e => e.stopPropagation()}>
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={26} className="text-amber-600" />
        </div>
        <h3 className="text-lg font-extrabold text-center text-zinc-900 mb-2">
          KYC баталгаажуулалт шаардлагатай
        </h3>
        <p className="text-sm text-zinc-500 text-center leading-relaxed mb-6">
          Татах хүсэлт гаргахын тулд эхлээд аккаунтын мэдээлэл болон
          баталгаажуулалтаа дуусгана уу.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
          <p className="text-xs font-bold text-amber-700 mb-1.5">Дуусгах шаардлагатай:</p>
          <ul className="space-y-1">
            {[
              "E-Mongolia баталгаажуулалт",
              "Хувийн мэдээлэл бөглөх",
              "Банкны данс холбох",
            ].map(item => (
              <li key={item} className="flex items-center gap-2 text-xs text-amber-700">
                <AlertCircle size={10} className="flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <button type="button" onClick={onGoAccount}
            className="w-full h-10 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))" }}>
            Аккаунт тохиргоо руу очих<ArrowRight size={14} />
          </button>
          <button type="button" onClick={onClose}
            className="w-full h-10 rounded-xl text-sm font-semibold text-zinc-600 border border-border hover:bg-zinc-50 transition-colors">
            Болих
          </button>
        </div>
      </div>
    </div>
  );
}

export function WithdrawTab({ onWithdrawRequest, onDetailClick }: WithdrawTabProps) {
  const navigate = useNavigate();
  const [showKycModal, setShowKycModal] = useState(false);

  const handleWithdrawClick = () => {
    if (AVAILABLE_BALANCE < 100000) return;
    if (!KYC_VERIFIED) {
      setShowKycModal(true);
    } else {
      onWithdrawRequest();
    }
  };

  return (
    <div className="space-y-5">
      {showKycModal && (
        <KycModal
          onClose={() => setShowKycModal(false)}
          onGoAccount={() => { navigate("/account"); setShowKycModal(false); }}
        />
      )}

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
              onClick={handleWithdrawClick}
              disabled={AVAILABLE_BALANCE < 100000}
              className="flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-bold text-white transition-all shadow-[0_2px_8px_0_rgba(108,77,246,0.35)] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, #000))" }}>
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
                const st = WITHDRAW_STATUS[w.status] || { label: w.status, cls: "bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200" };
                const receiveAmt = w.amount * 0.9;
                return (
                  <tr key={w.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-zinc-900">{w.requestedDate}</p>
                      <p className="text-xs text-zinc-300 mt-0.5">{w.id}</p>
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
