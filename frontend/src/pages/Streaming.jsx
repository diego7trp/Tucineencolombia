import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { getStreaming } from '../services/api'

const PLATAFORMA_COLORES = {
  'Netflix':      { bg: 'rgba(229,9,20,.15)',    color: '#e50914',  border: 'rgba(229,9,20,.3)'    },
  'HBO Max':      { bg: 'rgba(70,46,165,.15)',   color: '#a78bfa',  border: 'rgba(70,46,165,.3)'   },
  'Disney+':      { bg: 'rgba(17,60,163,.15)',   color: '#6ea0f7',  border: 'rgba(17,60,163,.3)'   },
  'Prime Video':  { bg: 'rgba(0,168,225,.15)',   color: '#00a8e1',  border: 'rgba(0,168,225,.3)'   },
  'Apple TV+':    { bg: 'rgba(255,255,255,.08)', color: '#f0ede6',  border: 'rgba(255,255,255,.15)' },
  'Paramount+':   { bg: 'rgba(0,116,217,.15)',   color: '#60a5fa',  border: 'rgba(0,116,217,.3)'   },
}

const PLATAFORMAS_ORDEN = ['Netflix', 'HBO Max', 'Disney+', 'Prime Video', 'Apple TV+', 'Paramount+']

export default function Streaming() {
  const { data: items, loading, error } = useApi(getStreaming)

  if (loading) return <p className="estado-msg">Cargando estrenos de streaming...</p>
  if (error)   return <p className="estado-msg error">Error: {error}</p>

  // Agrupar por plataforma
  const porPlataforma = {}
  ;(items || []).forEach(item => {
    if (!porPlataforma[item.plataforma]) porPlataforma[item.plataforma] = []
    porPlataforma[item.plataforma].push(item)
  })

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">Streaming — Abril 2026</h1>
        <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
          Series y películas que llegan este mes a las principales plataformas disponibles en Colombia
        </p>
      </div>

      {/* Badges de plataformas */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {PLATAFORMAS_ORDEN.filter(p => porPlataforma[p]).map(plat => {
          const estilo = PLATAFORMA_COLORES[plat] || PLATAFORMA_COLORES['Netflix']
          return (
            <div key={plat} style={{
              padding: '6px 16px', borderRadius: '20px', fontSize: '12px',
              fontWeight: 700, letterSpacing: '.5px',
              background: estilo.bg, color: estilo.color,
              border: `.5px solid ${estilo.border}`
            }}>
              {plat} · {porPlataforma[plat].length}
            </div>
          )
        })}
      </div>

      {/* Sección por plataforma */}
      {PLATAFORMAS_ORDEN.filter(p => porPlataforma[p]).map(plat => {
        const estilo = PLATAFORMA_COLORES[plat] || PLATAFORMA_COLORES['Netflix']
        return (
          <section key={plat} style={{ marginBottom: '3rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              marginBottom: '1.2rem', paddingBottom: '10px',
              borderBottom: `.5px solid ${estilo.border}`
            }}>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px',
                letterSpacing: '1px', color: estilo.color
              }}>{plat}</span>
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                {porPlataforma[plat].length} estreno{porPlataforma[plat].length > 1 ? 's' : ''} en abril
              </span>
            </div>

            <div className="movies-grid">
              {porPlataforma[plat].map(item => (
                <div key={item.id} className="movie-card">
                  <div className="movie-card-poster">
                    <img
                      src={item.imagen}
                      alt={item.titulo}
                      onError={e => e.target.src = 'https://via.placeholder.com/300x450?text=' + encodeURIComponent(item.titulo)}
                    />
                    <span className="movie-card-genre">
                      {item.tipo === 'serie' ? 'Serie' : item.tipo === 'documental' ? 'Doc' : 'Película'}
                    </span>
                    {/* Badge de plataforma */}
                    <span style={{
                      position: 'absolute', bottom: 8, left: 8,
                      background: estilo.bg, color: estilo.color,
                      border: `.5px solid ${estilo.border}`,
                      fontSize: '9px', padding: '3px 8px',
                      borderRadius: '10px', letterSpacing: '.5px',
                      fontWeight: 700
                    }}>{plat}</span>
                  </div>
                  <div className="movie-card-body">
                    <h3>{item.titulo}</h3>
                    <p className="movie-card-meta">
                      {new Date(item.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}