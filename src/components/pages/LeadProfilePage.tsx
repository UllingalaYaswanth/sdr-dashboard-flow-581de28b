import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Building2, 
  MapPin, 
  Target, 
  Zap, 
  Star,
  Clock,
  ExternalLink,
  ShieldCheck,
  Briefcase,
  Bot,
  User,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Sparkles
} from "lucide-react";

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
  status: string;
  lastTouch: string;
  course: string;
  group: string;
  qualification: string;
  intent: string;
  readiness: string;
  behavior: string;
  fit: string;
  objections: string;
  pipelineStatus: string;
  advancedSdrLanguage: string;
}

interface LeadProfilePageProps {
  lead: CampaignLead;
  onBack: () => void;
}

// Custom Score Breakdown Component
const ScoreBreakdown = ({ lead }: { lead: CampaignLead }) => (
  <div className="sdr-card space-y-4">
    <h4 className="text-sm font-bold flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-[hsl(var(--ai-blue))]" />
      Score Generation Analysis
    </h4>
    <div className="space-y-4">
      {[
        { label: "Profile & ICP Fit", score: lead.fitScore || 85, weight: 35, color: "hsl(var(--ai-blue))", icon: Building2 },
        { label: "Behavioral Intent", score: lead.intentScore || 78, weight: 40, color: "hsl(var(--ai-orange))", icon: Zap },
        { label: "Buying Readiness", score: lead.timingScore || 92, weight: 25, color: "hsl(var(--ai-green))", icon: Clock },
      ].map((item, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-2 text-muted-foreground">
              <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} /> {item.label}
            </span>
            <span style={{ color: item.color }}>{item.score}% Match</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border/20 p-[1px]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${item.score}%` }}
              transition={{ duration: 1.2, delay: i * 0.1, ease: "circOut" }}
              className="h-full rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]" 
              style={{ 
                backgroundColor: item.color,
                backgroundImage: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2))`
              }} 
            />
          </div>
        </div>
      ))}
    </div>
    <div className="pt-3 border-t border-border/50 text-[10px] text-muted-foreground leading-relaxed">
      <span className="font-bold text-foreground">AI Rationale:</span> Calculated using {lead.company}'s historical relevance, {lead.name}'s seniority ({lead.role}), and recent engagement signals.
    </div>
  </div>
);

// Custom Status Journey Graph Component
const StatusJourney = ({ lead }: { lead: CampaignLead }) => {
  const stages = [
    { id: "searching",  label: "New",        time: "3 Days ago",  icon: "🆕", color: "hsl(var(--ai-blue))",   bgColor: "hsl(var(--ai-blue) / 0.12)"   },
    { id: "enriching",  label: "Enriched",   time: "2 Days ago",  icon: "🧠", color: "hsl(var(--ai-purple))", bgColor: "hsl(var(--ai-purple) / 0.12)" },
    { id: "contacted",  label: "Contacted",  time: "Yesterday",   icon: "📨", color: "hsl(var(--ai-orange))", bgColor: "hsl(var(--ai-orange) / 0.12)" },
    { id: "replied",    label: "Replied",    time: "Today, AM",   icon: "💬", color: "hsl(var(--ai-teal))",   bgColor: "hsl(var(--ai-teal) / 0.12)"   },
    { id: "interested", label: "Interested", time: "Now",         icon: "⭐", color: "hsl(var(--ai-green))",  bgColor: "hsl(var(--ai-green) / 0.12)"  },
    { id: "meeting",    label: "Meeting",    time: "Scheduled",   icon: "📅", color: "hsl(36 95% 55%)",       bgColor: "hsl(36 95% 55% / 0.12)"       },
  ];

  const currentIndex = stages.findIndex(s => s.id === lead.status);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="border-b border-border/50 pb-8 mb-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-sm font-bold flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[hsl(var(--ai-green))]" />
          Lead Status Journey
        </h4>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: stages[activeIndex].bgColor, color: stages[activeIndex].color }}>
          <span>{stages[activeIndex].icon}</span>
          {stages[activeIndex].label}
        </div>
      </div>

      {/* Stepper Track */}
      <div className="relative flex items-center">
        {stages.map((stage, i) => {
          const isCompleted = i < activeIndex;
          const isCurrent   = i === activeIndex;
          const isPending   = i > activeIndex;
          const isLast      = i === stages.length - 1;

          return (
            <div key={stage.id} className="flex items-center" style={{ flex: isLast ? "0 0 auto" : 1 }}>
              {/* Node */}
              <div className="flex flex-col items-center" style={{ minWidth: 48 }}>
                {/* Circle */}
                <div className="relative flex items-center justify-center">
                  {/* Outer glow ring for current */}
                  {isCurrent && (
                    <motion.div
                      className="absolute rounded-full"
                      style={{ width: 44, height: 44, border: `2px solid ${stage.color}`, opacity: 0.4 }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.35, ease: "backOut" }}
                    className="relative w-9 h-9 rounded-full flex items-center justify-center text-base shadow-sm border-2 transition-all"
                    style={{
                      background:   isCompleted || isCurrent ? stage.bgColor : "hsl(var(--secondary))",
                      borderColor:  isCompleted ? stage.color : isCurrent ? stage.color : "hsl(var(--border))",
                      boxShadow:    isCurrent ? `0 0 0 4px ${stage.bgColor}, 0 4px 16px ${stage.bgColor}` : "none",
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" style={{ color: stage.color }} />
                    ) : (
                      <span className={isPending ? "opacity-30 grayscale" : ""}>{stage.icon}</span>
                    )}
                  </motion.div>
                </div>

                {/* Label + Time */}
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex flex-col items-center mt-2 text-center"
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-wide whitespace-nowrap"
                    style={{ color: isCurrent ? stage.color : isCompleted ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))", opacity: isPending ? 0.45 : 1 }}
                  >
                    {stage.label}
                  </span>
                  <span className="text-[9px] mt-0.5 whitespace-nowrap" style={{ color: "hsl(var(--muted-foreground))", opacity: isPending ? 0.35 : 0.75 }}>
                    {stage.time}
                  </span>
                </motion.div>
              </div>

              {/* Connector bar (skip after last) */}
              {!isLast && (
                <div className="flex-1 mx-1 relative" style={{ height: 3, marginBottom: 28 }}>
                  {/* Background track */}
                  <div className="w-full h-full rounded-full" style={{ background: "hsl(var(--border))" }} />
                  {/* Filled portion */}
                  {(isCompleted || isCurrent) && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? "100%" : isCurrent ? "50%" : "0%" }}
                      transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${stages[i].color}, ${stages[i + 1]?.color ?? stages[i].color})`,
                        opacity: isCompleted ? 1 : 0.5,
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function LeadProfilePage({ lead, onBack }: LeadProfilePageProps) {
  const firstName = lead.name.split(" ")[0];

  const qualificationMetrics = [
    { label: "Qualification", value: lead.qualification, color: "hsl(var(--ai-green))", icon: Target },
    { label: "Intent", value: lead.intent, color: "hsl(var(--ai-orange))", icon: Zap },
    { label: "Readiness", value: lead.readiness, color: "hsl(var(--ai-blue))", icon: Star },
    { label: "Behavior", value: lead.behavior, color: "hsl(var(--ai-purple))", icon: Clock },
  ];

  const sequence = [
    {
      id: 1,
      type: "ai",
      channel: "email",
      time: "2 Days ago",
      subject: `Partnership Opportunity – ${lead.course}`,
      body: `Hi ${firstName},\n\nI noticed your work at ${lead.company} and thought you'd be interested in our ${lead.course}. We've helped similar institutions achieve 93%+ placement rates.\n\nWould you have 15 minutes this week?`,
      status: "opened"
    },
    {
      id: 2,
      type: "lead",
      channel: "email",
      time: "Yesterday, 11:30 AM",
      body: `Hey, thanks for reaching out. We are actually looking to modernize our curriculum for the upcoming semester. How does your placement support work for Tier-1 colleges like ours?`,
    },
    {
      id: 3,
      type: "ai",
      channel: "whatsapp",
      time: "Yesterday, 4:00 PM",
      body: `Hi ${firstName}! Following up on your email. For Tier-1 colleges, we provide a dedicated hiring pipeline with 500+ corporate partners. Sending you our latest placement report for high-ranking engineering colleges. 📊`,
      status: "delivered"
    },
    {
      id: 4,
      type: "lead",
      channel: "whatsapp",
      time: "Today, 9:20 AM",
      body: `This looks impressive. I'd like to discuss the branded program option. Can we jump on a quick call tomorrow?`,
    },
    {
      id: 5,
      type: "milestone",
      label: "Meeting Scheduled",
      time: "Today, 10:00 AM",
      detail: "Product Demo & Partnership Discussion",
      date: "Mar 28, 2025 • 2:30 PM",
      icon: Calendar,
      color: "hsl(var(--ai-green))"
    }
  ];
  


  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-12"
    >
      {/* Header / Navigation */}
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={onBack}
          className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
          title="Back to Campaign"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Lead Profile</div>
          <h2 className="text-xl font-bold truncate">{lead.name}</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Dynamic score priority badge */}
          {lead.score >= 80 ? (
            <div className="px-3 py-1.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5"
              style={{ background: "hsl(var(--ai-green) / 0.1)", color: "hsl(var(--ai-green))", borderColor: "hsl(var(--ai-green) / 0.25)" }}>
              🔥 Hot Lead — Strong Opportunity
            </div>
          ) : lead.score >= 60 ? (
            <div className="px-3 py-1.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5"
              style={{ background: "hsl(var(--ai-orange) / 0.1)", color: "hsl(var(--ai-orange))", borderColor: "hsl(var(--ai-orange) / 0.25)" }}>
              🌡️ Warm Lead — Needs Nurturing
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5"
              style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}>
              ❄️ Cold Lead — Low Priority
            </div>
          )}
          
        </div>
      </div>

      {/* Qualification Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {qualificationMetrics.map((met, i) => (
          <div key={i} className="sdr-card p-4 hover:border-[hsl(var(--ai-blue)/0.3)] transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-secondary">
                <met.icon className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{met.label}</span>
            </div>
            <div className="text-sm font-bold" style={{ color: met.color }}>{met.value}</div>
          </div>
        ))}
      </div>

      {/* Main Score Breakdown at the Top */}
      <div className="grid grid-cols-1">
        <ScoreBreakdown lead={lead} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Basic Info & SDR description */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sdr-card overflow-hidden !pt-0 !px-0">
            <div className="h-32 bg-gradient-to-br from-[hsl(var(--ai-blue))] to-[hsl(var(--ai-purple))] opacity-20 relative">
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl bg-secondary border-4 border-background flex items-center justify-center text-3xl shadow-2xl z-20">
                👤
              </div>
            </div>
            <div className="px-6 pb-6 pt-14 text-center">
              <h3 className="text-xl font-bold text-foreground mb-1 leading-tight">{lead.name}</h3>
              <p className="text-sm text-[hsl(var(--ai-blue))] font-semibold mb-3">{lead.role}</p>
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs font-medium">
                <Building2 className="w-3.5 h-3.5" />
                {lead.company}
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-secondary/30 border border-border/50 italic text-[11px] leading-relaxed text-muted-foreground">
                "Warm inbound, high intent, ICP fit, decision-maker, budget unclear, demo requested — strong opportunity."
              </div>
            </div>
          </div>

          <div className="sdr-card space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <Zap className="w-4 h-4 text-[hsl(var(--ai-orange))]" />
              SDR Key Signals
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                lead.qualification, lead.intent, lead.readiness, lead.behavior, lead.fit
              ].map(sig => (
                <span key={sig} className="text-[10px] px-2 py-1 rounded-md bg-secondary text-muted-foreground font-medium border border-border/50">
                  {sig}
                </span>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="text-[10px] text-muted-foreground uppercase font-bold mb-2">Internal Note</div>
              <div className="text-xs italic text-[hsl(var(--ai-blue))] font-medium leading-relaxed">
                "{lead.advancedSdrLanguage}: {lead.intent}, {lead.qualification}, {lead.readiness}, {lead.objections !== 'None' ? `objection: ${lead.objections}` : 'strong opportunity'}."
              </div>
            </div>
          </div>

          <div className="sdr-card space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <Phone className="w-4 h-4 text-[hsl(var(--ai-blue))]" />
              Contact Details
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary group-hover:bg-[hsl(var(--ai-blue)/0.1)] transition-colors">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground group-hover:text-[hsl(var(--ai-blue))]" />
                  </div>
                  <div className="text-xs font-medium">{lead.email}</div>
                </div>
              </div>
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary group-hover:bg-[hsl(var(--ai-blue)/0.1)] transition-colors">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground group-hover:text-[hsl(var(--ai-blue))]" />
                  </div>
                  <div className="text-xs font-medium">{lead.phone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Communication Sequence */}
        <div className="lg:col-span-2 space-y-6">
          <div className="sdr-card">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-[hsl(var(--ai-blue))]" />
                Communication Sequence
              </h4>
              <div className="text-[10px] text-muted-foreground font-medium">Auto-pilot active for {lead.course}</div>
            </div>

            <div className="mb-10 px-2">
              <StatusJourney lead={lead} />
            </div>

            <div className="relative space-y-10 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border/40">
              {sequence.map((item) => (
                <div key={item.id} className="relative pl-14">
                  {/* Icon with Ring Glow */}
                  <div className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-2 border-background shadow-xl z-20 transition-all ${
                    item.type === 'ai' ? 'bg-[hsl(var(--ai-blue))]' : 
                    item.type === 'lead' ? 'bg-secondary' : 
                    'bg-[hsl(var(--ai-green))]'
                  }`}>
                    {/* Outer Glow Ring */}
                    <div className={`absolute inset-[-4px] rounded-full opacity-20 border-[3px] ${
                      item.type === 'ai' ? 'border-[hsl(var(--ai-blue))]' : 
                      item.type === 'lead' ? 'border-muted-foreground' : 
                      'border-[hsl(var(--ai-green))]'
                    }`} />
                    
                    {item.type === 'ai' ? <Bot className="w-4.5 h-4.5 text-white" /> : 
                     item.type === 'lead' ? <User className="w-4.5 h-4.5 text-foreground" /> : 
                     item.icon && <item.icon className="w-4.5 h-4.5 text-white" />}
                  </div>

                  <div className={`rounded-2xl p-5 border transition-all ${
                    item.type === 'milestone' ? 'bg-[hsl(var(--ai-green)/0.03)] border-[hsl(var(--ai-green)/0.2)] shadow-sm' : 
                    'bg-secondary/10 border-border/40 hover:border-border/60 hover:bg-secondary/20'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {item.type === 'milestone' ? (
                          <span className="text-xs font-bold text-[hsl(var(--ai-green))]">{item.label}</span>
                        ) : (
                          <>
                            <span className="text-xs font-bold">{item.type === 'ai' ? 'AI Agent' : firstName}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-medium uppercase">{item.channel}</span>
                          </>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{item.time}</span>
                    </div>

                    {item.subject && <div className="text-xs font-bold mb-2">Subject: {item.subject}</div>}
                    
                    {item.type === 'milestone' ? (
                      <div className="mt-2 text-sm">
                        <div className="font-semibold">{item.detail}</div>
                        <div className="text-muted-foreground flex items-center gap-2 mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.date}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{item.body}</p>
                    )}

                    {item.type === 'ai' && item.status && (
                      <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2 text-[10px] font-medium text-[hsl(var(--ai-blue))]">
                        <CheckCircle2 className="w-3 h-3" />
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
