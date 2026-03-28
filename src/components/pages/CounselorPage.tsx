import { Phone, Users, TrendingUp, Clock, Award } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { counselorPerformance } from "@/data/mockData";

export default function CounselorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Counselor Performance</h1>
        <p className="text-sm text-muted-foreground">Track and analyze your AI SDR performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Phone} value="1,776" label="Total Calls" change="+14.2%" />
        <StatCard icon={Users} value="740" label="Total Meetings" change="+11.5%" />
        <StatCard icon={TrendingUp} value="41.5%" label="Avg Conversion" change="+3.2%" />
        <StatCard icon={Clock} value="25 min" label="Avg Call Duration" change="-2.1%" changeType="negative" />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Counselor Performance Leaderboard</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/20">
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Counselor</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Calls</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Meetings</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Conversion</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Avg Duration</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {counselorPerformance.map((c) => (
                <tr key={c.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {c.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium text-foreground">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-muted-foreground">{c.calls}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-muted-foreground">{c.Meetings}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-sm font-bold text-foreground">{c.conversion}%</span>
                      <div className="w-24 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-chart-green rounded-full"
                          style={{ width: `${c.conversion}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-muted-foreground">{c.avgDuration}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.status === 'online' ? 'bg-chart-green/10 text-chart-green' :
                        c.status === 'away' ? 'bg-chart-orange/10 text-chart-orange' :
                          'bg-muted text-muted-foreground'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${c.status === 'online' ? 'bg-chart-green' :
                          c.status === 'away' ? 'bg-chart-orange' :
                            'bg-muted-foreground'
                        }`} />
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
