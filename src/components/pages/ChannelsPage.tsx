import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ChannelConfig {
  name: string;
  pct: number;
  enabled: boolean;
  color: string;
}

const defaultB2C: ChannelConfig[] = [
  { name: "WhatsApp automation", pct: 72, enabled: true, color: "bg-sdr-green" },
  { name: "Calls (counselor)", pct: 18, enabled: true, color: "bg-sdr-teal" },
  { name: "Email nurture", pct: 10, enabled: true, color: "bg-sdr-green/30" },
];

const defaultB2B: ChannelConfig[] = [
  { name: "Email via Lemlist", pct: 55, enabled: true, color: "bg-sdr-blue" },
  { name: "LinkedIn DM", pct: 30, enabled: true, color: "bg-sdr-blue/60" },
  { name: "Calls (high value)", pct: 15, enabled: true, color: "bg-sdr-blue/30" },
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

export function ChannelsPage() {
  const [b2cChannels, setB2CChannels] = useState(defaultB2C);
  const [b2bChannels, setB2BChannels] = useState(defaultB2B);

  const toggleChannel = (type: "b2c" | "b2b", idx: number) => {
    if (type === "b2c") {
      const updated = [...b2cChannels];
      updated[idx] = { ...updated[idx], enabled: !updated[idx].enabled };
      setB2CChannels(updated);
      toast(updated[idx].enabled ? `${updated[idx].name} enabled` : `${updated[idx].name} disabled`);
    } else {
      const updated = [...b2bChannels];
      updated[idx] = { ...updated[idx], enabled: !updated[idx].enabled };
      setB2BChannels(updated);
      toast(updated[idx].enabled ? `${updated[idx].name} enabled` : `${updated[idx].name} disabled`);
    }
  };

  const adjustWeight = (type: "b2c" | "b2b", idx: number, delta: number) => {
    const channels = type === "b2c" ? [...b2cChannels] : [...b2bChannels];
    const newPct = Math.max(0, Math.min(100, channels[idx].pct + delta));
    channels[idx] = { ...channels[idx], pct: newPct };
    type === "b2c" ? setB2CChannels(channels) : setB2BChannels(channels);
  };

  const ChannelRow = ({ ch, idx, type }: { ch: ChannelConfig; idx: number; type: "b2c" | "b2b" }) => (
    <div className="sdr-state-row group">
      <button
        onClick={() => toggleChannel(type, idx)}
        className={`w-3 h-3 rounded-sm border flex-shrink-0 transition-colors ${ch.enabled ? "bg-primary border-primary" : "bg-transparent border-muted-foreground"}`}
      />
      <span className={`flex-1 text-sm ${!ch.enabled ? "line-through text-muted-foreground" : ""}`}>{ch.name}</span>
      <div className="flex items-center gap-1.5">
        <button onClick={() => adjustWeight(type, idx, -5)} className="text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center rounded hover:bg-secondary">−</button>
        <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${ch.enabled ? ch.color : "bg-muted-foreground/30"}`} style={{ width: `${ch.pct}%` }} />
        </div>
        <button onClick={() => adjustWeight(type, idx, 5)} className="text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center rounded hover:bg-secondary">+</button>
        <span className="text-xs text-muted-foreground w-8 text-right">{ch.pct}%</span>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-3">
      <div>
        <div className="sdr-section-title">B2C channel routing — click to toggle, hover for weight controls</div>
        <div className="sdr-card mb-3">
          {b2cChannels.map((ch, i) => <ChannelRow key={ch.name} ch={ch} idx={i} type="b2c" />)}
        </div>
        <div className="sdr-section-title">B2B channel routing</div>
        <div className="sdr-card">
          {b2bChannels.map((ch, i) => <ChannelRow key={ch.name} ch={ch} idx={i} type="b2b" />)}
        </div>
      </div>
      <div>
        <div className="sdr-section-title">Language + tone selection</div>
        <div className="sdr-card mb-3">
          <div className="text-xs text-muted-foreground mb-2.5">Auto-detected from name pattern + company + ICP type</div>
          {langMap.map(l => (
            <div key={l.target} className="sdr-state-row">
              <span className={`sdr-state-dot ${l.color}`} />
              <span className="flex-1 text-sm">{l.target}</span>
              <span className={`sdr-badge ${l.type === "B2B" ? "bg-[hsl(var(--badge-b2b-bg))] text-[hsl(var(--badge-b2b-fg))]" : "bg-[hsl(var(--badge-warm-bg))] text-[hsl(var(--badge-warm-fg))]"}`}>{l.lang}</span>
            </div>
          ))}
        </div>
        <div className="sdr-section-title">Email infra health</div>
        <div className="sdr-card">
          {infraDomains.map(d => (
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
