import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const b2cStates = [
  { state: "New", desc: "Just entered pipeline", count: 482, badge: "new" },
  { state: "Interested", desc: "Replied / clicked", count: 241, badge: "warm" },
  { state: "Counseling", desc: "In conversation", count: 89, badge: "hot" },
  { state: "Enrolled", desc: "Payment done", count: 67, badge: "done" },
];

const b2bStates = [
  { state: "New", desc: "Imported from Apollo", count: 310, badge: "new" },
  { state: "Contacted", desc: "Email/LinkedIn sent", count: 198, badge: "b2b" },
  { state: "Qualified", desc: "Replied, budget confirmed", count: 54, badge: "warm" },
  { state: "Meeting", desc: "Demo/discovery booked", count: 24, badge: "hot" },
  { state: "Deal", desc: "Proposal sent / closing", count: 8, badge: "done" },
];

const b2cMeetings = [
  { name: "Ravi Kumar", detail: "Demo call — Mar 19, 6 PM", confirmed: true },
  { name: "Neha Joshi", detail: "Counseling — Mar 20, 11 AM", confirmed: true },
  { name: "Aryan Verma", detail: "Awaiting slot confirm", confirmed: false },
];

const b2bMeetings = [
  { name: "Priya Sharma — Amity", detail: "Discovery — Mar 21, 11 AM", confirmed: true },
  { name: "Rahul Mehta — UpGrad", detail: "Demo — Mar 22, 3 PM", confirmed: true },
  { name: "Sneha Iyer — NIIT", detail: "Reschedule pending", confirmed: false },
];

const stateColors: Record<string, string> = {
  New: "bg-muted-foreground",
  Interested: "bg-sdr-orange",
  Counseling: "bg-sdr-coral",
  Enrolled: "bg-sdr-green",
  Contacted: "bg-sdr-blue/60",
  Qualified: "bg-sdr-orange",
  Meeting: "bg-sdr-coral",
  Deal: "bg-sdr-green",
};

const badgeStyles: Record<string, string> = {
  new: "bg-[hsl(var(--badge-new-bg))] text-[hsl(var(--badge-new-fg))]",
  warm: "bg-[hsl(var(--badge-warm-bg))] text-[hsl(var(--badge-warm-fg))]",
  hot: "bg-[hsl(var(--badge-hot-bg))] text-[hsl(var(--badge-hot-fg))]",
  done: "bg-[hsl(var(--badge-done-bg))] text-[hsl(var(--badge-done-fg))]",
  b2b: "bg-[hsl(var(--badge-b2b-bg))] text-[hsl(var(--badge-b2b-fg))]",
};

export function StatesPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-3">
      <div>
        <div className="sdr-section-title">B2C state machine — student journey</div>
        <div className="sdr-card mb-3">
          {b2cStates.map((s) => (
            <div key={s.state} className="sdr-state-row">
              <span className={`sdr-state-dot ${stateColors[s.state]}`} />
              <span className="flex-1 text-sm font-medium">{s.state}</span>
              <span className="text-xs text-muted-foreground">{s.desc}</span>
              <Badge variant="secondary" className={`sdr-badge ${badgeStyles[s.badge]}`}>{s.count}</Badge>
            </div>
          ))}
        </div>
        <div className="sdr-section-title">Meeting system — B2C</div>
        <div className="sdr-card">
          <div className="text-xs text-muted-foreground mb-2">Auto-booking link sent when state = Counseling + intent ≥ 65</div>
          {b2cMeetings.map((m) => (
            <div key={m.name} className="sdr-state-row">
              <span className={`sdr-state-dot ${m.confirmed ? "bg-sdr-green" : "bg-sdr-orange"}`} />
              <span className="flex-1 text-sm">{m.name}</span>
              <span className={`text-xs ${m.confirmed ? "text-sdr-green" : "text-sdr-orange"}`}>{m.detail}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="sdr-section-title">B2B state machine — deal journey</div>
        <div className="sdr-card mb-3">
          {b2bStates.map((s) => (
            <div key={s.state} className="sdr-state-row">
              <span className={`sdr-state-dot ${stateColors[s.state]}`} />
              <span className="flex-1 text-sm font-medium">{s.state}</span>
              <span className="text-xs text-muted-foreground">{s.desc}</span>
              <Badge variant="secondary" className={`sdr-badge ${badgeStyles[s.badge]}`}>{s.count}</Badge>
            </div>
          ))}
        </div>
        <div className="sdr-section-title">Meeting system — B2B</div>
        <div className="sdr-card">
          <div className="text-xs text-muted-foreground mb-2">Auto-booking when state = Meeting + score ≥ 70. Assigned to enterprise counselor.</div>
          {b2bMeetings.map((m) => (
            <div key={m.name} className="sdr-state-row">
              <span className={`sdr-state-dot ${m.confirmed ? "bg-sdr-green" : "bg-sdr-orange"}`} />
              <span className="flex-1 text-sm">{m.name}</span>
              <span className={`text-xs ${m.confirmed ? "text-sdr-green" : "text-sdr-orange"}`}>{m.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
