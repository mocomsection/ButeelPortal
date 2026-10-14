export function ContributorNameExample({ language, id }: { language: string; id?: string }) {
  const mongolian = language === "mn";
  return (
    <div id={id} className="overflow-hidden rounded-xl border border-border bg-muted/20">
      <div className="space-y-1 border-b border-border/60 px-4 py-3">
        <p className="m-0! text-xs! font-semibold text-primary">Жишээ:</p>
        <p className="m-0! text-xs! leading-relaxed text-muted-foreground">{mongolian ? "Овог, нэр гэсэн дарааллаар бичнэ" : "Нэр, овог гэсэн дарааллаар бичнэ"}</p>
      </div>
      <div className="grid grid-cols-2 divide-x divide-border/60 px-1 py-3">
        <div className="min-w-0 px-3 py-1 text-center sm:px-4">
          <p className="m-0! text-xs! text-muted-foreground">{mongolian ? "Овог" : "Нэр"}{!mongolian && <span className="mt-0.5 block text-[11px]">First name</span>}</p>
          <p className="mb-0! mt-1.5! break-words text-sm! font-medium text-foreground">{mongolian ? "Саруулбат" : "Gan-Edene"}</p>
        </div>
        <div className="min-w-0 px-3 py-1 text-center sm:px-4">
          <p className="m-0! text-xs! text-muted-foreground">{mongolian ? "Нэр" : "Овог"}{!mongolian && <span className="mt-0.5 block text-[11px]">Last name</span>}</p>
          <p className="mb-0! mt-1.5! break-words text-sm! font-medium text-foreground">{mongolian ? "Ган-Эрдэнэ" : "Saruulbat"}</p>
        </div>
      </div>
    </div>
  );
}
