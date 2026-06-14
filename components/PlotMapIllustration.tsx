export default function PlotMapIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Illustration of a surveyed plot of land with boundary lines and a location pin"
    >
      {/* Background field */}
      <rect x="0" y="0" width="600" height="500" rx="20" fill="var(--color-green-pale)" />

      {/* Contour-style background lines */}
      <path
        d="M -20 380 C 100 350, 200 410, 320 370 C 440 330, 520 390, 640 360"
        stroke="var(--color-line)"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M -20 430 C 120 400, 240 450, 360 420 C 480 390, 540 440, 640 420"
        stroke="var(--color-line)"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />

      {/* Main plot boundary (dashed) */}
      <rect
        x="90"
        y="160"
        width="420"
        height="260"
        rx="6"
        stroke="var(--color-green)"
        strokeWidth="3"
        strokeDasharray="14 10"
        fill="none"
      />

      {/* Internal subdivision lines */}
      <line
        x1="300"
        y1="160"
        x2="300"
        y2="420"
        stroke="var(--color-green-bright)"
        strokeWidth="2"
        strokeDasharray="8 8"
        opacity="0.5"
      />
      <line
        x1="90"
        y1="290"
        x2="510"
        y2="290"
        stroke="var(--color-green-bright)"
        strokeWidth="2"
        strokeDasharray="8 8"
        opacity="0.5"
      />

      {/* Road */}
      <rect x="0" y="430" width="600" height="40" fill="var(--color-navy)" opacity="0.08" />
      <line
        x1="0"
        y1="450"
        x2="600"
        y2="450"
        stroke="var(--color-paper)"
        strokeWidth="3"
        strokeDasharray="16 14"
      />

      {/* Trees (left cluster, echoes logo) */}
      <g>
        <ellipse cx="60" cy="200" rx="42" ry="38" fill="var(--color-green-bright)" />
        <ellipse cx="38" cy="225" rx="26" ry="24" fill="var(--color-green)" opacity="0.85" />
        <rect x="54" y="232" width="10" height="34" fill="var(--color-navy)" opacity="0.55" />
      </g>

      {/* Tree (right) */}
      <g>
        <ellipse cx="550" cy="210" rx="34" ry="30" fill="var(--color-green-bright)" opacity="0.85" />
        <rect x="544" y="232" width="8" height="28" fill="var(--color-navy)" opacity="0.5" />
      </g>

      {/* Coordinate ticks */}
      {[150, 230, 310, 390, 470].map((x) => (
        <line key={x} x1={x} y1="155" x2={x} y2="165" stroke="var(--color-muted)" strokeWidth="1.5" />
      ))}
      {[185, 245, 305, 365].map((y) => (
        <line key={y} x1="85" y1={y} x2="95" y2={y} stroke="var(--color-muted)" strokeWidth="1.5" />
      ))}

      {/* Location pin */}
      <g transform="translate(300, 230)">
        <path
          d="M0 -55 C28 -55 48 -33 48 -10 C48 22 14 50 0 70 C-14 50 -48 22 -48 -10 C-48 -33 -28 -55 0 -55 Z"
          fill="var(--color-navy)"
        />
        <circle cx="0" cy="-10" r="16" fill="var(--color-paper)" />
      </g>

      {/* Dimension labels */}
      <text
        x="300"
        y="145"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="13"
        fill="var(--color-muted)"
        letterSpacing="1"
      >
        75 FT
      </text>
      <text
        x="60"
        y="295"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="13"
        fill="var(--color-muted)"
        letterSpacing="1"
        transform="rotate(-90 60 295)"
      >
        60 FT
      </text>
    </svg>
  );
}
