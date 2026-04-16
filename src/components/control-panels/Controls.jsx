// ─── Shared UI primitives used by toolbar panels ──────────────────────────────

export function isLight(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
}

export function Section({ label, children }) {
  return (
    <div>
      <div className="section-label">{label}</div>
      {children}
    </div>
  )
}

export function TypeGrid({ types, active, onSelect, catalog }) {
  return (
    <div className="type-grid">
      {types.map(t => {
        const { name, color } = catalog[t]
        const light    = isLight(color)
        const isActive = t === active
        return (
          <button
            key={t}
            title={name}
            onClick={() => onSelect(t)}
            className={`type-grid-btn${isActive ? ' type-grid-btn--active' : ''}`}
            style={{
              background: color,
              color: light ? '#222' : '#fff',
              textShadow: light ? 'none' : '0 1px 2px rgba(0,0,0,0.6)',
            }}
          >
            {name}
          </button>
        )
      })}
    </div>
  )
}
