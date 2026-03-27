import { Lead } from "@/data/mockData";
import { motion } from "framer-motion";

interface ScoreCardProps {
  lead: Lead;
}

const ScoreRing = ({ value, label, color }: { value: number; label: string; color: string }) => {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = circ * (value / 100);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-14 h-14">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r={r} fill="none" stroke="hsl(var(--secondary))" strokeWidth="5" />
          <motion.circle
            cx="28" cy="28" r={r} fill="none"
            stroke={color} strokeWidth="5"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${dash} ${circ - dash}` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold">{value}</span>
        </div>
      </div>
      <span className="text-[10px] text-muted-foreground text-center leading-tight">{label}</span>
    </div>
  );
};

export function ScoreCard({ lead }: ScoreCardProps) {
  const getColor = (s: number) =>
    s >= 70 ? "hsl(var(--ai-green))" : s >= 50 ? "hsl(var(--ai-orange))" : "hsl(var(--ai-red))";

  return (
    <div className="sdr-card">
      <div className="sdr-section-title">AI Score Breakdown</div>
      {/* Overall score */}
      <div className="flex items-center gap-4 mb-4 p-3 rounded-xl" style={{ background: "hsl(var(--secondary))" }}>
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
            <motion.circle
              cx="32" cy="32" r="26" fill="none"
              stroke={getColor(lead.score)} strokeWidth="6"
              strokeDasharray={`${(lead.score / 100) * 163} ${163}`}
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 163` }}
              animate={{ strokeDasharray: `${(lead.score / 100) * 163} 163` }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold" style={{ color: getColor(lead.score) }}>{lead.score}</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Overall AI Score</div>
          <div className="text-sm font-semibold">{lead.name}</div>
          <div className="text-xs text-muted-foreground">{lead.icp}</div>
          <div className="mt-1 text-xs font-medium" style={{ color: getColor(lead.score) }}>
            {lead.score >= 70 ? "🔥 High priority" : lead.score >= 50 ? "⚡ Moderate" : "❄️ Low priority"}
          </div>
        </div>
      </div>

      {/* Sub-scores */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <ScoreRing value={lead.fitScore} label="Fit" color={getColor(lead.fitScore)} />
        <ScoreRing value={lead.intentScore} label="Intent" color={getColor(lead.intentScore)} />
        <ScoreRing value={lead.timingScore} label="Timing" color={getColor(lead.timingScore)} />
      </div>

      {/* AI Recommended action */}
      <div className="rounded-xl p-3" style={{ background: lead.status === "hot" ? "hsl(var(--badge-hot-bg))" : "hsl(var(--secondary))" }}>
        <div className="text-[10px] font-semibold uppercase tracking-wider mb-1"
          style={{ color: lead.status === "hot" ? "hsl(var(--ai-red))" : "hsl(var(--muted-foreground))" }}>
          AI Suggests
        </div>
        <div className="text-sm font-medium">{lead.nextAction}</div>
      </div>
    </div>
  );
}
