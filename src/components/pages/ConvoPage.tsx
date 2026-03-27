import { useState, useRef, useEffect } from "react";
import { useLeads } from "@/context/LeadContext";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Monitor } from "lucide-react";

const aiReplies: Record<string, string[]> = {
  default: [
    "Great question! Let me break this down for you. Our program is designed specifically for working professionals who want to transition into data science.",
    "I understand your concern. Many of our successful graduates had the same worry. Here's what makes us different — we provide 1-on-1 mentorship until you land a job.",
    "Absolutely! We offer flexible EMI options starting at ₹4,900/month. Plus, our job guarantee means you don't pay if you don't get placed within 6 months.",
    "That's a smart comparison. Unlike self-paced platforms, we offer live cohort classes, real project experience, and direct hiring partnerships with 200+ companies.",
  ],
  hindi: [
    "Bilkul sahi sawaal! Humara program specially working professionals ke liye hai. 6 mahine mein complete ho jaata hai.",
    "Tension mat lo bhai! 93% students placed hue hain. Aur job guarantee bhi milti hai — nahi lagi toh full refund.",
    "EMI option available hai — ₹4,900/month se start. Aur placement support jab tak job na mile.",
  ],
};

const systemAnalysis = [
  "Classification: {type} · Sentiment: Positive (0.74)\nIntent: +15 points · Next: Qualify → book demo",
  "Classification: Price inquiry · Sentiment: Curious (0.61)\nIntent: +10 points · Next: Share EMI options",
  "Classification: Comparison objection · Sentiment: Neutral (0.52)\nIntent: +5 points · Next: Differentiation pitch",
  "Classification: Trust query · Sentiment: Skeptical (0.45)\nIntent: +8 points · Next: Share testimonials",
];

const responseLogic = [
  { trigger: "No open after 2 days", action: "Change subject line", color: "bg-muted-foreground" },
  { trigger: "Opened, no reply", action: "Send follow-up", color: "bg-sdr-orange" },
  { trigger: "Clicked, no reply", action: "Switch channel", color: "bg-sdr-orange" },
  { trigger: "Intent spike +30", action: "Escalate: call now", color: "bg-sdr-coral" },
  { trigger: "Replied positive", action: "AI handles → qualify", color: "bg-sdr-green" },
  { trigger: '"not now"', action: "Add to 30-day drip", color: "bg-sdr-blue" },
];

const aiCapabilities = [
  { name: "Objection handling", detail: "Price, time, trust", active: true },
  { name: "Qualification questions", detail: "Budget, timeline, role", active: true },
  { name: "Pricing negotiation", detail: "Discount logic", active: true },
  { name: "Sentiment scoring", detail: "0–1 per message", active: true },
  { name: "Meeting booking trigger", detail: "Auto on hot signal", active: true },
];

export function ConvoPage() {
  const { conversations, addConversationMessage } = useLeads();
  const [activeConvo, setActiveConvo] = useState(0);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const convo = conversations[activeConvo];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convo?.messages.length]);

  const handleSend = () => {
    if (!inputText.trim() || isTyping) return;
    const text = inputText.trim();
    setInputText("");

    // Add lead message
    addConversationMessage(activeConvo, { sender: "lead", text });

    // Simulate AI typing
    setIsTyping(true);
    setTimeout(() => {
      const isHindi = /bhai|kya|hai|kaise|kitna|aur/i.test(text);
      const replies = isHindi ? aiReplies.hindi : aiReplies.default;
      const reply = replies[Math.floor(Math.random() * replies.length)];
      addConversationMessage(activeConvo, { sender: "ai", text: reply });

      // Add system analysis
      setTimeout(() => {
        const analysis = systemAnalysis[Math.floor(Math.random() * systemAnalysis.length)]
          .replace("{type}", convo.type === "B2B" ? "Business inquiry" : "Student inquiry");
        addConversationMessage(activeConvo, { sender: "system", text: analysis });
        setIsTyping(false);
      }, 600);
    }, 800 + Math.random() * 800);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-3">
      <div className="flex flex-col">
        <div className="flex gap-1.5 mb-2">
          {conversations.map((c, i) => (
            <button
              key={c.lead}
              onClick={() => setActiveConvo(i)}
              className={`sdr-badge cursor-pointer transition-all ${
                i === activeConvo ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-accent"
              }`}
            >
              {c.lead} ({c.type})
            </button>
          ))}
        </div>
        <div className="sdr-section-title">{convo.type} conversation — {convo.lead} · {convo.channel}</div>

        {/* Chat area */}
        <div className="sdr-card flex-1 flex flex-col max-h-[450px]">
          <div className="flex-1 overflow-y-auto space-y-2 mb-3">
            {convo.messages.map((msg, i) => {
              const isLead = msg.sender === "lead";
              const isAI = msg.sender === "ai";
              const isSystem = msg.sender === "system";
              return (
                <motion.div
                  key={i}
                  initial={i >= convo.messages.length - 3 ? { opacity: 0, y: 6 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${isLead ? "justify-start" : isAI ? "justify-start" : "justify-center"}`}
                >
                  {isLead && <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5"><User className="w-3 h-3 text-muted-foreground" /></div>}
                  {isAI && <div className="w-6 h-6 rounded-full bg-sdr-blue-light flex items-center justify-center flex-shrink-0 mt-0.5"><Bot className="w-3 h-3 text-sdr-blue-dark" /></div>}
                  <div className={`rounded-lg px-3 py-2 text-sm leading-relaxed max-w-[85%] ${
                    isLead ? "bg-secondary text-foreground" :
                    isAI ? "bg-sdr-blue-light text-sdr-blue-dark" :
                    "bg-sdr-green-light text-sdr-green-dark font-mono text-xs w-full"
                  }`}>
                    {isSystem && <div className="flex items-center gap-1 mb-1 text-[10px] opacity-70"><Monitor className="w-3 h-3" /> System analysis</div>}
                    {isSystem ? <pre className="whitespace-pre-wrap">{msg.text}</pre> : msg.text}
                  </div>
                </motion.div>
              );
            })}
            {isTyping && (
              <div className="flex gap-2 items-center">
                <div className="w-6 h-6 rounded-full bg-sdr-blue-light flex items-center justify-center"><Bot className="w-3 h-3 text-sdr-blue-dark" /></div>
                <div className="bg-sdr-blue-light rounded-lg px-3 py-2 text-sm text-sdr-blue-dark">
                  <span className="animate-pulse">typing...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 border-t border-border pt-2">
            <input
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder={`Type as ${convo.lead}... (try Hinglish for B2C)`}
              disabled={isTyping}
              className="flex-1 bg-secondary border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isTyping}
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="sdr-section-title">Response engine logic</div>
        <div className="sdr-card mb-3">
          {responseLogic.map(r => (
            <div key={r.trigger} className="sdr-state-row">
              <span className={`sdr-state-dot ${r.color}`} />
              <span className="flex-1 text-sm">{r.trigger}</span>
              <span className={`text-xs ${r.color === "bg-sdr-coral" ? "text-sdr-coral" : r.color === "bg-sdr-green" ? "text-sdr-green" : "text-muted-foreground"}`}>{r.action}</span>
            </div>
          ))}
        </div>
        <div className="sdr-section-title">AI capability stack</div>
        <div className="sdr-card">
          {aiCapabilities.map(c => (
            <div key={c.name} className="sdr-state-row">
              <span className={`sdr-state-dot ${c.active ? "bg-sdr-green" : "bg-muted-foreground"}`} />
              <span className="flex-1 text-sm">{c.name}</span>
              <span className="text-xs text-muted-foreground">{c.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
