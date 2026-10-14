import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  className?: string;
  variant?: "default" | "attached";
  compact?: boolean;
}

export function SelectInput({ value, onChange, options, placeholder = "Сонгох", className = "", variant = "default", compact = false }: SelectInputProps) {
  const normalized = options.map(option => typeof option === "string" ? { value: option, label: option } : option).filter(option => option.value !== "");
  const selected = normalized.find(option => option.value === value);
  const attached = variant === "attached";

  return (
    <div className={`relative ${attached ? "max-w-[48%] shrink-0" : ""} ${className}`}>
      <Select.Root value={selected?.value || ""} onValueChange={onChange}>
        <Select.Trigger aria-label={attached ? "Нэр бичих хэл" : placeholder}
          className={attached
            ? "group flex h-full w-full min-w-[90px] cursor-pointer items-center justify-between gap-2 border-0 border-l border-border bg-secondary px-3 py-2 text-[11px] font-extrabold text-primary outline-none transition-colors hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary data-[state=open]:border-primary"
            : compact
              ? "group flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-border bg-card px-2.5 text-sm outline-none transition-colors hover:border-primary hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary/20 data-[state=open]:border-primary"
              : "group flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5 text-left text-sm outline-none transition-colors hover:border-primary hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary/20 data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/20"}>
          <span className={compact ? "flex min-w-0 flex-1 items-center justify-center text-sm font-medium text-foreground" : attached ? "min-w-0 truncate text-[11px] font-extrabold text-primary" : `min-w-0 truncate text-sm ${selected ? "text-foreground" : "font-normal text-muted-foreground"}`}>
            <Select.Value placeholder={compact ? "—" : placeholder}>{selected?.label}</Select.Value>
          </span>
          <Select.Icon asChild><ChevronDown size={14} className={"shrink-0 transition-transform group-data-[state=open]:rotate-180 " + (compact ? "text-muted-foreground" : "text-primary")} /></Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content position="popper" align="start" sideOffset={4} collisionPadding={8}
            className={"z-[1000] max-h-[min(260px,var(--radix-select-content-available-height))] max-w-[calc(100vw-16px)] overflow-hidden rounded-xl border border-border bg-card shadow-xl outline-none " + (compact ? "w-[var(--radix-select-trigger-width)]" : "w-[max(180px,var(--radix-select-trigger-width))]")}>
            <Select.Viewport className={compact ? "space-y-1 p-1" : "space-y-1 p-2"}>
              {normalized.map(option => (
                <Select.Item key={option.value} value={option.value}
                  className={`relative min-h-10 cursor-pointer items-center rounded-lg py-2.5 text-left ${compact ? "grid grid-cols-[14px_12px] justify-center gap-1 px-1" : "flex justify-between gap-3 px-3"} ${attached ? "text-xs" : "text-sm"} text-foreground outline-none transition-colors data-[highlighted]:bg-secondary data-[highlighted]:text-primary data-[state=checked]:bg-primary/5 data-[state=checked]:font-semibold data-[state=checked]:text-primary`}>
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator><Check size={compact ? 12 : 13} className="shrink-0 text-primary" /></Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
