import { BarChart } from "@/components/dashboard/BarChart";
import { motion } from "framer-motion";

const pitchOutputs = [
  { type: "Student-facing hook", text: '"Land a data job in 6 months — or we refund you. 93% of our grads placed within 90 days of graduation."' },
  { type: "B2B hook (for colleges)", text: '"Offer your students a certified data science track without building curriculum. Plug into our cohort, we handle delivery."' },
  { type: "Urgency hook", text: '"Next cohort starts Mar 31 — 12 seats left. Early-bird pricing closes this Friday."' },
  { type: "Competitor angle", text: '"Unlike Coursera self-paced, you get live mentorship + a real hiring pipeline — not just a certificate."' },
];

const valueProps = [
  { label: "Placement rate", value: 93, color: "bg-sdr-green" },
  { label: "Curriculum freshness", value: 90, color: "bg-sdr-blue" },
  { label: "Mentor quality score", value: 88, color: "bg-sdr-purple" },
  { label: "Price competitiveness", value: 76, color: "bg-sdr-orange" },
];

export function PitchPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-3">
      <div>
        <div className="sdr-section-title">Client inputs</div>
        <div className="sdr-card mb-3">
          <div className="text-xs text-muted-foreground mb-1.5">Product / course</div>
          <div className="text-sm font-medium mb-2">Full-Stack Data Science Program</div>
          <div className="flex flex-wrap gap-1.5">
            <span className="sdr-badge bg-sdr-blue-light text-sdr-blue-dark">6-month online</span>
            <span className="sdr-badge bg-sdr-green-light text-sdr-green-dark">Job guarantee</span>
            <span className="sdr-badge bg-[hsl(var(--badge-warm-bg))] text-[hsl(var(--badge-warm-fg))]">₹49,000</span>
          </div>
          <div className="mt-2.5 text-xs text-muted-foreground">Outcomes: 93% placement rate · Avg CTC ₹8.4 LPA</div>
        </div>

        <div className="sdr-section-title">AI pitch outputs</div>
        {pitchOutputs.map((p) => (
          <div key={p.type} className="bg-secondary rounded-md p-2.5 text-sm leading-relaxed text-muted-foreground mb-2">
            <strong className="text-foreground font-medium">{p.type}:</strong> {p.text}
          </div>
        ))}
      </div>
      <div>
        <div className="sdr-section-title">Value props library</div>
        <div className="sdr-card mb-3">
          {valueProps.map((v) => (
            <BarChart key={v.label} label={v.label} value={`${v.value}%`} pct={v.value} colorClass={v.color} />
          ))}
        </div>
        <div className="sdr-section-title">Stored as master pitch doc</div>
        <div className="sdr-card">
          <p className="text-sm text-muted-foreground leading-relaxed">
            All pitch outputs are stored in a <span className="text-foreground font-medium">master pitch document</span> that feeds every downstream stage — ICP generation, personalization engine, channel selection, and AI conversation brain all pull from this doc. One source of truth.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
