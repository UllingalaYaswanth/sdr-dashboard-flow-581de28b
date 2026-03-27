import { Lead } from "@/data/mockData";
import { BarChart } from "./BarChart";
import { motion } from "framer-motion";

interface ScoreCardProps {
  lead: Lead;
}

export function ScoreCard({ lead }: ScoreCardProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sdr-card">
      <div className="sdr-section-title mb-3">Lead scoring — {lead.name}</div>
      <BarChart label="Fit score (ICP match)" value={lead.fitScore} pct={lead.fitScore} colorClass="bg-sdr-blue" />
      <BarChart label="Intent score (behavior)" value={lead.intentScore} pct={lead.intentScore} colorClass="bg-sdr-coral" />
      <BarChart label="Timing score (recency)" value={lead.timingScore} pct={lead.timingScore} colorClass="bg-sdr-orange" />

      <div className="flex gap-2 mt-3 items-center">
        <div className="flex-1 text-center bg-secondary rounded-md py-2">
          <div className="text-xl font-medium text-sdr-blue">{lead.fitScore}</div>
          <div className="text-xs text-muted-foreground">Fit ×0.4</div>
        </div>
        <span className="text-muted-foreground">+</span>
        <div className="flex-1 text-center bg-secondary rounded-md py-2">
          <div className="text-xl font-medium text-sdr-coral">{lead.intentScore}</div>
          <div className="text-xs text-muted-foreground">Intent ×0.4</div>
        </div>
        <span className="text-muted-foreground">+</span>
        <div className="flex-1 text-center bg-secondary rounded-md py-2">
          <div className="text-xl font-medium text-sdr-orange">{lead.timingScore}</div>
          <div className="text-xs text-muted-foreground">Timing ×0.2</div>
        </div>
        <span className="text-muted-foreground">=</span>
        <div className="flex-[1.2] text-center bg-sdr-blue-light rounded-md py-2">
          <div className="text-xl font-medium text-sdr-blue-dark">{lead.score}</div>
          <div className="text-xs text-sdr-blue-dark">
            Final · {lead.status === "hot" ? "Hot" : lead.status === "warm" ? "Warm" : "Cold"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
