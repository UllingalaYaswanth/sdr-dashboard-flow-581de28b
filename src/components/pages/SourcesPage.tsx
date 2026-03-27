import { useState } from "react";
import { useLeads } from "@/context/LeadContext";
import { BarChart } from "@/components/dashboard/BarChart";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const sampleNames = [
  { name: "Amit Gupta", type: "B2C" as const, icp: "Career switcher", source: "ads" as const },
  { name: "Kavita Nair", type: "B2B" as const, icp: "College partnerships", source: "apollo" as const },
  { name: "Suresh Rao", type: "B2C" as const, icp: "College student", source: "ads" as const },
  { name: "Meera Desai", type: "B2C" as const, icp: "Skill learner", source: "upload" as const },
  { name: "Vikram Jha", type: "B2B" as const, icp: "HR / L&D heads", source: "apollo" as const },
];

export function SourcesPage() {
  const { leads, addLead } = useLeads();
  const [importing, setImporting] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "", type: "B2C", source: "ads" });

  const apolloCount = leads.filter(l => l.source === "apollo").length;
  const adsCount = leads.filter(l => l.source === "ads").length;
  const uploadCount = leads.filter(l => l.source === "upload").length;
  const total = leads.length;

  const handleSimulateImport = (source: string) => {
    setImporting(source);
    const sample = sampleNames.filter(s => s.source === source || (source === "upload" && s.source === "upload"))[0]
      || sampleNames[Math.floor(Math.random() * sampleNames.length)];

    setTimeout(() => {
      addLead({
        id: Date.now().toString(),
        name: sample.name,
        email: `${sample.name.toLowerCase().replace(" ", ".")}@example.com`,
        phone: "+91-9xxxxx" + Math.floor(1000 + Math.random() * 9000),
        type: sample.type,
        source: source as any,
        icp: sample.icp,
        score: Math.floor(40 + Math.random() * 40),
        fitScore: Math.floor(40 + Math.random() * 40),
        intentScore: Math.floor(20 + Math.random() * 50),
        timingScore: Math.floor(30 + Math.random() * 50),
        status: "new",
        state: "new",
        campaign: source === "apollo" ? "Apollo-Q2" : source === "ads" ? "Meta-DS-Mar" : "Client-Upload",
        location: "India",
        nextAction: "Score & route",
        lastActivity: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        intentEvents: [{ time: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }), action: `Imported from ${source}`, points: 5 }],
      });
      setImporting(null);
    }, 1200);
  };

  const handleAddLead = () => {
    if (!newLead.name || !newLead.email) return toast.error("Name and email required");
    addLead({
      id: Date.now().toString(),
      ...newLead,
      type: newLead.type as any,
      source: newLead.source as any,
      icp: newLead.type === "B2B" ? "College partnerships" : "Career switcher",
      score: Math.floor(30 + Math.random() * 40),
      fitScore: Math.floor(40 + Math.random() * 40),
      intentScore: Math.floor(10 + Math.random() * 30),
      timingScore: Math.floor(30 + Math.random() * 50),
      status: "new",
      state: "new",
      campaign: "Manual-add",
      location: "India",
      nextAction: "Score & qualify",
      lastActivity: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      intentEvents: [],
    });
    setNewLead({ name: "", email: "", phone: "", type: "B2C", source: "ads" });
    setShowAddForm(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="grid md:grid-cols-3 gap-3 mb-3">
        {/* Apollo */}
        <div className="sdr-card">
          <div className="flex items-center gap-2 mb-2.5">
            <Badge variant="secondary" className="sdr-badge bg-sdr-blue-light text-sdr-blue-dark">Apollo.io</Badge>
            <Badge variant="secondary" className="sdr-badge bg-[hsl(var(--badge-b2b-bg))] text-[hsl(var(--badge-b2b-fg))]">B2B</Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">Filter by ICP → export → enrich. Best for institutional deals.</p>
          <BarChart label="Leads imported" value={apolloCount.toString()} pct={Math.round((apolloCount / Math.max(total, 1)) * 100)} colorClass="bg-sdr-blue" />
          <button
            onClick={() => handleSimulateImport("apollo")}
            disabled={importing === "apollo"}
            className="w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-sdr-blue-light text-sdr-blue-dark rounded-md text-xs font-medium hover:bg-sdr-blue/20 transition-colors disabled:opacity-50"
          >
            {importing === "apollo" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            {importing === "apollo" ? "Importing..." : "Simulate Apollo import"}
          </button>
        </div>

        {/* Ads */}
        <div className="sdr-card">
          <div className="flex items-center gap-2 mb-2.5">
            <Badge variant="secondary" className="sdr-badge bg-sdr-green-light text-sdr-green-dark">Ads / inbound</Badge>
            <Badge variant="secondary" className="sdr-badge bg-[hsl(var(--badge-b2c-bg))] text-[hsl(var(--badge-b2c-fg))]">B2C</Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">Meta + Google ads → landing pages → WhatsApp / form fill.</p>
          <BarChart label="Leads captured" value={adsCount.toString()} pct={Math.round((adsCount / Math.max(total, 1)) * 100)} colorClass="bg-sdr-green" />
          <button
            onClick={() => handleSimulateImport("ads")}
            disabled={importing === "ads"}
            className="w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-sdr-green-light text-sdr-green-dark rounded-md text-xs font-medium hover:bg-sdr-green/20 transition-colors disabled:opacity-50"
          >
            {importing === "ads" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            {importing === "ads" ? "Capturing..." : "Simulate ad capture"}
          </button>
        </div>

        {/* Upload */}
        <div className="sdr-card">
          <div className="flex items-center gap-2 mb-2.5">
            <Badge variant="secondary" className="sdr-badge bg-sdr-orange-light text-sdr-orange">Client upload</Badge>
            <Badge variant="secondary" className="sdr-badge bg-[hsl(var(--badge-hybrid-bg))] text-[hsl(var(--badge-hybrid-fg))]">B2B + B2C</Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">CSV / Excel / old CRM. Cleaned & enriched before entering pipeline.</p>
          <BarChart label="Leads uploaded" value={uploadCount.toString()} pct={Math.round((uploadCount / Math.max(total, 1)) * 100)} colorClass="bg-sdr-orange" />
          <button
            onClick={() => handleSimulateImport("upload")}
            disabled={importing === "upload"}
            className="w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-sdr-orange-light text-sdr-orange rounded-md text-xs font-medium hover:bg-sdr-orange/20 transition-colors disabled:opacity-50"
          >
            {importing === "upload" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {importing === "upload" ? "Uploading..." : "Simulate CSV upload"}
          </button>
        </div>
      </div>

      {/* Manual add form */}
      <div className="sdr-card mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="sdr-section-title mb-0">Add lead manually</div>
          <button onClick={() => setShowAddForm(!showAddForm)} className="text-xs text-primary hover:underline">{showAddForm ? "Cancel" : "+ Add lead"}</button>
        </div>
        <AnimatePresence>
          {showAddForm && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-2">
                <input value={newLead.name} onChange={e => setNewLead(p => ({ ...p, name: e.target.value }))} placeholder="Name" className="bg-secondary border border-border rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                <input value={newLead.email} onChange={e => setNewLead(p => ({ ...p, email: e.target.value }))} placeholder="Email" className="bg-secondary border border-border rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                <input value={newLead.phone} onChange={e => setNewLead(p => ({ ...p, phone: e.target.value }))} placeholder="Phone" className="bg-secondary border border-border rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                <select value={newLead.type} onChange={e => setNewLead(p => ({ ...p, type: e.target.value }))} className="bg-secondary border border-border rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="B2C">B2C</option>
                  <option value="B2B">B2B</option>
                </select>
                <button onClick={handleAddLead} className="bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-sm font-medium hover:bg-primary/90 transition-colors">Add</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="sdr-card">
        <div className="sdr-section-title">Pipeline summary</div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-secondary rounded-md p-3">
            <div className="text-2xl font-medium text-sdr-blue">{apolloCount}</div>
            <div className="text-xs text-muted-foreground">Apollo (B2B)</div>
          </div>
          <div className="bg-secondary rounded-md p-3">
            <div className="text-2xl font-medium text-sdr-green">{adsCount}</div>
            <div className="text-xs text-muted-foreground">Ads (B2C)</div>
          </div>
          <div className="bg-secondary rounded-md p-3">
            <div className="text-2xl font-medium text-sdr-orange">{uploadCount}</div>
            <div className="text-xs text-muted-foreground">Upload</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
