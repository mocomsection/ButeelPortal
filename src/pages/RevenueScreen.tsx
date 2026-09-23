import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import type { WITHDRAWALS_DATA } from "@/data/revenue";
import { WithdrawalDetailModal, WithdrawalRequestModal } from "./revenue/RevenueModals";
import { WithdrawTab } from "./revenue/WithdrawTab";

export default function RevenueScreen() {
  const [wdModal, setWdModal] = useState<typeof WITHDRAWALS_DATA[0] | null>(null);
  const [wdStep, setWdStep] = useState<null | "form" | "success">(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyText = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Shell title="Орлого" subtitle="Орлого татах болон тооцооны мэдээлэл">
      <WithdrawalDetailModal withdrawal={wdModal} onClose={() => setWdModal(null)} />
      <WithdrawalRequestModal
        step={wdStep}
        onClose={() => setWdStep(null)}
        onSubmit={() => setWdStep("success")}
        copiedField={copiedField}
        onCopy={copyText}
      />
      <WithdrawTab
        onWithdrawRequest={() => setWdStep("form")}
        onDetailClick={setWdModal}
      />
    </Shell>
  );
}
