import { useState } from "react";
import { b2cICPs, b2bICPs, ICP } from "@/data/mockData";
import { useLeads } from "@/context/LeadContext";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Check, X, Users } from "lucide-react";

function ICPCard({ icp, leadCount, onEdit }: { icp: ICP; leadCount: number; onEdit?: (details: Record<string, string>) => void }) {
  const [editing, setEditing] = useState(false);
  const [details, setDetails] = useState(icp.details);

  const colorMap: Record<string, string> = {
    "sdr-blue": "text-[hsl(var(--ai-blue))]",
    "sdr-green": "text-[hsl(var(--ai-green))]",
    "sdr-purple": "text-[hsl(var(--ai-purple))]",
    "sdr-orange": "text-[hsl(var(--ai-orange))]",
  };

  const handleSave = () => {
    onEdit?.(details);
    setEditing(false);
  };

  return (
    <motion.div layout className="border border-border rounded-md p-2.5 relative group">
      <div className="flex items-center justify-between mb-1.5">
        <div className={`text-sm font-medium ${colorMap[icp.color] || ""}`}>{icp.name}</div>
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground"><Users className="w-3 h-3" />{leadCount}</span>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="p-0.5 rounded hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit2 className="w-3 h-3 text-muted-foreground" />
            </button>
          ) : (
            <div className="flex gap-0.5">
            <button onClick={handleSave} className="p-0.5 rounded hover:bg-[hsl(var(--badge-done-bg))]"><Check className="w-3 h-3 text-[hsl(var(--ai-green))]" /></button>
              <button onClick={() => { setDetails(icp.details); setEditing(false); }} className="p-0.5 rounded hover:bg-[hsl(var(--badge-hot-bg))]"><X className="w-3 h-3 text-[hsl(var(--ai-red))]" /></button>
            </div>
          )}
        </div>
      </div>
      {Object.entries(details).map(([k, v]) => (
        <div key={k} className="text-xs text-muted-foreground mb-0.5">
          {k}:{" "}
          {editing ? (
            <input
              value={v}
              onChange={e => setDetails(prev => ({ ...prev, [k]: e.target.value }))}
              className="bg-secondary border border-border rounded px-1.5 py-0.5 text-xs text-foreground w-[calc(100%-60px)] focus:outline-none focus:ring-1 focus:ring-primary"
            />
          ) : (
            <span className="text-foreground">{v}</span>
          )}
        </div>
      ))}
    </motion.div>
  );
}

export function ICPPage() {
  const { leads } = useLeads();
  const [activeTab, setActiveTab] = useState<"both" | "b2c" | "b2b">("both");

  const getICPLeadCount = (icpName: string) => leads.filter(l => l.icp === icpName).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex gap-1.5 mb-3">
        {(["both", "b2c", "b2b"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`sdr-badge cursor-pointer transition-all ${tab === activeTab ? "bg-[hsl(var(--ai-blue))] text-white" : "bg-secondary text-muted-foreground hover:bg-accent"}`}
          >
            {tab === "both" ? "Dual mode" : tab.toUpperCase()}
          </button>
        ))}
        <Badge variant="secondary" className="sdr-badge bg-[hsl(var(--badge-b2c-bg))] text-[hsl(var(--badge-b2c-fg))]">B2C: {leads.filter(l => l.type === "B2C").length} leads</Badge>
        <Badge variant="secondary" className="sdr-badge bg-[hsl(var(--badge-b2b-bg))] text-[hsl(var(--badge-b2b-fg))]">B2B: {leads.filter(l => l.type === "B2B").length} leads</Badge>
      </div>

      <div className={`grid ${activeTab === "both" ? "md:grid-cols-2" : "md:grid-cols-1"} gap-3`}>
        {(activeTab === "both" || activeTab === "b2c") && (
          <div>
            <div className="sdr-section-title">B2C ICP Profiles</div>
            <div className="grid grid-cols-2 gap-2">
              {b2cICPs.map(icp => <ICPCard key={icp.name} icp={icp} leadCount={getICPLeadCount(icp.name)} />)}
            </div>
          </div>
        )}
        {(activeTab === "both" || activeTab === "b2b") && (
          <div>
            <div className="sdr-section-title">B2B ICP Profiles (Apollo)</div>
            <div className="grid grid-cols-2 gap-2">
              {b2bICPs.map(icp => <ICPCard key={icp.name} icp={icp} leadCount={getICPLeadCount(icp.name)} />)}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
