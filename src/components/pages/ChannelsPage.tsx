import { motion } from "framer-motion";

const b2cChannels = [
  { name: "WhatsApp automation", pct: 72, color: "bg-sdr-green" },
  { name: "Calls (counselor)", pct: 18, color: "bg-sdr-teal" },
  { name: "Email nurture", pct: 10, color: "bg-sdr-green/30" },
];

const b2bChannels = [
  { name: "Email via Lemlist", pct: 55, color: "bg-sdr-blue" },
  { name: "LinkedIn DM", pct: 30, color: "bg-sdr-blue/60" },
  { name: "Calls (high value)", pct: 15, color: "bg-sdr-blue/30" },
];

const langMap = [
  { target: "Colleges / enterprises", lang: "Formal English", type: "B2B", color: "bg-sdr-green" },
  { target: "Solo creators", lang: "Hinglish casual", type: "B2C", color: "bg-sdr-coral" },
  { target: "Career switchers", lang: "Semi-formal English", type: "B2C", color: "bg-sdr-purple" },
  { target: "Parents", lang: "Hindi / regional", type: "B2C", color: "bg-sdr-orange" },
  { target: "HR / L&D", lang: "Formal English", type: "B2B", color: "bg-sdr-blue" },
];

const infraDomains = [
  { domain: "yourbrand.co", status: "Day 18 · 42/day · warm", healthy: true },
  { domain: "tryyourbrand.com", status: "Day 7 · 15/day · warming", healthy: false },
  { domain: "yourbrand.io", status: "Day 24 · 50/day · active", healthy: true },
];

function ChannelRow({ name, pct, color, type }: { name: string; pct: number; color: string; type: string }) {
  return (
    <div className="sdr-state-row">
      <span className="flex-1 text-sm">{name}</span>
      <span className="text-xs text-muted-foreground w-8">{type}</span>
      <div className="flex-[2] h-1.5 bg-border rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
    </div>
  );
}

export function ChannelsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-3">
      <div>
        <div className="sdr-section-title">B2C channel routing</div>
        <div className="sdr-card mb-3">
          {b2cChannels.map((ch) => <ChannelRow key={ch.name} {...ch} type="B2C" />)}
        </div>
        <div className="sdr-section-title">B2B channel routing</div>
        <div className="sdr-card">
          {b2bChannels.map((ch) => <ChannelRow key={ch.name} {...ch} type="B2B" />)}
        </div>
      </div>
      <div>
        <div className="sdr-section-title">Language + tone selection</div>
        <div className="sdr-card mb-3">
          <div className="text-xs text-muted-foreground mb-2.5">Auto-detected from name pattern + company city + ICP type</div>
          {langMap.map((l) => (
            <div key={l.target} className="sdr-state-row">
              <span className={`sdr-state-dot ${l.color}`} />
              <span className="flex-1 text-sm">{l.target}</span>
              <span className={`sdr-badge ${l.type === "B2B" ? "bg-[hsl(var(--badge-b2b-bg))] text-[hsl(var(--badge-b2b-fg))]" : "bg-[hsl(var(--badge-warm-bg))] text-[hsl(var(--badge-warm-fg))]"}`}>{l.lang}</span>
            </div>
          ))}
        </div>
        <div className="sdr-section-title">Email infra health</div>
        <div className="sdr-card">
          {infraDomains.map((d) => (
            <div key={d.domain} className="sdr-state-row">
              <span className={`sdr-state-dot ${d.healthy ? "bg-sdr-green" : "bg-sdr-orange"}`} />
              <span className="flex-1 text-sm">{d.domain}</span>
              <span className={`text-xs ${d.healthy ? "text-sdr-green" : "text-sdr-orange"}`}>{d.status}</span>
            </div>
          ))}
          <div className="mt-2 text-sm text-muted-foreground">
            Inbox deliverability: <strong className="text-sdr-green">94%</strong> · Spam rate: <strong className="text-sdr-green">0.3%</strong>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
