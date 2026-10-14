import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Shield, X, CheckCircle2 } from "lucide-react";
import { Input } from "./Input";
import { Btn } from "./Btn";

export function PasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [saved, setSaved] = useState(false);
  const passwordValid = newPassword.length >= 8 && /\p{L}/u.test(newPassword) && /\d/.test(newPassword);
  const canSave = !!currentPassword && passwordValid && confirmation === newPassword;

  return <Dialog.Root open onOpenChange={open => { if (!open) onClose(); }}><Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-sm" />
    <Dialog.Content className="fixed left-1/2 top-1/2 z-[201] max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-xl outline-none sm:p-6">
      <Dialog.Close aria-label="Цонх хаах" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"><X size={16} /></Dialog.Close>
      {saved ? <div className="py-3 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600"><CheckCircle2 size={24} /></div>
        <Dialog.Title className="text-base font-semibold">Нууц үг амжилттай солигдлоо</Dialog.Title>
        <Dialog.Description className="mt-2 text-sm leading-relaxed text-muted-foreground">Дараагийн нэвтрэлтэд шинэ нууц үгээ ашиглана уу.</Dialog.Description>
        <div className="mt-5"><Btn full onClick={onClose}>Дуусгах</Btn></div>
      </div> : <>
        <div className="mb-5 flex items-center gap-3 pr-8"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><Shield size={16} /></span><div><Dialog.Title className="text-sm font-semibold">Нууц үг солих</Dialog.Title><Dialog.Description className="mt-1 text-xs text-muted-foreground">Одоогийн болон шинэ нууц үгээ оруулна уу.</Dialog.Description></div></div>
        <form onSubmit={event => { event.preventDefault(); if (canSave) setSaved(true); }}>
          <div className="space-y-4">
            <Input label="Одоогийн нууц үг" type="password" value={currentPassword} onChange={setCurrentPassword} autoComplete="current-password" />
            <Input label="Шинэ нууц үг" type="password" value={newPassword} onChange={setNewPassword} autoComplete="new-password" helper="8+ тэмдэгт, үсэг болон тоо агуулсан байна." error={newPassword && !passwordValid ? "Нууц үгийн шаардлага хангаагүй байна." : undefined} />
            <Input label="Шинэ нууц үг давтах" type="password" value={confirmation} onChange={setConfirmation} autoComplete="new-password" error={confirmation && confirmation !== newPassword ? "Нууц үг таарахгүй байна." : undefined} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3"><Btn variant="secondary" full onClick={onClose}>Болих</Btn><Btn type="submit" full disabled={!canSave}>Хадгалах</Btn></div>
        </form>
      </>}
    </Dialog.Content>
  </Dialog.Portal></Dialog.Root>;
}
