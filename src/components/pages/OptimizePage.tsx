import { optimizations } from "@/data/mockData";
import { motion } from "framer-motion";

export function OptimizePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-3">
      <div>
        <div className="sdr-section-title">This week's auto-optimizations</div>
        <div className="sdr-card">
          {optimizations.map((o) => (
            <div key={o.label} className="flex items-center justify-between py-1.5 border-b border-border last:border-b-0 text-sm">
              <span className="text-muted-foreground">{o.label}</span>
              <span className={`text-xs ${o.up ? "text-sdr-green" : "text-sdr-coral"}`}>{o.change}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="sdr-section-title">Self-optimization loop</div>
        <div className="sdr-card mb-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Analytics feed back weekly into every upstream stage. The system recalibrates ICP weights, scoring formulas, channel allocation, and message variants — automatically.
          </p>
          <div className="flex flex-wrap gap-1 items-center mt-3">
            {["Analytics", "Scoring weights", "ICP targeting", "Channels", "Messaging", "Loop"].map((n, i, arr) => (
              <span key={n} className="flex items-center gap-1">
                <span className="sdr-flow-node bg-sdr-blue-light text-sdr-blue border-sdr-blue/30">{n}</span>
                {i < arr.length - 1 && <span className="text-[10px] text-muted-foreground">→</span>}
              </span>
            ))}
          </div>
          <div className="mt-3 text-sm font-medium">Growth flywheel: every cycle = smarter targeting, better conversion, lower CPL.</div>
        </div>
      </div>
    </motion.div>
  );
}
