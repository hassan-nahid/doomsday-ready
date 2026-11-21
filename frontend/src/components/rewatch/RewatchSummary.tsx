import { Progress } from "@/components/ui/progress";
import { formatDuration } from "@/utils/formatDuration";

interface RewatchSummaryProps {
  watchedCount: number;
  totalCount: number;
  unwatchedRuntimeMinutes: number;
}

export function RewatchSummary({
  watchedCount,
  totalCount,
  unwatchedRuntimeMinutes,
}: RewatchSummaryProps) {
  const progressPct =
    totalCount > 0 ? Math.round((watchedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))]/30 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span>
          <strong className="text-white">
            {watchedCount} of {totalCount} watched
          </strong>{" "}
          <span className="text-[hsl(var(--muted-foreground))]">
            ({progressPct}%)
          </span>
        </span>
        <span className="text-[hsl(var(--muted-foreground))]">
          Remaining watch time:{" "}
          <strong className="text-white">
            {formatDuration(unwatchedRuntimeMinutes)}
          </strong>
        </span>
      </div>
      <Progress value={progressPct} />
    </div>
  );
}
