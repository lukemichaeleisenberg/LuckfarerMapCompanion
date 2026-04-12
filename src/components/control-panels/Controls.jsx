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
      <div style={{
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: '#555',
        marginBottom: 5,
      }}>
        {label}
      </div>
      {children}
    </div>
  )
}

export function TypeGrid({ types, active, onSelect, catalog }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {types.map(t => {
        const { name, color } = catalog[t]
        const light    = isLight(color)
        const isActive = t === active
        return (
          <button
            key={t}
            title={name}
            onClick={() => onSelect(t)}
            style={{
              padding: '3px 7px',
              background: color,
              border: isActive ? '2px solid #fff' : '2px solid rgba(0,0,0,0.25)',
              borderRadius: 4,
              color: light ? '#222' : '#fff',
              fontWeight: 'bold',
              fontSize: 11,
              cursor: 'pointer',
              textShadow: light ? 'none' : '0 1px 2px rgba(0,0,0,0.6)',
              whiteSpace: 'nowrap',
              outline: isActive ? '1px solid rgba(255,255,255,0.4)' : 'none',
              outlineOffset: 1,
            }}
          >
            {name}
          </button>
        )
      })}
    </div>
  )
}
