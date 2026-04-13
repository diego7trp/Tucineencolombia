import { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { getPeliculas, getCartelera } from '../services/api'
import MovieCard from '../components/MovieCard'

const GENEROS = ['Todos', 'Acción', 'Drama', 'Thriller', 'Ciencia ficción', 'Animación', 'Terror', 'Comedia']

const TOP10 = [
  { titulo: 'Super Mario Galaxy: La Película', espectadores: '820K', porcentaje: 98 },
  { titulo: 'Hoppers: Operación Castor',        espectadores: '610K', porcentaje: 80 },
  { titulo: 'Nuremberg: El juicio del siglo',   espectadores: '490K', porcentaje: 65 },
  { titulo: 'Scream 7',                         espectadores: '380K', porcentaje: 52 },
  { titulo: 'La Momia',                         espectadores: '310K', porcentaje: 42 },
  { titulo: 'El Diablo viste a la Moda 2',      espectadores: '280K', porcentaje: 38 },
  { titulo: 'Michael (Biopic MJ)',              espectadores: '240K', porcentaje: 33 },
  { titulo: 'Proyecto fin del mundo',           espectadores: '190K', porcentaje: 26 },
  { titulo: 'Llueve sobre Babel',               espectadores: '150K', porcentaje: 21 },
  { titulo: 'Páramo',                           espectadores: '120K', porcentaje: 16 },
]

// Pósters de fondo para el hero (películas en cartelera abril 2026)
const HERO_POSTERS = [
  'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
  'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
  'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
  'https://image.tmdb.org/t/p/w500/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg',
  'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
]

export default function Home() {
  const { data: peliculasDB, loading: loadingDB }        = useApi(getPeliculas)
  const { data: cartelera,   loading: loadingCartelera } = useApi(getCartelera)
  const [searchParams] = useSearchParams()
  const [genero, setGenero] = useState('Todos')
  const navigate = useNavigate()

  const busqueda = searchParams.get('buscar') || ''

  // Filtra películas locales por búsqueda Y género
  const filtradas = useMemo(() => {
    return (peliculasDB || []).filter(p => {
      const coincideBusqueda = p.titulo.toLowerCase().includes(busqueda.toLowerCase())
      const coincideGenero   = genero === 'Todos' || p.genero === genero
      return coincideBusqueda && coincideGenero
    })
  }, [peliculasDB, busqueda, genero])

  // Filtra cartelera TMDB por género (mapeo simple)
  const carteleraFiltrada = useMemo(() => {
    if (genero === 'Todos') return cartelera || []
    return (cartelera || []).filter(p =>
      p.genero?.toLowerCase().includes(genero.toLowerCase()) ||
      genero.toLowerCase().includes(p.genero?.toLowerCase() || '')
    )
  }, [cartelera, genero])

  return (
    <>
      {/* ══════════════ HERO ══════════════ */}
      <section className="hero">
        {/* Pósters de fondo animados */}
        <div className="hero-posters-bg">
          {HERO_POSTERS.map((src, i) => (
            <div key={i} className="hero-poster-item" style={{ animationDelay: `${i * 0.15}s` }}>
              <img src={src} alt="" onError={e => e.target.style.opacity = 0} />
            </div>
          ))}
          <div className="hero-posters-overlay" />
        </div>

        <div className="hero-content">
          <p className="hero-tag"></p>
          <h1>La <span>Pataforma</span><br />de cine en Colombia</h1>
          <p className="hero-sub">Estrenos, festivales y lo mejor del cine nacional e internacional</p>

          {/* Stats rápidos */}
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">
                {loadingCartelera ? '—' : (cartelera?.length || 0)}
              </span>
              <span className="hero-stat-label">En cartelera</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">{peliculasDB?.length || 0}</span>
              <span className="hero-stat-label">Películas</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">6</span>
              <span className="hero-stat-label">Festivales</span>
            </div>
          </div>

          {/* Filtros de género */}
          <div className="genre-filters">
            {GENEROS.map(g => (
              <button
                key={g}
                className={`filter-badge ${genero === g ? 'active' : ''}`}
                onClick={() => setGenero(g)}
              >{g}</button>
            ))}
          </div>
        </div>
      </section>

      <div className="container home-layout">
        <div className="home-main">

          {/* Cartelera en tiempo real */}
          <div className="section-header">
            <h2 className="section-title">En cines ahora mismo</h2>
            <span
              onClick={() => navigate('/cartelera')}
              style={{ fontSize: '11px', color: 'var(--gold)', cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase' }}
            >Ver completa →</span>
          </div>

          {loadingCartelera && <p className="estado-msg">Cargando cartelera...</p>}
          {!loadingCartelera && carteleraFiltrada.length === 0 && genero !== 'Todos' && (
            <p className="estado-msg">No hay películas de este género en cartelera ahora.</p>
          )}

          <div className="movies-grid" style={{ marginBottom: '2.5rem' }}>
            {carteleraFiltrada.slice(0, 4).map(p => (
              <div key={p.id} className="movie-card" onClick={() => navigate(`/cartelera/${p.id}`)}>
                <div className="movie-card-poster">
                  <img src={p.imagen} alt={p.titulo}
                    onError={e => e.target.src = 'https://via.placeholder.com/300x450?text=Sin+imagen'} />
                  <span className="movie-card-genre">{p.genero}</span>
                  {p.calificacion > 0 && (
                    <span style={{
                      position: 'absolute', bottom: 8, right: 8,
                      background: 'rgba(10,10,15,.85)',
                      border: '.5px solid rgba(201,168,76,.4)',
                      color: 'var(--gold)', fontSize: '11px',
                      padding: '3px 8px', borderRadius: '10px'
                    }}>⭐ {p.calificacion.toFixed(1)}</span>
                  )}
                </div>
                <div className="movie-card-body">
                  <h3>{p.titulo}</h3>
                  <p className="movie-card-meta">{p.fecha_estreno?.slice(0, 4)} · {p.duracion}</p>
                  <p className="movie-card-desc">{p.descripcion?.slice(0, 90)}...</p>
                  <button className="btn-primary">Ver detalles →</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: '.5px', background: 'rgba(201,168,76,.1)', margin: '0 0 2rem' }} />

          {/* Películas BD local */}
          <div className="section-header">
            <h2 className="section-title">
              {busqueda ? `Resultados: "${busqueda}"` : genero !== 'Todos' ? `${genero}` : 'Películas destacadas'}
            </h2>
          </div>
          {loadingDB && <p className="estado-msg">Cargando...</p>}
          {!loadingDB && filtradas.length === 0 && (
            <p className="estado-msg">No se encontraron películas{genero !== 'Todos' ? ` de ${genero}` : ''}.</p>
          )}
          <div className="movies-grid">
            {filtradas.map(p => <MovieCard key={p.id} movie={p} showBadge />)}
          </div>
        </div>

        {/* TOP 10 actualizado */}
        <aside className="top10-aside">
          <h2 className="section-title">Top 10 en Colombia</h2>
          <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '1rem' }}>Abril 2026</p>
          <ol className="top10-list">
            {TOP10.map((item, i) => (
              <li key={i} className={`top10-item ${i < 3 ? 'top3' : ''}`}>
                <span className="top10-num">{i + 1}</span>
                <div className="top10-info" style={{ flex: 1 }}>
                  <p className="top10-titulo">{item.titulo}</p>
                  <p className="top10-esp">{item.espectadores} espectadores</p>
                  <div style={{ marginTop: '4px', height: '2px', background: 'rgba(255,255,255,.06)', borderRadius: '2px' }}>
                    <div style={{ width: `${item.porcentaje}%`, height: '100%', background: i < 3 ? 'var(--gold)' : 'rgba(201,168,76,.3)', borderRadius: '2px' }} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </>
  )
}