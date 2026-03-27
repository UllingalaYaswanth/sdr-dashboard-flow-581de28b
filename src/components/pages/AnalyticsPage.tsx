import { useState } from "react";
import { useLeads } from "@/context/LeadContext";
import { MetricRow } from "@/components/dashboard/MetricRow";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { Brain, TrendingUp, Target, Zap } from "lucide-react";

const dateRanges = ["This week", "This month", "Last 30 days", "All time"];

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
      <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg text-sm">
        <p className="font-semibold mb-1 text-xs text-muted-foreground uppercase">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color || p.fill || COLORS.blue }} className="text-xs font-medium">
            {p.name || "Value"}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AnalyticsPage() {
  const { leads } = useLeads();
  const [range, setRange] = useState("This month");

  const b2bLeads = leads.filter(l => l.type === "B2B");
  const b2cLeads = leads.filter(l => l.type === "B2C");
  const converted = leads.filter(l => l.state === "enrolled" || l.state === "deal");
  const hotLeads = leads.filter(l => l.status === "hot");

  const bestSource = leads.filter(l => l.source === "ads").length > leads.filter(l => l.source === "apollo").length ? "Ads" : "Apollo";
  const convRate = leads.length > 0 ? ((converted.length / leads.length) * 100).toFixed(1) : "0";
  const avgScore = leads.length > 0 ? Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length) : 0;

  const metrics = [
    { label: "Best Source", value: bestSource, delta: "highest volume", deltaType: "up" as const },
    { label: "Avg Lead Score", value: avgScore.toString(), delta: "across pipeline", deltaType: "up" as const },
    { label: "Hot Rate", value: `${leads.length > 0 ? Math.round((hotLeads.length / leads.length) * 100) : 0}%`, delta: `${hotLeads.length} urgent`, deltaType: "up" as const },
    { label: "Conversion", value: `${convRate}%`, delta: `${converted.length} closed`, deltaType: "up" as const },
  ];

  const icpData = [
    { name: "Colleges", value: leads.filter(l => l.icp === "College partnerships").length, fill: COLORS.blue },
    { name: "Career sw.", value: leads.filter(l => l.icp === "Career switcher").length, fill: COLORS.green },
    { name: "Students", value: leads.filter(l => l.icp === "College student").length, fill: COLORS.purple },
    { name: "HR/L&D", value: leads.filter(l => l.icp === "HR / L&D heads").length, fill: COLORS.teal },
    { name: "Skill learn.", value: leads.filter(l => l.icp === "Skill learner").length, fill: COLORS.orange },
  ].filter(d => d.value > 0);

  const scoreDistribution = [
    { range: "0–30", count: leads.filter(l => l.score <= 30).length, fill: COLORS.red },
    { range: "31–50", count: leads.filter(l => l.score > 30 && l.score <= 50).length, fill: COLORS.orange },
    { range: "51–70", count: leads.filter(l => l.score > 50 && l.score <= 70).length, fill: COLORS.blue },
    { range: "71–85", count: leads.filter(l => l.score > 70 && l.score <= 85).length, fill: COLORS.teal },
    { range: "86–100", count: leads.filter(l => l.score > 85).length, fill: COLORS.green },
  ];

  const sourcePerformance = [
    { name: "Apollo", leads: leads.filter(l => l.source === "apollo").length, conversion: leads.filter(l => l.source === "apollo" && (l.state === "enrolled" || l.state === "deal")).length },
    { name: "Ads", leads: leads.filter(l => l.source === "ads").length, conversion: leads.filter(l => l.source === "ads" && (l.state === "enrolled" || l.state === "deal")).length },
    { name: "Upload", leads: leads.filter(l => l.source === "upload").length, conversion: leads.filter(l => l.source === "upload" && (l.state === "enrolled" || l.state === "deal")).length },
  ];

  const trendData = [
    { day: "Mon", leads: Math.round(leads.length * 0.12), conversions: Math.round(converted.length * 0.10) },
    { day: "Tue", leads: Math.round(leads.length * 0.18), conversions: Math.round(converted.length * 0.20) },
    { day: "Wed", leads: Math.round(leads.length * 0.15), conversions: Math.round(converted.length * 0.15) },
    { day: "Thu", leads: Math.round(leads.length * 0.22), conversions: Math.round(converted.length * 0.25) },
    { day: "Fri", leads: Math.round(leads.length * 0.20), conversions: Math.round(converted.length * 0.18) },
    { day: "Sat", leads: Math.round(leads.length * 0.08), conversions: Math.round(converted.length * 0.07) },
    { day: "Sun", leads: Math.round(leads.length * 0.05), conversions: Math.round(converted.length * 0.05) },
  ];

  const channelMetrics = [
    { channel: "WhatsApp", openRate: 87, replyRate: 42, fill: COLORS.green },
    { channel: "Email", openRate: 34, replyRate: 12, fill: COLORS.blue },
    { channel: "LinkedIn", openRate: 56, replyRate: 28, fill: COLORS.purple },
    { channel: "Call", openRate: 71, replyRate: 58, fill: COLORS.orange },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Date range selector */}
      <div className="flex gap-1.5 mb-4">
        {dateRanges.map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`sdr-badge cursor-pointer transition-all ${r === range ? "bg-[hsl(var(--ai-blue))] text-white" : "bg-secondary text-muted-foreground hover:bg-accent"}`}
          >{r}</button>
        ))}
      </div>

      <MetricRow metrics={metrics} />

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* ICP breakdown */}
        <div className="sdr-card">
          <div className="sdr-section-title">
            <Target className="w-3.5 h-3.5" />
            Leads by ICP
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={icpData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {icpData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-1">
            {icpData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.fill }} />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="font-semibold ml-auto">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Score distribution */}
        <div className="sdr-card">
          <div className="sdr-section-title">
            <Brain className="w-3.5 h-3.5" />
            Score Distribution
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scoreDistribution} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {scoreDistribution.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Weekly trend */}
        <div className="sdr-card">
          <div className="sdr-section-title">
            <TrendingUp className="w-3.5 h-3.5" />
            Weekly Lead Trend
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={COLORS.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="leads" name="Leads" stroke={COLORS.blue} strokeWidth={2} fill="url(#leadsGrad)" dot={false} />
              <Area type="monotone" dataKey="conversions" name="Conversions" stroke={COLORS.green} strokeWidth={2} fill="url(#convGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Source performance */}
        <div className="sdr-card">
          <div className="sdr-section-title">
            <Zap className="w-3.5 h-3.5" />
            Source Performance
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sourcePerformance} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="leads" name="Leads" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
              <Bar dataKey="conversion" name="Conversions" fill={COLORS.green} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Channel effectiveness */}
      <div className="sdr-card">
        <div className="sdr-section-title">
          <Brain className="w-3.5 h-3.5" />
          Channel Effectiveness
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {channelMetrics.map(ch => (
            <div key={ch.channel} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{ch.channel}</span>
                <span className="text-xs text-muted-foreground">{ch.replyRate}% reply</span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Open rate</span>
                  <span className="text-xs font-bold">{ch.openRate}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${ch.openRate}%` }} transition={{ duration: 0.7, delay: 0.2 }}
                    className="h-full rounded-full" style={{ background: ch.fill }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Reply rate</span>
                  <span className="text-xs font-bold">{ch.replyRate}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${ch.replyRate}%` }} transition={{ duration: 0.7, delay: 0.3 }}
                    className="h-full rounded-full" style={{ background: ch.fill, opacity: 0.6 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
