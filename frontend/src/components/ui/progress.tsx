import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--secondary))]",
        className
      )}
    >
      <div
        className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
