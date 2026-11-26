// Das Omni-Admin-Logo als SVG: ein Knoten in der Mitte mit sechs Spitzen.
// animated = nacheinander wird jede Spitze kurz dick (im Uhrzeigersinn).

const SPOKES = [-90, -30, 30, 90, 150, 210];
const CYCLE = 3; // Sekunden für eine Runde

export function HubLogo({ size = 96, animated = false }: { size?: number; animated?: boolean }) {
  const c = 50;
  const r = 30;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={animated ? "hub-anim" : undefined} aria-hidden>
      <defs>
        <radialGradient id="hub-core" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dcd9ff" />
        </radialGradient>
      </defs>
      {SPOKES.map((deg, i) => {
        const x = c + r * Math.cos((deg * Math.PI) / 180);
        const y = c + r * Math.sin((deg * Math.PI) / 180);
        const style = animated ? { animationDelay: `${(i * CYCLE) / SPOKES.length}s` } : undefined;
        return (
          <g key={deg}>
            <line className="hub-spoke" style={style} x1={c} y1={c} x2={x} y2={y} stroke="#fff" strokeWidth={4} strokeLinecap="round" />
            <circle className="hub-node" style={style} cx={x} cy={y} r={6.5} fill="#4338ca" stroke="#fff" strokeWidth={4} />
          </g>
        );
      })}
      <circle cx={c} cy={c} r={10} fill="url(#hub-core)" />
    </svg>
  );
}
