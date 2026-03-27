import { useState } from "react";
import { leads } from "@/data/mockData";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { motion } from "framer-motion";

export function IntentPage() {
  const [selectedId, setSelectedId] = useState("1");
  const selectedLead = leads.find((l) => l.id === selectedId)!;

  const intentLeads = leads.filter((l) => l.intentEvents.length > 1);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-3">
      <div>
        <div className="flex gap-1.5 mb-2 flex-wrap">
          {intentLeads.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelectedId(l.id)}
              className={`sdr-badge cursor-pointer transition-colors ${
                l.id === selectedId
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-accent"
              }`}
            >
              {l.name} ({l.type})
            </button>
          ))}
        </div>
        <div className="sdr-section-title">Intent events — {selectedLead.name} ({selectedLead.type})</div>
        <div className="sdr-card">
          {selectedLead.intentEvents.map((evt, i) => (
            <div key={i} className="flex items-center gap-2 py-1 border-b border-border last:border-b-0 text-sm">
              <span className="text-xs text-muted-foreground w-[85px] flex-shrink-0">{evt.time}</span>
              <span className="flex-1">{evt.action}</span>
              <span className={`text-xs font-medium ${evt.points > 0 ? "text-sdr-green" : "text-sdr-coral"}`}>
                {evt.points > 0 ? "+" : ""}{evt.points}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <ScoreCard lead={selectedLead} />
      </div>
    </motion.div>
  );
}
