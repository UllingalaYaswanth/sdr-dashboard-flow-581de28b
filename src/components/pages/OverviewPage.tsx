import { MetricRow } from "@/components/dashboard/MetricRow";
import { FlowPipeline } from "@/components/dashboard/FlowPipeline";
import { useLeads } from "@/context/LeadContext";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function OverviewPage() {
  const { leads } = useLeads();

  const hotCount = leads.filter(l => l.status === "hot").length;
  const warmCount = leads.filter(l => l.status === "warm").length;
  const coldCount = leads.filter(l => l.status === "cold").length;
  const meetingsCount = leads.filter(l => l.state === "meeting" || l.state === "counseling").length;
  const convRate = ((leads.filter(l => l.state === "enrolled" || l.state === "deal").length / leads.length) * 100).toFixed(1);

  const metrics = [
    { label: "Total leads", value: leads.length.toString(), delta: `${hotCount} hot`, deltaType: "up" as const },
    { label: "Hot queue", value: hotCount.toString(), delta: "act now", deltaType: "up" as const },
    { label: "Meetings booked", value: meetingsCount.toString(), delta: "this week", deltaType: "up" as const },
    { label: "Conversion rate", value: `${convRate}%`, delta: "all time", deltaType: "up" as const },
  ];

  const sourceData = [
    { name: "Apollo", value: leads.filter(l => l.source === "apollo").length, fill: "hsl(212, 65%, 37%)" },
    { name: "Ads", value: leads.filter(l => l.source === "ads").length, fill: "hsl(160, 55%, 37%)" },
    { name: "Upload", value: leads.filter(l => l.source === "upload").length, fill: "hsl(34, 85%, 55%)" },
  ];

  const funnelData = [
    { stage: "Total", count: leads.length },
    { stage: "Contacted", count: leads.filter(l => !["new"].includes(l.state)).length },
    { stage: "Interested", count: leads.filter(l => ["interested", "counseling", "enrolled", "qualified", "meeting", "deal"].includes(l.state)).length },
    { stage: "Meeting", count: leads.filter(l => ["meeting", "counseling", "deal", "enrolled"].includes(l.state)).length },
    { stage: "Converted", count: leads.filter(l => ["enrolled", "deal"].includes(l.state)).length },
  ];

  const statusData = [
    { name: "Hot", value: hotCount, fill: "hsl(16, 70%, 52%)" },
    { name: "Warm", value: warmCount, fill: "hsl(34, 85%, 55%)" },
    { name: "Cold", value: coldCount, fill: "hsl(212, 65%, 37%)" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <MetricRow metrics={metrics} />
      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <div className="sdr-card">
          <div className="sdr-section-title">Leads by source</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {sourceData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="sdr-card">
          <div className="sdr-section-title">Pipeline funnel</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 92%)" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="stage" type="category" width={70} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(212, 65%, 37%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-3 mb-3">
        <div className="sdr-card col-span-1">
          <div className="sdr-section-title">Status distribution</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="sdr-card col-span-2">
          <div className="sdr-section-title">Master flow — current position</div>
          <FlowPipeline />
        </div>
      </div>
    </motion.div>
  );
}
