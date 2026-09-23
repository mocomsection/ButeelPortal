export const AVAILABLE_BALANCE = 410000.00;
export const LIFETIME_TOTAL    = 9225000.00;
export const CURRENT_MONTH_KEY = "2026-08";
export const PAGE_SIZE = 25;

export const fmtMoney = (n: number) => "₮" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const formatMonthFull = (key: string) => { const [y,m] = key.split("-"); return `${y} он ${parseInt(m)}-р сар`; };
export const formatMonthShort = (key: string) => { const [y,m] = key.split("-"); return `${parseInt(m)} сар, ${y.slice(2)}`; };
export const fmtYAxis = (v: number) => { if(v===0) return "0"; if(v>=1000000) return `${(v/1000000)%1===0?(v/1000000).toFixed(0):(v/1000000).toFixed(1)}сая`; if(v>=1000) return `${(v/1000).toFixed(0)}м`; return String(v); };

export const thCls  = "text-left text-[11px] font-bold text-zinc-400 uppercase px-5 py-3";
export const thRCls = "text-right text-[11px] font-bold text-zinc-400 uppercase px-5 py-3";
export const tdCls  = "px-5 py-3.5 text-sm text-zinc-500";
export const tdRCls = "px-5 py-3.5 text-right text-sm tabular-nums text-zinc-500";
export const tdBoldR = "px-5 py-3.5 text-right text-sm tabular-nums font-bold text-zinc-900";
