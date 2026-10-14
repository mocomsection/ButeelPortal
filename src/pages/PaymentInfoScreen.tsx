import { useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { Input } from "@/components/ui/Input";
import { SelectInput } from "@/components/ui/SelectInput";

export default function PaymentInfoScreen() {
  const navigate = useNavigate();
  const [bank, setBank] = useState("Хаан банк");
  const [accountNo, setAccountNo] = useState("");
  const [holderName, setHolderName] = useState("");
  return (
    <Shell title="Төлбөр Хүлээн Авагчийн Мэдээлэл">
      <div className="max-w-xl space-y-5">
        <button type="button" onClick={() => navigate("/account")} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700">
          <ArrowLeft size={16} />Буцах
        </button>

        <Card className="p-6">
          <h2 className="font-semibold text-zinc-900 mb-5">Банкны Данс</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Банк</label>
              <SelectInput
                value={bank}
                onChange={setBank}
                options={["Хаан банк", "Голомт банк", "Төрийн банк", "МТБанк", "Капитрон банк", "Хас банк"]}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-border bg-white text-zinc-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <Input label="Дансны дугаар" placeholder="1234567890" value={accountNo} onChange={setAccountNo} />
            <Input label="Дансны эзэмшигчийн нэр" placeholder="БОЛД ЖАРГАЛ" value={holderName} onChange={setHolderName}
              helper="Дансны эзэмшигч нь KYC-аар баталгаажсан нэртэй таарах ёстой" />
          </div>
        </Card>

        {/* KYC name note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <span className="font-semibold">Анхааруулга: </span>
            Дансны эзэмшигчийн нэр нь таны KYC-аар баталгаажсан нэртэй яг таарах ёстой.
            KYC баталгаажуулалт хийгдээгүй бол <button type="button" className="underline font-semibold" onClick={() => navigate("/account/tax")}>эндээс баталгаажуулна уу</button>.
          </div>
        </div>

        <div className="flex gap-3">
          <Btn variant="secondary" onClick={() => navigate("/account")}>Буцах</Btn>
          <Btn full onClick={() => navigate("/account")}>Хадгалах</Btn>
        </div>
      </div>
    </Shell>
  );
}
