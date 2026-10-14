import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown, Plus, Search } from "lucide-react";

interface CreatableSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  onCreate: (name: string) => void;
  placeholder: string;
}

export function CreatableSelect({ value, options, onChange, onCreate, placeholder }: CreatableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const name = query.trim();
  const filtered = options.filter(option => option.toLowerCase().includes(name.toLowerCase()));
  const exact = options.find(option => option.toLowerCase() === name.toLowerCase());
  const choose = (option: string) => {
    onChange(option);
    setOpen(false);
    setQuery("");
  };
  const create = () => {
    if (!name) return;
    if (exact) choose(exact);
    else {
      onCreate(name);
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <Popover.Root open={open} onOpenChange={next => { setOpen(next); if (!next) setQuery(""); }}>
      <Popover.Trigger asChild>
        <button type="button" className="flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
          <span className={`min-w-0 truncate text-sm ${value ? "text-foreground" : "text-muted-foreground"}`}>{value || placeholder}</span>
          <ChevronDown size={14} className="shrink-0 text-muted-foreground" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={6} collisionPadding={16}
          className="z-[300] w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-card shadow-xl outline-none">
          <div className="relative border-b border-border p-2">
            <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={event => setQuery(event.target.value)} aria-label="Эрхийн байгууллага хайх эсвэл үүсгэх"
              placeholder="Хайх эсвэл шинэ нэр бичих…"
              onKeyDown={event => { if (event.key === "Enter" && name) { event.preventDefault(); create(); } }}
              className="w-full rounded-lg bg-muted/30 py-2 pl-9 pr-3 text-sm outline-none" />
          </div>
          <div className="max-h-52 overflow-y-auto p-1">
            {!name && <button type="button" onClick={() => choose("Copyright Control")} className="flex min-h-10 w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-secondary">Байгууллагагүй{value === "Copyright Control" && <Check size={13} />}</button>}
            {filtered.map(option => (
              <button key={option} type="button" onClick={() => choose(option)} className="flex min-h-10 w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-secondary">
                <span className="min-w-0 break-words text-sm">{option}</span>{value === option && <Check size={13} className="shrink-0 text-primary" />}
              </button>
            ))}
            {name && !exact && (
              <button type="button" onClick={create} className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-primary hover:bg-secondary">
                <Plus size={14} className="shrink-0" /><span className="min-w-0 break-words text-sm">“{name}” үүсгээд сонгох</span>
              </button>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
