export default function Footer() {
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
    </div>
  )
}
