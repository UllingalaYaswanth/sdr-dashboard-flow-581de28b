import { useState, useMemo } from "react";
import { useLeads } from "@/context/LeadContext";
import { Lead, LeadStatus, LeadType, LeadSource } from "@/data/mockData";
import { MetricRow } from "@/components/dashboard/MetricRow";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Filter, ArrowUpDown, Zap, Phone, Mail, MessageSquare } from "lucide-react";

const statusFilters: LeadStatus[] = ["hot", "warm", "cold", "new", "done"];
const typeFilters: LeadType[] = ["B2B", "B2C"];
const sourceFilters: LeadSource[] = ["apollo", "ads", "upload"];

const StatusBadge = ({ status, onClick, interactive }: { status: LeadStatus; onClick?: (e?: any) => void; interactive?: boolean }) => {
  const config: Record<string, { bg: string; fg: string; dot: string }> = {
    hot: { bg: "hsl(var(--badge-hot-bg))", fg: "hsl(var(--badge-hot-fg))", dot: "hsl(var(--ai-red))" },
    warm: { bg: "hsl(var(--badge-warm-bg))", fg: "hsl(var(--badge-warm-fg))", dot: "hsl(var(--ai-orange))" },
    cold: { bg: "hsl(var(--badge-cold-bg))", fg: "hsl(var(--badge-cold-fg))", dot: "hsl(var(--ai-blue))" },
    new: { bg: "hsl(var(--badge-new-bg))", fg: "hsl(var(--badge-new-fg))", dot: "hsl(var(--muted-foreground))" },
    done: { bg: "hsl(var(--badge-done-bg))", fg: "hsl(var(--badge-done-fg))", dot: "hsl(var(--ai-green))" },
  };
  const c = config[status] || config.new;
  return (
    <span
      onClick={onClick}
      className={`sdr-badge ${interactive ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
      style={{ background: c.bg, color: c.fg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const aiActions: Record<LeadStatus, string> = {
  hot: "Call now",
  warm: "Send follow-up",
  cold: "Add to drip",
  new: "First touch",
  done: "Archive",
};

const actionIcons: Record<LeadStatus, typeof Phone> = {
  hot: Phone,
  warm: Mail,
  cold: MessageSquare,
  new: Zap,
  done: X,
};

export function QueuePage() {
  const { leads, updateLeadStatus } = useLeads();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus[]>([]);
  const [typeFilter, setTypeFilter] = useState<LeadType[]>([]);
  const [sourceFilter, setSourceFilter] = useState<LeadSource[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"score" | "name">("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [changingStatus, setChangingStatus] = useState<string | null>(null);

  const filteredLeads = useMemo(() => {
    let result = [...leads];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.icp.toLowerCase().includes(q));
    }
    if (statusFilter.length) result = result.filter(l => statusFilter.includes(l.status));
    if (typeFilter.length) result = result.filter(l => typeFilter.includes(l.type));
    if (sourceFilter.length) result = result.filter(l => sourceFilter.includes(l.source));
    result.sort((a, b) => {
      const mul = sortDir === "desc" ? -1 : 1;
      if (sortBy === "score") return (a.score - b.score) * mul;
      return a.name.localeCompare(b.name) * mul;
    });
    return result;
  }, [leads, search, statusFilter, typeFilter, sourceFilter, sortBy, sortDir]);

  const hotCount = leads.filter(l => l.status === "hot").length;
  const warmCount = leads.filter(l => l.status === "warm").length;
  const coldCount = leads.filter(l => l.status === "cold").length;
  const totalIntentScore = leads.reduce((s, l) => s + l.intentScore, 0);
  const avgScore = leads.length > 0 ? Math.round(totalIntentScore / leads.length) : 0;

  const queueMetrics = [
    { label: "Hot Queue", value: hotCount.toString(), delta: "immediate action", deltaType: "up" as const },
    { label: "Warm Pipeline", value: warmCount.toString(), delta: "nurture now", deltaType: "neutral" as const },
    { label: "Cold Pool", value: coldCount.toString(), delta: "drip sequence", deltaType: "neutral" as const },
    { label: "Avg Intent Score", value: `${avgScore}`, delta: `${filteredLeads.length} shown`, deltaType: "up" as const },
  ];

  const toggleFilter = <T,>(arr: T[], val: T, setter: (v: T[]) => void) => {
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    updateLeadStatus(leadId, newStatus);
    setChangingStatus(null);
    if (selectedLead?.id === leadId) setSelectedLead({ ...selectedLead, status: newStatus });
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "hsl(var(--ai-green))";
    if (score >= 50) return "hsl(var(--ai-orange))";
    return "hsl(var(--ai-red))";
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <MetricRow metrics={queueMetrics} />

      {/* Search & filter bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads by name, email, ICP..."
            className="w-full bg-secondary border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm border transition-all ${showFilters ? "bg-[hsl(var(--ai-blue))] text-white border-[hsl(var(--ai-blue))]" : "bg-secondary border-border text-muted-foreground hover:bg-accent"}`}
        >
          <Filter className="w-3.5 h-3.5" /> Filters
          {(statusFilter.length + typeFilter.length + sourceFilter.length > 0) && (
            <span className="bg-white text-[hsl(var(--ai-blue))] rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">{statusFilter.length + typeFilter.length + sourceFilter.length}</span>
          )}
        </button>
        <button
          onClick={() => { setSortDir(sortDir === "desc" ? "asc" : "desc"); }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm bg-secondary border border-border text-muted-foreground hover:bg-accent transition-colors"
        >
          <ArrowUpDown className="w-3.5 h-3.5" /> {sortBy === "score" ? "Score" : "Name"} {sortDir === "desc" ? "↓" : "↑"}
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-3">
            <div className="sdr-card flex flex-wrap gap-4">
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">Status</div>
                <div className="flex gap-1.5 flex-wrap">
                  {statusFilters.map(s => (
                    <button key={s} onClick={() => toggleFilter(statusFilter, s, setStatusFilter)}
                      className={`transition-all ${statusFilter.includes(s) ? "ring-2 ring-[hsl(var(--ai-blue))] ring-offset-1" : "opacity-60 hover:opacity-100"}`}>
                      <StatusBadge status={s} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">Type</div>
                <div className="flex gap-1.5">
                  {typeFilters.map(t => (
                    <button key={t} onClick={() => toggleFilter(typeFilter, t, setTypeFilter)}
                      className={`sdr-badge cursor-pointer transition-all ${typeFilter.includes(t) ? "bg-[hsl(var(--ai-blue))] text-white" : "bg-secondary text-muted-foreground hover:bg-accent"}`}
                    >{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">Source</div>
                <div className="flex gap-1.5">
                  {sourceFilters.map(s => (
                    <button key={s} onClick={() => toggleFilter(sourceFilter, s, setSourceFilter)}
                      className={`sdr-badge cursor-pointer transition-all ${sourceFilter.includes(s) ? "bg-[hsl(var(--ai-blue))] text-white" : "bg-secondary text-muted-foreground hover:bg-accent"}`}
                    >{s.charAt(0).toUpperCase() + s.slice(1)}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-end gap-2">
                <button onClick={() => setSortBy(sortBy === "score" ? "name" : "score")}
                  className="sdr-badge bg-secondary text-muted-foreground hover:bg-accent cursor-pointer">
                  Sort: {sortBy}</button>
                {(statusFilter.length + typeFilter.length + sourceFilter.length > 0) && (
                  <button onClick={() => { setStatusFilter([]); setTypeFilter([]); setSourceFilter([]); }}
                    className="text-xs text-[hsl(var(--ai-red))] hover:underline cursor-pointer">Clear all</button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead table */}
      <div className="sdr-card">
        <div className="sdr-section-title">
          <Zap className="w-3.5 h-3.5" />
          {filteredLeads.length} leads {search || statusFilter.length || typeFilter.length || sourceFilter.length ? "(filtered)" : "in queue"}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-semibold text-muted-foreground text-[11px] py-2 px-3 uppercase tracking-wide">Name</th>
                <th className="text-left font-semibold text-muted-foreground text-[11px] py-2 px-3 uppercase tracking-wide">Type</th>
                <th className="text-left font-semibold text-muted-foreground text-[11px] py-2 px-3 uppercase tracking-wide">Source</th>
                <th className="text-left font-semibold text-muted-foreground text-[11px] py-2 px-3 uppercase tracking-wide">Score</th>
                <th className="text-left font-semibold text-muted-foreground text-[11px] py-2 px-3 uppercase tracking-wide">Status</th>
                <th className="text-left font-semibold text-muted-foreground text-[11px] py-2 px-3 uppercase tracking-wide">AI Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead, idx) => {
                const ActionIcon = actionIcons[lead.status] || Zap;
                return (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`border-b border-border last:border-b-0 hover:bg-secondary/60 cursor-pointer transition-colors ${selectedLead?.id === lead.id ? "bg-secondary" : ""}`}
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-[13px]">{lead.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-[140px]">{lead.email}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="sdr-badge" style={{
                        background: lead.type === "B2B" ? "hsl(var(--badge-b2b-bg))" : "hsl(var(--badge-b2c-bg))",
                        color: lead.type === "B2B" ? "hsl(var(--badge-b2b-fg))" : "hsl(var(--badge-b2c-fg))"
                      }}>{lead.type}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="sdr-badge bg-secondary text-muted-foreground">{lead.source}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold" style={{ color: getScoreColor(lead.score) }}>{lead.score}</span>
                        <div className="h-1.5 w-12 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${lead.score}%`, background: getScoreColor(lead.score) }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 relative">
                      <StatusBadge
                        status={lead.status}
                        interactive
                        onClick={(e) => { e?.stopPropagation?.(); setChangingStatus(changingStatus === lead.id ? null : lead.id); }}
                      />
                      {changingStatus === lead.id && (
                        <div className="absolute z-50 top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-lg p-2 flex flex-col gap-1 min-w-[120px]"
                          onClick={e => e.stopPropagation()}>
                          {statusFilters.filter(s => s !== lead.status && s !== "done").map(s => (
                            <button key={s} onClick={() => handleStatusChange(lead.id, s)}
                              className="text-left px-2 py-1.5 text-xs rounded-lg hover:bg-secondary transition-colors flex items-center gap-2">
                              <StatusBadge status={s} />
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${lead.status === "hot" ? "text-[hsl(var(--ai-red))]" : "text-muted-foreground"}`}>
                        <ActionIcon className="w-3 h-3" />
                        {aiActions[lead.status]}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
            <div className="text-center py-10 text-sm text-muted-foreground">No leads match your filters</div>
          )}
        </div>
      </div>

      {/* Lead detail panel */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="sdr-section-title mb-0">Lead Intelligence — {selectedLead.name}</div>
              <button onClick={() => setSelectedLead(null)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <ScoreCard lead={selectedLead} />
              <div className="sdr-card">
                <div className="sdr-section-title">Contact Details</div>
                <div className="space-y-2 text-sm mb-3">
                  {[
                    ["Email", selectedLead.email],
                    ["Phone", selectedLead.phone],
                    ["ICP", selectedLead.icp],
                    ["Campaign", selectedLead.campaign],
                    ["Location", selectedLead.location],
                    ["State", selectedLead.state],
                    ["Last activity", selectedLead.lastActivity],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="sdr-section-title mb-2">Intent Timeline ({selectedLead.intentEvents.length} events)</div>
                  {selectedLead.intentEvents.slice(-4).map((evt, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs py-1">
                      <span className="text-muted-foreground w-[65px] flex-shrink-0">{evt.time.split(" ").slice(1).join(" ")}</span>
                      <span className="flex-1">{evt.action}</span>
                      <span className={`font-semibold ${evt.points > 0 ? "text-[hsl(var(--ai-green))]" : "text-[hsl(var(--ai-red))]"}`}>
                        {evt.points > 0 ? "+" : ""}{evt.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
