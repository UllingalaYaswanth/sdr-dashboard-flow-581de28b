import { flowSteps } from "@/data/mockData";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function FlowPipeline() {
  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {flowSteps.map((step, i) => (
        <motion.span
          key={step.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.04 }}
          className="flex items-center gap-1"
        >
          <span
            className={`sdr-flow-node flex items-center gap-1 text-[11px] ${
              step.done
                ? "bg-[hsl(var(--badge-done-bg))] text-[hsl(var(--badge-done-fg))] border-[hsl(var(--ai-green)/0.25)]"
                : step.active
                ? "bg-[hsl(var(--badge-ai-bg))] text-[hsl(var(--badge-ai-fg))] border-[hsl(var(--ai-blue)/0.4)]"
                : "bg-secondary text-muted-foreground border-border"
            }`}
          >
            {step.done && <Check className="w-2.5 h-2.5" />}
            {step.active && <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--ai-blue))] animate-pulse" />}
            {step.label}
          </span>
          {i < flowSteps.length - 1 && (
            <span className="text-[10px] text-muted-foreground/50">›</span>
          )}
        </motion.span>
      ))}
    </div>
  );
}
