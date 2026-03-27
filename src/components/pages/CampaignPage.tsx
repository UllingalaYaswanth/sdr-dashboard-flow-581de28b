import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Send,
  MailOpen,
  MessageSquare,
  Star,
  Play,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Sparkles,
  Loader2,
  Mail,
  Phone,
  Calendar,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Target,
  Zap,
  Filter,
  Search,
  MoreVertical,
  CheckCircle2,
  Clock,
  Bot,
  Building2,
  MapPin,
  Brain,
} from "lucide-react";
import { toast } from "sonner";
import LeadProfilePage from "./LeadProfilePage";
import LeadFunnelPage from "./LeadFunnelPage";

// ─── Types ─────────────────────────────────────────────────────────────────
interface Campaign {
  id: string;
  name: string;
  status: "running" | "paused" | "draft";
  target: string;
  sent: number;
  opens: number;
  replies: number;
  interested: number;
  channel: string;
  createdAt: string;
  color: string;
}

interface CampaignLead {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  email: string;
  phone: string;
  whatsapp: string;
  score: number;
  fitScore: number;
  intentScore: number;
  timingScore: number;
  status: "searching" | "enriching" | "sending" | "contacted" | "replied" | "interested" | "meeting" | "not_interested";
  lastTouch: string;
  course: string;
  channel: "email" | "whatsapp" | "call" | "meeting" | null;
  group: string;
  // SDR specific fields
  qualification: string;
  intent: string;
  readiness: string;
  behavior: string;
  fit: string;
  objections: string;
  pipelineStatus: string;
  advancedSdrLanguage: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
const mockCampaigns: Campaign[] = [
  {
    id: "c1",
    name: "EdTech Colleges Q2",
    status: "running",
    target: "College Directors & VP Academics",
    sent: 1240,
    opens: 558,
    replies: 86,
    interested: 21,
    channel: "Email",
    createdAt: "2024-03-15",
    color: "hsl(var(--ai-blue))",
  },
  {
    id: "c2",
    name: "Career Switchers Mar",
    status: "running",
    target: "Software Engineers with 2y exp",
    sent: 780,
    opens: 312,
    replies: 42,
    interested: 12,
    channel: "LinkedIn",
    createdAt: "2024-03-10",
    color: "hsl(var(--ai-green))",
  },
  {
    id: "c3",
    name: "HR L&D Enterprise",
    status: "running",
    target: "CHROs & L&D Managers",
    sent: 320,
    opens: 134,
    replies: 14,
    interested: 4,
    channel: "WhatsApp",
    createdAt: "2024-03-20",
    color: "hsl(var(--ai-orange))",
  },
];

const generateLeads = (inputs: WizardInputs): CampaignLead[] => {
  const target = (inputs.targetAudience || "").toLowerCase();
  const courseName = inputs.courseName || "AI Growth Program";

  const allPools: Record<string, { name: string; role: string; company: string; location: string }[]> = {
    college: [
      { name: "Priya Sharma", role: "VP Academics", company: "Amity University", location: "Noida" },
      { name: "Vikram Saxena", role: "Dean – Engineering", company: "VIT University", location: "Vellore" },
      { name: "Sunita Rao", role: "Director – Placements", company: "Manipal Institute", location: "Manipal" },
      { name: "Kartik Verma", role: "HOD – CS", company: "BITS Pilani", location: "Pilani" },
      { name: "Meera Pillai", role: "Head – Student Affairs", company: "SRM University", location: "Chennai" },
    ],
    edtech: [
      { name: "Aisha Khan", role: "Program Director", company: "BYJU's", location: "Delhi" },
      { name: "Rohan Gupta", role: "VP Growth", company: "PhysicsWallah", location: "Lucknow" },
      { name: "Sneha Iyer", role: "Head – Curriculum", company: "NIIT", location: "Chennai" },
      { name: "Arjun Kapoor", role: "Head of Partnerships", company: "UpGrad", location: "Mumbai" },
      { name: "Divya Menon", role: "Content Lead", company: "Unacademy", location: "Bengaluru" },
    ],
    corporate: [
      { name: "Rahul Mehta", role: "L&D Manager", company: "Infosys", location: "Bengaluru" },
      { name: "Deepa Nair", role: "CHRO", company: "TCS Digital", location: "Pune" },
      { name: "Sanjay Bhatia", role: "Head – Training", company: "Wipro", location: "Hyderabad" },
      { name: "Anjali Sinha", role: "VP – People", company: "HCL Technologies", location: "Noida" },
      { name: "Ramesh Kumar", role: "Talent Development Lead", company: "Capgemini", location: "Mumbai" },
    ],
    default: [
      { name: "Priya Sharma", role: "VP Academics", company: "Amity University", location: "Noida" },
      { name: "Rahul Mehta", role: "L&D Manager", company: "Infosys", location: "Bengaluru" },
      { name: "Sneha Iyer", role: "Director – Placements", company: "NIIT", location: "Chennai" },
      { name: "Arjun Kapoor", role: "Head of Partnerships", company: "UpGrad", location: "Mumbai" },
      { name: "Deepa Nair", role: "CHRO", company: "TCS Digital", location: "Pune" },
      { name: "Vikram Saxena", role: "Dean – Engineering", company: "VIT University", location: "Vellore" },
      { name: "Aisha Khan", role: "Program Director", company: "BYJU's", location: "Delhi" },
      { name: "Rohan Gupta", role: "VP Growth", company: "PhysicsWallah", location: "Lucknow" },
    ],
  };

  const extraLeads = [
    { name: "Kavya Reddy", role: "Director – Industry Relations", company: "IIT Hyderabad", location: "Hyderabad" },
    { name: "Manish Tiwari", role: "Academic Head", company: "Lovely Professional University", location: "Jalandhar" },
    { name: "Shalini Agarwal", role: "VP – Corporate Training", company: "Deloitte India", location: "Delhi" },
    { name: "Prakash Iyer", role: "Head – EdTech Partnerships", company: "Simply Learn", location: "Bengaluru" },
  ];

  let pool = target.includes("college") || target.includes("director") || target.includes("dean") || target.includes("academic")
    ? allPools.college
    : target.includes("edtech") || target.includes("career") || target.includes("student")
      ? allPools.edtech
      : target.includes("hr") || target.includes("l&d") || target.includes("chro") || target.includes("enterprise")
        ? allPools.corporate
        : allPools.default;

  const combined = [...pool, ...extraLeads].slice(0, 12);
  const groups = ["Tier-1 Institutes", "Corporate L&D Leads", "EdTech Growth Contacts"];
  const statuses: CampaignLead["status"][] = ["enriching", "searching", "contacted", "replied", "interested", "searching", "contacted", "replied", "enriching", "sending", "interested", "contacted"];

  const sdrData = {
    qual: ["Qualified Lead", "Target Account", "Persona Fit", "Decision Maker", "Influence", "Champion"],
    intent: ["Hot Lead", "Warm Lead", "Inbound Lead", "High Intent", "Engaged", "Active Prospect"],
    readiness: ["Budget Confirmed", "Need Identified", "Pain Point", "Urgency", "Buying Signal"],
    behavior: ["Opened Email", "Clicked Link", "Replied", "Booked Demo", "Multiple Touchpoints"],
    fit: ["Company Size Fit", "Industry Fit", "Geography Fit", "Use Case Fit", "Tech Stack Match"],
    objections: ["None", "Timing Issue", "Already Using Competitor", "No Response", "Ghosted"],
    pipeline: ["New Lead", "Contacted", "Working Lead", "Nurturing", "Meeting Scheduled", "Opportunity Created"],
    advanced: ["Strong Signal Lead", "High Fit, Low Intent", "Sales Ready", "Needs Nurture", "Pipeline Builder", "Quick Win"]
  };

  const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  return combined.map((n, i) => {
    const fs = Math.floor(Math.random() * 15) + 80;
    const is = Math.floor(Math.random() * 20) + 75;
    const ts = Math.floor(Math.random() * 25) + 70;
    const totalScore = Math.floor((fs * 0.35) + (is * 0.40) + (ts * 0.25));

    return {
      id: `lead-${Date.now()}-${i}`,
      name: n.name,
      role: n.role,
      company: n.company,
      location: n.location,
      email: `${n.name.split(" ")[0].toLowerCase()}@${n.company.replace(/\s/g, "").toLowerCase()}.com`,
      phone: `+91-9${800 + i}xxxx${1000 + i}`,
      whatsapp: `+91-9${800 + i}xxxx${1000 + i}`,
      score: totalScore,
      fitScore: fs,
      intentScore: is,
      timingScore: ts,
      status: statuses[i % statuses.length],
      lastTouch: `${27 - (i % 7)} Mar`,
      course: courseName,
      channel: null,
      group: groups[i % groups.length],
      qualification: getRandom(sdrData.qual),
      intent: getRandom(sdrData.intent),
      readiness: getRandom(sdrData.readiness),
      behavior: getRandom(sdrData.behavior),
      fit: getRandom(sdrData.fit),
      objections: getRandom(sdrData.objections),
      pipelineStatus: getRandom(sdrData.pipeline),
      advancedSdrLanguage: getRandom(sdrData.advanced),
    };
  });
};


// ─── Wizard types ────────────────────────────────────────────────────────────
interface WizardInputs {
  campaignName: string;
  courseName: string;
  productUrl: string;
  duration: string;
  price: string;
  guarantee: string;
  placementRate: string;
  avgCTC: string;
  targetAudience: string;
  location: string;
  industry: string;
  channels: string[];
  budget: string;
}

const defaultWizard: WizardInputs = {
  campaignName: "",
  courseName: "",
  productUrl: "",
  duration: "",
  price: "",
  guarantee: "",
  placementRate: "",
  avgCTC: "",
  targetAudience: "",
  location: "",
  industry: "",
  channels: [],
  budget: "",
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, trend, icon: Icon, color }: {
  label: string; value: string; sub: string; trend: "up" | "down" | "neutral"; icon: any; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="sdr-card flex items-start gap-3"
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
        <Icon className="w-4.5 h-4.5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-muted-foreground mb-0.5">{label}</div>
        <div className="text-xl font-bold">{value}</div>
        <div className="flex items-center gap-1 mt-0.5">
          {trend === "up" && <TrendingUp className="w-3 h-3" style={{ color: "hsl(var(--ai-green))" }} />}
          {trend === "down" && <TrendingDown className="w-3 h-3 text-red-400" />}
          {trend === "neutral" && <Minus className="w-3 h-3 text-muted-foreground" />}
          <span className="text-[11px]" style={{ color: trend === "up" ? "hsl(var(--ai-green))" : trend === "down" ? "#f87171" : "hsl(var(--muted-foreground))" }}>{sub}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Channel Toggle ───────────────────────────────────────────────────────────
function ChannelToggle({ value, checked, onChange }: { value: string; checked: boolean; onChange: (v: string) => void }) {
  const labels: Record<string, string> = { email: "✉️ Email", whatsapp: "💬 WhatsApp", call: "📞 Call", linkedin: "🔗 LinkedIn", sms: "📱 SMS" };
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${checked ? "border-[hsl(var(--ai-blue))] text-[hsl(var(--ai-blue))]" : "border-border text-muted-foreground hover:border-border/80"}`}
      style={checked ? { background: "hsl(var(--ai-blue)/0.1)" } : {}}
    >
      {labels[value]}
    </button>
  );
}

// ─── Lead Status Badge ────────────────────────────────────────────────────────
const statusStyle: Record<CampaignLead["status"], { bg: string; fg: string; label: string }> = {
  searching: { bg: "hsl(var(--badge-new-bg))", fg: "hsl(var(--badge-new-fg))", label: "Searching" },
  enriching: { bg: "hsl(var(--badge-ai-bg))", fg: "hsl(var(--badge-ai-fg))", label: "Enriching" },
  sending: { bg: "hsl(var(--ai-blue)/0.1)", fg: "hsl(var(--ai-blue))", label: "Sending" },
  contacted: { bg: "hsl(var(--badge-b2b-bg))", fg: "hsl(var(--badge-b2b-fg))", label: "Contacted" },
  replied: { bg: "hsl(var(--badge-warm-bg))", fg: "hsl(var(--badge-warm-fg))", label: "Replied" },
  interested: { bg: "hsl(var(--badge-done-bg))", fg: "hsl(var(--badge-done-fg))", label: "Interested" },
  meeting: { bg: "hsl(var(--badge-b2c-bg))", fg: "hsl(var(--badge-b2c-fg))", label: "Meeting" },
  not_interested: { bg: "hsl(var(--muted))", fg: "hsl(var(--muted-foreground))", label: "Not Interested" },
};


// ─── Create Campaign Wizard ───────────────────────────────────────────────────
function CampaignWizard({ onClose, onCreate, onViewProfile }: { onClose: () => void; onCreate: (inputs: WizardInputs) => void; onViewProfile: (lead: CampaignLead) => void }) {
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState<WizardInputs>(defaultWizard);
  const totalSteps = 2;

  const set = (key: keyof WizardInputs, val: string) => setInputs(p => ({ ...p, [key]: val }));
  const toggleChannel = (ch: string) => setInputs(p => ({
    ...p,
    channels: p.channels.includes(ch) ? p.channels.filter(c => c !== ch) : [...p.channels, ch],
  }));

  useEffect(() => {
    if (step === 2 && !inputs.targetAudience) {
      const timer = setTimeout(() => {
        set("targetAudience", "College Placement Heads & VP Academics");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, inputs.targetAudience]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-[-10px] z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-2xl rounded-2xl border border-border shadow-2xl overflow-hidden"
        style={{ background: "hsl(var(--background))" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: "hsl(var(--ai-blue))" }} />
              Create AI Campaign
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">Step {step} of {totalSteps}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-secondary">
          <motion.div className="h-full rounded-full" style={{ background: "hsl(var(--ai-blue))", width: `${(step / totalSteps) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>

        {/* Steps */}
        <div className="px-5 py-5">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                {/* Campaign name */}
                <div>
                  <div className="text-sm font-semibold mb-1">Campaign Name *</div>
                  <input
                    value={inputs.campaignName}
                    onChange={e => set("campaignName", e.target.value)}
                    placeholder="e.g. EdTech Colleges Q2 2025"
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all"
                  />
                </div>

                {/* Divider */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Product / Course</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* Course name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Course / Product Name</label>
                    <input
                      value={inputs.courseName}
                      onChange={e => set("courseName", e.target.value)}
                      placeholder="Full-Stack Data Science"
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Course / Product URL</label>
                    <input
                      value={inputs.productUrl}
                      onChange={e => set("productUrl", e.target.value)}
                      placeholder="https://oyesell.com/course"
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all"
                    />
                  </div>
                </div>

                {/* Duration, Price, Guarantee row */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Duration</label>
                    <input
                      value={inputs.duration}
                      onChange={e => set("duration", e.target.value)}
                      placeholder="6-month online"
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Price</label>
                    <input
                      value={inputs.price}
                      onChange={e => set("price", e.target.value)}
                      placeholder="₹49,000"
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Guarantee / USP</label>
                    <input
                      value={inputs.guarantee}
                      onChange={e => set("guarantee", e.target.value)}
                      placeholder="Job guarantee"
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all"
                    />
                  </div>
                </div>

                {/* Outcomes row */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Outcomes</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">Placement</span>
                      <input
                        value={inputs.placementRate}
                        onChange={e => set("placementRate", e.target.value)}
                        placeholder="93%"
                        className="w-full bg-secondary border border-border rounded-xl pl-20 pr-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all"
                        style={{ color: "hsl(var(--ai-green))" }}
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">Avg CTC</span>
                      <input
                        value={inputs.avgCTC}
                        onChange={e => set("avgCTC", e.target.value)}
                        placeholder="₹8.4 LPA"
                        className="w-full bg-secondary border border-border rounded-xl pl-16 pr-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all"
                        style={{ color: "hsl(var(--ai-blue))" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Outcome preview pill */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] rounded-full px-2.5 py-1 font-medium" style={{ background: "hsl(var(--badge-done-bg))", color: "hsl(var(--badge-done-fg))" }}>
                    🎯 {inputs.placementRate || "93%"} placement rate
                  </span>
                  <span className="text-[10px] rounded-full px-2.5 py-1 font-medium" style={{ background: "hsl(var(--badge-ai-bg))", color: "hsl(var(--badge-ai-fg))" }}>
                    💼 Avg CTC {inputs.avgCTC || "₹8.4 LPA"}
                  </span>
                </div>

                {/* Communication Channels */}
                <div className="pt-2 border-t border-border">
                  <div className="text-xs font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-[hsl(var(--ai-blue))]" />
                    Communication Channels *
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["email", "whatsapp", "linkedin", "call", "sms"].map(ch => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => toggleChannel(ch)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${inputs.channels.includes(ch) ? "border-[hsl(var(--ai-blue))] bg-[hsl(var(--ai-blue)/0.1)] text-[hsl(var(--ai-blue))]" : "border-border hover:border-border/80 text-muted-foreground bg-secondary/30"}`}
                      >
                        {ch === 'email' && <Mail className="w-3.5 h-3.5" />}
                        {ch === 'whatsapp' && <MessageCircle className="w-3.5 h-3.5" />}
                        {ch === 'linkedin' && <Target className="w-3.5 h-3.5" />}
                        {ch === 'call' && <Phone className="w-3.5 h-3.5" />}
                        {ch === 'sms' && <MessageSquare className="w-3.5 h-3.5" />}
                        <span className="text-xs font-medium capitalize">{ch}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold">Is this your ICP?</h3>
                  <p className="text-xs text-muted-foreground">AI has identified the ideal human profile for your campaign</p>
                </div>

                <div className="relative group mx-auto max-w-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--ai-blue))] to-[hsl(var(--ai-purple))] rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                  <div className="relative bg-secondary/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[hsl(var(--ai-blue))] to-[hsl(var(--ai-purple))] flex items-center justify-center text-3xl shadow-lg border-2 border-white/20">
                        👨‍🏫
                      </div>
                      <div>
                        <div className="text-xl font-bold">Arjun Mehta</div>
                        <div className="text-sm text-[hsl(var(--ai-blue))] font-semibold">VP Academics & Partnerships</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-[11px] text-muted-foreground">Tier-1 Engineering Colleges</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-3 bg-background/50 rounded-xl border border-border/50">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1 flex items-center gap-1">
                          <Target className="w-3 h-3" /> Focus Area
                        </div>
                        <div className="text-xs">University-corporate partnerships, placement excellence, and curriculum modernization.</div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-background/50 rounded-xl border border-border/50">
                          <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-[hsl(var(--ai-orange))]" /> Pain Point
                          </div>
                          <div className="text-xs">Stagnant placement records and lack of industry-ready talent.</div>
                        </div>
                        <div className="p-3 bg-background/50 rounded-xl border border-border/50">
                          <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1 flex items-center gap-1">
                            <Search className="w-3 h-3 text-[hsl(var(--ai-blue))]" /> Intent Signal
                          </div>
                          <div className="text-xs">Active searching for "Branded EdTech Partnership" solutions.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-center text-muted-foreground px-12">
                  This persona matches your course value prop. AI will prioritize leads with these exact seniority and intent signals.
                </p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="p-4 rounded-xl border border-dashed border-[hsl(var(--ai-blue)/0.3)] bg-[hsl(var(--ai-blue)/0.03)]">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-[hsl(var(--ai-blue))]" />
                    <span className="text-sm font-semibold">Discovery Results (131 matching leads found)</span>
                  </div>
                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                    {generateLeads(inputs).map((l, i) => (
                      <motion.div
                        key={l.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewProfile(l);
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/50 border border-border cursor-pointer hover:border-[hsl(var(--ai-blue))] transition-all group"
                      >
                        <div className="w-8 h-8 rounded-full bg-[hsl(var(--ai-blue)/0.1)] flex items-center justify-center text-[10px] font-bold text-[hsl(var(--ai-blue))] flex-shrink-0">
                          {l.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold truncate">{l.name}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{l.role} · {l.company}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="px-4 py-3 rounded-xl text-xs flex items-center gap-3 bg-[hsl(var(--badge-ai-bg))] text-[hsl(var(--badge-ai-fg))]">
                  <Zap className="w-4 h-4 flex-shrink-0 text-[hsl(var(--ai-blue))]" />
                  <div>
                    <span className="font-bold">Auto-Outreach Ready:</span> AI will start the sequence on {inputs.channels.join(" & ")} immediately after launch.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border flex items-center justify-between">
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors text-muted-foreground"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {step === 1 ? "Cancel" : "Back"}
          </button>
          <button
            onClick={() => step < totalSteps ? setStep(s => s + 1) : onCreate(inputs)}
            disabled={step === 1 && !inputs.campaignName.trim()}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: "hsl(var(--ai-blue))" }}
          >
            {step === totalSteps ? (
              <><Zap className="w-3.5 h-3.5" />Launch & Auto-Send Outreach</>
            ) : (
              <>Next<ChevronRight className="w-3.5 h-3.5" /></>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "hsl(var(--ai-green))" : score >= 60 ? "hsl(var(--ai-orange))" : "hsl(var(--ai-red))";
  return (
    <div className="relative w-9 h-9 flex items-center justify-center">
      <svg className="absolute inset-0 w-9 h-9 -rotate-90">
        <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" />
        <circle cx="18" cy="18" r="14" fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={`${(score / 100) * 88} 88`} strokeLinecap="round" />
      </svg>
      <span className="text-[9px] font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function CampaignPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [showWizard, setShowWizard] = useState(false);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [leads, setLeads] = useState<CampaignLead[]>([]);
  const [generatingLeads, setGeneratingLeads] = useState(false);
  const [leadsVisible, setLeadsVisible] = useState(false);
  const [profileLead, setProfileLead] = useState<CampaignLead | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [campaignInputs, setCampaignInputs] = useState<WizardInputs | null>(null);
  // Email preview phase
  const [emailsVisible, setEmailsVisible] = useState(false);
  const [emailDrafts, setEmailDrafts] = useState<Record<string, string>>({});
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
  // Launch phase
  const [launching, setLaunching] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);
  const [launched, setLaunched] = useState(false);
  // Live stats
  const [liveStats, setLiveStats] = useState({ sent: 0, delivered: 0, opened: 0, replied: 0, interested: 0, meetings: 0 });
  const [activityFeed, setActivityFeed] = useState<{ id: number; text: string; time: string; type: string }[]>([]);
  const [statsRunning, setStatsRunning] = useState(false);
  const [detailView, setDetailView] = useState<"stats" | "leads" | "funnel">("stats");

  const totalSent = campaigns.reduce((a, c) => a + c.sent, 0);
  const totalOpens = campaigns.reduce((a, c) => a + c.opens, 0);
  const totalReplies = campaigns.reduce((a, c) => a + c.replies, 0);
  const totalInterested = campaigns.reduce((a, c) => a + c.interested, 0);
  const openRate = totalSent > 0 ? ((totalOpens / totalSent) * 100).toFixed(1) : "0";
  const replyRate = totalSent > 0 ? ((totalReplies / totalSent) * 100).toFixed(0) : "0";

  const handleCreate = (inputs: WizardInputs) => {
    setShowWizard(false);
    setGeneratingLeads(true);
    setLeadsVisible(false);
    setEmailsVisible(false);
    setLaunched(false);
    setStatsRunning(false);
    setLaunchProgress(0);
    setActivityFeed([]);
    setLiveStats({ sent: 0, delivered: 0, opened: 0, replied: 0, interested: 0, meetings: 0 });
    setCampaignInputs(inputs);
    const newCampaign: Campaign = {
      id: `c${Date.now()}`,
      name: inputs.campaignName || "Untitled Campaign",
      status: "running",
      target: inputs.targetAudience,
      sent: 0, opens: 0, replies: 0, interested: 0,
      channel: inputs.channels && inputs.channels.length > 0 ? inputs.channels.join(" + ") : "Email",
      createdAt: "Today",
      color: "hsl(var(--ai-teal))",
    };
    setCampaigns(p => [...p, newCampaign]);
    setActiveCampaignId(newCampaign.id);
    toast.success("Campaign created! AI is generating leads…");
    const generated = generateLeads(inputs);
    const drafts: Record<string, string> = {};
    generated.forEach(l => {
      drafts[l.id] =
        `Hi ${l.name.split(" ")[0]},\n\n` +
        `I came across ${l.company} and your role as ${l.role} — wanted to reach out personally.\n\n` +
        `We\'re working with institutions on our ${inputs.courseName || "program"} (${inputs.duration || "structured program"}). ` +
        `Given the pressure around placements, this could be a strong fit:\n\n` +
        `\u2022 ${inputs.placementRate || "High"} placement rate \u2014 Avg package ${inputs.avgCTC || "competitive"}\n` +
        `\u2022 ${inputs.guarantee || "Outcome-backed program"}\n` +
        `\u2022 Pricing: ${inputs.price || "Flexible"} \u2014 fully managed delivery\n\n` +
        (inputs.productUrl ? `Learn more: ${inputs.productUrl}\n\n` : "") +
        `Would you be open to a 15-min call this week to explore if this makes sense for ${l.company}?\n\n` +
        `Looking forward to connecting,\nOyeSell AI`;
    });
    setEmailDrafts(drafts);
    setTimeout(() => {
      setLeads(generated);
      setGeneratingLeads(false);
      setLeadsVisible(true);
      toast.success(`${generated.length} high-intent leads found & verified 🎯`);

      // Auto-triggering the outreach launch as requested
      setTimeout(() => {
        handleLaunch();
      }, 1000);
    }, 2000);
  };

  const handleLeadAction = (id: string, channel: CampaignLead["channel"]) => {
    setLeads(p => p.map(l => l.id === id ? { ...l, channel, status: channel === "meeting" ? "meeting" : channel ? "contacted" : l.status } : l));
  };

  const startLiveStats = (total: number, feed: { text: string; type: string }[]) => {
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      setLiveStats(prev => ({
        sent: Math.min(prev.sent + Math.floor(Math.random() * 2 + 1), total),
        delivered: Math.min(prev.delivered + Math.floor(Math.random() * 2), total),
        opened: Math.min(prev.opened + (tick % 3 === 0 ? 1 : 0), Math.floor(total * 0.45)),
        replied: Math.min(prev.replied + (tick % 8 === 0 ? 1 : 0), Math.floor(total * 0.12)),
        interested: Math.min(prev.interested + (tick % 13 === 0 ? 1 : 0), Math.floor(total * 0.05)),
        meetings: Math.min(prev.meetings + (tick % 19 === 0 ? 1 : 0), Math.floor(total * 0.025)),
      }));
      if (feed[tick - 1]) {
        const item = feed[tick - 1];
        const now = new Date();
        setActivityFeed(prev => [{ id: tick, text: item.text, type: item.type, time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}` }, ...prev.slice(0, 14)]);
      }
      if (tick >= 70) clearInterval(interval);
    }, 750);
  };

  const handleLaunch = () => {
    setLaunching(true);
    setEmailsVisible(false);
    let prog = 0;
    const feedTexts: { text: string; type: string }[] = [
      ...leads.map(l => ({ text: `${l.name} (${l.company}) — AI SDR found & verified`, type: "searching" })),
      ...leads.map(l => ({ text: `${l.name} — Enriching profiles from Apollo & LinkedIn`, type: "enriching" })),
      ...leads.map(l => ({ text: `${l.name} — Initial outreach sent via Email`, type: "sending" })),
      ...leads.filter((_, i) => i % 2 === 0).map(l => ({ text: `${l.name} — Email opened`, type: "open" })),
      ...leads.filter((_, i) => i % 3 === 0).map(l => ({ text: `${l.name} — Replied: "Sounds interesting!"`, type: "reply" })),
      ...leads.filter((_, i) => i % 5 === 0).map(l => ({ text: `${l.name} — Status updated: Interested`, type: "interest" })),
      ...leads.filter((_, i) => i % 7 === 0).map(l => ({ text: `${l.name} — Demo booked & timing allotted`, type: "meeting" })),
    ].sort(() => Math.random() - 0.5);
    const iv = setInterval(() => {
      prog += Math.random() * 16 + 5;
      if (prog >= 100) {
        clearInterval(iv);
        setLaunchProgress(100);
        setLaunching(false);
        setLaunched(true);
        const channels = campaignInputs?.channels || ["email"];
        toast.success(`Campaign launched! AI is auto-sending outreach via ${channels.join(" & ")} ✨`);
        setStatsRunning(true);
        startLiveStats(leads.length, feedTexts);
      } else {
        setLaunchProgress(Math.min(prog, 100));
      }
    }, 180);
  };

  const activeCampaign = campaigns.find(c => c.id === activeCampaignId);
  const filteredLeads = leads.filter(l => {
    const matchQuery = !searchQuery || l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchQuery && matchStatus;
  });

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

        <AnimatePresence mode="wait">
          {profileLead ? (
            <LeadProfilePage key="profile" lead={profileLead} onBack={() => setProfileLead(null)} />
          ) : !activeCampaignId ? (
            <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
              {/* ── Header ── */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4" style={{ color: "hsl(var(--ai-blue))" }} />
                    Campaigns
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Your AI-powered outreach engine</p>
                </div>
                <button
                  onClick={() => setShowWizard(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, hsl(var(--ai-blue)), hsl(var(--ai-purple)))" }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Campaign
                </button>
              </div>

              {/* ── Stats row ── */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <StatCard label="Total Sent" value={totalSent.toLocaleString()} sub="↑ 18% this week" trend="up" icon={Send} color="hsl(var(--ai-blue))" />
                <StatCard label="Open Rate" value={`${openRate}%`} sub="↑ 6 vs last month" trend="up" icon={MailOpen} color="hsl(var(--ai-purple))" />
                <StatCard label="Replies" value={totalReplies.toString()} sub={`→ ${replyRate}% reply rate`} trend="neutral" icon={MessageSquare} color="hsl(var(--ai-orange))" />
                <StatCard label="Interested" value={totalInterested.toString()} sub="↑ 3 new today" trend="up" icon={Star} color="hsl(var(--ai-green))" />
                <StatCard label="Active Campaigns" value={campaigns.filter(c => c.status === "running").length.toString()} sub="running" trend="neutral" icon={Play} color="hsl(var(--ai-teal))" />
              </div>

              {/* ── Active Campaigns ── */}
              <div>
                <div className="sdr-section-title mb-2">
                  <Target className="w-3.5 h-3.5" />
                  Active Campaigns
                </div>
                <div className="space-y-2">
                  {campaigns.map((c, i) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => {
                        setActiveCampaignId(c.id);
                        setLeads([]);
                        setLeadsVisible(true);
                        // In a real app we'd fetch leads for this specific campaign
                        const mockLeads = generateLeads({ courseName: "AI EdTech Growth", targetAudience: c.target } as any);
                        setLeads(mockLeads);
                      }}
                      className="sdr-card cursor-pointer transition-all hover:shadow-md hover:ring-2 ring-[hsl(var(--ai-blue)/0.3)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">{c.name}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.status === "running" ? "bg-green-500/10 text-green-400" : c.status === "paused" ? "bg-yellow-500/10 text-yellow-400" : "bg-secondary text-muted-foreground"}`}>
                              {c.status === "running" ? "● Running" : c.status === "paused" ? "⏸ Paused" : "Draft"}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">{c.target}</div>
                        </div>
                        <div className="hidden md:flex items-center gap-5 flex-shrink-0">
                          {[
                            { label: "Sent", val: c.sent.toLocaleString() },
                            { label: "Opens", val: `${c.opens > 0 ? Math.round((c.opens / (c.sent || 1)) * 100) : 0}%` },
                            { label: "Replies", val: c.replies },
                            { label: "Interested", val: c.interested },
                          ].map(m => (
                            <div key={m.label} className="text-center">
                              <div className="text-[11px] text-muted-foreground">{m.label}</div>
                              <div className="text-sm font-bold">{m.val}</div>
                            </div>
                          ))}
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              {/* ── Detail Header ── */}
              <div className="flex items-center gap-4 mb-2">
                <button
                  onClick={() => { setActiveCampaignId(null); setLeadsVisible(false); }}
                  className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                  title="Back to Campaigns"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold truncate">{activeCampaign?.name}</h2>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${activeCampaign?.status === "running" ? "bg-green-500/10 text-green-400" : "bg-secondary text-muted-foreground"}`}>
                      {activeCampaign?.status === "running" ? "● Running" : "Paused"}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    <Target className="w-3 h-3" />
                    {activeCampaign?.target}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex bg-secondary/50 p-1 rounded-xl border border-border/50 mr-2">
                    <button
                      onClick={() => setDetailView("stats")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        detailView === "stats" 
                          ? "bg-[hsl(var(--ai-blue))] text-white shadow-md shadow-[hsl(var(--ai-blue)/0.2)]" 
                          : "text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      Live Strategy
                    </button>
                    <button
                      onClick={() => setDetailView("leads")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        detailView === "leads" 
                          ? "bg-[hsl(var(--ai-blue))] text-white shadow-md shadow-[hsl(var(--ai-blue)/0.2)]" 
                          : "text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      Review Leads
                    </button>
                    <button
                      onClick={() => setDetailView("funnel")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        detailView === "funnel" 
                          ? "bg-[hsl(var(--ai-blue))] text-white shadow-md shadow-[hsl(var(--ai-blue)/0.2)]" 
                          : "text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      Performance Funnel
                    </button>
                  </div>
                  
                  <button className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold hover:bg-orange-500/20 transition-colors">
                    Pause Campaign
                  </button>
                </div>
              </div>

              {/* ── Live Stats Dashboard (Tab 1: stats) ── */}
              {detailView === "stats" && (
                <AnimatePresence mode="wait">
                  {(launched || activeCampaign?.status === "running") ? (
                    <motion.div key="live-stats" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                      <div className="sdr-section-title">
                        <Zap className="w-3.5 h-3.5" style={{ color: "hsl(var(--ai-green))" }} />
                        Live Campaign Stats
                        <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-[10px] rounded-full px-2 py-0.5 font-semibold" style={{ background: "hsl(var(--badge-done-bg))", color: "hsl(var(--badge-done-fg))" }}>
                          ● LIVE
                        </motion.span>
                      </div>

                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {[
                          { label: "Sent", val: (launched ? liveStats.sent : activeCampaign?.sent) || 0, total: leads.length || 1, color: "hsl(var(--ai-blue))", icon: Send },
                          { label: "Delivered", val: (launched ? liveStats.delivered : Math.floor((activeCampaign?.sent || 0) * 0.98)) || 0, total: leads.length || 1, color: "hsl(var(--ai-teal))", icon: CheckCircle2 },
                          { label: "Opened", val: (launched ? liveStats.opened : activeCampaign?.opens) || 0, total: leads.length || 1, color: "hsl(var(--ai-purple))", icon: MailOpen },
                          { label: "Replied", val: (launched ? liveStats.replied : activeCampaign?.replies) || 0, total: leads.length || 1, color: "hsl(var(--ai-orange))", icon: MessageSquare },
                          { label: "Interested", val: (launched ? liveStats.interested : activeCampaign?.interested) || 0, total: leads.length || 1, color: "hsl(var(--ai-green))", icon: Star },
                          { label: "Meetings", val: (launched ? liveStats.meetings : Math.floor((activeCampaign?.interested || 0) * 0.6)) || 0, total: leads.length || 1, color: "hsl(var(--ai-red) / 0.9)", icon: Calendar },
                        ].map(({ label, val, total, color, icon: Icon }) => (
                          <div key={label} className="sdr-card text-center py-3 px-2">
                            <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color }} />
                            <motion.div key={val} initial={{ scale: 1.25, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} className="text-lg font-bold">{val}</motion.div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
                            {total > 0 && <div className="text-[9px]" style={{ color }}>({Math.round((val / total) * 100)}%)</div>}
                          </div>
                        ))}
                      </div>

                      <div className="sdr-card space-y-3">
                        <div className="text-xs font-semibold">Funnel Progress</div>
                        {[
                          { label: "Open Rate", val: (launched ? liveStats.opened : activeCampaign?.opens) || 0, base: (launched ? liveStats.sent : activeCampaign?.sent) || 1, color: "hsl(var(--ai-purple))", target: "45%" },
                          { label: "Reply Rate", val: (launched ? liveStats.replied : activeCampaign?.replies) || 0, base: (launched ? liveStats.sent : activeCampaign?.sent) || 1, color: "hsl(var(--ai-orange))", target: "12%" },
                          { label: "Interest Rate", val: (launched ? liveStats.interested : activeCampaign?.interested) || 0, base: (launched ? liveStats.sent : activeCampaign?.sent) || 1, color: "hsl(var(--ai-green))", target: "5%" },
                          { label: "Meeting Rate", val: (launched ? liveStats.meetings : Math.floor((activeCampaign?.interested || 0) * 0.6)) || 0, base: (launched ? liveStats.sent : activeCampaign?.sent) || 1, color: "hsl(var(--ai-blue))", target: "2.5%" },
                        ].map(({ label, val, base, color, target }) => {
                          const pct = Math.round((val / base) * 100);
                          return (
                            <div key={label}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-muted-foreground">{label}</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
                                  <span className="text-[10px] text-muted-foreground">target {target}</span>
                                </div>
                              </div>
                              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                <motion.div className="h-full rounded-full" style={{ background: color, width: `${pct}%` }} transition={{ duration: 0.5 }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pb-2">
                        <div className="sdr-section-title mb-2">
                          <Bot className="w-3.5 h-3.5" />
                          Live Activity Feed
                        </div>
                        <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                          <AnimatePresence initial={false}>
                            {activityFeed.map(item => (
                              <motion.div key={item.id}
                                initial={{ opacity: 0, x: -12, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs"
                                style={{ background: "hsl(var(--secondary))" }}
                              >
                                <span className="text-sm flex-shrink-0">
                                  {item.type === "open" ? "📬" : item.type === "reply" ? "💬" : item.type === "interest" ? "⭐" : item.type === "searching" ? "🔍" : item.type === "enriching" ? "🧠" : item.type === "sending" ? "⚡" : "📅"}
                                </span>
                                <span className="flex-1">{item.text}</span>
                                <span className="text-muted-foreground flex-shrink-0 tabular-nums">{item.time}</span>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                          {(activityFeed.length === 0 && (statsRunning || launched)) && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground text-center py-4 justify-center">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Waiting for activity…
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div key="quick-stats" className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div className="sdr-card p-3 flex flex-col items-center justify-center text-center">
                        <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Sent</div>
                        <div className="text-lg font-bold">{activeCampaign?.sent.toLocaleString()}</div>
                      </div>
                      <div className="sdr-card p-3 flex flex-col items-center justify-center text-center">
                        <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Open Rate</div>
                        <div className="text-lg font-bold">{activeCampaign && activeCampaign.sent > 0 ? Math.round((activeCampaign.opens / activeCampaign.sent) * 100) : 0}%</div>
                      </div>
                      <div className="sdr-card p-3 flex flex-col items-center justify-center text-center">
                        <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Replies</div>
                        <div className="text-lg font-bold">{activeCampaign?.replies}</div>
                      </div>
                      <div className="sdr-card p-3 flex flex-col items-center justify-center text-center">
                        <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Interested</div>
                        <div className="text-lg font-bold">{activeCampaign?.interested}</div>
                      </div>
                      <div className="sdr-card p-3 flex flex-col items-center justify-center text-center">
                        <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Channel</div>
                        <div className="text-sm font-bold flex items-center gap-1.5 text-[hsl(var(--ai-blue))]">
                          <Zap className="w-3 h-3" />
                          {activeCampaign?.channel || "Email"}
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              )}

              {/* ── Leads Content (Tab 2: leads) ── */}
              {detailView === "leads" && (
                <div className="space-y-5">
                  <AnimatePresence>
                    {generatingLeads && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="sdr-card flex items-center gap-3"
                        style={{ borderColor: "hsl(var(--ai-blue)/0.4)" }}
                      >
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--ai-blue)/0.1)" }}>
                          <Loader2 className="w-4.5 h-4.5 animate-spin" style={{ color: "hsl(var(--ai-blue))" }} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">AI is generating leads…</div>
                          <div className="text-xs text-muted-foreground">Scanning Apollo, LinkedIn &amp; enrichment databases based on your filters</div>
                        </div>
                        <div className="ml-auto flex gap-1">
                          {[0, 1, 2].map(i => (
                            <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(var(--ai-blue))" }}
                              animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Leads Table ── */}
                  <AnimatePresence>
                    {leadsVisible && leads.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="sdr-section-title mb-3">
                          <Users className="w-3.5 h-3.5" />
                          AI-Generated Leads
                          <span className="sdr-badge ml-1" style={{ background: "hsl(var(--badge-ai-bg))", color: "hsl(var(--badge-ai-fg))" }}>{leads.length} leads</span>
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <div className="relative flex-1 min-w-[180px]">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <input
                              value={searchQuery}
                              onChange={e => setSearchQuery(e.target.value)}
                              placeholder="Search leads…"
                              className="w-full bg-secondary border border-border rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all"
                            />
                          </div>
                          {["all", "searching", "enriching", "sending", "contacted", "replied", "interested", "meeting"].map(s => (
                            <button
                              key={s}
                              onClick={() => setStatusFilter(s)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all capitalize ${statusFilter === s ? "text-white" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                              style={statusFilter === s ? { background: "hsl(var(--ai-blue))" } : {}}
                            >
                              {s}
                            </button>
                          ))}
                        </div>

                        {/* Grouped Lead cards */}
                        <div className="space-y-6">
                          {Array.from(new Set(filteredLeads.map(l => l.group))).map((group, groupIndex) => (
                            <div key={group} className="space-y-2">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: ["hsl(var(--ai-blue))", "hsl(var(--ai-purple))", "hsl(var(--ai-teal))"][groupIndex % 3] }} />
                                {group}
                              </div>
                              {filteredLeads.filter(l => l.group === group).map((lead, i) => (
                                <motion.div
                                  key={lead.id}
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.04 }}
                                  onClick={() => setProfileLead(lead)}
                                  className="sdr-card cursor-pointer hover:shadow-md transition-all border-l-4 border-l-transparent hover:border-l-[hsl(var(--ai-blue))] group"
                                >
                                  <div className="flex items-center gap-3 py-1">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-semibold">{lead.name}</span>
                                        <span className="text-[10px] font-medium rounded-full px-2 py-0.5" style={{ background: statusStyle[lead.status].bg, color: statusStyle[lead.status].fg }}>
                                          {statusStyle[lead.status].label}
                                        </span>
                                        {lead.channel && (
                                          <span className="text-[10px] font-medium rounded-full px-2 py-0.5" style={{ background: "hsl(var(--badge-done-bg))", color: "hsl(var(--badge-done-fg))" }}>
                                            ✓ Via {lead.channel}
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[11px] text-muted-foreground truncate">{lead.role} · {lead.company} · {lead.location}</div>
                                    </div>
                                    <div className="hidden md:flex items-center gap-1 flex-shrink-0">
                                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          ))}
                        </div>

                        {/* Interested / replied summary */}
                        {leads.some(l => l.status === "interested" || l.status === "meeting") && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 rounded-xl flex items-center gap-2 text-xs" style={{ background: "hsl(var(--badge-done-bg))", color: "hsl(var(--badge-done-fg))" }}>
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            <span>{leads.filter(l => l.status === "interested" || l.status === "meeting").length} leads are interested or have meetings booked — send them course details or schedule a follow-up!</span>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {detailView === "funnel" && (
                <div className="sdr-card border-none bg-transparent p-0">
                  <LeadFunnelPage campaign={activeCampaign!} />
                </div>
              )}

              {/* ── Email Preview Phase ── */}
              <AnimatePresence>
                {emailsVisible && leads.length > 0 && !launched && !launching && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                    <div className="sdr-section-title">
                      <Mail className="w-3.5 h-3.5" />
                      Hyper-Personalised Emails
                      <span className="sdr-badge ml-1" style={{ background: "hsl(var(--badge-ai-bg))", color: "hsl(var(--badge-ai-fg))" }}>AI-drafted · {leads.length} emails</span>
                    </div>

                    <div className="p-3 rounded-xl text-xs flex items-center gap-2" style={{ background: "hsl(var(--badge-ai-bg))", color: "hsl(var(--badge-ai-fg))" }}>
                      <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                      Each email is personalised with the lead's name, company, role &amp; your course details. Review and edit before launching.
                    </div>

                    <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                      {leads.map((lead, i) => (
                        <motion.div key={lead.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                          className="sdr-card border border-border">
                          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpandedEmail(expandedEmail === lead.id ? null : lead.id)}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "hsl(var(--badge-ai-bg))" }}>
                              <Mail className="w-3.5 h-3.5" style={{ color: "hsl(var(--badge-ai-fg))" }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold">{lead.name} <span className="text-muted-foreground font-normal">· {lead.role}, {lead.company}</span></div>
                              <div className="text-[11px] text-muted-foreground truncate">To: {lead.email}</div>
                            </div>
                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(var(--ai-green))" }} />
                            <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${expandedEmail === lead.id ? "rotate-90" : ""}`} />
                          </div>
                          <AnimatePresence>
                            {expandedEmail === lead.id && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="pt-3 mt-3 border-t border-border">
                                  <textarea
                                    rows={8}
                                    value={emailDrafts[lead.id] || ""}
                                    onChange={e => setEmailDrafts(p => ({ ...p, [lead.id]: e.target.value }))}
                                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all resize-none"
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>

                    <button
                      onClick={handleLaunch}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                      style={{ background: "linear-gradient(135deg, hsl(var(--ai-blue)), hsl(var(--ai-purple)))" }}
                    >
                      <Zap className="w-4 h-4" />
                      Launch Campaign — Send {leads.length} Personalised Emails
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Launching Progress ── */}
              <AnimatePresence>
                {launching && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="sdr-card" style={{ borderColor: "hsl(var(--ai-blue)/0.4)" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--ai-blue)/0.1)" }}>
                        <Send className="w-4 h-4 animate-pulse" style={{ color: "hsl(var(--ai-blue))" }} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Sending hyper-personalised emails…</div>
                        <div className="text-xs text-muted-foreground">{Math.round((launchProgress / 100) * leads.length)} of {leads.length} emails sent</div>
                      </div>
                      <div className="ml-auto text-sm font-bold" style={{ color: "hsl(var(--ai-blue))" }}>{Math.round(launchProgress)}%</div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, hsl(var(--ai-blue)), hsl(var(--ai-purple)))", width: `${launchProgress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>


            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showWizard && <CampaignWizard onClose={() => setShowWizard(false)} onCreate={handleCreate} onViewProfile={(l) => { setProfileLead(l); setShowWizard(false); }} />}
      </AnimatePresence>
    </>
  );
};

export default CampaignPage;
