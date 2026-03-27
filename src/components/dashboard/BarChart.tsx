interface BarChartProps {
  label: string;
  value: string | number;
  pct: number;
  colorClass: string;
}

export function BarChart({ label, value, pct, colorClass }: BarChartProps) {
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="sdr-bar">
        <div
          className={`sdr-bar-fill ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
