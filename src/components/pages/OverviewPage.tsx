import { useLeads } from "@/context/LeadContext";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { MetricRow } from "@/components/dashboard/MetricRow";
import { FlowPipeline } from "@/components/dashboard/FlowPipeline";
import { Zap, Target, Brain, TrendingUp, Activity, ArrowUpRight } from "lucide-react";

const COLORS = {
  blue: "hsl(222, 89%, 55%)",
  purple: "hsl(260, 70%, 60%)",
  green: "hsl(152, 69%, 42%)",
  orange: "hsl(28, 96%, 56%)",
  red: "hsl(4, 80%, 54%)",
  teal: "hsl(186, 68%, 45%)",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-sm">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color || p.fill }} className="text-xs">{p.name}: <span className="font-semibold">{p.value}</span></p>
        ))}
      </div>
    );
  }
  return null;
};

export function OverviewPage() {
  const { leads } = useLeads();

  const hotCount = leads.filter(l => l.status === "hot").length;
  const warmCount = leads.filter(l => l.status === "warm").length;
  const coldCount = leads.filter(l => l.status === "cold").length;
  const newCount = leads.filter(l => l.status === "new").length;
  const doneCount = leads.filter(l => l.status === "done").length;
  const meetingsCount = leads.filter(l => l.state === "meeting" || l.state === "counseling").length;
  const converted = leads.filter(l => l.state === "enrolled" || l.state === "deal").length;
  const convRate = leads.length > 0 ? ((converted / leads.length) * 100).toFixed(1) : "0";
  const b2bCount = leads.filter(l => l.type === "B2B").length;
  const b2cCount = leads.filter(l => l.type === "B2C").length;

  const metrics = [
    { label: "Total Leads", value: leads.length.toString(), delta: `${hotCount} hot`, deltaType: "up" as const },
    { label: "Hot Pipeline", value: hotCount.toString(), delta: "priority action", deltaType: "up" as const },
    { label: "Meetings Booked", value: meetingsCount.toString(), delta: "this week", deltaType: "up" as const },
    { label: "Conversion Rate", value: `${convRate}%`, delta: "all time", deltaType: "up" as const },
  ];

  const sourceData = [
    { name: "Apollo", value: leads.filter(l => l.source === "apollo").length, fill: COLORS.blue },
    { name: "Ads", value: leads.filter(l => l.source === "ads").length, fill: COLORS.green },
    { name: "Upload", value: leads.filter(l => l.source === "upload").length, fill: COLORS.orange },
  ];

  const funnelData = [
    { stage: "Total", count: leads.length },
    { stage: "Contacted", count: leads.filter(l => !["new"].includes(l.state)).length },
    { stage: "Interested", count: leads.filter(l => ["interested", "counseling", "enrolled", "qualified", "meeting", "deal"].includes(l.state)).length },
    { stage: "Meeting", count: leads.filter(l => ["meeting", "counseling", "deal", "enrolled"].includes(l.state)).length },
    { stage: "Converted", count: converted },
  ];

  const statusData = [
    { name: "Hot", value: hotCount, fill: COLORS.red },
    { name: "Warm", value: warmCount, fill: COLORS.orange },
    { name: "Cold", value: coldCount, fill: COLORS.blue },
    { name: "New", value: newCount, fill: COLORS.teal },
    { name: "Done", value: doneCount, fill: COLORS.green },
  ];

  const stateData = [
    { name: "New", value: leads.filter(l => l.state === "new").length, color: "hsl(var(--ai-blue))" },
    { name: "Contacted", value: leads.filter(l => l.state === "contacted").length, color: "hsl(var(--ai-teal))" },
    { name: "Interested", value: leads.filter(l => l.state === "interested").length, color: "hsl(var(--ai-purple))" },
    { name: "Qualified", value: leads.filter(l => l.state === "qualified").length, color: "hsl(var(--ai-green))" },
    { name: "Meeting", value: leads.filter(l => l.state === "meeting").length, color: "hsl(var(--ai-orange))" },
    { name: "Enrolled", value: leads.filter(l => l.state === "enrolled" || l.state === "deal").length, color: "hsl(var(--ai-red))" },
  ];

  const typeData = [
    { name: "B2B", value: b2bCount, fill: COLORS.blue },
    { name: "B2C", value: b2cCount, fill: COLORS.purple },
  ];

  const recentActivity = [
    { time: "2m ago", event: "Hot lead spike detected — Ravi Kumar intent +35", type: "hot" },
    { time: "8m ago", event: "AI sent 12 WhatsApp messages to warm B2C leads", type: "ai" },
    { time: "15m ago", event: "Meeting booked — Priya Sharma (Amity, B2B)", type: "meeting" },
    { time: "22m ago", event: "3 new Apollo leads ingested — HR/L&D segment", type: "source" },
    { time: "1h ago", event: "Self-optimization cycle complete — ICP weights updated", type: "optimize" },
  ];

  const activityColor: Record<string, string> = {
    hot: "hsl(var(--ai-red))",
    ai: "hsl(var(--ai-blue))",
    meeting: "hsl(var(--ai-green))",
    source: "hsl(var(--ai-orange))",
    optimize: "hsl(var(--ai-purple))",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <MetricRow metrics={metrics} />

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {/* Status breakdown */}
        <div className="sdr-card">
          <div className="sdr-section-title">
            <Target className="w-3.5 h-3.5" />
            Priority Breakdown
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" paddingAngle={2}>
                {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-y-1 gap-x-2 mt-1 px-1">
            {statusData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: d.fill }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="font-bold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline funnel */}
        <div className="sdr-card md:col-span-2">
          <div className="sdr-section-title">
            <Activity className="w-3.5 h-3.5" />
            Lead Journey States
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {stateData.map((s, i) => (
              <div key={s.name} className="p-2 rounded-lg bg-secondary/50 border border-border/50">
                <div className="text-[10px] text-muted-foreground mb-0.5 uppercase tracking-wider font-semibold">{s.name}</div>
                <div className="flex items-end justify-between">
                  <span className="text-lg font-bold leading-none" style={{ color: s.color }}>{s.value}</span>
                  <div className="w-8 h-1 rounded-full opacity-50" style={{ background: s.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 h-1.5 bg-secondary rounded-full overflow-hidden flex">
            {stateData.map((s, i) => (
              <div 
                key={i} 
                style={{ 
                  width: `${(s.value / leads.length) * 100}%`,
                  background: s.color 
                }} 
                className="h-full first:rounded-l-full last:rounded-r-full border-r border-background/20 last:border-0"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {/* Source distribution */}
        <div className="sdr-card">
          <div className="sdr-section-title">
            <Brain className="w-3.5 h-3.5" />
            Lead Sources
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" paddingAngle={3}>
                {sourceData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {sourceData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.fill }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Activity Feed */}
        <div className="sdr-card md:col-span-2">
          <div className="sdr-section-title">
            <Zap className="w-3.5 h-3.5" />
            Live AI Activity
          </div>
          <div className="space-y-2">
            {recentActivity.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 p-2.5 rounded-lg"
                style={{ background: "hsl(var(--secondary))" }}
              >
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: activityColor[a.type] }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] leading-snug">{a.event}</p>
                </div>
                <span className="text-[10px] text-muted-foreground flex-shrink-0">{a.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* B2B vs B2C + AI Flow */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="sdr-card">
          <div className="sdr-section-title">
            <TrendingUp className="w-3.5 h-3.5" />
            B2B vs B2C Mix
          </div>
          <div className="space-y-3 mt-1">
            {typeData.map(d => (
              <div key={d.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium">{d.name}</span>
                  <span className="text-xs font-bold">{d.value}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.value / leads.length) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ background: d.fill }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">{leads.length > 0 ? Math.round((d.value / leads.length) * 100) : 0}% of pipeline</div>
              </div>
            ))}
            {/* Quick stats */}
            <div className="pt-2 border-t border-border grid grid-cols-2 gap-2">
              <div className="text-center p-2 rounded-lg" style={{ background: "hsl(var(--badge-hot-bg))" }}>
                <div className="text-lg font-bold" style={{ color: "hsl(var(--ai-red))" }}>{hotCount}</div>
                <div className="text-[10px]" style={{ color: "hsl(var(--ai-red))" }}>Hot leads</div>
              </div>
              <div className="text-center p-2 rounded-lg" style={{ background: "hsl(var(--badge-done-bg))" }}>
                <div className="text-lg font-bold" style={{ color: "hsl(var(--ai-green))" }}>{converted}</div>
                <div className="text-[10px]" style={{ color: "hsl(var(--ai-green))" }}>Converted</div>
              </div>
            </div>
          </div>
        </div>
        <div className="sdr-card md:col-span-2">
          <div className="sdr-section-title">
            <Zap className="w-3.5 h-3.5" />
            AI Engine Flow — Current Stage
          </div>
          <FlowPipeline />
        </div>
      </div>
    </motion.div>
  );
}
