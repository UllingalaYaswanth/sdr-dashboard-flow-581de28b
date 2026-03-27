import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

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
  status: "new" | "contacted" | "replied" | "interested" | "meeting";
  lastTouch: string;
  course: string;
  channel: "email" | "whatsapp" | "call" | "meeting" | null;
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
    createdAt: "Mar 20",
    color: "hsl(var(--ai-blue))",
  },
  {
    id: "c2",
    name: "Meta DS March",
    status: "running",
    target: "Career Switchers & College Students",
    sent: 780,
    opens: 362,
    replies: 42,
    interested: 13,
    createdAt: "Mar 22",
    color: "hsl(var(--ai-purple))",
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
    createdAt: "Mar 25",
    color: "hsl(var(--ai-teal))",
  },
];

const generateLeads = (inputs: WizardInputs): CampaignLead[] => {
  const names = [
    { name: "Priya Sharma", role: "VP Academics", company: "Amity University", location: "Noida", course: inputs.courseName },
    { name: "Rahul Mehta", role: "L&D Manager", company: "Infosys", location: "Bengaluru", course: inputs.courseName },
    { name: "Sneha Iyer", role: "Director – Placements", company: "NIIT", location: "Chennai", course: inputs.courseName },
    { name: "Arjun Kapoor", role: "Head of Partnerships", company: "UpGrad", location: "Mumbai", course: inputs.courseName },
    { name: "Deepa Nair", role: "CHRO", company: "TCS Digital", location: "Pune", course: inputs.courseName },
    { name: "Vikram Saxena", role: "Dean – Engineering", company: "VIT University", location: "Vellore", course: inputs.courseName },
    { name: "Aisha Khan", role: "Program Director", company: "BYJU's", location: "Delhi", course: inputs.courseName },
    { name: "Rohan Gupta", role: "VP Growth", company: "PhysicsWallah", location: "Lucknow", course: inputs.courseName },
  ];
  return names.map((n, i) => ({
    id: `lead-${i}`,
    name: n.name,
    role: n.role,
    company: n.company,
    location: n.location,
    email: `${n.name.split(" ")[0].toLowerCase()}@${n.company.replace(/\s/g, "").toLowerCase()}.com`,
    phone: `+91-9${800 + i}xxxx${1000 + i}`,
    whatsapp: `+91-9${800 + i}xxxx${1000 + i}`,
    score: 95 - i * 7,
    status: (["new", "new", "contacted", "replied", "interested", "new", "contacted", "replied"] as CampaignLead["status"][])[i],
    lastTouch: `${27 - i} Mar`,
    course: n.course,
    channel: null,
  }));
};

// ─── Wizard types ────────────────────────────────────────────────────────────
interface WizardInputs {
  campaignName: string;
  courseName: string;
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
  goal: string;
}

const defaultWizard: WizardInputs = {
  campaignName: "",
  courseName: "",
  duration: "",
  price: "",
  guarantee: "",
  placementRate: "",
  avgCTC: "",
  targetAudience: "",
  location: "",
  industry: "",
  channels: [],
  goal: "Book demo meetings",
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
  const labels: Record<string, string> = { email: "✉️ Email", whatsapp: "💬 WhatsApp", call: "📞 Call", linkedin: "🔗 LinkedIn" };
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
  new: { bg: "hsl(var(--badge-ai-bg))", fg: "hsl(var(--badge-ai-fg))", label: "New" },
  contacted: { bg: "hsl(var(--badge-b2b-bg))", fg: "hsl(var(--badge-b2b-fg))", label: "Contacted" },
  replied: { bg: "hsl(var(--badge-warm-bg))", fg: "hsl(var(--badge-warm-fg))", label: "Replied" },
  interested: { bg: "hsl(var(--badge-done-bg))", fg: "hsl(var(--badge-done-fg))", label: "Interested" },
  meeting: { bg: "hsl(var(--badge-b2c-bg))", fg: "hsl(var(--badge-b2c-fg))", label: "Meeting" },
};

// ─── Interaction Panel ────────────────────────────────────────────────────────
function InteractionPanel({ lead, onClose, onUpdate }: { lead: CampaignLead; onClose: () => void; onUpdate: (id: string, action: CampaignLead["channel"]) => void }) {
  const [activeTab, setActiveTab] = useState<"email" | "whatsapp" | "call" | "meeting">("email");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const emailDraft = `Hi ${lead.name.split(" ")[0]},\n\nI noticed your work at ${lead.company} and thought you'd be interested in our ${lead.course}.\n\nWe've helped similar institutions achieve 93%+ placement rates. Would you have 15 minutes this week for a quick demo?\n\nBest regards,\nOyeSell AI Team`;
  const whatsappDraft = `Hi ${lead.name.split(" ")[0]}! 👋\n\nI came across ${lead.company} and thought our ${lead.course} could be a great fit.\n\n🎓 93% placement rate\n⚡ Live cohort delivery\n💼 Branded program for your institution\n\nInterested in a quick chat?`;
  const callScript = `Opening: "Hi ${lead.name.split(" ")[0]}, this is [Name] from OyeSell. Is this a good time?"\n\nValue prop: "We help institutions like ${lead.company} offer branded data programs with 93% placement — without building curriculum."\n\nObjection handling: "Unlike self-paced courses, we handle delivery + hiring pipeline."\n\nClose: "Can we schedule a 15-minute demo this week?"`;

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      onUpdate(lead.id, activeTab);
      toast.success(`${activeTab === "email" ? "Email" : activeTab === "whatsapp" ? "WhatsApp message" : activeTab === "call" ? "Call logged" : "Meeting booked"} for ${lead.name}`);
      onClose();
    }, 1200);
  };

  const handleTabContent = () => {
    switch (activeTab) {
      case "email":
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Subject</label>
              <input className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all" defaultValue={`Partnership Opportunity – ${lead.course}`} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Message</label>
              <textarea rows={6} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all resize-none" defaultValue={emailDraft} />
            </div>
          </div>
        );
      case "whatsapp":
        return (
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">WhatsApp Message</label>
            <textarea rows={6} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all resize-none" defaultValue={whatsappDraft} />
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="w-3 h-3" />{lead.whatsapp}
            </div>
          </div>
        );
      case "call":
        return (
          <div>
            <div className="p-3 rounded-xl mb-3" style={{ background: "hsl(var(--badge-ai-bg))" }}>
              <div className="text-xs font-semibold mb-2" style={{ color: "hsl(var(--badge-ai-fg))" }}>📞 AI Call Script</div>
              <pre className="text-xs whitespace-pre-wrap text-muted-foreground leading-relaxed">{callScript}</pre>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="w-3 h-3" />{lead.phone}
            </div>
          </div>
        );
      case "meeting":
        return (
          <div className="space-y-3">
            <div className="p-3 rounded-xl" style={{ background: "hsl(var(--badge-done-bg))" }}>
              <div className="text-xs font-semibold mb-1" style={{ color: "hsl(var(--badge-done-fg))" }}>Schedule Demo Meeting</div>
              <p className="text-xs text-muted-foreground">Book a 15-minute product demo for {lead.name} at {lead.company} regarding {lead.course}.</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Preferred Time</label>
              <input type="datetime-local" className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Course of Interest</label>
              <input className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all" defaultValue={lead.course} />
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        className="w-full max-w-lg rounded-2xl border border-border shadow-2xl overflow-hidden"
        style={{ background: "hsl(var(--background))" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-start justify-between">
          <div>
            <div className="font-semibold text-sm">{lead.name}</div>
            <div className="text-xs text-muted-foreground">{lead.role} · {lead.company} · {lead.location}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Score & status */}
        <div className="px-5 py-3 flex items-center gap-3 border-b border-border">
          <div className="text-[11px] font-medium rounded-full px-2.5 py-1" style={{ background: "hsl(var(--badge-done-bg))", color: "hsl(var(--badge-done-fg))" }}>
            🎯 Score: {lead.score}
          </div>
          <div className="text-[11px] font-medium rounded-full px-2.5 py-1" style={{ background: statusStyle[lead.status].bg, color: statusStyle[lead.status].fg }}>
            {statusStyle[lead.status].label}
          </div>
          <div className="text-[11px] text-muted-foreground ml-auto">📩 {lead.email}</div>
        </div>

        {/* Channel tabs */}
        <div className="px-5 pt-4">
          <div className="flex gap-1 mb-4">
            {[
              { key: "email", icon: Mail, label: "Email" },
              { key: "whatsapp", icon: MessageCircle, label: "WhatsApp" },
              { key: "call", icon: Phone, label: "Call" },
              { key: "meeting", icon: Calendar, label: "Meeting" },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-1 justify-center ${activeTab === key ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
                style={activeTab === key ? { background: "hsl(var(--ai-blue))" } : { background: "hsl(var(--secondary))" }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="pb-4">
            {handleTabContent()}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between">
          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Bot className="w-3 h-3" />
            AI-drafted · {lead.lastTouch}
          </div>
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
            style={{ background: "hsl(var(--ai-blue))" }}
          >
            {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            {activeTab === "call" ? "Log Call" : activeTab === "meeting" ? "Book Meeting" : "Send"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Create Campaign Wizard ───────────────────────────────────────────────────
function CampaignWizard({ onClose, onCreate }: { onClose: () => void; onCreate: (inputs: WizardInputs) => void }) {
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState<WizardInputs>(defaultWizard);
  const totalSteps = 3;

  const set = (key: keyof WizardInputs, val: string) => setInputs(p => ({ ...p, [key]: val }));
  const toggleChannel = (ch: string) => setInputs(p => ({
    ...p,
    channels: p.channels.includes(ch) ? p.channels.filter(c => c !== ch) : [...p.channels, ch],
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-lg rounded-2xl border border-border shadow-2xl overflow-hidden"
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
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
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
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Course / Product Name</label>
                  <input
                    value={inputs.courseName}
                    onChange={e => set("courseName", e.target.value)}
                    placeholder="Full-Stack Data Science Program"
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all"
                  />
                </div>

                {/* Duration + Price row */}
                <div className="grid grid-cols-2 gap-3">
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
                </div>

                {/* Guarantee */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Guarantee / USP</label>
                  <input
                    value={inputs.guarantee}
                    onChange={e => set("guarantee", e.target.value)}
                    placeholder="Job guarantee"
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all"
                  />
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
                    🎯 {inputs.placementRate} placement rate
                  </span>
                  <span className="text-[10px] rounded-full px-2.5 py-1 font-medium" style={{ background: "hsl(var(--badge-ai-bg))", color: "hsl(var(--badge-ai-fg))" }}>
                    💼 Avg CTC {inputs.avgCTC}
                  </span>
                  {inputs.guarantee && (
                    <span className="text-[10px] rounded-full px-2.5 py-1 font-medium" style={{ background: "hsl(var(--badge-b2c-bg))", color: "hsl(var(--badge-b2c-fg))" }}>
                      ✅ {inputs.guarantee}
                    </span>
                  )}
                </div>

                {/* Goal */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Campaign Goal</label>
                  <select
                    value={inputs.goal}
                    onChange={e => set("goal", e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all"
                  >
                    <option>Book demo meetings</option>
                    <option>Generate inbound leads</option>
                    <option>Nurture existing leads</option>
                    <option>Partnership outreach</option>
                  </select>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <div className="text-sm font-semibold mb-1 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" style={{ color: "hsl(var(--ai-blue))" }} />
                    Target Audience
                  </div>
                  <input
                    value={inputs.targetAudience}
                    onChange={e => set("targetAudience", e.target.value)}
                    placeholder="e.g. College Directors, VP Academics"
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" style={{ color: "hsl(var(--ai-purple))" }} />
                    Industry / Sector
                  </div>
                  <input
                    value={inputs.industry}
                    onChange={e => set("industry", e.target.value)}
                    placeholder="e.g. EdTech, Higher Education, Enterprise"
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" style={{ color: "hsl(var(--ai-orange))" }} />
                    Location
                  </div>
                  <input
                    value={inputs.location}
                    onChange={e => set("location", e.target.value)}
                    placeholder="Pan India, Mumbai, Bengaluru..."
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-blue)/0.3)] transition-all"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold mb-2">Outreach Channels</div>
                  <div className="flex flex-wrap gap-2">
                    {["email", "whatsapp", "call", "linkedin"].map(ch => (
                      <ChannelToggle key={ch} value={ch} checked={inputs.channels.includes(ch)} onChange={toggleChannel} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="p-4 rounded-xl border border-dashed border-[hsl(var(--ai-blue))]" style={{ background: "hsl(var(--ai-blue)/0.05)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4" style={{ color: "hsl(var(--ai-blue))" }} />
                    <span className="text-sm font-semibold">AI will generate leads for:</span>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between"><span>Campaign</span><span className="text-foreground font-medium">{inputs.campaignName || "Untitled"}</span></div>
                    <div className="flex justify-between"><span>Course</span><span className="text-foreground font-medium">{inputs.courseName}</span></div>
                    <div className="flex justify-between"><span>Duration</span><span className="text-foreground font-medium">{inputs.duration}</span></div>
                    <div className="flex justify-between"><span>Price</span><span className="text-foreground font-medium">{inputs.price}</span></div>
                    <div className="flex justify-between"><span>Guarantee</span><span className="text-foreground font-medium">{inputs.guarantee}</span></div>
                    <div className="flex justify-between"><span>Outcomes</span><span className="text-foreground font-medium">{inputs.placementRate} placement · {inputs.avgCTC} avg CTC</span></div>
                    <div className="flex justify-between"><span>Target</span><span className="text-foreground font-medium">{inputs.targetAudience}</span></div>
                    <div className="flex justify-between"><span>Industry</span><span className="text-foreground font-medium">{inputs.industry}</span></div>
                    <div className="flex justify-between"><span>Location</span><span className="text-foreground font-medium">{inputs.location}</span></div>
                    <div className="flex justify-between"><span>Channels</span><span className="text-foreground font-medium capitalize">{inputs.channels.join(", ")}</span></div>
                    <div className="flex justify-between"><span>Goal</span><span className="text-foreground font-medium">{inputs.goal}</span></div>
                  </div>
                </div>
                <div className="p-3 rounded-xl text-xs flex items-start gap-2" style={{ background: "hsl(var(--badge-ai-bg))", color: "hsl(var(--badge-ai-fg))" }}>
                  <Bot className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  AI will scan Apollo, LinkedIn, and enrichment databases to find 50–200 qualified leads matching your filters. Estimated: ~30 seconds.
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
              <><Sparkles className="w-3.5 h-3.5" />Launch & Generate Leads</>
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
  const [selectedLead, setSelectedLead] = useState<CampaignLead | null>(null);
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
        `Would you be open to a 15-min call this week to explore if this makes sense for ${l.company}?\n\n` +
        `Looking forward to connecting,\nOyeSell AI`;
    });
    setEmailDrafts(drafts);
    setTimeout(() => {
      setLeads(generated);
      setGeneratingLeads(false);
      setLeadsVisible(true);
      toast.success(`${generated.length} leads generated by AI \uD83C\uDFAF`);
      setTimeout(() => setEmailsVisible(true), 700);
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
      ...leads.map(l => ({ text: `${l.name} received the email`, type: "open" })),
      ...leads.filter((_, i) => i % 2 === 0).map(l => ({ text: `${l.name} opened the email`, type: "open" })),
      ...leads.filter((_, i) => i % 3 === 0).map(l => ({ text: `${l.name} replied: "Looks interesting, let's connect!"`, type: "reply" })),
      ...leads.filter((_, i) => i % 5 === 0).map(l => ({ text: `${l.name} marked as Interested`, type: "interest" })),
      ...leads.filter((_, i) => i % 7 === 0).map(l => ({ text: `${l.name} booked a demo meeting`, type: "meeting" })),
    ].sort(() => Math.random() - 0.5);
    const iv = setInterval(() => {
      prog += Math.random() * 16 + 5;
      if (prog >= 100) {
        clearInterval(iv);
        setLaunchProgress(100);
        setLaunching(false);
        setLaunched(true);
        toast.success(`Campaign launched! ${leads.length} hyper-personalised emails sent ✨`);
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

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
                if (c.id !== activeCampaignId) { setLeadsVisible(false); setLeads([]); }
              }}
              className={`sdr-card cursor-pointer transition-all hover:shadow-md ${activeCampaignId === c.id ? "ring-2 ring-[hsl(var(--ai-blue))]" : ""}`}
            >
              <div className="flex items-center gap-3">
                {/* Color dot */}
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
                {/* Metrics */}
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
                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${activeCampaignId === c.id ? "rotate-90" : ""}`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── AI Lead Generation Status ── */}
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
              <div className="text-xs text-muted-foreground">Scanning Apollo, LinkedIn & enrichment databases based on your filters</div>
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
              {activeCampaign && (
                <span className="text-[10px] text-muted-foreground ml-2">for {activeCampaign.name}</span>
              )}
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
              {["all", "new", "contacted", "replied", "interested", "meeting"].map(s => (
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

            {/* Lead cards */}
            <div className="space-y-2">
              {filteredLeads.map((lead, i) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="sdr-card hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <ScoreRing score={lead.score} />
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
                      {[
                        { key: "email", icon: Mail, title: "Send Email" },
                        { key: "whatsapp", icon: MessageCircle, title: "WhatsApp" },
                        { key: "call", icon: Phone, title: "Call" },
                        { key: "meeting", icon: Calendar, title: "Meeting" },
                      ].map(({ key, icon: Icon, title }) => (
                        <button
                          key={key}
                          onClick={() => setSelectedLead({ ...lead, channel: null })}
                          title={title}
                          className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setSelectedLead({ ...lead, channel: null })}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all md:hidden"
                      style={{ background: "hsl(var(--ai-blue)/0.1)", color: "hsl(var(--ai-blue))" }}
                    >
                      <Zap className="w-3 h-3" />
                      Engage
                    </button>
                  </div>
                </motion.div>
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
              Each email is personalised with the lead's name, company, role & your course details. Review and edit before launching.
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

      {/* ── Live Stats Dashboard ── */}
      <AnimatePresence>
        {launched && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="sdr-section-title">
              <Zap className="w-3.5 h-3.5" style={{ color: "hsl(var(--ai-green))" }} />
              Live Campaign Stats
              <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[10px] rounded-full px-2 py-0.5 font-semibold" style={{ background: "hsl(var(--badge-done-bg))", color: "hsl(var(--badge-done-fg))" }}>
                ● LIVE
              </motion.span>
            </div>

            {/* 6 stat tiles */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { label: "Sent", val: liveStats.sent, total: leads.length, color: "hsl(var(--ai-blue))", icon: Send },
                { label: "Delivered", val: liveStats.delivered, total: leads.length, color: "hsl(var(--ai-teal))", icon: CheckCircle2 },
                { label: "Opened", val: liveStats.opened, total: leads.length, color: "hsl(var(--ai-purple))", icon: MailOpen },
                { label: "Replied", val: liveStats.replied, total: leads.length, color: "hsl(var(--ai-orange))", icon: MessageSquare },
                { label: "Interested", val: liveStats.interested, total: leads.length, color: "hsl(var(--ai-green))", icon: Star },
                { label: "Meetings", val: liveStats.meetings, total: leads.length, color: "hsl(var(--ai-red) / 0.9)", icon: Calendar },
              ].map(({ label, val, total, color, icon: Icon }) => (
                <div key={label} className="sdr-card text-center py-3 px-2">
                  <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color }} />
                  <motion.div key={val} initial={{ scale: 1.25, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} className="text-lg font-bold">{val}</motion.div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
                  {total > 0 && <div className="text-[9px]" style={{ color }}>({Math.round((val / total) * 100)}%)</div>}
                </div>
              ))}
            </div>

            {/* Funnel progress bars */}
            <div className="sdr-card space-y-3">
              <div className="text-xs font-semibold">Funnel Progress</div>
              {[
                { label: "Open Rate", val: liveStats.opened, base: liveStats.sent || 1, color: "hsl(var(--ai-purple))", target: "45%" },
                { label: "Reply Rate", val: liveStats.replied, base: liveStats.sent || 1, color: "hsl(var(--ai-orange))", target: "12%" },
                { label: "Interest Rate", val: liveStats.interested, base: liveStats.sent || 1, color: "hsl(var(--ai-green))", target: "5%" },
                { label: "Meeting Rate", val: liveStats.meetings, base: liveStats.sent || 1, color: "hsl(var(--ai-blue))", target: "2.5%" },
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

            {/* Live Activity Feed */}
            <div>
              <div className="sdr-section-title mb-2">
                <Bot className="w-3.5 h-3.5" />
                Live Activity Feed
              </div>
              <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
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
                        {item.type === "open" ? "📬" : item.type === "reply" ? "💬" : item.type === "interest" ? "⭐" : "📅"}
                      </span>
                      <span className="flex-1">{item.text}</span>
                      <span className="text-muted-foreground flex-shrink-0 tabular-nums">{item.time}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {activityFeed.length === 0 && statsRunning && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground text-center py-4 justify-center">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Waiting for activity…
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showWizard && <CampaignWizard onClose={() => setShowWizard(false)} onCreate={handleCreate} />}
      </AnimatePresence>
      <AnimatePresence>
        {selectedLead && (
          <InteractionPanel
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onUpdate={handleLeadAction}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
