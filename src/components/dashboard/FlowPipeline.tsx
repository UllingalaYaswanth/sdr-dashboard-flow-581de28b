import { flowSteps } from "@/data/mockData";

export function FlowPipeline() {
  return (
    <div className="flex flex-wrap gap-1 items-center">
      {flowSteps.map((step, i) => {
        const isDone = step.done;
        const isActive = step.active;
        let cls = "sdr-flow-node bg-secondary text-muted-foreground border-border";
        if (isDone) cls = "sdr-flow-node bg-[hsl(var(--badge-done-bg))] text-[hsl(var(--badge-done-fg))] border-[hsl(100,40%,80%)]";
        if (isActive) cls = "sdr-flow-node bg-sdr-blue-light text-sdr-blue border-sdr-blue/30";

        return (
          <span key={step.label} className="flex items-center gap-1">
            <span className={cls}>{step.label}</span>
            {i < flowSteps.length - 1 && <span className="text-[10px] text-muted-foreground">→</span>}
          </span>
        );
      })}
    </div>
  );
}
