import { useState } from "react";
import { useLeads } from "@/context/LeadContext";
import { LeadState } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ChevronRight, Calendar, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const b2cFlow: LeadState[] = ["new", "interested", "counseling", "enrolled"];
const b2bFlow: LeadState[] = ["new", "contacted", "qualified", "meeting", "deal"];

const stateLabels: Record<LeadState, string> = {
  new: "New", interested: "Interested", counseling: "Counseling", enrolled: "Enrolled",
  contacted: "Contacted", qualified: "Qualified", meeting: "Meeting", deal: "Deal",
};

const stateColors: Record<LeadState, string> = {
  new: "bg-muted-foreground", interested: "bg-[hsl(var(--ai-orange))]", counseling: "bg-[hsl(var(--ai-red))]",
  enrolled: "bg-[hsl(var(--ai-green))]", contacted: "bg-[hsl(var(--ai-blue))]", qualified: "bg-[hsl(var(--ai-orange))]",
  meeting: "bg-[hsl(var(--ai-red))]", deal: "bg-[hsl(var(--ai-green))]",
};

const badgeStyles: Record<string, string> = {
  new: "bg-[hsl(var(--badge-new-bg))] text-[hsl(var(--badge-new-fg))]",
  interested: "bg-[hsl(var(--badge-warm-bg))] text-[hsl(var(--badge-warm-fg))]",
  counseling: "bg-[hsl(var(--badge-hot-bg))] text-[hsl(var(--badge-hot-fg))]",
  enrolled: "bg-[hsl(var(--badge-done-bg))] text-[hsl(var(--badge-done-fg))]",
  contacted: "bg-[hsl(var(--badge-b2b-bg))] text-[hsl(var(--badge-b2b-fg))]",
  qualified: "bg-[hsl(var(--badge-warm-bg))] text-[hsl(var(--badge-warm-fg))]",
  meeting: "bg-[hsl(var(--badge-hot-bg))] text-[hsl(var(--badge-hot-fg))]",
  deal: "bg-[hsl(var(--badge-done-bg))] text-[hsl(var(--badge-done-fg))]",
};

export function StatesPage() {
  const { leads, updateLeadState } = useLeads();
  const [expandedLead, setExpandedLead] = useState<string | null>(null);

  const b2cLeads = leads.filter(l => l.type === "B2C");
  const b2bLeads = leads.filter(l => l.type === "B2B");

  const getNextState = (currentState: LeadState, type: "B2B" | "B2C"): LeadState | null => {
    const flow = type === "B2C" ? b2cFlow : b2bFlow;
    const idx = flow.indexOf(currentState);
    if (idx === -1 || idx >= flow.length - 1) return null;
    return flow[idx + 1];
  };

  const handleAdvance = (leadId: string, currentState: LeadState, type: "B2B" | "B2C") => {
    const nextState = getNextState(currentState, type);
    if (nextState) {
      updateLeadState(leadId, nextState);
    }
  };

  const getStateCounts = (leadsArr: typeof leads, flow: LeadState[]) =>
    flow.map(state => ({
      state,
      count: leadsArr.filter(l => l.state === state).length,
      leads: leadsArr.filter(l => l.state === state),
    }));

  const b2cStates = getStateCounts(b2cLeads, b2cFlow);
  const b2bStates = getStateCounts(b2bLeads, b2bFlow);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-3">
      <div>
        <div className="sdr-section-title">B2C Lead Journey — Student</div>
        <div className="sdr-card mb-3">
          {b2cStates.map(s => (
            <div key={s.state}>
              <div className="sdr-state-row">
                <span className={`sdr-state-dot ${stateColors[s.state]}`} />
                <span className="flex-1 text-sm font-medium">{stateLabels[s.state]}</span>
                <Badge variant="secondary" className={`sdr-badge ${badgeStyles[s.state]}`}>{s.count}</Badge>
                <button onClick={() => setExpandedLead(expandedLead === `b2c-${s.state}` ? null : `b2c-${s.state}`)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-1">
                  {s.count > 0 ? "▾" : ""}
                </button>
              </div>
              {expandedLead === `b2c-${s.state}` && s.leads.length > 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="ml-6 mb-2">
                  {s.leads.map(lead => {
                    const nextState = getNextState(lead.state, "B2C");
                    return (
                      <div key={lead.id} className="flex items-center gap-2 py-1 text-sm">
                        <span className="flex-1">{lead.name} · Score {lead.score}</span>
                        {nextState && (
                          <button
                            onClick={() => handleAdvance(lead.id, lead.state, "B2C")}
                            className="flex items-center gap-1 text-xs px-2.5 py-1 bg-[hsl(var(--ai-blue))] text-white rounded-lg hover:opacity-90 transition-colors"
                          >
                            → {stateLabels[nextState]} <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                        {!nextState && <CheckCircle2 className="w-4 h-4 text-[hsl(var(--ai-green))]" />}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* B2C flow visualization */}
        <div className="sdr-card">
          <div className="sdr-section-title">B2C flow</div>
          <div className="flex items-center gap-1 flex-wrap">
            {b2cFlow.map((state, i) => (
              <span key={state} className="flex items-center gap-1">
                <span className={`sdr-flow-node ${badgeStyles[state]}`}>{stateLabels[state]} ({b2cStates[i]?.count || 0})</span>
                {i < b2cFlow.length - 1 && <span className="text-muted-foreground text-xs">→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="sdr-section-title">B2B Lead Journey — Deal Pipeline</div>
        <div className="sdr-card mb-3">
          {b2bStates.map(s => (
            <div key={s.state}>
              <div className="sdr-state-row">
                <span className={`sdr-state-dot ${stateColors[s.state]}`} />
                <span className="flex-1 text-sm font-medium">{stateLabels[s.state]}</span>
                <Badge variant="secondary" className={`sdr-badge ${badgeStyles[s.state]}`}>{s.count}</Badge>
                <button onClick={() => setExpandedLead(expandedLead === `b2b-${s.state}` ? null : `b2b-${s.state}`)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-1">
                  {s.count > 0 ? "▾" : ""}
                </button>
              </div>
              {expandedLead === `b2b-${s.state}` && s.leads.length > 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="ml-6 mb-2">
                  {s.leads.map(lead => {
                    const nextState = getNextState(lead.state, "B2B");
                    return (
                      <div key={lead.id} className="flex items-center gap-2 py-1 text-sm">
                        <span className="flex-1">{lead.name} · Score {lead.score}</span>
                        {nextState && (
                          <button
                            onClick={() => handleAdvance(lead.id, lead.state, "B2B")}
                            className="flex items-center gap-1 text-xs px-2.5 py-1 bg-[hsl(var(--ai-blue))] text-white rounded-lg hover:opacity-90 transition-colors"
                          >
                            → {stateLabels[nextState]} <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                        {!nextState && <CheckCircle2 className="w-4 h-4 text-[hsl(var(--ai-green))]" />}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <div className="sdr-card">
          <div className="sdr-section-title">B2B flow</div>
          <div className="flex items-center gap-1 flex-wrap">
            {b2bFlow.map((state, i) => (
              <span key={state} className="flex items-center gap-1">
                <span className={`sdr-flow-node ${badgeStyles[state]}`}>{stateLabels[state]} ({b2bStates[i]?.count || 0})</span>
                {i < b2bFlow.length - 1 && <span className="text-muted-foreground text-xs">→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
