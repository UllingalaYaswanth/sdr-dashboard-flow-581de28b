import { useState } from "react";
import { optimizations } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface OptState {
  label: string;
  change: string;
  up: boolean;
  applied: boolean;
  rejected: boolean;
}

export function OptimizePage() {
  const [opts, setOpts] = useState<OptState[]>(
    optimizations.map(o => ({ ...o, applied: false, rejected: false }))
  );
  const [running, setRunning] = useState(false);

  const handleApply = (idx: number) => {
    const updated = [...opts];
    updated[idx] = { ...updated[idx], applied: true, rejected: false };
    setOpts(updated);
    toast.success(`Applied: ${updated[idx].label}`);
  };

  const handleReject = (idx: number) => {
    const updated = [...opts];
    updated[idx] = { ...updated[idx], rejected: true, applied: false };
    setOpts(updated);
    toast(`Rejected: ${updated[idx].label}`);
  };

  const handleReset = (idx: number) => {
    const updated = [...opts];
    updated[idx] = { ...updated[idx], applied: false, rejected: false };
    setOpts(updated);
  };

  const handleRunCycle = () => {
    setRunning(true);
    toast("Running optimization cycle...");
    // Simulate progressive application
    opts.forEach((_, i) => {
      if (!opts[i].applied && !opts[i].rejected) {
        setTimeout(() => {
          setOpts(prev => {
            const u = [...prev];
            u[i] = { ...u[i], applied: true };
            return u;
          });
          if (i === opts.length - 1) {
            setRunning(false);
            toast.success("Optimization cycle complete — all changes applied");
          }
        }, 500 + i * 400);
      }
    });
    setTimeout(() => setRunning(false), 500 + opts.length * 400 + 200);
  };

  const appliedCount = opts.filter(o => o.applied).length;
  const rejectedCount = opts.filter(o => o.rejected).length;
  const pendingCount = opts.filter(o => !o.applied && !o.rejected).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-3">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="sdr-section-title mb-0">This week's auto-optimizations</div>
          <button
            onClick={handleRunCycle}
            disabled={running || pendingCount === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" /> {running ? "Running..." : "Run cycle"}
          </button>
        </div>
        <div className="sdr-card">
          {opts.map((o, i) => (
            <motion.div
              key={o.label}
              layout
              className={`flex items-center gap-2 py-2 border-b border-border last:border-b-0 text-sm transition-colors ${
                o.applied ? "bg-sdr-green-light/30" : o.rejected ? "bg-secondary/50 opacity-50" : ""
              }`}
            >
              <div className="flex-1">
                <span className={o.rejected ? "line-through text-muted-foreground" : ""}>{o.label}</span>
                <div className={`text-xs mt-0.5 ${o.up ? "text-sdr-green" : "text-sdr-coral"}`}>{o.change}</div>
              </div>
              <div className="flex gap-1">
                {!o.applied && !o.rejected && (
                  <>
                    <button onClick={() => handleApply(i)} className="p-1 rounded hover:bg-sdr-green-light transition-colors" title="Apply">
                      <CheckCircle2 className="w-4 h-4 text-sdr-green" />
                    </button>
                    <button onClick={() => handleReject(i)} className="p-1 rounded hover:bg-sdr-coral-light transition-colors" title="Reject">
                      <XCircle className="w-4 h-4 text-sdr-coral" />
                    </button>
                  </>
                )}
                {(o.applied || o.rejected) && (
                  <button onClick={() => handleReset(i)} className="p-1 rounded hover:bg-secondary transition-colors" title="Reset">
                    <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                )}
                {o.applied && <span className="text-xs text-sdr-green font-medium">Applied</span>}
                {o.rejected && <span className="text-xs text-sdr-coral font-medium">Rejected</span>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-sdr-green-light rounded-md p-2.5 text-center">
            <div className="text-lg font-medium text-sdr-green-dark">{appliedCount}</div>
            <div className="text-xs text-sdr-green-dark">Applied</div>
          </div>
          <div className="bg-sdr-coral-light rounded-md p-2.5 text-center">
            <div className="text-lg font-medium text-sdr-coral">{rejectedCount}</div>
            <div className="text-xs text-sdr-coral">Rejected</div>
          </div>
          <div className="bg-secondary rounded-md p-2.5 text-center">
            <div className="text-lg font-medium">{pendingCount}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
        </div>
      </div>

      <div>
        <div className="sdr-section-title">Self-optimization loop</div>
        <div className="sdr-card mb-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Analytics feed back weekly into every upstream stage. The system recalibrates ICP weights, scoring formulas, channel allocation, and message variants — automatically.
          </p>
          <div className="flex flex-wrap gap-1 items-center mt-3">
            {["Analytics", "Scoring", "ICP targeting", "Channels", "Messaging", "Loop"].map((n, i, arr) => (
              <span key={n} className="flex items-center gap-1">
                <span className={`sdr-flow-node ${appliedCount > i ? "bg-[hsl(var(--badge-done-bg))] text-[hsl(var(--badge-done-fg))] border-[hsl(100,40%,80%)]" : "bg-sdr-blue-light text-sdr-blue border-sdr-blue/30"}`}>{n}</span>
                {i < arr.length - 1 && <span className="text-[10px] text-muted-foreground">→</span>}
              </span>
            ))}
          </div>
          <div className="mt-3 text-sm font-medium">
            Growth flywheel: every cycle = smarter targeting, better conversion, lower CPL.
          </div>
        </div>

        <div className="sdr-section-title">How it works</div>
        <div className="sdr-card">
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex gap-2"><span className="font-medium text-foreground">1.</span> Analytics identifies underperforming segments</div>
            <div className="flex gap-2"><span className="font-medium text-foreground">2.</span> AI proposes weight/channel/copy changes</div>
            <div className="flex gap-2"><span className="font-medium text-foreground">3.</span> You review & apply (or auto-apply)</div>
            <div className="flex gap-2"><span className="font-medium text-foreground">4.</span> Changes propagate to all pipeline stages</div>
            <div className="flex gap-2"><span className="font-medium text-foreground">5.</span> Next cycle measures impact & re-optimizes</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
