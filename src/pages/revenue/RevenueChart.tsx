import { TrendingUp, FileText } from "lucide-react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Card } from "@/components/ui/Card";
import { ALL_MONTHLY } from "@/data/revenue";
import { CURRENT_MONTH_KEY, fmtMoney, formatMonthFull, formatMonthShort, fmtYAxis } from "./revenueUtils";

const PRIMARY = "var(--primary)";

interface RevenueChartProps {
  revenueContentType: "music" | "audiobook" | "film";
  onShowMonthly: () => void;
}

export function RevenueChart({ revenueContentType, onShowMonthly }: RevenueChartProps) {
  const chartData = ALL_MONTHLY.map(m => ({
    ...m,
    label: formatMonthShort(m.key),
    isCurrent: m.key === CURRENT_MONTH_KEY,
  }));

  const chartDataFiltered = chartData.map(d => ({
    ...d,
    amount: revenueContentType === "music" ? d.amount
          : revenueContentType === "audiobook" ? Math.round(d.amount * 0.12)
          : Math.round(d.amount * 0.04),
  }));

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-1 flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-primary" />
            <h3 className="font-bold text-foreground text-sm">Нийт хугацааны орлогын график</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {revenueContentType === "music" ? "Цомог / Дуу" : revenueContentType === "audiobook" ? "Аудио ном" : "Кино"} — Сар бүрийн баталгаажсан орлого
          </p>
        </div>
        <button type="button" onClick={onShowMonthly}
          className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 bg-secondary hover:bg-secondary/80 px-3 h-8 rounded-xl transition-colors">
          <FileText size={12} />Сар бүрээр харах
        </button>
      </div>
      <div className="h-52 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartDataFiltered} margin={{ top:4, right:12, left:4, bottom:4 }}>
            <defs>
              <linearGradient id="liftimeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.22} />
                <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tick={{ fontSize:11, fill:"var(--muted-foreground)" }} axisLine={false} tickLine={false} interval="preserveStartEnd" tickMargin={8} />
            <YAxis tick={{ fontSize:11, fill:"var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={fmtYAxis} width={44} tickMargin={6} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-card rounded-xl shadow-lg border border-border px-4 py-3 text-xs">
                    <p className="font-bold text-foreground mb-1">{formatMonthFull(d.key)}</p>
                    <p className="font-extrabold text-primary">{fmtMoney(d.amount)}</p>
                    {d.isCurrent && <p className="text-xs text-primary/60 mt-1">Одоогийн сар</p>}
                  </div>
                );
              }}
            />
            <Area
              dataKey="amount" stroke={PRIMARY} strokeWidth={2} fill="url(#liftimeGrad)"
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (!payload.isCurrent) return <g key={payload.key} />;
                return (
                  <g key={payload.key}>
                    <circle cx={cx} cy={cy} r={6} fill={PRIMARY} stroke="var(--card)" strokeWidth={2} />
                  </g>
                );
              }}
              activeDot={{ r:4, strokeWidth:0, fill:PRIMARY }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground font-medium">Одоогийн сар</span>
        </div>
        <span className="text-xs text-muted-foreground">Цэг дээр хулганаа аваачиж сарын орлогыг харна.</span>
      </div>
    </Card>
  );
}
