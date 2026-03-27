import { useState } from "react";
import { leads, queueMetrics, Lead } from "@/data/mockData";
import { MetricRow } from "@/components/dashboard/MetricRow";
import { LeadTable } from "@/components/dashboard/LeadTable";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function QueuePage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const sortedLeads = [...leads].sort((a, b) => b.score - a.score);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <MetricRow metrics={queueMetrics} />
      <div className="sdr-card">
        <div className="sdr-section-title">Hot queue — top leads</div>
        <LeadTable leads={sortedLeads} onSelectLead={setSelectedLead} />
      </div>
      <AnimatePresence>
        {selectedLead && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-3"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="sdr-section-title mb-0">Lead detail — {selectedLead.name}</div>
              <button onClick={() => setSelectedLead(null)} className="p-1 rounded hover:bg-secondary transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <ScoreCard lead={selectedLead} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
