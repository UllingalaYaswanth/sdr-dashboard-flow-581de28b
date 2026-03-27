import { MetricRow } from "@/components/dashboard/MetricRow";
import { BarChart } from "@/components/dashboard/BarChart";
import { FlowPipeline } from "@/components/dashboard/FlowPipeline";
import { overviewMetrics, sourceBarData, funnelSteps } from "@/data/mockData";
import { motion } from "framer-motion";

export function OverviewPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <MetricRow metrics={overviewMetrics} />
      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <div className="sdr-card">
          <div className="sdr-section-title">Leads by source</div>
          {sourceBarData.map((s) => (
            <BarChart key={s.label} label={s.label} value={s.value.toLocaleString()} pct={s.pct} colorClass={s.color} />
          ))}
        </div>
        <div className="sdr-card">
          <div className="sdr-section-title">Pipeline health</div>
          <div className="flex flex-col gap-1">
            {funnelSteps.map((step, i) => {
              const blues = ["bg-sdr-blue/20", "bg-sdr-blue/40", "bg-sdr-blue", "bg-sdr-blue-dark/80", "bg-sdr-blue-dark"];
              return (
                <div key={step.label} className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-md bg-secondary">
                  <span className="text-sm flex-1">{step.label}</span>
                  <div className="flex-[2] h-1.5 bg-border rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${blues[i]}`} style={{ width: `${step.pct}%` }} />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{step.value.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground w-8 text-right">{step.rate}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="sdr-card">
        <div className="sdr-section-title">Master flow — current position</div>
        <FlowPipeline />
      </div>
    </motion.div>
  );
}
