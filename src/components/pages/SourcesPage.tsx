import { BarChart } from "@/components/dashboard/BarChart";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function SourcesPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="grid md:grid-cols-3 gap-3 mb-3">
        <div className="sdr-card">
          <div className="flex items-center gap-2 mb-2.5">
            <Badge variant="secondary" className="sdr-badge bg-sdr-blue-light text-sdr-blue-dark">Apollo.io</Badge>
            <Badge variant="secondary" className="sdr-badge bg-[hsl(var(--badge-b2b-bg))] text-[hsl(var(--badge-b2b-fg))]">B2B only</Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">Filter by ICP → export → enrich. Best for institutional deals and HR outreach.</p>
          <BarChart label="Leads this month" value="840" pct={60} colorClass="bg-sdr-blue" />
          <BarChart label="Email verified" value="91%" pct={91} colorClass="bg-sdr-green" />
          <div className="mt-2 text-xs text-muted-foreground">Saved searches: 12 active · Refresh: daily</div>
        </div>
        <div className="sdr-card">
          <div className="flex items-center gap-2 mb-2.5">
            <Badge variant="secondary" className="sdr-badge bg-sdr-green-light text-sdr-green-dark">Ads / inbound</Badge>
            <Badge variant="secondary" className="sdr-badge bg-[hsl(var(--badge-b2c-bg))] text-[hsl(var(--badge-b2c-fg))]">B2C only</Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">Meta + Google ads → landing pages → WhatsApp / form fill. Direct student acquisition.</p>
          <BarChart label="Leads this month" value="1,680" pct={100} colorClass="bg-sdr-green" />
          <BarChart label="Phone verified" value="84%" pct={84} colorClass="bg-sdr-green" />
          <div className="mt-2 text-xs text-muted-foreground">CPL avg: ₹180 · Best: Meta carousel ads</div>
        </div>
        <div className="sdr-card">
          <div className="flex items-center gap-2 mb-2.5">
            <Badge variant="secondary" className="sdr-badge bg-sdr-orange-light text-sdr-orange">Client upload</Badge>
            <Badge variant="secondary" className="sdr-badge bg-[hsl(var(--badge-hybrid-bg))] text-[hsl(var(--badge-hybrid-fg))]">B2B + B2C</Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">CSV / Excel / old CRM. Cleaned, deduplicated, enriched before entering pipeline.</p>
          <BarChart label="Leads uploaded" value="327" pct={20} colorClass="bg-sdr-orange" />
          <BarChart label="After dedup clean" value="281" pct={17} colorClass="bg-sdr-orange" />
          <div className="mt-2 text-xs text-muted-foreground">Last upload: Mar 26 · 14% duplicates removed</div>
        </div>
      </div>
      <div className="sdr-card">
        <div className="sdr-section-title">Unified lead object — sample</div>
        <div className="text-xs font-mono text-muted-foreground leading-relaxed bg-secondary p-2.5 rounded-md">
          name: "Priya Sharma" &nbsp;|&nbsp; email: priya@amity.edu ✓ &nbsp;|&nbsp; phone: +91-98xxxx ✓<br />
          source: <span className="text-primary">apollo</span> &nbsp;|&nbsp; type: <span className="text-primary">B2B</span> &nbsp;|&nbsp; icp: "College partnerships"<br />
          campaign: "Colleges-Q2-India" &nbsp;|&nbsp; location: "Noida, UP"<br />
          linkedin: priya-sharma-edu &nbsp;|&nbsp; tech_stack: ["Moodle","Zoom"] &nbsp;|&nbsp; hiring_signal: true
        </div>
      </div>
    </motion.div>
  );
}
