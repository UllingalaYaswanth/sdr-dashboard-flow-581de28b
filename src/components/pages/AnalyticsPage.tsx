import { MetricRow } from "@/components/dashboard/MetricRow";
import { BarChart } from "@/components/dashboard/BarChart";
import { analyticsMetrics } from "@/data/mockData";
import { motion } from "framer-motion";

const conversionByICP = [
  { label: "Colleges (B2B)", value: "4.1%", pct: 82, color: "bg-sdr-blue" },
  { label: "Career switchers (B2C)", value: "3.8%", pct: 76, color: "bg-sdr-green" },
  { label: "Bootcamps (B2B)", value: "2.2%", pct: 44, color: "bg-sdr-purple" },
  { label: "College students (B2C)", value: "1.9%", pct: 38, color: "bg-sdr-teal" },
  { label: "Skill learners (B2C)", value: "1.1%", pct: 22, color: "bg-sdr-blue/30" },
];

const revenueBySource = [
  { label: "Ads / inbound", value: "₹18.4L", pct: 72, color: "bg-sdr-green" },
  { label: "Apollo (B2B deals)", value: "₹6.2L", pct: 24, color: "bg-sdr-blue" },
  { label: "Client upload", value: "₹1.1L", pct: 4, color: "bg-sdr-orange" },
];

export function AnalyticsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <MetricRow metrics={analyticsMetrics} />
      <div className="grid md:grid-cols-2 gap-3">
        <div className="sdr-card">
          <div className="sdr-section-title">Conversion by ICP</div>
          {conversionByICP.map((c) => (
            <BarChart key={c.label} {...c} colorClass={c.color} />
          ))}
        </div>
        <div className="sdr-card">
          <div className="sdr-section-title">Revenue by source</div>
          {revenueBySource.map((r) => (
            <BarChart key={r.label} {...r} colorClass={r.color} />
          ))}
          <div className="mt-2.5 border-t border-border pt-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total revenue this month</span>
              <span className="font-medium">₹25.7L</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-muted-foreground">CPL average</span>
              <span>₹180</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-muted-foreground">Revenue / meeting</span>
              <span>₹62,700</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
