import { motion } from "framer-motion";
import { Metric } from "@/data/mockData";

interface MetricRowProps {
  metrics: Metric[];
}

export function MetricRow({ metrics }: MetricRowProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="sdr-metric-card"
        >
          <div className="text-xs text-muted-foreground">{m.label}</div>
          <div className="text-xl font-medium mt-0.5">{m.value}</div>
          <div className={`text-xs mt-0.5 ${m.deltaType === "up" ? "text-sdr-green" : m.deltaType === "down" ? "text-sdr-coral" : "text-muted-foreground"}`}>
            {m.delta}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
