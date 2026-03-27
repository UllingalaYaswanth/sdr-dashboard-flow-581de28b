import { Lead } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

interface LeadTableProps {
  leads: Lead[];
  onSelectLead?: (lead: Lead) => void;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    hot: "bg-[hsl(var(--badge-hot-bg))] text-[hsl(var(--badge-hot-fg))] hover:bg-[hsl(var(--badge-hot-bg))]",
    warm: "bg-[hsl(var(--badge-warm-bg))] text-[hsl(var(--badge-warm-fg))] hover:bg-[hsl(var(--badge-warm-bg))]",
    cold: "bg-[hsl(var(--badge-cold-bg))] text-[hsl(var(--badge-cold-fg))] hover:bg-[hsl(var(--badge-cold-bg))]",
    new: "bg-[hsl(var(--badge-new-bg))] text-[hsl(var(--badge-new-fg))] hover:bg-[hsl(var(--badge-new-bg))]",
    done: "bg-[hsl(var(--badge-done-bg))] text-[hsl(var(--badge-done-fg))] hover:bg-[hsl(var(--badge-done-bg))]",
  };
  return <Badge variant="secondary" className={`sdr-badge ${styles[status] || ""}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
}

function TypeBadge({ type }: { type: string }) {
  const s = type === "B2B"
    ? "bg-[hsl(var(--badge-b2b-bg))] text-[hsl(var(--badge-b2b-fg))]"
    : "bg-[hsl(var(--badge-b2c-bg))] text-[hsl(var(--badge-b2c-fg))]";
  return <Badge variant="secondary" className={`sdr-badge ${s}`}>{type}</Badge>;
}

function SourceBadge({ source }: { source: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    apollo: { label: "Apollo", cls: "bg-[hsl(var(--badge-b2b-bg))] text-[hsl(var(--badge-b2b-fg))]" },
    ads: { label: "Ads", cls: "bg-[hsl(var(--badge-b2c-bg))] text-[hsl(var(--badge-b2c-fg))]" },
    upload: { label: "Upload", cls: "bg-[hsl(var(--badge-warm-bg))] text-[hsl(var(--badge-warm-fg))]" },
  };
  const m = map[source] || { label: source, cls: "" };
  return <Badge variant="secondary" className={`sdr-badge ${m.cls}`}>{m.label}</Badge>;
}

export function LeadTable({ leads, onSelectLead }: LeadTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left font-medium text-muted-foreground text-xs py-1.5 px-2">Name</th>
            <th className="text-left font-medium text-muted-foreground text-xs py-1.5 px-2">Type</th>
            <th className="text-left font-medium text-muted-foreground text-xs py-1.5 px-2">Source</th>
            <th className="text-left font-medium text-muted-foreground text-xs py-1.5 px-2">Score</th>
            <th className="text-left font-medium text-muted-foreground text-xs py-1.5 px-2">Status</th>
            <th className="text-left font-medium text-muted-foreground text-xs py-1.5 px-2">Next action</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="border-b border-border last:border-b-0 hover:bg-secondary/50 cursor-pointer transition-colors"
              onClick={() => onSelectLead?.(lead)}
            >
              <td className="py-1.5 px-2 font-medium">{lead.name}</td>
              <td className="py-1.5 px-2"><TypeBadge type={lead.type} /></td>
              <td className="py-1.5 px-2"><SourceBadge source={lead.source} /></td>
              <td className="py-1.5 px-2 font-semibold">{lead.score}</td>
              <td className="py-1.5 px-2"><StatusBadge status={lead.status} /></td>
              <td className={`py-1.5 px-2 text-xs ${lead.status === "hot" ? "text-sdr-coral" : "text-muted-foreground"}`}>
                {lead.nextAction}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { StatusBadge, TypeBadge, SourceBadge };
