import { b2cICPs, b2bICPs, ICP } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

function ICPCard({ icp }: { icp: ICP }) {
  const colorMap: Record<string, string> = {
    "sdr-blue": "text-sdr-blue-dark",
    "sdr-green": "text-sdr-green-dark",
    "sdr-purple": "text-sdr-purple",
    "sdr-orange": "text-sdr-orange",
  };
  return (
    <div className="border border-border rounded-md p-2.5">
      <div className={`text-sm font-medium mb-1.5 ${colorMap[icp.color] || ""}`}>{icp.name}</div>
      {Object.entries(icp.details).map(([k, v]) => (
        <div key={k} className="text-xs text-muted-foreground mb-0.5">
          {k}: <span className="text-foreground">{v}</span>
        </div>
      ))}
    </div>
  );
}

export function ICPPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex gap-1.5 mb-3">
        <Badge variant="secondary" className="sdr-badge bg-[hsl(var(--badge-b2c-bg))] text-[hsl(var(--badge-b2c-fg))]">B2C mode — student/learner ICPs</Badge>
        <Badge variant="secondary" className="sdr-badge bg-[hsl(var(--badge-b2b-bg))] text-[hsl(var(--badge-b2b-fg))]">B2B mode — institutional/enterprise ICPs</Badge>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <div className="sdr-section-title">B2C ICPs</div>
          <div className="grid grid-cols-2 gap-2">
            {b2cICPs.map((icp) => <ICPCard key={icp.name} icp={icp} />)}
          </div>
        </div>
        <div>
          <div className="sdr-section-title">B2B ICPs (via Apollo)</div>
          <div className="grid grid-cols-2 gap-2">
            {b2bICPs.map((icp) => <ICPCard key={icp.name} icp={icp} />)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
