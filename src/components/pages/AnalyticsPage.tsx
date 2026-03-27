import { useState } from "react";
import { useLeads } from "@/context/LeadContext";
import { MetricRow } from "@/components/dashboard/MetricRow";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const dateRanges = ["This week", "This month", "Last 30 days", "All time"];

export function AnalyticsPage() {
  const { leads } = useLeads();
  const [range, setRange] = useState("This month");

  const b2bLeads = leads.filter(l => l.type === "B2B");
  const b2cLeads = leads.filter(l => l.type === "B2C");
  const hotLeads = leads.filter(l => l.status === "hot");
  const converted = leads.filter(l => l.state === "enrolled" || l.state === "deal");

  const bestSource = leads.filter(l => l.source === "ads").length > leads.filter(l => l.source === "apollo").length ? "Ads" : "Apollo";
  const bestICP = "Colleges";
  const convRate = leads.length > 0 ? ((converted.length / leads.length) * 100).toFixed(1) : "0";

  const metrics = [
    { label: "Best source", value: bestSource, delta: "highest volume", deltaType: "up" as const },
    { label: "B2B leads", value: b2bLeads.length.toString(), delta: `${Math.round((b2bLeads.length / Math.max(leads.length, 1)) * 100)}% of total`, deltaType: "up" as const },
    { label: "B2C leads", value: b2cLeads.length.toString(), delta: `${Math.round((b2cLeads.length / Math.max(leads.length, 1)) * 100)}% of total`, deltaType: "up" as const },
    { label: "Conversion", value: `${convRate}%`, delta: `${converted.length} converted`, deltaType: "up" as const },
  ];

  const conversionByICP = [
    { name: "Colleges", value: leads.filter(l => l.icp === "College partnerships").length, fill: "hsl(212, 65%, 37%)" },
    { name: "Career sw.", value: leads.filter(l => l.icp === "Career switcher").length, fill: "hsl(160, 55%, 37%)" },
    { name: "Students", value: leads.filter(l => l.icp === "College student").length, fill: "hsl(243, 38%, 55%)" },
    { name: "HR/L&D", value: leads.filter(l => l.icp === "HR / L&D heads").length, fill: "hsl(160, 40%, 60%)" },
    { name: "Skill learn.", value: leads.filter(l => l.icp === "Skill learner").length, fill: "hsl(34, 85%, 55%)" },
  ].filter(d => d.value > 0);

  const scoreDistribution = [
    { range: "0-30", count: leads.filter(l => l.score <= 30).length },
    { range: "31-50", count: leads.filter(l => l.score > 30 && l.score <= 50).length },
    { range: "51-70", count: leads.filter(l => l.score > 50 && l.score <= 70).length },
    { range: "71-85", count: leads.filter(l => l.score > 70 && l.score <= 85).length },
    { range: "86-100", count: leads.filter(l => l.score > 85).length },
  ];

  const sourceRevenue = [
    { name: "Ads", value: leads.filter(l => l.source === "ads").length * 11000 },
    { name: "Apollo", value: leads.filter(l => l.source === "apollo").length * 62000 },
    { name: "Upload", value: leads.filter(l => l.source === "upload").length * 8000 },
  ];

  const trendData = [
    { day: "Mon", leads: Math.round(leads.length * 0.12) },
    { day: "Tue", leads: Math.round(leads.length * 0.18) },
    { day: "Wed", leads: Math.round(leads.length * 0.15) },
    { day: "Thu", leads: Math.round(leads.length * 0.22) },
    { day: "Fri", leads: Math.round(leads.length * 0.2) },
    { day: "Sat", leads: Math.round(leads.length * 0.08) },
    { day: "Sun", leads: Math.round(leads.length * 0.05) },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Date range picker */}
      <div className="flex gap-1.5 mb-3">
        {dateRanges.map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`sdr-badge cursor-pointer transition-all ${r === range ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-accent"}`}
          >{r}</button>
        ))}
      </div>

      <MetricRow metrics={metrics} />

      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <div className="sdr-card">
          <div className="sdr-section-title">Leads by ICP</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={conversionByICP} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {conversionByICP.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="sdr-card">
          <div className="sdr-section-title">Score distribution</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 92%)" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(212, 65%, 37%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="sdr-card">
          <div className="sdr-section-title">Weekly lead trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 92%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="leads" stroke="hsl(160, 55%, 37%)" strokeWidth={2} dot={{ fill: "hsl(160, 55%, 37%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="sdr-card">
          <div className="sdr-section-title">Revenue by source (estimated)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sourceRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 92%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="value" fill="hsl(34, 85%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
