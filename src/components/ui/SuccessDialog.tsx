import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle2 } from "lucide-react";
import { Btn } from "./Btn";

export function SuccessDialog({ open, title, description, onContinue, buttonLabel = "Ойлголоо" }: { open: boolean; title: string; description: string; onContinue: () => void; buttonLabel?: string }) {
  return <Dialog.Root open={open} onOpenChange={next => { if (!next) onContinue(); }}><Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-[220] bg-black/45 backdrop-blur-sm" />
    <Dialog.Content className="fixed left-1/2 top-1/2 z-[221] max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-6 text-center shadow-2xl outline-none sm:p-8">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600"><CheckCircle2 size={28} /></div>
      <Dialog.Title className="text-base font-semibold text-foreground">{title}</Dialog.Title>
      <Dialog.Description className="mt-2 break-words text-sm leading-relaxed text-muted-foreground">{description}</Dialog.Description>
      <div className="mt-6"><Btn full onClick={onContinue}>{buttonLabel}</Btn></div>
    </Dialog.Content>
  </Dialog.Portal></Dialog.Root>;
}
