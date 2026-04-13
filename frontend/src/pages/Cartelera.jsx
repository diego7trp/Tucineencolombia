import { useApi } from '../hooks/useApi'
import { getCartelera } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Cartelera() {
  const { data: peliculas, loading, error } = useApi(getCartelera)
  const navigate = useNavigate()

  if (loading) return <p className="estado-msg">Cargando cartelera en tiempo real...</p>
  if (error)   return <p className="estado-msg error">Error: {error}</p>

  return (
    <div className="container">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">Cartelera en Colombia</h1>
        <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
          Películas en cines ahora mismo • Datos en tiempo real de TMDB
        </p>
      </div>

      <div className="movies-grid">
        {(peliculas || []).map(p => (
          <div key={p.id} className="movie-card" onClick={() => navigate(`/cartelera/${p.id}`)}>
            <div className="movie-card-poster">
              <img
                src={p.imagen}
                alt={p.titulo}
                onError={e => e.target.src = 'https://via.placeholder.com/300x450?text=Sin+imagen'}
              />
              <span className="movie-card-genre">{p.genero}</span>
              {p.calificacion > 0 && (
                <span style={{
                  position: 'absolute', bottom: 8, right: 8,
                  background: 'rgba(10,10,15,.85)',
                  border: '.5px solid rgba(201,168,76,.4)',
                  color: 'var(--gold)', fontSize: '11px',
                  padding: '3px 8px', borderRadius: '10px'
                }}>
                  ⭐ {p.calificacion.toFixed(1)}
                </span>
              )}
            </div>
            <div className="movie-card-body">
              <h3>{p.titulo}</h3>
              <p className="movie-card-meta">{p.fecha_estreno?.slice(0,4)} · {p.duracion}</p>
              <p className="movie-card-desc">{p.descripcion?.slice(0, 90)}...</p>

              {/* CINES DISPONIBLES */}
              <div style={{ marginTop: '10px', borderTop: '.5px solid rgba(255,255,255,.06)', paddingTop: '8px' }}>
                <p style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                  En cines
                </p>
                {p.cines?.map((cine, i) => (
                  <div key={i} style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '3px' }}>
                    {cine.logo} {cine.nombre}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}