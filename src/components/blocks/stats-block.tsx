import { Counter } from "@/components/motion/counter";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const COLS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

/** Row of animated stat counters. */
export function StatsBlock({
  items,
}: {
  items: { value: number; suffix: string; label: string }[];
}) {
  const visible = items.filter((i) => i.label.trim() || i.value);
  if (visible.length === 0) return null;
  const cols = COLS[Math.min(visible.length, 4)] ?? "sm:grid-cols-3";

  return (
    <RevealGroup className={cn("grid grid-cols-2 gap-8 sm:gap-10", cols)}>
      {visible.map((item, i) => (
        <RevealItem key={i} className="text-center sm:text-left">
          <div className="font-display text-5xl text-primary sm:text-6xl">
            <Counter value={item.value} suffix={item.suffix} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
