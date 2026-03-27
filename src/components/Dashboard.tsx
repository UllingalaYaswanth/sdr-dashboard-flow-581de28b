import { useState } from "react";
import { NavPage, navItems, pageTitles } from "@/data/mockData";
import OverviewPageV2 from "@/components/pages/OverviewPageV2";
import { CampaignPage } from "@/components/pages/CampaignPage";
import { PitchPage } from "@/components/pages/PitchPage";
import { ICPPage } from "@/components/pages/ICPPage";
import { SourcesPage } from "@/components/pages/SourcesPage";
import { IntentPage } from "@/components/pages/IntentPage";
import { QueuePage } from "@/components/pages/QueuePage";
import { ChannelsPage } from "@/components/pages/ChannelsPage";
import { ConvoPage } from "@/components/pages/ConvoPage";
import { StatesPage } from "@/components/pages/StatesPage";
import { AnalyticsPage } from "@/components/pages/AnalyticsPage";
import { OptimizePage } from "@/components/pages/OptimizePage";
import LeadFunnelPage from "@/components/pages/LeadFunnelPage";
import CounselorPage from "@/components/pages/CounselorPage";
import { Menu, X, Zap, Brain, Bot, ChevronRight } from "lucide-react";

const pageComponents: Record<NavPage, () => JSX.Element> = {
  overview: OverviewPageV2,
  campaign: CampaignPage,
  pitch: PitchPage,
  icp: ICPPage,
  sources: SourcesPage,
  intent: IntentPage,
  queue: QueuePage,
  channels: ChannelsPage,
  convo: ConvoPage,
  states: StatesPage,
  analytics: AnalyticsPage,
  optimize: OptimizePage,
  funnel: LeadFunnelPage,
  counselor: CounselorPage,
};

const sectionIcons: Record<string, typeof Zap> = {
  "Targeting": Brain,
  "Outreach": Bot,
  "Intelligence": Zap,
};

export default function Dashboard() {
  const [activePage, setActivePage] = useState<NavPage>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const ActiveComponent = pageComponents[activePage];
  let currentSection = "";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar — dark AI theme */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:sticky md:translate-x-0 top-0 left-0 z-40 w-[220px] h-screen flex flex-col transition-transform duration-200`}
        style={{ background: "hsl(var(--sidebar-background))" }}
      >
        {/* Logo */}
        <div className="px-4 py-4 border-b border-[hsl(var(--sidebar-border))]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--ai-blue)), hsl(var(--ai-purple)))" }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-white tracking-tight leading-tight">OyeSell AI</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="ai-live-dot" />
                <span className="text-[10px]" style={{ color: "hsl(var(--ai-green))" }}>SDR Engine active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map((item) => {
            const showSection = item.section !== currentSection;
            if (showSection) currentSection = item.section;
            const isActive = activePage === item.key;
            return (
              <div key={item.key}>
                {showSection && (
                  <div className="px-4 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "hsl(var(--sidebar-foreground) / 0.5)" }}>
                    {item.section}
                  </div>
                )}
                <button
                  onClick={() => {
                    setActivePage(item.key);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2 text-[13px] transition-all duration-150 relative ${
                    isActive
                      ? "text-white font-medium"
                      : "font-normal hover:text-white"
                  }`}
                  style={{
                    color: isActive ? "white" : "hsl(var(--sidebar-foreground))",
                    background: isActive ? "hsl(var(--sidebar-accent))" : "transparent",
                  }}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4/5 rounded-r-full"
                      style={{ background: "hsl(var(--ai-blue))" }}
                    />
                  )}
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.color}`} />
                  {item.label}
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
                </button>
              </div>
            );
          })}
        </nav>

        {/* Bottom status */}
        <div className="px-4 py-3 border-t" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
          <div className="rounded-lg p-2.5" style={{ background: "hsl(var(--sidebar-accent))" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold" style={{ color: "hsl(var(--sidebar-foreground))" }}>AI Activity</span>
              <span className="text-[10px] font-bold" style={{ color: "hsl(var(--ai-green))" }}>LIVE</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color: "hsl(var(--sidebar-foreground) / 0.7)" }}>Messages sent</span>
                <span className="text-[10px] font-medium text-white">2,847</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color: "hsl(var(--sidebar-foreground) / 0.7)" }}>Sequences active</span>
                <span className="text-[10px] font-medium text-white">143</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-5 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] font-semibold truncate">{pageTitles[activePage]}</h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{ background: "hsl(var(--badge-ai-bg))", color: "hsl(var(--badge-ai-fg))" }}>
              <Zap className="w-3 h-3" />
              AI SDR
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{ background: "hsl(var(--badge-b2b-bg))", color: "hsl(var(--badge-b2b-fg))" }}>
              B2B
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{ background: "hsl(var(--badge-b2c-bg))", color: "hsl(var(--badge-b2c-fg))" }}>
              B2C
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 overflow-y-auto">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
}
