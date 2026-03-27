import { motion } from "framer-motion";

interface FunnelStage {
  label: string;
  count: number;
  converted: string | null;
  dropOff: string | null;
  width: string;
}

interface Campaign {
  id: string;
  name: string;
  sent: number;
  opens: number;
  replies: number;
  interested: number;
}

interface LeadFunnelPageProps {
  campaign?: Campaign;
}

const globalFunnelStages: FunnelStage[] = [
  { label: "LEADS DISCOVERED", count: 12847, converted: null, dropOff: null, width: "100%" },
  { label: "Contacted by AI", count: 11562, converted: "90% converted", dropOff: "10% drop-off", width: "90%" },
  { label: "Conversation Started", count: 9832, converted: "85% converted", dropOff: "15% drop-off", width: "76%" },
  { label: "Qualified Lead", count: 5421, converted: "55% converted", dropOff: "45% drop-off", width: "42%" },
  { label: "Counseling Call Booked", count: 2845, converted: "52% converted", dropOff: "48% drop-off", width: "34%" },
  { label: "Attended Call", count: 2276, converted: "80% converted", dropOff: "20% drop-off", width: "29%" },
];

const colors = [
  "hsl(263, 70%, 58%)", "hsl(263, 70%, 58%)", "hsl(263, 60%, 55%)",
  "hsl(263, 50%, 50%)", "hsl(200, 70%, 50%)", "hsl(160, 70%, 48%)", "hsl(36, 95%, 55%)",
];

export default function LeadFunnelPage({ campaign }: LeadFunnelPageProps) {
  let stages = globalFunnelStages;
  let summary = {
    conversion: "14.7%",
    enrolled: 1892,
    dropoffs: 10955
  };

  if (campaign) {
    // Generate dynamic stages based on campaign stats
    const sent = campaign.sent;
    const opened = campaign.opens;
    const replied = campaign.replies;
    const interested = campaign.interested;
    const hypotheticalMeetings = Math.floor(interested * 0.6);
    const hypotheticalEnrolled = Math.floor(hypotheticalMeetings * 0.4);

    stages = [
      { 
        label: "LEADS DISCOVERED", 
        count: sent * 1.5, 
        converted: null, 
        dropOff: null, 
        width: "100%" 
      },
      { 
        label: "Outreach Sent", 
        count: sent, 
        converted: `${Math.round((sent / (sent * 1.5 || 1)) * 100)}% reach`, 
        dropOff: null, 
        width: `${(sent / (sent * 1.5 || 1)) * 100}%` 
      },
      { 
        label: "Opened / Engaged", 
        count: opened, 
        converted: `${Math.round((opened / (sent || 1)) * 100)}% open rate`, 
        dropOff: `${Math.round(((sent - opened) / (sent || 1)) * 100)}% bounce`, 
        width: `${(opened / (sent * 1.5 || 1)) * 100}%` 
      },
      { 
        label: "SDR Replies", 
        count: replied, 
        converted: `${Math.round((replied / (opened || 1)) * 100)}% reply rate`, 
        dropOff: `${Math.round(((opened - replied) / (opened || 1)) * 100)}% no-reply`, 
        width: `${(replied / (sent * 1.5 || 1)) * 100}%` 
      },
      { 
        label: "Interested / Qualified", 
        count: interested, 
        converted: `${Math.round((interested / (replied || 1)) * 100)}% interest`, 
        dropOff: `${Math.round(((replied - interested) / (replied || 1)) * 100)}% rejection`, 
        width: `${(interested / (sent * 1.5 || 1)) * 100}%` 
      },
      { 
        label: "Meetings Booked", 
        count: hypotheticalMeetings, 
        converted: `${Math.round((hypotheticalMeetings / (interested || 1)) * 100)}% booking`, 
        dropOff: null, 
        width: `${(hypotheticalMeetings / (sent * 1.5 || 1)) * 100}%` 
      },
    ];

    summary = {
      conversion: `${((hypotheticalEnrolled / (sent || 1)) * 100).toFixed(1)}%`,
      enrolled: hypotheticalEnrolled,
      dropoffs: sent - hypotheticalEnrolled
    };
  }

  return (
    <div className="space-y-6">
      {!campaign && (
        <div>
          <h1 className="text-2xl font-bold text-foreground">Global Lead Pipeline Funnel</h1>
          <p className="text-sm text-muted-foreground">Aggregate performance metrics across all AI SDR activity</p>
        </div>
      )}

      <div className={`rounded-2xl border border-border bg-card p-6 ${campaign ? 'shadow-none border-none bg-transparent px-0' : 'shadow-sm'}`}>
        {!campaign && <h3 className="text-lg font-semibold text-foreground mb-6">Performance Visualization</h3>}
        <div className="space-y-5">
          {stages.map((stage, i) => (
            <div key={stage.label} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-foreground uppercase tracking-tight">{stage.label}</span>
                <div className="flex gap-3 text-[10px] font-medium">
                  <span className="text-muted-foreground">{stage.count.toLocaleString()} leads</span>
                  {stage.converted && <span className="text-[hsl(var(--ai-green))]">{stage.converted}</span>}
                  {stage.dropOff && <span className="text-[hsl(var(--ai-red))] opacity-70 group-hover:opacity-100 transition-opacity">{stage.dropOff}</span>}
                </div>
              </div>
              <div className="relative h-9 w-full rounded-xl bg-secondary/50 overflow-hidden border border-border/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: stage.width }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-xl flex items-center justify-end pr-4 text-[10px] font-bold text-white shadow-lg"
                  style={{ backgroundColor: colors[i % colors.length] }}
                >
                  <span className="drop-shadow-sm">{Math.round(stage.count).toLocaleString()} leads</span>
                </motion.div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-10 rounded-2xl border border-border/50 p-6 bg-secondary/20 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-xl font-bold text-[hsl(var(--ai-green))]">{summary.conversion}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Conversion</p>
          </div>
          <div className="text-center border-x border-border/50">
            <p className="text-xl font-bold text-[hsl(var(--ai-blue))]">{summary.enrolled.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Success</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[hsl(var(--ai-red))] opacity-80">{summary.dropoffs.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Churned</p>
          </div>
        </div>
      </div>
    </div>
  );
}
