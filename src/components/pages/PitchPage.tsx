import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Copy, Check, Zap, Target, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const defaultInputs = {
  product: "Full-Stack Data Science Program",
  duration: "6-month online",
  price: "₹49,000",
  guarantee: "Job guarantee",
  placement: "93%",
  avgCTC: "₹8.4 LPA",
};

const pitchTemplates = [
  {
    type: "Student Hook",
    icon: "🎓",
    channel: "WhatsApp / Instagram",
    generate: (i: typeof defaultInputs) => `"Land a data job in ${i.duration.split("-")[0]} months — or we refund you. ${i.placement} of our grads placed within 90 days of graduation."`,
  },
  {
    type: "B2B College Pitch",
    icon: "🏛️",
    channel: "Email / LinkedIn",
    generate: (i: typeof defaultInputs) => `"Offer your students a certified data science track without building curriculum. Plug into our cohort, we handle delivery. ${i.placement} placement rate."`,
  },
  {
    type: "Urgency Hook",
    icon: "⚡",
    channel: "All channels",
    generate: (i: typeof defaultInputs) => `"Next cohort starts Apr 7 — 12 seats left. Early-bird pricing at ${i.price} closes this Friday."`,
  },
  {
    type: "Competitor Angle",
    icon: "🎯",
    channel: "Email",
    generate: (i: typeof defaultInputs) => `"Unlike Coursera self-paced, you get live mentorship + a real hiring pipeline — not just a certificate. Avg CTC: ${i.avgCTC}."`,
  },
  {
    type: "Hinglish (B2C)",
    icon: "💬",
    channel: "WhatsApp",
    generate: (i: typeof defaultInputs) => `"Bhai, ${i.duration} mein full data science seekho — live classes + mentorship. ${i.placement} placement rate, avg ${i.avgCTC} package. Price: ${i.price}. Kya interest hai?"`,
  },
];

const valueProps = [
  { label: "Placement Rate", value: 93, color: "hsl(var(--ai-green))", bg: "hsl(var(--badge-done-bg))" },
  { label: "Curriculum Freshness", value: 90, color: "hsl(var(--ai-blue))", bg: "hsl(var(--badge-ai-bg))" },
  { label: "Mentor Quality", value: 88, color: "hsl(var(--ai-purple))", bg: "hsl(var(--badge-b2c-bg))" },
  { label: "Price Competitiveness", value: 76, color: "hsl(var(--ai-orange))", bg: "hsl(var(--badge-warm-bg))" },
];

export function PitchPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [pitches, setPitches] = useState<{ type: string; text: string; icon: string; channel: string }[]>([]);
  const [generating, setGenerating] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [activeVariant, setActiveVariant] = useState<number | null>(null);

  const handleGenerate = () => {
    setGenerating(true);
    setPitches([]);
    pitchTemplates.forEach((t, i) => {
      setTimeout(() => {
        setPitches(prev => [...prev, { type: t.type, text: t.generate(inputs), icon: t.icon, channel: t.channel }]);
        if (i === pitchTemplates.length - 1) {
          setGenerating(false);
          toast.success("5 AI pitch variants ready");
        }
      }, 400 + i * 350);
    });
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-4">
      {/* Left: Inputs + outputs */}
      <div>
        <div className="sdr-section-title">
          <Target className="w-3.5 h-3.5" />
          Campaign Inputs
        </div>
        <div className="sdr-card mb-4">
          <div className="grid gap-3">
            {Object.entries(inputs).map(([key, val]) => (
              <div key={key}>
                <label className="text-xs font-medium text-muted-foreground block mb-1 capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
                <input
                  value={val}
                  onChange={e => setInputs(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full mt-4 rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            style={{ background: "hsl(var(--ai-blue))", color: "white" }}
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? "Generating variants..." : "Generate AI Pitches"}
          </button>
        </div>

        <div className="sdr-section-title">
          <Sparkles className="w-3.5 h-3.5" />
          AI Pitch Variants
        </div>
        <AnimatePresence>
          {pitches.map((p, i) => (
            <motion.div
              key={p.type}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`sdr-card mb-2 cursor-pointer transition-all ${activeVariant === i ? "ring-2 ring-[hsl(var(--ai-blue))]" : ""}`}
              onClick={() => setActiveVariant(activeVariant === i ? null : i)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{p.icon}</span>
                  <span className="text-[12px] font-semibold">{p.type}</span>
                  <span className="sdr-badge text-[10px]" style={{ background: "hsl(var(--badge-ai-bg))", color: "hsl(var(--badge-ai-fg))" }}>{p.channel}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleCopy(p.text, i); }}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors flex-shrink-0"
                >
                  {copiedIdx === i ? <Check className="w-3.5 h-3.5 text-[hsl(var(--ai-green))]" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                </button>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        {pitches.length === 0 && !generating && (
          <div className="text-center py-8 text-sm text-muted-foreground bg-secondary/40 rounded-xl border-2 border-dashed border-border">
            <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-30" />
            Edit inputs above and click "Generate AI Pitches"
          </div>
        )}
      </div>

      {/* Right: Value props + pitch doc */}
      <div>
        <div className="sdr-section-title">
          <TrendingUp className="w-3.5 h-3.5" />
          Value Proposition Scores
        </div>
        <div className="sdr-card mb-4">
          <div className="space-y-4">
            {valueProps.map((v, i) => (
              <div key={v.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">{v.label}</span>
                  <span className="text-sm font-bold" style={{ color: v.color }}>{v.value}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${v.value}%` }}
                    transition={{ duration: 0.7, delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: v.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sdr-section-title">
          <Zap className="w-3.5 h-3.5" />
          Master Pitch Document
        </div>
        <div className="sdr-card">
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            All pitch variants are stored in a <span className="text-foreground font-semibold">master pitch document</span> that feeds every downstream stage — ICP generation, personalization, channel selection, and the AI conversation brain all pull from this.
          </p>
          <div className="grid grid-cols-3 gap-2 text-center mb-3">
            {["ICP Engine", "Channels", "AI Convo"].map(s => (
              <div key={s} className="rounded-lg py-2 text-xs font-medium" style={{ background: "hsl(var(--badge-ai-bg))", color: "hsl(var(--badge-ai-fg))" }}>{s}</div>
            ))}
          </div>
          {pitches.length > 0 && (
            <div className="rounded-lg p-2.5 text-xs font-medium flex items-center gap-2"
              style={{ background: "hsl(var(--badge-done-bg))", color: "hsl(var(--badge-done-fg))" }}>
              <Check className="w-3.5 h-3.5" />
              {pitches.length} pitch variants saved to master doc
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
