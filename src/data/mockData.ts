export type LeadType = "B2B" | "B2C";
export type LeadSource = "apollo" | "ads" | "upload";
export type LeadStatus = "hot" | "warm" | "cold" | "new" | "done";
export type LeadState = "new" | "interested" | "counseling" | "enrolled" | "contacted" | "qualified" | "meeting" | "deal";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: LeadType;
  source: LeadSource;
  icp: string;
  score: number;
  fitScore: number;
  intentScore: number;
  timingScore: number;
  status: LeadStatus;
  state: LeadState;
  campaign: string;
  location: string;
  nextAction: string;
  lastActivity: string;
  intentEvents: IntentEvent[];
}

export interface IntentEvent {
  time: string;
  action: string;
  points: number;
}

export interface Metric {
  label: string;
  value: string;
  delta: string;
  deltaType: "up" | "down" | "neutral";
}

export interface ICP {
  name: string;
  type: LeadType;
  details: Record<string, string>;
  color: string;
}

export interface ConversationMessage {
  sender: "lead" | "ai" | "system";
  text: string;
}

export interface Conversation {
  lead: string;
  type: LeadType;
  channel: string;
  role: string;
  messages: ConversationMessage[];
}

// Leads
export const leads: Lead[] = [
  {
    id: "1", name: "Priya Sharma", email: "priya@amity.edu", phone: "+91-98xxxx1234",
    type: "B2B", source: "apollo", icp: "College partnerships", score: 75,
    fitScore: 82, intentScore: 73, timingScore: 65,
    status: "hot", state: "meeting", campaign: "Colleges-Q2-India", location: "Noida, UP",
    nextAction: "LinkedIn DM today", lastActivity: "Mar 17",
    intentEvents: [
      { time: "Mar 14 10:22", action: "Opened email #1", points: 20 },
      { time: "Mar 14 10:25", action: "Clicked demo link", points: 25 },
      { time: "Mar 15 09:11", action: "Visited /pricing (2 min)", points: 30 },
      { time: "Mar 15 09:13", action: "Visited /features", points: 15 },
      { time: "Mar 16 11:00", action: "Opened email #2", points: 20 },
      { time: "Mar 17 08:30", action: "Inactive (24h)", points: -10 },
    ],
  },
  {
    id: "2", name: "Ravi Kumar", email: "ravi.k@gmail.com", phone: "+91-97xxxx5678",
    type: "B2C", source: "ads", icp: "Career switcher", score: 81,
    fitScore: 78, intentScore: 80, timingScore: 90,
    status: "hot", state: "counseling", campaign: "Meta-DS-Mar", location: "Mumbai, MH",
    nextAction: "Call — intent spike", lastActivity: "Mar 17",
    intentEvents: [
      { time: "Mar 16 14:10", action: "Clicked Meta ad", points: 20 },
      { time: "Mar 16 14:12", action: "Filled landing page form", points: 35 },
      { time: "Mar 16 14:20", action: "Attended webinar (40 min)", points: 30 },
      { time: "Mar 17 09:05", action: "Opened WhatsApp msg", points: 15 },
    ],
  },
  {
    id: "3", name: "Neha Joshi", email: "neha.j@outlook.com", phone: "+91-99xxxx9012",
    type: "B2C", source: "ads", icp: "College student", score: 79,
    fitScore: 75, intentScore: 82, timingScore: 78,
    status: "hot", state: "interested", campaign: "Meta-DS-Mar", location: "Pune, MH",
    nextAction: "WhatsApp follow-up", lastActivity: "Mar 16",
    intentEvents: [
      { time: "Mar 15 18:30", action: "Clicked Instagram ad", points: 20 },
      { time: "Mar 15 18:35", action: "Watched 3-min video", points: 25 },
      { time: "Mar 16 10:00", action: "Visited /syllabus", points: 20 },
    ],
  },
  {
    id: "4", name: "Rahul Mehta", email: "rahul@upgrad.com", phone: "+91-98xxxx3456",
    type: "B2B", source: "apollo", icp: "HR / L&D heads", score: 71,
    fitScore: 70, intentScore: 68, timingScore: 75,
    status: "hot", state: "qualified", campaign: "Apollo-HR-Q2", location: "Bengaluru, KA",
    nextAction: "Email follow-up #2", lastActivity: "Mar 15",
    intentEvents: [
      { time: "Mar 13 09:00", action: "Opened email #1", points: 20 },
      { time: "Mar 14 11:30", action: "Forwarded to team", points: 30 },
    ],
  },
  {
    id: "5", name: "Anjali Singh", email: "anjali.s@yahoo.com", phone: "+91-96xxxx7890",
    type: "B2C", source: "upload", icp: "Skill learner", score: 68,
    fitScore: 65, intentScore: 70, timingScore: 68,
    status: "warm", state: "interested", campaign: "Client-Upload-Mar", location: "Delhi",
    nextAction: "Drip email sequence", lastActivity: "Mar 14",
    intentEvents: [
      { time: "Mar 12 16:00", action: "Form submitted (client list)", points: 15 },
      { time: "Mar 14 09:20", action: "Opened welcome email", points: 20 },
    ],
  },
  {
    id: "6", name: "Dev Patel", email: "dev.p@gmail.com", phone: "+91-95xxxx2345",
    type: "B2C", source: "ads", icp: "Career switcher", score: 52,
    fitScore: 55, intentScore: 48, timingScore: 53,
    status: "warm", state: "new", campaign: "Google-DS-Mar", location: "Ahmedabad, GJ",
    nextAction: "WhatsApp nurture", lastActivity: "Mar 13",
    intentEvents: [
      { time: "Mar 13 14:00", action: "Clicked Google ad", points: 15 },
      { time: "Mar 13 14:05", action: "Bounced after 30s", points: -5 },
    ],
  },
  {
    id: "7", name: "Sneha Iyer", email: "sneha@niit.com", phone: "+91-94xxxx6789",
    type: "B2B", source: "apollo", icp: "College partnerships", score: 64,
    fitScore: 72, intentScore: 55, timingScore: 60,
    status: "warm", state: "contacted", campaign: "Apollo-Colleges-Q2", location: "Chennai, TN",
    nextAction: "Follow-up email", lastActivity: "Mar 12",
    intentEvents: [
      { time: "Mar 10 10:00", action: "Email delivered", points: 5 },
      { time: "Mar 12 09:15", action: "Opened email #1", points: 20 },
    ],
  },
  {
    id: "8", name: "Aryan Verma", email: "aryan.v@gmail.com", phone: "+91-93xxxx0123",
    type: "B2C", source: "ads", icp: "College student", score: 45,
    fitScore: 50, intentScore: 40, timingScore: 45,
    status: "cold", state: "new", campaign: "Meta-Awareness", location: "Jaipur, RJ",
    nextAction: "Add to drip", lastActivity: "Mar 10",
    intentEvents: [
      { time: "Mar 10 20:00", action: "Saw ad (impression)", points: 5 },
    ],
  },
];

// Overview metrics
export const overviewMetrics: Metric[] = [
  { label: "Total leads", value: "2,847", delta: "+312 this week", deltaType: "up" },
  { label: "Hot queue", value: "143", delta: "+28 today", deltaType: "up" },
  { label: "Meetings booked", value: "41", delta: "+6 this week", deltaType: "up" },
  { label: "Conversion rate", value: "3.2%", delta: "+0.4% vs last", deltaType: "up" },
];

export const queueMetrics: Metric[] = [
  { label: "Hot", value: "143", delta: "act now", deltaType: "up" },
  { label: "Warm", value: "489", delta: "nurture", deltaType: "neutral" },
  { label: "Cold", value: "2,215", delta: "drip", deltaType: "neutral" },
  { label: "Intent spike", value: "18", delta: "same-day outreach", deltaType: "down" },
];

export const analyticsMetrics: Metric[] = [
  { label: "Best source", value: "Meta Ads", delta: "2.8× ROI", deltaType: "up" },
  { label: "Best ICP", value: "Colleges", delta: "2.4× conv.", deltaType: "up" },
  { label: "Best channel", value: "WhatsApp", delta: "B2C +3.1×", deltaType: "up" },
  { label: "Best language", value: "Hinglish", delta: "Creators", deltaType: "up" },
];

// ICPs
export const b2cICPs: ICP[] = [
  { name: "College student", type: "B2C", color: "sdr-blue", details: { Goal: "job-ready skills", Budget: "₹30–60k", Speed: "2–4 weeks", Channel: "WhatsApp, Instagram ads" } },
  { name: "Career switcher", type: "B2C", color: "sdr-green", details: { Goal: "salary jump", Budget: "₹50–90k", Speed: "1–2 weeks", Channel: "LinkedIn, Google" } },
  { name: "Skill learner", type: "B2C", color: "sdr-purple", details: { Goal: "upskill for role", Budget: "₹10–30k", Speed: "impulse buy", Channel: "YouTube, WhatsApp" } },
  { name: "Parent", type: "B2C", color: "sdr-orange", details: { Goal: "child placement", Budget: "₹40–80k", Speed: "3–6 weeks", Channel: "Calls, WhatsApp" } },
];

export const b2bICPs: ICP[] = [
  { name: "College partnerships", type: "B2B", color: "sdr-blue", details: { Contact: "Director, VP Academics", "Deal size": "₹5–20L", Speed: "8–12 weeks", Channel: "Email + call" } },
  { name: "HR / L&D heads", type: "B2B", color: "sdr-green", details: { Contact: "CHRO, L&D Manager", "Deal size": "₹2–8L", Speed: "4–8 weeks", Channel: "LinkedIn + email" } },
  { name: "Bootcamp tie-ups", type: "B2B", color: "sdr-purple", details: { Contact: "Founder, Head of Growth", "Deal size": "Rev share", Speed: "2–4 weeks", Channel: "LinkedIn DM" } },
  { name: "Enterprise bulk", type: "B2B", color: "sdr-orange", details: { Contact: "Procurement, CTO", "Deal size": "₹10–50L", Speed: "12–24 weeks", Channel: "Email + call" } },
];

// Conversations
export const conversations: Conversation[] = [
  {
    lead: "Priya Sharma", type: "B2B", channel: "Email", role: "AI acting as sales rep",
    messages: [
      { sender: "lead", text: "Thanks for reaching out. We're evaluating 2 vendors. What makes you different from Coursera?" },
      { sender: "ai", text: "Great question Priya — key difference is live cohort delivery + your own branded program (Coursera is self-paced consumer). We've helped 3 similar universities get 93%+ placement. 15-min side-by-side demo this week?" },
      { sender: "system", text: "Classification: Interested + comparison objection\nSentiment: Positive (0.74) · Intent: +15\nNext state: Negotiation → schedule meeting" },
    ],
  },
  {
    lead: "Ravi Kumar", type: "B2C", channel: "WhatsApp", role: "AI acting as admission counselor",
    messages: [
      { sender: "lead", text: "Bhai yeh 49k mein kya milega exactly? Aur job guarantee real hai?" },
      { sender: "ai", text: "Ravi bhai, bilkul real hai! 6 mahine mein — live classes, 1-on-1 mentorship, aur placement support jab tak job na mile. 93% grads placed in 90 days. Free demo class aaj shaam 6 baje lega kya?" },
      { sender: "system", text: "Classification: Price query + trust objection\nSentiment: Curious (0.61) · Intent: +10\nNext action: Book demo class" },
    ],
  },
];

// Flow steps
export const flowSteps = [
  { label: "Client input", done: true },
  { label: "AI pitch", done: true },
  { label: "Dual ICP", done: true },
  { label: "Lead sources", done: true },
  { label: "Ingestion", done: true },
  { label: "Intent tracking", active: true },
  { label: "Scoring" },
  { label: "Queue" },
  { label: "Batching" },
  { label: "Channels" },
  { label: "Messaging" },
  { label: "Infra" },
  { label: "Responses" },
  { label: "AI convo" },
  { label: "States" },
  { label: "Meetings" },
  { label: "Analytics" },
  { label: "Optimize" },
];

// Optimizations
export const optimizations = [
  { label: "ICP-A (Colleges) weight", change: "0.40 → 0.52 (high ROI)", up: true },
  { label: "ICP-C (Creators) channel", change: "Email → WhatsApp (+reply)", up: true },
  { label: "Timing score weight", change: "0.20 → 0.25 (recency matters)", up: true },
  { label: "Subject line variant", change: "B adopted (38% > 29%)", up: true },
  { label: "Apollo filter strategy", change: "Aggressive → Balanced", up: true },
  { label: "B2C send time", change: "Noon → 7 PM (higher open)", up: false },
  { label: "Hinglish tone", change: "Adopted for all creators", up: true },
];

export const sourceBarData = [
  { label: "Apollo (B2B)", value: 840, pct: 30, color: "bg-sdr-blue" },
  { label: "Ads / inbound (B2C)", value: 1680, pct: 59, color: "bg-sdr-green" },
  { label: "Client upload", value: 327, pct: 11, color: "bg-sdr-orange" },
];

export const funnelSteps = [
  { label: "Total leads", value: 2847, pct: 100, rate: "" },
  { label: "Contacted", value: 2220, pct: 78, rate: "78%" },
  { label: "Replied", value: 626, pct: 22, rate: "22%" },
  { label: "Meetings", value: 196, pct: 7, rate: "7%" },
  { label: "Converted", value: 91, pct: 3, rate: "3.2%" },
];

export type NavPage = "overview" | "campaign" | "pitch" | "icp" | "sources" | "intent" | "queue" | "channels" | "convo" | "states" | "analytics" | "optimize";

export const navItems: { key: NavPage; label: string; section: string; color: string }[] = [
  { key: "overview", label: "Command Center", section: "Targeting", color: "bg-[hsl(var(--ai-blue))]" },
  { key: "campaign", label: "Campaigns", section: "Targeting", color: "bg-[hsl(var(--ai-green))]" },
  { key: "pitch", label: "AI Pitch Generator", section: "Targeting", color: "bg-[hsl(var(--ai-purple))]" },
  { key: "icp", label: "ICP Intelligence", section: "Targeting", color: "bg-[hsl(var(--ai-teal))]" },
  { key: "sources", label: "Lead Sources", section: "Targeting", color: "bg-[hsl(var(--ai-orange))]" },
  { key: "intent", label: "Intent Radar", section: "Targeting", color: "bg-[hsl(var(--ai-red))]" },
  { key: "queue", label: "Priority Engine", section: "Outreach", color: "bg-[hsl(var(--ai-blue))]" },
  { key: "channels", label: "Channel Mix", section: "Outreach", color: "bg-[hsl(var(--ai-green))]" },
  { key: "convo", label: "AI Conversations", section: "Outreach", color: "bg-[hsl(var(--ai-orange))]" },
  { key: "states", label: "Lead Journey", section: "Outreach", color: "bg-[hsl(var(--ai-purple))]" },
  { key: "analytics", label: "Analytics Hub", section: "Intelligence", color: "bg-[hsl(var(--ai-blue-dark))]" },
  { key: "optimize", label: "Self-Learning Loop", section: "Intelligence", color: "bg-[hsl(var(--ai-green))]" },
];

export const pageTitles: Record<NavPage, string> = {
  overview: "AI Command Center",
  campaign: "AI Campaign Engine",
  pitch: "AI Pitch Generator",
  icp: "ICP Intelligence",
  sources: "Lead Sources & Ingestion",
  intent: "Intent Radar & Scoring",
  queue: "Priority Engine",
  channels: "Channel Intelligence",
  convo: "AI Conversation Engine",
  states: "Lead Journey Map",
  analytics: "Analytics Hub",
  optimize: "Self-Learning Loop",
};
