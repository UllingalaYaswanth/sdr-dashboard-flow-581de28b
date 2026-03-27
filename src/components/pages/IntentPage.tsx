import { useState } from "react";
import { useLeads } from "@/context/LeadContext";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Plus } from "lucide-react";
import { toast } from "sonner";

const simulatedEvents = [
  { action: "Opened email #3", points: 20 },
  { action: "Clicked pricing page", points: 25 },
  { action: "Downloaded brochure", points: 30 },
  { action: "Watched demo video (5 min)", points: 35 },
  { action: "Visited /apply page", points: 40 },
  { action: "Submitted inquiry form", points: 45 },
  { action: "Forwarded to colleague", points: 30 },
  { action: "Inactive (48h)", points: -15 },
  { action: "Unsubscribed from email", points: -25 },
];

export function IntentPage() {
  const { leads, addIntentEvent } = useLeads();
  const [selectedId, setSelectedId] = useState(leads[0]?.id || "1");
  const selectedLead = leads.find(l => l.id === selectedId);
  const intentLeads = leads.filter(l => l.intentEvents.length > 0);

  const handleSimulateEvent = () => {
    if (!selectedLead) return;
    const evt = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
    const now = new Date();
    const time = `${now.toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    addIntentEvent(selectedId, { time, action: evt.action, points: evt.points });
    toast.success(`${evt.action} (${evt.points > 0 ? "+" : ""}${evt.points} pts)`);
  };

  if (!selectedLead) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {intentLeads.map(l => (
          <button
            key={l.id}
            onClick={() => setSelectedId(l.id)}
            className={`sdr-badge cursor-pointer transition-all ${
              l.id === selectedId
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-accent"
            }`}
          >
            {l.name} ({l.type}) · {l.score}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="sdr-section-title mb-0">Intent events — {selectedLead.name}</div>
            <button
              onClick={handleSimulateEvent}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" /> Simulate event
            </button>
          </div>
          <div className="sdr-card">
            <AnimatePresence>
              {selectedLead.intentEvents.map((evt, i) => (
                <motion.div
                  key={`${evt.time}-${evt.action}-${i}`}
                  initial={i === selectedLead.intentEvents.length - 1 ? { opacity: 0, x: -8 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 py-1.5 border-b border-border last:border-b-0 text-sm"
                >
                  <span className="text-xs text-muted-foreground w-[95px] flex-shrink-0">{evt.time}</span>
                  <span className="flex-1">{evt.action}</span>
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                    evt.points > 0 ? "text-sdr-green bg-sdr-green-light" : "text-sdr-coral bg-sdr-coral-light"
                  }`}>
                    {evt.points > 0 ? "+" : ""}{evt.points}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {selectedLead.intentEvents.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No events yet. Click "Simulate event" to add one.
              </div>
            )}
          </div>

          <div className="sdr-card mt-3">
            <div className="sdr-section-title">Scoring formula</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• <strong>Fit (40%)</strong>: ICP match, budget, company size</div>
              <div>• <strong>Intent (40%)</strong>: Page visits, email opens, ad clicks, form fills</div>
              <div>• <strong>Timing (20%)</strong>: Recency of engagement, inactive decay</div>
              <div className="pt-1.5 text-foreground font-medium">
                Score = (Fit × 0.4) + (Intent × 0.4) + (Timing × 0.2) = {selectedLead.score}
              </div>
            </div>
          </div>
        </div>
        <div>
          <ScoreCard lead={selectedLead} />
        </div>
      </div>
    </motion.div>
  );
}
