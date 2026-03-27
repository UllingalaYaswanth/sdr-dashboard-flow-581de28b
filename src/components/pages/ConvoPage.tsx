import { useState } from "react";
import { conversations, Conversation } from "@/data/mockData";
import { motion } from "framer-motion";

const responseLogic = [
  { trigger: "No open after 2 days", action: "Change subject line", color: "bg-muted-foreground" },
  { trigger: "Opened, no reply", action: "Send follow-up", color: "bg-sdr-orange" },
  { trigger: "Clicked, no reply", action: "Switch channel", color: "bg-sdr-orange" },
  { trigger: "Intent spike +30", action: "Escalate: call now", color: "bg-sdr-coral" },
  { trigger: "Replied positive", action: "AI handles → qualify", color: "bg-sdr-green" },
  { trigger: 'Replied: "not now"', action: "Add to 30-day drip", color: "bg-sdr-blue" },
];

const aiCapabilities = [
  { name: "Objection handling", detail: "Price, time, trust" },
  { name: "Qualification questions", detail: "Budget, timeline, role" },
  { name: "Pricing negotiation", detail: "Discount logic" },
  { name: "Sentiment scoring", detail: "0–1 per message" },
  { name: "Meeting booking trigger", detail: "Auto on hot signal" },
];

function ConvoCard({ convo }: { convo: Conversation }) {
  return (
    <div className="sdr-card mb-3">
      <div className="text-xs text-muted-foreground mb-2">Role: {convo.role} · Channel: {convo.channel}</div>
      {convo.messages.map((msg, i) => {
        let cls = "sdr-convo-bubble bg-secondary text-muted-foreground";
        if (msg.sender === "ai") cls = "sdr-convo-bubble bg-sdr-blue-light text-sdr-blue-dark";
        if (msg.sender === "system") cls = "sdr-convo-bubble bg-sdr-green-light text-sdr-green-dark font-mono text-xs";
        return (
          <div key={i} className={cls}>
            {msg.sender === "system" ? (
              <pre className="whitespace-pre-wrap">{msg.text}</pre>
            ) : (
              msg.text
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ConvoPage() {
  const [activeConvo, setActiveConvo] = useState(0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-3">
      <div>
        <div className="flex gap-1.5 mb-2">
          {conversations.map((c, i) => (
            <button
              key={c.lead}
              onClick={() => setActiveConvo(i)}
              className={`sdr-badge cursor-pointer transition-colors ${
                i === activeConvo ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-accent"
              }`}
            >
              {c.lead} ({c.type})
            </button>
          ))}
        </div>
        <div className="sdr-section-title">{conversations[activeConvo].type} conversation — {conversations[activeConvo].lead}</div>
        <ConvoCard convo={conversations[activeConvo]} />
      </div>
      <div>
        <div className="sdr-section-title">Response engine logic</div>
        <div className="sdr-card mb-3">
          {responseLogic.map((r) => (
            <div key={r.trigger} className="sdr-state-row">
              <span className={`sdr-state-dot ${r.color}`} />
              <span className="flex-1 text-sm">{r.trigger}</span>
              <span className={`text-xs ${r.color === "bg-sdr-coral" ? "text-sdr-coral" : r.color === "bg-sdr-green" ? "text-sdr-green" : "text-muted-foreground"}`}>{r.action}</span>
            </div>
          ))}
        </div>
        <div className="sdr-section-title">AI capability stack</div>
        <div className="sdr-card">
          {aiCapabilities.map((c) => (
            <div key={c.name} className="sdr-state-row">
              <span className="sdr-state-dot bg-sdr-green" />
              <span className="flex-1 text-sm">{c.name}</span>
              <span className="text-xs text-muted-foreground">{c.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
