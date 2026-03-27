import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  change: string;
  changeType?: "positive" | "negative";
  className?: string;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  change,
  changeType = "positive",
  className,
}: StatCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4 shadow-sm", className)}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        <div className={cn(
          "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
          changeType === "positive" 
            ? "bg-emerald-500/10 text-emerald-500" 
            : "bg-rose-500/10 text-rose-500"
        )}>
          {changeType === "positive" ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {change}
        </div>
      </div>
    </div>
  );
}
