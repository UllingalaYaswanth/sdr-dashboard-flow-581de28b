import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Lead, LeadStatus, LeadState, LeadType, LeadSource, IntentEvent, leads as initialLeads, Conversation, conversations as initialConversations, ConversationMessage } from "@/data/mockData";
import { toast } from "sonner";

interface LeadContextType {
  leads: Lead[];
  conversations: Conversation[];
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  updateLeadState: (id: string, state: LeadState) => void;
  addIntentEvent: (id: string, event: IntentEvent) => void;
  addConversationMessage: (index: number, message: ConversationMessage) => void;
  getFilteredLeads: (filters: LeadFilters) => Lead[];
  searchLeads: (query: string) => Lead[];
}

export interface LeadFilters {
  status?: LeadStatus[];
  type?: LeadType[];
  source?: LeadSource[];
  minScore?: number;
}

const LeadContext = createContext<LeadContextType | null>(null);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);

  const addLead = useCallback((lead: Lead) => {
    setLeads(prev => [lead, ...prev]);
    toast.success(`Lead "${lead.name}" added to pipeline`);
  }, []);

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  }, []);

  const updateLeadStatus = useCallback((id: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    const lead = leads.find(l => l.id === id);
    toast.success(`${lead?.name} moved to ${status}`);
  }, [leads]);

  const updateLeadState = useCallback((id: string, state: LeadState) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, state } : l));
    const lead = leads.find(l => l.id === id);
    toast.success(`${lead?.name} → ${state}`);
  }, [leads]);

  const addIntentEvent = useCallback((id: string, event: IntentEvent) => {
    setLeads(prev => prev.map(l =>
      l.id === id
        ? { ...l, intentEvents: [...l.intentEvents, event], intentScore: Math.min(100, l.intentScore + event.points), score: Math.min(100, l.score + Math.round(event.points * 0.4)) }
        : l
    ));
  }, []);

  const addConversationMessage = useCallback((index: number, message: ConversationMessage) => {
    setConversations(prev => prev.map((c, i) =>
      i === index ? { ...c, messages: [...c.messages, message] } : c
    ));
  }, []);

  const getFilteredLeads = useCallback((filters: LeadFilters) => {
    return leads.filter(l => {
      if (filters.status?.length && !filters.status.includes(l.status)) return false;
      if (filters.type?.length && !filters.type.includes(l.type)) return false;
      if (filters.source?.length && !filters.source.includes(l.source)) return false;
      if (filters.minScore && l.score < filters.minScore) return false;
      return true;
    });
  }, [leads]);

  const searchLeads = useCallback((query: string) => {
    const q = query.toLowerCase();
    return leads.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.icp.toLowerCase().includes(q) ||
      l.campaign.toLowerCase().includes(q)
    );
  }, [leads]);

  return (
    <LeadContext.Provider value={{ leads, conversations, addLead, updateLead, updateLeadStatus, updateLeadState, addIntentEvent, addConversationMessage, getFilteredLeads, searchLeads }}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads() {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error("useLeads must be used within LeadProvider");
  return ctx;
}
