const STROKES = [0, 1, 2, 3];

export function Splash({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 240 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible ${className}`}
    >
      <defs>
        <filter id="splash-rough" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="3"
            seed="4"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" />
        </filter>
      </defs>

      <g filter="url(#splash-rough)">
        {/* thin scratchy strokes poking out around the core */}
        {STROKES.map((i) => (
          <path
            key={i}
            d="M4 62 L52 24 L96 70 L150 18 L196 66 L236 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`translate(0 ${i * 8})`}
          />
        ))}

        {/* solid core: the text always sits on this */}
        <rect x="30" y="18" width="180" height="64" rx="8" />

        {/* droplets */}
        <circle cx="228" cy="84" r="4" />
        <circle cx="238" cy="62" r="2.5" />
        <circle cx="8" cy="22" r="3.5" />
        <circle cx="150" cy="96" r="3" />
        <circle cx="48" cy="94" r="2.5" />
        <circle cx="196" cy="8" r="3" />
      </g>
    </svg>
  );
}
