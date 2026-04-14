import { useMapStore } from '../store/mapStore.js'

export default function Footer() {
  const runGenerate = useMapStore(s => s.generateMap)
  return (
    <div style={{
      borderTop: '1px solid #333',
      padding: '10px 20px',
      background: '#1a1a2e',
      fontSize: 12,
      color: '#555',
    }}>
      <a
        href="https://lukemichaeleisenberg.github.io/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#778', textDecoration: 'none' }}
        onMouseEnter={e => e.target.style.color = '#aab'}
        onMouseLeave={e => e.target.style.color = '#778'}
      >
        lukemichaeleisenberg.github.io
      </a>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <button
          onClick={runGenerate}
          style={{
            padding: '5px 14px',
            background: '#2a3a6a',
            border: '1px solid #4a5a9a',
            borderRadius: 5,
            color: '#c8d8ff',
            fontFamily: 'Georgia, serif',
            fontSize: 13,
            fontWeight: 'bold',
            cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
          onMouseEnter={e => { e.target.style.background = '#3a4a8a' }}
          onMouseLeave={e => { e.target.style.background = '#2a3a6a' }}
        >
          Generate Map
        </button>
      </div>
    </div>
  )
}
