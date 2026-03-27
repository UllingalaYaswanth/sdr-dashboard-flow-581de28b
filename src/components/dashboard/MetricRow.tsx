import { Metric } from "@/data/mockData";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricRowProps {
  metrics: Metric[];
}

export function MetricRow({ metrics }: MetricRowProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="sdr-metric-card"
        >
          <div className="text-[11px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">{m.label}</div>
          <div className="text-2xl font-bold tracking-tight mb-1.5">{m.value}</div>
          <div className={`flex items-center gap-1 text-[11px] font-medium ${
            m.deltaType === "up" ? "text-[hsl(var(--ai-green))]" :
            m.deltaType === "down" ? "text-[hsl(var(--ai-red))]" :
            "text-muted-foreground"
          }`}>
            {m.deltaType === "up" ? <TrendingUp className="w-3 h-3" /> :
             m.deltaType === "down" ? <TrendingDown className="w-3 h-3" /> :
             <Minus className="w-3 h-3" />}
            {m.delta}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
