import { useState } from "react";
import { optimizations } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, Sparkles, Brain, Zap, TrendingUp, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";

interface OptState {
  label: string;
  change: string;
  up: boolean;
  applied: boolean;
  rejected: boolean;
  impact: string;
  category: string;
}

const learningMetrics = [
  { metric: "ICP Targeting", score: 78, max: 100 },
  { metric: "Channel Mix", score: 85, max: 100 },
  { metric: "Message Quality", score: 72, max: 100 },
  { metric: "Timing", score: 68, max: 100 },
  { metric: "Lead Scoring", score: 91, max: 100 },
  { metric: "Engagement", score: 63, max: 100 },
];

const radarData = learningMetrics.map(m => ({ subject: m.metric, score: m.score }));

const enrichedOptimizations = optimizations.map((o, i) => ({
  ...o,
  applied: false,
  rejected: false,
  impact: ["High", "Medium", "High", "Medium", "Low", "High", "Medium"][i % 7] as string,
  category: ["ICP", "Channel", "Scoring", "Copy", "Source", "Schedule", "Tone"][i % 7] as string,
}));

export function OptimizePage() {
  const [opts, setOpts] = useState<OptState[]>(enrichedOptimizations);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"suggestions" | "metrics">("suggestions");

  const handleApply = (idx: number) => {
    const updated = [...opts];
    updated[idx] = { ...updated[idx], applied: true, rejected: false };
    setOpts(updated);
    toast.success(`✓ Applied: ${updated[idx].label}`);
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
    toast("🔄 Running AI optimization cycle...");
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
            toast.success("🎯 Optimization complete — all changes applied");
          }
        }, 500 + i * 400);
      }
    });
    setTimeout(() => setRunning(false), 500 + opts.length * 400 + 200);
  };

  const appliedCount = opts.filter(o => o.applied).length;
  const rejectedCount = opts.filter(o => o.rejected).length;
  const pendingCount = opts.filter(o => !o.applied && !o.rejected).length;

  const impactColor: Record<string, string> = {
    High: "hsl(var(--ai-red))",
    Medium: "hsl(var(--ai-orange))",
    Low: "hsl(var(--ai-green))",
  };

  const categoryColor: Record<string, string> = {
    ICP: "hsl(var(--badge-b2b-bg))",
    Channel: "hsl(var(--badge-done-bg))",
    Scoring: "hsl(var(--badge-ai-bg))",
    Copy: "hsl(var(--badge-warm-bg))",
    Source: "hsl(var(--badge-b2c-bg))",
    Schedule: "hsl(var(--badge-new-bg))",
    Tone: "hsl(var(--badge-hot-bg))",
  };
  const categoryFgColor: Record<string, string> = {
    ICP: "hsl(var(--badge-b2b-fg))",
    Channel: "hsl(var(--badge-done-fg))",
    Scoring: "hsl(var(--badge-ai-fg))",
    Copy: "hsl(var(--badge-warm-fg))",
    Source: "hsl(var(--badge-b2c-fg))",
    Schedule: "hsl(var(--badge-new-fg))",
    Tone: "hsl(var(--badge-hot-fg))",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header with run button */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex gap-1">
          {(["suggestions", "metrics"] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === t ? "bg-[hsl(var(--ai-blue))] text-white" : "bg-secondary text-muted-foreground hover:bg-accent"}`}
            >{t === "suggestions" ? "AI Suggestions" : "Learning Metrics"}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex gap-3 text-xs">
            <span className="text-[hsl(var(--ai-green))] font-semibold">{appliedCount} applied</span>
            <span className="text-[hsl(var(--ai-red))] font-semibold">{rejectedCount} rejected</span>
            <span className="text-muted-foreground">{pendingCount} pending</span>
          </div>
          <button
            onClick={handleRunCycle}
            disabled={running || pendingCount === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-[hsl(var(--ai-blue))] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-40"
          >
            {running ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {running ? "Running..." : "Run AI Cycle"}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "suggestions" && (
          <motion.div key="suggestions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 gap-4">
            {/* Optimization list */}
            <div className="sdr-card">
              <div className="sdr-section-title">
                <Brain className="w-3.5 h-3.5" />
                AI-Suggested Optimizations
              </div>
              <div className="space-y-0">
                {opts.map((o, i) => (
                  <motion.div
                    key={o.label}
                    layout
                    className={`flex items-start gap-3 py-3 border-b border-border last:border-b-0 transition-all ${o.rejected ? "opacity-40" : ""}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-sm font-medium ${o.rejected ? "line-through text-muted-foreground" : ""}`}>{o.label}</span>
                        <span className="sdr-badge text-[10px]" style={{ background: categoryColor[o.category] || "#eee", color: categoryFgColor[o.category] || "#333" }}>
                          {o.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${o.up ? "text-[hsl(var(--ai-green))]" : "text-[hsl(var(--ai-red))]"}`}>{o.change}</span>
                        <span className="text-[10px] font-semibold" style={{ color: impactColor[o.impact] }}>{o.impact} impact</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                      {!o.applied && !o.rejected && (
                        <>
                          <button onClick={() => handleApply(i)}
                            className="p-1.5 rounded-lg hover:bg-[hsl(var(--badge-done-bg))] transition-colors" title="Apply">
                            <CheckCircle2 className="w-4 h-4 text-[hsl(var(--ai-green))]" />
                          </button>
                          <button onClick={() => handleReject(i)}
                            className="p-1.5 rounded-lg hover:bg-[hsl(var(--badge-hot-bg))] transition-colors" title="Reject">
                            <XCircle className="w-4 h-4 text-[hsl(var(--ai-red))]" />
                          </button>
                        </>
                      )}
                      {(o.applied || o.rejected) && (
                        <button onClick={() => handleReset(i)}
                          className="p-1.5 rounded-lg hover:bg-secondary transition-colors" title="Reset">
                          <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      )}
                      {o.applied && <span className="text-xs font-semibold text-[hsl(var(--ai-green))]">Applied</span>}
                      {o.rejected && <span className="text-xs font-semibold text-[hsl(var(--ai-red))]">Rejected</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* How it works + loop */}
            <div className="space-y-4">
              <div className="sdr-card">
                <div className="sdr-section-title">
                  <Zap className="w-3.5 h-3.5" />
                  Self-Learning Loop
                </div>
                <div className="flex flex-wrap gap-2 items-center mb-4">
                  {["Analytics", "Insights", "Suggestions", "Apply", "Measure", "Loop"].map((n, i, arr) => (
                    <span key={n} className="flex items-center gap-1.5">
                      <span className={`sdr-flow-node text-[11px] ${appliedCount > i ? "bg-[hsl(var(--badge-done-bg))] text-[hsl(var(--badge-done-fg))] border-[hsl(var(--ai-green)/0.3)]" : "bg-[hsl(var(--badge-ai-bg))] text-[hsl(var(--badge-ai-fg))] border-[hsl(var(--ai-blue)/0.3)]"}`}>{n}</span>
                      {i < arr.length - 1 && <span className="text-[10px] text-muted-foreground">→</span>}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Analytics feed back weekly into every upstream stage. The AI recalibrates ICP weights, scoring formulas, channel allocation, and message variants — fully automatically.
                </p>
              </div>

              <div className="sdr-card">
                <div className="sdr-section-title">
                  <TrendingUp className="w-3.5 h-3.5" />
                  How It Works
                </div>
                <div className="space-y-3">
                  {[
                    { step: "1", text: "Analytics identifies underperforming segments", color: "hsl(var(--ai-blue))" },
                    { step: "2", text: "AI proposes weight, channel & copy changes", color: "hsl(var(--ai-purple))" },
                    { step: "3", text: "You review & apply (or auto-apply in full-auto mode)", color: "hsl(var(--ai-green))" },
                    { step: "4", text: "Changes propagate to all pipeline stages instantly", color: "hsl(var(--ai-orange))" },
                    { step: "5", text: "Next cycle measures impact & re-optimizes", color: "hsl(var(--ai-teal))" },
                  ].map(s => (
                    <div key={s.step} className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5" style={{ background: s.color }}>{s.step}</span>
                      <span className="text-sm text-muted-foreground">{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary counts */}
              <div className="grid grid-cols-3 gap-3">
                <div className="sdr-card text-center">
                  <div className="text-2xl font-bold text-[hsl(var(--ai-green))]">{appliedCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">Applied</div>
                </div>
                <div className="sdr-card text-center">
                  <div className="text-2xl font-bold text-[hsl(var(--ai-red))]">{rejectedCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">Rejected</div>
                </div>
                <div className="sdr-card text-center">
                  <div className="text-2xl font-bold">{pendingCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">Pending</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "metrics" && (
          <motion.div key="metrics" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 gap-4">
            {/* Radar chart */}
            <div className="sdr-card">
              <div className="sdr-section-title">
                <Brain className="w-3.5 h-3.5" />
                AI Learning Radar
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Radar name="Score" dataKey="score" stroke="hsl(var(--ai-blue))" fill="hsl(var(--ai-blue))" fillOpacity={0.15} strokeWidth={2} />
                  <Tooltip content={({ active, payload }) => active && payload?.length ? (
                    <div className="bg-card border border-border rounded-lg px-3 py-2 text-sm shadow-lg">
                      <span className="font-semibold">{payload[0].value}</span><span className="text-muted-foreground">/100</span>
                    </div>
                  ) : null} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Metric bars */}
            <div className="sdr-card">
              <div className="sdr-section-title">
                <TrendingUp className="w-3.5 h-3.5" />
                Performance Metrics
              </div>
              <div className="space-y-4">
                {learningMetrics.map((m, i) => {
                  const color = m.score >= 80 ? "hsl(var(--ai-green))" : m.score >= 65 ? "hsl(var(--ai-blue))" : "hsl(var(--ai-orange))";
                  return (
                    <div key={m.metric}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium">{m.metric}</span>
                        <span className="text-sm font-bold" style={{ color }}>{m.score}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${m.score}%` }}
                          transition={{ duration: 0.7, delay: i * 0.1 }}
                          className="h-full rounded-full"
                          style={{ background: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
