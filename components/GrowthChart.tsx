"use client";

const data = [
  { year: "2019", value: 28 },
  { year: "2020", value: 30 },
  { year: "2021", value: 38 },
  { year: "2022", value: 52 },
  { year: "2023", value: 68 },
  { year: "2024", value: 84 },
  { year: "2025", value: 100 },
];

const WIDTH = 600;
const HEIGHT = 280;
const PADDING = { top: 24, right: 24, bottom: 36, left: 44 };

export default function GrowthChart() {
  const chartWidth = WIDTH - PADDING.left - PADDING.right;
  const chartHeight = HEIGHT - PADDING.top - PADDING.bottom;

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = 0;

  const points = data.map((d, i) => {
    const x = PADDING.left + (i / (data.length - 1)) * chartWidth;
    const y = PADDING.top + chartHeight - ((d.value - minValue) / (maxValue - minValue)) * chartHeight;
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${PADDING.top + chartHeight} L ${points[0].x} ${PADDING.top + chartHeight} Z`;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full"
      role="img"
      aria-label="Illustrative chart showing rising land prices index from 2019 to 2025, trending upward from an index of 28 to 100"
    >
      {/* Gridlines */}
      {[0, 25, 50, 75, 100].map((val) => {
        const y = PADDING.top + chartHeight - (val / maxValue) * chartHeight;
        return (
          <g key={val}>
            <line
              x1={PADDING.left}
              y1={y}
              x2={WIDTH - PADDING.right}
              y2={y}
              stroke="var(--color-line)"
              strokeWidth="1"
              strokeDasharray={val === 0 ? "0" : "4 6"}
            />
            <text
              x={PADDING.left - 10}
              y={y + 4}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize="11"
              fill="var(--color-muted)"
            >
              {val}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <defs>
        <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-green-bright)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--color-green-bright)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#growth-fill)" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="var(--color-green)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />

      {/* Points + year labels */}
      {points.map((p) => (
        <g key={p.year}>
          <circle cx={p.x} cy={p.y} r="4" fill="var(--color-paper)" stroke="var(--color-green)" strokeWidth="2.5" />
          <text
            x={p.x}
            y={HEIGHT - 8}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="11"
            fill="var(--color-muted)"
          >
            {p.year}
          </text>
        </g>
      ))}

      {/* Highlight final value */}
      <text
        x={points[points.length - 1].x}
        y={points[points.length - 1].y - 14}
        textAnchor="end"
        fontFamily="var(--font-display)"
        fontWeight="700"
        fontSize="15"
        fill="var(--color-navy)"
      >
        Index 100
      </text>
    </svg>
  );
}
