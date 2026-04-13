import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { getPeliculas } from '../services/api'

const FECHA_ESTRENO = {
  'The Mandalorian & Grogu':              { fecha: '21 Mayo 2026',      dias: 39  },
  'El Diablo Viste a la Moda 2':          { fecha: '30 Abril 2026',     dias: 18  },
  'Toy Story 5':                          { fecha: '18 Junio 2026',     dias: 67  },
  'El Día de la Revelación':              { fecha: '11 Junio 2026',     dias: 60  },
  'La Odisea':                            { fecha: '16 Julio 2026',     dias: 95  },
  'Supergirl':                            { fecha: '25 Junio 2026',     dias: 74  },
  'Spider-Man: Un Nuevo Día':             { fecha: '30 Julio 2026',     dias: 109 },
  'Los Juegos del Hambre: Amanecer en la Cosecha': { fecha: '19 Nov 2026', dias: 221 },
  'Vengadores: El Juicio Final':          { fecha: '17 Dic 2026',       dias: 249 },
  'Dune: Mesías':                         { fecha: '25 Dic 2026',       dias: 257 },
}

export default function Estrenos() {
  const { data: peliculas, loading, error } = useApi(getPeliculas)
  const navigate = useNavigate()

  if (loading) return <p className="estado-msg">Cargando próximos estrenos...</p>
  if (error)   return <p className="estado-msg error">Error: {error}</p>

  const internacionales = (peliculas || []).filter(p => p.tipo === 'internacional')
  const nacionales      = (peliculas || []).filter(p => p.tipo === 'nacional')

  const renderCard = (p) => {
    const info = FECHA_ESTRENO[p.titulo]
    return (
      <div key={p.id} className="movie-card" onClick={() => navigate(`/pelicula/${p.id}`)}>
        <div className="movie-card-poster">
          <img
            src={p.imagen} alt={p.titulo}
            onError={e => e.target.src = 'https://via.placeholder.com/300x450?text=' + encodeURIComponent(p.titulo)}
          />
          <span className="movie-card-genre">{p.genero}</span>
          {info && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(10,10,15,0.95), transparent)',
              padding: '20px 10px 8px',
              textAlign: 'center'
            }}>
              <span style={{
                fontSize: '10px', color: 'var(--gold)',
                letterSpacing: '1px', display: 'block'
              }}>{info.fecha}</span>
              <span style={{
                fontSize: '9px', color: 'var(--muted)'
              }}>en {info.dias} días</span>
            </div>
          )}
        </div>
        <div className="movie-card-body">
          <h3>{p.titulo}</h3>
          <p className="movie-card-meta">{p.anio} · {p.genero}</p>
          <p className="movie-card-desc">{p.descripcion?.slice(0, 100)}...</p>
          <button className="btn-primary">Ver más →</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">Próximos Estrenos</h1>
        <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
          Las películas más esperadas que llegan a los cines de Colombia en 2026
        </p>
      </div>

      {/* Timeline de los más próximos */}
      <div style={{
        display: 'flex', gap: '10px', overflowX: 'auto',
        paddingBottom: '1rem', marginBottom: '2.5rem'
      }}>
        {[
          { titulo: 'El Diablo Viste a la Moda 2', fecha: '30 Abr' },
          { titulo: 'The Mandalorian & Grogu',     fecha: '21 May' },
          { titulo: 'El Día de la Revelación',     fecha: '11 Jun' },
          { titulo: 'Toy Story 5',                 fecha: '18 Jun' },
          { titulo: 'Supergirl',                   fecha: '25 Jun' },
          { titulo: 'La Odisea',                   fecha: '16 Jul' },
          { titulo: 'Spider-Man: Un Nuevo Día',    fecha: '30 Jul' },
        ].map((item, i) => (
          <div key={i} style={{
            flexShrink: 0, padding: '10px 16px',
            background: i === 0 ? 'rgba(201,168,76,.15)' : 'var(--card-bg)',
            border: `.5px solid ${i === 0 ? 'rgba(201,168,76,.4)' : 'rgba(255,255,255,.06)'}`,
            borderRadius: '8px', textAlign: 'center', minWidth: '120px'
          }}>
            <p style={{ fontSize: '13px', color: 'var(--gold)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>
              {item.fecha}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text)', marginTop: '4px', lineHeight: '1.3' }}>
              {item.titulo}
            </p>
          </div>
        ))}
      </div>

      {/* Internacionales */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{
          fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
          color: 'var(--gold)', marginBottom: '1.2rem', paddingBottom: '8px',
          borderBottom: '.5px solid rgba(201,168,76,.2)'
        }}>Internacionales</div>
        <div className="movies-grid">
          {internacionales.map(renderCard)}
        </div>
      </section>

      {/* Nacionales */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{
          fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
          color: 'var(--text)', marginBottom: '1.2rem', paddingBottom: '8px',
          borderBottom: '.5px solid rgba(255,255,255,.1)'
        }}>Producción Colombiana</div>
        <div className="movies-grid">
          {nacionales.map(renderCard)}
        </div>
      </section>
    </div>
  )
}