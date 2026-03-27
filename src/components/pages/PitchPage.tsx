import { useState } from "react";
import { BarChart } from "@/components/dashboard/BarChart";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
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
  { type: "Student-facing hook", generate: (i: typeof defaultInputs) => `"Land a data job in ${i.duration.split("-")[0]} months — or we refund you. ${i.placement} of our grads placed within 90 days of graduation."` },
  { type: "B2B hook (for colleges)", generate: (i: typeof defaultInputs) => `"Offer your students a certified data science track without building curriculum. Plug into our cohort, we handle delivery. ${i.placement} placement rate."` },
  { type: "Urgency hook", generate: (i: typeof defaultInputs) => `"Next cohort starts Apr 7 — 12 seats left. Early-bird pricing at ${i.price} closes this Friday."` },
  { type: "Competitor angle", generate: (i: typeof defaultInputs) => `"Unlike Coursera self-paced, you get live mentorship + a real hiring pipeline — not just a certificate. Avg CTC: ${i.avgCTC}."` },
  { type: "WhatsApp-ready (Hinglish)", generate: (i: typeof defaultInputs) => `"Bhai, ${i.duration} mein full data science seekho — live classes + mentorship. ${i.placement} placement rate, avg ${i.avgCTC} package. Price: ${i.price}. Kya interest hai?"` },
];

const valueProps = [
  { label: "Placement rate", value: 93, color: "bg-sdr-green" },
  { label: "Curriculum freshness", value: 90, color: "bg-sdr-blue" },
  { label: "Mentor quality score", value: 88, color: "bg-sdr-purple" },
  { label: "Price competitiveness", value: 76, color: "bg-sdr-orange" },
];

export function PitchPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [pitches, setPitches] = useState<{ type: string; text: string }[]>([]);
  const [generating, setGenerating] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = () => {
    setGenerating(true);
    setPitches([]);
    // Simulate AI generation with staggered results
    pitchTemplates.forEach((t, i) => {
      setTimeout(() => {
        setPitches(prev => [...prev, { type: t.type, text: t.generate(inputs) }]);
        if (i === pitchTemplates.length - 1) {
          setGenerating(false);
          toast.success("5 pitch variants generated");
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-3">
      <div>
        <div className="sdr-section-title">Client inputs — editable</div>
        <div className="sdr-card mb-3">
          {Object.entries(inputs).map(([key, val]) => (
            <div key={key} className="mb-2 last:mb-0">
              <label className="text-xs text-muted-foreground capitalize block mb-0.5">{key.replace(/([A-Z])/g, " $1")}</label>
              <input
                value={val}
                onChange={e => setInputs(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-full bg-secondary border border-border rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          ))}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full mt-3 bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? "Generating..." : "Generate AI pitches"}
          </button>
        </div>

        <div className="sdr-section-title">AI pitch outputs</div>
        <AnimatePresence>
          {pitches.map((p, i) => (
            <motion.div
              key={p.type}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary rounded-md p-2.5 text-sm leading-relaxed text-muted-foreground mb-2 group relative"
            >
              <strong className="text-foreground font-medium">{p.type}:</strong> {p.text}
              <button
                onClick={() => handleCopy(p.text, i)}
                className="absolute top-2 right-2 p-1 rounded hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copiedIdx === i ? <Check className="w-3.5 h-3.5 text-sdr-green" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {pitches.length === 0 && !generating && (
          <div className="text-sm text-muted-foreground bg-secondary/50 rounded-md p-4 text-center">
            Edit inputs above and click "Generate AI pitches" to see results
          </div>
        )}
      </div>
      <div>
        <div className="sdr-section-title">Value props library</div>
        <div className="sdr-card mb-3">
          {valueProps.map(v => (
            <BarChart key={v.label} label={v.label} value={`${v.value}%`} pct={v.value} colorClass={v.color} />
          ))}
        </div>
        <div className="sdr-section-title">Stored as master pitch doc</div>
        <div className="sdr-card">
          <p className="text-sm text-muted-foreground leading-relaxed">
            All pitch outputs are stored in a <span className="text-foreground font-medium">master pitch document</span> that feeds every downstream stage — ICP generation, personalization engine, channel selection, and AI conversation brain all pull from this doc.
          </p>
          {pitches.length > 0 && (
            <div className="mt-3 p-2 bg-[hsl(var(--badge-done-bg))] rounded-md text-xs text-[hsl(var(--badge-done-fg))]">
              ✓ {pitches.length} pitch variants saved to master doc
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
