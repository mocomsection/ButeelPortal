import { SelectInput } from "./SelectInput";

const LETTERS = "АБВГДЕЁЖЗИЙКЛМНОӨПРСТУҮФХЦЧШЩЪЫЬЭЮЯ".split("");
export const isValidRegisterNumber = (value: string) => /^[А-ЯЁӨҮ]{2}\d{8}$/.test(value);

export function RegisterNumberInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const first = LETTERS.includes(value[0]) ? value[0] : "";
  const second = LETTERS.includes(value[1]) ? value[1] : "";
  const digits = value.replace(/[^0-9]/g, "").slice(0, 8);
  const update = (firstLetter: string, secondLetter: string, numbers: string) => onChange(`${firstLetter || " "}${secondLetter || " "}${numbers}`);
  return <div className="grid grid-cols-[56px_56px_minmax(0,1fr)] items-center gap-2">
    <SelectInput compact value={first} onChange={letter => update(letter, second, digits)} options={LETTERS} placeholder="1-р үсэг" />
    <SelectInput compact value={second} onChange={letter => update(first, letter, digits)} options={LETTERS} placeholder="2-р үсэг" />
    <input aria-label="Регистрийн найман цифр" type="text" inputMode="numeric" maxLength={8} value={digits} onChange={event => update(first, second, event.target.value.replace(/[^0-9]/g, "").slice(0, 8))} placeholder="12345678" className="h-11 min-w-0 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
  </div>;
}
