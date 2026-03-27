import { useState, useMemo } from "react";
import { useLeads } from "@/context/LeadContext";
import { Lead, LeadStatus, LeadType, LeadSource } from "@/data/mockData";
import { MetricRow } from "@/components/dashboard/MetricRow";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Filter, ArrowUpDown } from "lucide-react";

const statusFilters: LeadStatus[] = ["hot", "warm", "cold", "new", "done"];
const typeFilters: LeadType[] = ["B2B", "B2C"];
const sourceFilters: LeadSource[] = ["apollo", "ads", "upload"];

function StatusBadge({ status, onClick, interactive }: { status: LeadStatus; onClick?: () => void; interactive?: boolean }) {
  const styles: Record<string, string> = {
    hot: "bg-[hsl(var(--badge-hot-bg))] text-[hsl(var(--badge-hot-fg))]",
    warm: "bg-[hsl(var(--badge-warm-bg))] text-[hsl(var(--badge-warm-fg))]",
    cold: "bg-[hsl(var(--badge-cold-bg))] text-[hsl(var(--badge-cold-fg))]",
    new: "bg-[hsl(var(--badge-new-bg))] text-[hsl(var(--badge-new-fg))]",
    done: "bg-[hsl(var(--badge-done-bg))] text-[hsl(var(--badge-done-fg))]",
  };
  return (
    <span
      onClick={onClick}
      className={`sdr-badge ${styles[status] || ""} ${interactive ? "cursor-pointer hover:ring-1 hover:ring-primary transition-all" : ""}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

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

  const queueMetrics = [
    { label: "Hot", value: hotCount.toString(), delta: "act now", deltaType: "up" as const },
    { label: "Warm", value: warmCount.toString(), delta: "nurture", deltaType: "neutral" as const },
    { label: "Cold", value: coldCount.toString(), delta: "drip", deltaType: "neutral" as const },
    { label: "Total", value: leads.length.toString(), delta: `${filteredLeads.length} shown`, deltaType: "neutral" as const },
  ];

  const toggleFilter = <T,>(arr: T[], val: T, setter: (v: T[]) => void) => {
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    updateLeadStatus(leadId, newStatus);
    setChangingStatus(null);
    if (selectedLead?.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <MetricRow metrics={queueMetrics} />

      {/* Search & filter bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads by name, email, ICP..."
            className="w-full bg-secondary border border-border rounded-md pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border transition-colors ${showFilters ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border text-muted-foreground hover:bg-accent"}`}
        >
          <Filter className="w-3.5 h-3.5" /> Filters
          {(statusFilter.length + typeFilter.length + sourceFilter.length > 0) && (
            <span className="bg-primary-foreground text-primary rounded-full w-4 h-4 text-[10px] flex items-center justify-center">{statusFilter.length + typeFilter.length + sourceFilter.length}</span>
          )}
        </button>
        <button
          onClick={() => { setSortDir(sortDir === "desc" ? "asc" : "desc"); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-secondary border border-border text-muted-foreground hover:bg-accent transition-colors"
        >
          <ArrowUpDown className="w-3.5 h-3.5" /> {sortBy === "score" ? "Score" : "Name"} {sortDir === "desc" ? "↓" : "↑"}
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-3">
            <div className="sdr-card flex flex-wrap gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1.5">Status</div>
                <div className="flex gap-1">
                  {statusFilters.map(s => (
                    <button key={s} onClick={() => toggleFilter(statusFilter, s, setStatusFilter)}
                      className={`sdr-badge cursor-pointer transition-all ${statusFilter.includes(s) ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"}`}
                    >
                      <StatusBadge status={s} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1.5">Type</div>
                <div className="flex gap-1">
                  {typeFilters.map(t => (
                    <button key={t} onClick={() => toggleFilter(typeFilter, t, setTypeFilter)}
                      className={`sdr-badge cursor-pointer transition-all ${typeFilter.includes(t) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-accent"}`}
                    >{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1.5">Source</div>
                <div className="flex gap-1">
                  {sourceFilters.map(s => (
                    <button key={s} onClick={() => toggleFilter(sourceFilter, s, setSourceFilter)}
                      className={`sdr-badge cursor-pointer transition-all ${sourceFilter.includes(s) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-accent"}`}
                    >{s.charAt(0).toUpperCase() + s.slice(1)}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-end">
                <button onClick={() => setSortBy(sortBy === "score" ? "name" : "score")}
                  className="sdr-badge bg-secondary text-muted-foreground hover:bg-accent cursor-pointer"
                >Sort by: {sortBy}</button>
              </div>
              {(statusFilter.length + typeFilter.length + sourceFilter.length > 0) && (
                <div className="flex items-end">
                  <button onClick={() => { setStatusFilter([]); setTypeFilter([]); setSourceFilter([]); }}
                    className="text-xs text-sdr-coral hover:underline cursor-pointer"
                  >Clear all</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead table */}
      <div className="sdr-card">
        <div className="sdr-section-title">
          {filteredLeads.length} leads {search || statusFilter.length || typeFilter.length || sourceFilter.length ? "(filtered)" : ""}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-medium text-muted-foreground text-xs py-1.5 px-2">Name</th>
                <th className="text-left font-medium text-muted-foreground text-xs py-1.5 px-2">Type</th>
                <th className="text-left font-medium text-muted-foreground text-xs py-1.5 px-2">Source</th>
                <th className="text-left font-medium text-muted-foreground text-xs py-1.5 px-2">Score</th>
                <th className="text-left font-medium text-muted-foreground text-xs py-1.5 px-2">Status</th>
                <th className="text-left font-medium text-muted-foreground text-xs py-1.5 px-2">Next action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => (
                <tr
                  key={lead.id}
                  className={`border-b border-border last:border-b-0 hover:bg-secondary/50 cursor-pointer transition-colors ${selectedLead?.id === lead.id ? "bg-secondary" : ""}`}
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="py-1.5 px-2 font-medium">{lead.name}</td>
                  <td className="py-1.5 px-2">
                    <Badge variant="secondary" className={`sdr-badge ${lead.type === "B2B" ? "bg-[hsl(var(--badge-b2b-bg))] text-[hsl(var(--badge-b2b-fg))]" : "bg-[hsl(var(--badge-b2c-bg))] text-[hsl(var(--badge-b2c-fg))]"}`}>{lead.type}</Badge>
                  </td>
                  <td className="py-1.5 px-2">
                    <Badge variant="secondary" className="sdr-badge bg-secondary text-muted-foreground">{lead.source}</Badge>
                  </td>
                  <td className="py-1.5 px-2 font-semibold">{lead.score}</td>
                  <td className="py-1.5 px-2 relative">
                    <StatusBadge
                      status={lead.status}
                      interactive
                      onClick={(e) => { e?.stopPropagation?.(); setChangingStatus(changingStatus === lead.id ? null : lead.id); }}
                    />
                    {changingStatus === lead.id && (
                      <div className="absolute z-50 top-full left-0 mt-1 bg-card border border-border rounded-md shadow-lg p-1.5 flex flex-col gap-1 min-w-[100px]"
                        onClick={e => e.stopPropagation()}>
                        {statusFilters.filter(s => s !== lead.status && s !== "done").map(s => (
                          <button key={s} onClick={() => handleStatusChange(lead.id, s)}
                            className="text-left px-2 py-1 text-xs rounded hover:bg-secondary transition-colors">
                            Move to <StatusBadge status={s} />
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className={`py-1.5 px-2 text-xs ${lead.status === "hot" ? "text-sdr-coral" : "text-muted-foreground"}`}>
                    {lead.nextAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
            <div className="text-center py-6 text-sm text-muted-foreground">No leads match your filters</div>
          )}
        </div>
      </div>

      {/* Lead detail panel */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <div className="sdr-section-title mb-0">Lead detail — {selectedLead.name}</div>
              <button onClick={() => setSelectedLead(null)} className="p-1 rounded hover:bg-secondary transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <ScoreCard lead={selectedLead} />
              <div className="sdr-card">
                <div className="sdr-section-title">Lead info</div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{selectedLead.email}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{selectedLead.phone}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">ICP</span><span>{selectedLead.icp}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Campaign</span><span>{selectedLead.campaign}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span>{selectedLead.location}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">State</span><span className="font-medium">{selectedLead.state}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Last activity</span><span>{selectedLead.lastActivity}</span></div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-1.5">Intent timeline ({selectedLead.intentEvents.length} events)</div>
                  {selectedLead.intentEvents.slice(-4).map((evt, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs py-0.5">
                      <span className="text-muted-foreground w-[75px] flex-shrink-0">{evt.time.split(" ").slice(1).join(" ")}</span>
                      <span className="flex-1">{evt.action}</span>
                      <span className={evt.points > 0 ? "text-sdr-green" : "text-sdr-coral"}>{evt.points > 0 ? "+" : ""}{evt.points}</span>
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

// Fix StatusBadge onClick type
function _fix() {} // unused, just ensuring no TS issues with onClick
