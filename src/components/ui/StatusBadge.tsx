import React from "react";
import { Clock, ChevronRight, RefreshCw, AlertCircle, CheckCircle2, Check, X, ArrowDownToLine } from "lucide-react";
import { StatusType, STATUS_MAP } from "@/types";

export function StatusBadge({ status }: { status: StatusType }) {
  const s = STATUS_MAP[status];
  const icons: Record<StatusType, React.ReactNode> = {
    draft:       <Clock size={10} />,
    submitted:   <ChevronRight size={10} />,
    reviewing:   <RefreshCw size={10} />,
    revision:    <AlertCircle size={10} />,
    approved:    <CheckCircle2 size={10} />,
    distributed: <Check size={10} />,
    failed:      <X size={10} />,
    paid:        <CheckCircle2 size={10} />,
    waiting:     <Clock size={10} />,
    withdrawn:   <ArrowDownToLine size={10} />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}>
      {icons[status]}{s.label}
    </span>
  );
}
