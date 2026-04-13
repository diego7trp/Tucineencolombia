import { useParams, useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { getDetalleTMDB } from '../services/api'

export default function CarteleraDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: p, loading, error } = useApi(() => getDetalleTMDB(id), [id])

  if (loading) return <p className="estado-msg">Cargando película...</p>
  if (error)   return <p className="estado-msg error">Película no encontrada.</p>
  if (!p)      return null

  return (
    <div className="container detail-layout">
      {/* Columna izquierda */}
      <div className="detail-left">
        <img
          className="detail-poster"
          src={p.imagen}
          alt={p.titulo}
          onError={e => e.target.src = 'https://via.placeholder.com/300x450?text=Sin+imagen'}
        />

        {/* Calificación */}
        {p.calificacion > 0 && (
          <div style={{
            marginTop: '1rem', padding: '1rem',
            background: 'var(--card-bg)',
            border: '.5px solid rgba(201,168,76,.2)',
            borderRadius: '8px', textAlign: 'center'
          }}>
            <p style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
              Calificación TMDB
            </p>
            <p style={{ fontSize: '32px', fontFamily: "'Bebas Neue', sans-serif", color: 'var(--text)', letterSpacing: '1px' }}>
              ⭐ {p.calificacion.toFixed(1)}
            </p>
          </div>
        )}

        {/* Cines disponibles */}
        <div className="donde-ver" style={{ marginTop: '1rem' }}>
          <h3>Dónde verla en Colombia</h3>
          <ul>
            {(p.cines || []).map((cine, i) => (
              <li key={i}>
                <span className="dv-plataforma">{cine.logo} {cine.nombre}</span>
                <span className="dv-tipo cine">En cartelera</span>
              </li>
            ))}
          </ul>
          <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '10px', lineHeight: '1.5' }}>
            📍 Disponibilidad varía por ciudad. Consulta la página de cada cine para horarios exactos.
          </p>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="detail-right">
        <button className="btn-back" onClick={() => navigate(-1)}>← Volver</button>

        <span style={{
          display: 'inline-block',
          background: 'rgba(201,168,76,.15)',
          border: '.5px solid var(--gold)',
          color: 'var(--gold)',
          fontSize: '10px', letterSpacing: '1px',
          padding: '4px 12px', borderRadius: '10px',
          textTransform: 'uppercase', marginBottom: '12px'
        }}>
          En cartelera ahora
        </span>

        <h1 className="detail-titulo">{p.titulo}</h1>

        <div className="detail-meta">
          <span>{p.fecha_estreno?.slice(0, 4)}</span>
          <span>·</span>
          <span>{p.genero}</span>
          <span>·</span>
          <span>{p.duracion}</span>
        </div>

        <p className="detail-sinopsis">{p.descripcion}</p>

        {p.trailer && (
          <div className="detail-trailer">
            <h3>Trailer oficial</h3>
            <div className="trailer-wrapper">
              <iframe
                src={p.trailer}
                title={`Trailer de ${p.titulo}`}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}