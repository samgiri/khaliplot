import type { CityCount, DayPoint } from "@/lib/admin-stats";

/** Compact 30-day area/line chart drawn as inline SVG (no chart library). */
export function TrendChart({
  points,
  color = "var(--color-green-bright)",
  height = 120,
}: {
  points: DayPoint[];
  color?: string;
  height?: number;
}) {
  const width = 600;
  const max = Math.max(1, ...points.map((p) => p.value));
  const n = points.length;
  const stepX = n > 1 ? width / (n - 1) : width;
  const y = (v: number) => height - (v / max) * (height - 8) - 4;

  const line = points.map((p, i) => `${i * stepX},${y(p.value)}`).join(" ");
  const area = `0,${height} ${line} ${(n - 1) * stepX},${height}`;
  const total = points.reduce((s, p) => s + p.value, 0);

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-28 w-full"
        role="img"
        aria-label="30-day trend"
      >
        <polygon points={area} fill={color} opacity={0.12} />
        <polyline points={line} fill="none" stroke={color} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-1 flex justify-between text-[11px] text-muted">
        <span>{points[0]?.label}</span>
        {total === 0 && <span className="text-muted/70">No activity in this window</span>}
        <span>{points[n - 1]?.label}</span>
      </div>
    </div>
  );
}

/** Horizontal bar list for categorical distributions (e.g. listings by city). */
export function BarList({
  items,
  emptyLabel = "No data yet",
  max: maxItems = 8,
}: {
  items: CityCount[];
  emptyLabel?: string;
  max?: number;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted">{emptyLabel}</p>;
  }
  const top = items.slice(0, maxItems);
  const max = Math.max(1, ...top.map((i) => i.count));

  return (
    <ul className="space-y-2.5">
      {top.map((item) => (
        <li key={item.city} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-sm text-ink">{item.city}</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-paper-dim">
            <div
              className="h-full rounded-full bg-green-bright"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
          <span className="w-8 shrink-0 text-right text-sm font-semibold text-navy">{item.count}</span>
        </li>
      ))}
    </ul>
  );
}
