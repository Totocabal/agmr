export default function AGMRLogo({ size = 46, light = false, withText = true, withTagline = true }) {
  const ring = light ? "#f0ece2" : "#1f4732"
  const ink  = light ? "rgba(240,236,226,0.92)" : "#1f4732"
  const sun  = light ? "#f4c585" : "#b8451f"
  const mtn  = light ? "rgba(240,236,226,0.85)" : "#1f4732"

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-label="Logo AGMR">
        <circle cx="50" cy="50" r="48" fill={light ? "transparent" : "#fbf6ea"} stroke={ring} strokeWidth="1.5"/>
        <circle cx="50" cy="50" r="42" fill="none" stroke={ring} strokeWidth=".8" opacity=".5"/>
        <circle cx="50" cy="34" r="5" fill={sun}/>
        <path d="M 22 70 L 38 46 L 50 60 L 62 42 L 78 70 Z" fill={mtn}/>
        <line x1="18" y1="70" x2="82" y2="70" stroke={ring} strokeWidth="1.2"/>
        <path d="M 26 78 Q 42 74 50 76 T 74 78" fill="none" stroke={ring} strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2,3" opacity=".65"/>
        <path d="M 32 70 L 28 62 L 36 62 Z M 32 64 L 28 56 L 36 56 Z" fill={ring} opacity=".85"/>
        <text x="50" y="92" fontSize="6" textAnchor="middle" fill={ring} fontFamily="serif" letterSpacing="2" opacity=".7" fontStyle="italic">est. 1970</text>
      </svg>
      {withText && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: "1.55rem", fontWeight: 600, color: ink }}>
            AGMR
          </span>
          {withTagline && (
            <span style={{ fontSize: ".66rem", color: light ? "rgba(240,236,226,0.6)" : "var(--ink-mute)", letterSpacing: ".22em", textTransform: "uppercase", marginTop: 3 }}>
              Gym · Marche · Rambouillet
            </span>
          )}
        </div>
      )}
    </div>
  )
}
