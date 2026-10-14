import { useId, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Building2, Plus, Search, X } from "lucide-react";
import { SelectInput } from "@/components/ui/SelectInput";
import { Btn } from "@/components/ui/Btn";
import { ContributorNameExample } from "@/components/ui/ContributorNameExample";

export type ContributorPerson = { id: string; name: string; nameLanguage?: "mn" | "en" };
const initials = (name: string) => name.split(/\s+/).map(word => word[0]).join("").slice(0, 2).toUpperCase();

export function ContributorPicker({ label, hint, required, people, options, onChange, onCreate, multiple = true, error, roleSelection, selectedContent, entityType = "person" }: {
  label: string; hint?: string; required?: boolean; people: ContributorPerson[]; options: ContributorPerson[];
  onChange: (people: ContributorPerson[]) => void; onCreate: (person: ContributorPerson) => void; multiple?: boolean; error?: boolean;
  roleSelection?: { value: string; options: string[]; onChange: (role: string) => void };
  selectedContent?: ReactNode;
  entityType?: "person" | "organization";
}) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("mn");
  const fieldId = useId();
  const organization = entityType === "organization";
  const filtered = options.filter(person => person.name.toLowerCase().includes(query.trim().toLowerCase()));
  const add = (person: ContributorPerson) => {
    if (!people.some(item => item.id === person.id)) onChange(multiple ? [...people, person] : [person]);
    setOpen(false);
  };
  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0"><p className="text-sm font-semibold text-foreground">{label}{required && <span className="text-destructive"> *</span>}</p>{hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}</div>
        <Btn variant="secondary" size="sm" icon={<Plus size={12} />} onClick={() => { setQuery(""); setCreating(false); setOpen(true); }}>{roleSelection ? "Нэмэх" : "Сонгох"}</Btn>
      </div>
      {error && people.length === 0 && <p role="alert" className="text-xs text-destructive">{label} заавал сонгоно уу.</p>}
      {selectedContent ?? (people.length > 0 && <div className="flex flex-wrap gap-2 border-t border-border pt-3">
        {people.map(person => <div key={person.id} className="flex min-w-0 max-w-full items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">{organization ? <Building2 size={15} /> : initials(person.name)}</span>
          <span className="min-w-0 break-words text-sm font-medium">{person.name}</span>
          <button type="button" aria-label={`${person.name} хасах`} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive" onClick={() => onChange(people.filter(item => item.id !== person.id))}><X size={13} /></button>
        </div>)}
      </div>)}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-4 right-4 top-1/2 z-[201] flex max-h-[calc(100dvh-2rem)] -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:left-1/2 sm:right-auto sm:w-full sm:max-w-lg sm:-translate-x-1/2">
            <div className="flex items-start justify-between gap-3 p-5 pb-3">
              <div><Dialog.Title className="text-lg font-extrabold">{creating ? `${roleSelection?.value || label} үүсгэх` : roleSelection ? "Оролцогч нэмэх" : `${label} сонгох`}</Dialog.Title><Dialog.Description className="mt-1 text-xs text-muted-foreground">{organization ? (creating ? "Студи эсвэл продакшны албан ёсны нэрийг оруулна уу." : "Бүртгэлтэй байгууллага сонгох эсвэл шинээр үүсгэнэ.") : creating ? "Нэрээ бичих хэлээ сонгоод бүтэн овог, нэрээ оруулна уу." : roleSelection ? "Үүрэг болон оролцох хүнийг энэ цонхноос сонгоно." : "Бүртгэлтэй хүн сонгох эсвэл шинээр үүсгэнэ."}</Dialog.Description></div>
              <Dialog.Close aria-label="Цонх хаах" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"><X size={16} /></Dialog.Close>
            </div>
            <div className="min-h-0 overflow-y-auto px-5 pb-5">
              {roleSelection && <div className="mb-4 space-y-2"><p className="text-sm font-medium">Оролцогчийн үүрэг</p><SelectInput value={roleSelection.value} onChange={roleSelection.onChange} options={roleSelection.options} /></div>}
              {creating ? <div className="space-y-3">
                <label htmlFor={fieldId} className="block text-sm font-medium">{organization ? "Студи / Продакшны нэр" : "Хууль ёсны бүтэн овог, нэр"} <span className="text-destructive">*</span></label>
                <div className="flex overflow-hidden rounded-xl border border-border focus-within:ring-2 focus-within:ring-primary/20">
                  <input id={fieldId} autoFocus required value={name} onChange={event => setName(event.target.value)} aria-describedby={organization ? undefined : `${fieldId}-example`} placeholder={organization ? "Байгууллагын нэр оруулах" : language === "mn" ? "Овог, нэр оруулах" : "Нэр, овог оруулах"} className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none" />
                  {!organization && <SelectInput value={language} onChange={setLanguage} variant="attached" options={[{ value: "mn", label: "Монгол" }, { value: "en", label: "English / Latin" }]} />}
                </div>
                {!organization && <ContributorNameExample language={language} id={`${fieldId}-example`} />}
              </div> : <>
                <div className="relative"><Search size={15} className="absolute left-3 top-3.5 text-muted-foreground" /><input autoFocus aria-label={`${label} хайх`} value={query} onChange={event => setQuery(event.target.value)} placeholder="Нэрээр хайх" className="w-full rounded-xl border border-border bg-background py-3 pl-9 pr-3 text-sm outline-none focus:border-primary" /></div>
                <div className="mt-3 space-y-1">
                  {filtered.map(person => { const selected = people.some(item => item.id === person.id); return <button key={person.id} type="button" disabled={selected} onClick={() => add(person)} className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left hover:bg-muted disabled:opacity-50"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">{organization ? <Building2 size={15} /> : initials(person.name)}</span><span className="min-w-0 flex-1 break-words text-sm">{person.name}</span>{selected && <span className="text-xs text-muted-foreground">Сонгосон</span>}</button>; })}
                  {filtered.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">Илэрц олдсонгүй</p>}
                </div>
              </>}
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t border-border bg-muted/20 px-5 py-4">
              {creating ? <><Btn variant="secondary" onClick={() => setCreating(false)}>Буцах</Btn><Btn disabled={!name.trim()} onClick={() => {
                const existing = options.find(person => person.name.toLowerCase() === name.trim().toLowerCase());
                const person = existing || { id: crypto.randomUUID(), name: name.trim(), ...(!organization ? { nameLanguage: language as "mn" | "en" } : {}) };
                if (!existing) onCreate(person);
                add(person);
              }}>Үүсгээд нэмэх</Btn></> : <Btn icon={<Plus size={14} />} onClick={() => { setName(query.trim()); setLanguage("mn"); setCreating(true); }}>Шинээр үүсгэх</Btn>}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
