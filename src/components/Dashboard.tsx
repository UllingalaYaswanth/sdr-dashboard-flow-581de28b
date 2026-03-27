import { useState } from "react";
import { NavPage, navItems, pageTitles } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { OverviewPage } from "@/components/pages/OverviewPage";
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
import { Menu, X } from "lucide-react";

const pageComponents: Record<NavPage, () => JSX.Element> = {
  overview: OverviewPage,
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
        <div className="fixed inset-0 bg-foreground/20 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:sticky md:translate-x-0 top-0 left-0 z-40 w-[200px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-200`}
      >
        <div className="px-3.5 py-3 border-b border-sidebar-border">
          <div className="text-sm font-medium">EdGrowth V3</div>
          <div className="text-xs text-muted-foreground mt-0.5">Hybrid engine</div>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto">
          {navItems.map((item) => {
            const showSection = item.section !== currentSection;
            if (showSection) currentSection = item.section;
            return (
              <div key={item.key}>
                {showSection && (
                  <div className="px-3.5 pt-3 pb-1 text-[10px] text-muted-foreground uppercase tracking-wider">
                    {item.section}
                  </div>
                )}
                <button
                  onClick={() => {
                    setActivePage(item.key);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3.5 py-1.5 text-xs transition-colors ${
                    activePage === item.key
                      ? "bg-card text-foreground font-medium border-r-2 border-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.color}`} />
                  {item.label}
                </button>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-2.5 flex items-center gap-2.5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1 rounded hover:bg-secondary transition-colors"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <h1 className="text-[15px] font-medium flex-1">{pageTitles[activePage]}</h1>
          <Badge variant="secondary" className="sdr-badge bg-[hsl(var(--badge-hybrid-bg))] text-[hsl(var(--badge-hybrid-fg))]">V3 hybrid</Badge>
          <Badge variant="secondary" className="sdr-badge bg-[hsl(var(--badge-b2b-bg))] text-[hsl(var(--badge-b2b-fg))]">B2B</Badge>
          <Badge variant="secondary" className="sdr-badge bg-[hsl(var(--badge-b2c-bg))] text-[hsl(var(--badge-b2c-fg))]">B2C</Badge>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
}
