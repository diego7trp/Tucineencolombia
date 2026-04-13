import { useParams, useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { getPelicula } from '../services/api'

export default function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: pelicula, loading, error } = useApi(() => getPelicula(id), [id])

  if (loading) return <p className="estado-msg">Cargando película...</p>
  if (error)   return <p className="estado-msg error">Película no encontrada.</p>
  if (!pelicula) return null

  return (
    <div className="container detail-layout">
      {/* Columna izquierda */}
      <div className="detail-left">
        <img
          className="detail-poster"
          src={pelicula.imagen}
          alt={pelicula.titulo}
          onError={e => e.target.src = 'https://via.placeholder.com/300x450?text=Sin+imagen'}
        />

        {/* Dónde ver */}
        {pelicula.donde_ver?.length > 0 && (
          <div className="donde-ver">
            <h3>Dónde ver en Colombia</h3>
            <ul>
              {pelicula.donde_ver.map((d, i) => (
                <li key={i}>
                  <span className="dv-plataforma">{d.plataforma}</span>
                  <span className={`dv-tipo ${d.tipo === 'Streaming' ? 'streaming' : 'cine'}`}>
                    {d.tipo}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Columna derecha */}
      <div className="detail-right">
        <button className="btn-back" onClick={() => navigate(-1)}>← Volver</button>

        {pelicula.tipo === 'nacional' && (
          <span className="badge-nacional">Producción colombiana</span>
        )}

        <h1 className="detail-titulo">{pelicula.titulo}</h1>

        <div className="detail-meta">
          <span>{pelicula.anio}</span>
          <span>·</span>
          <span>{pelicula.genero}</span>
          <span>·</span>
          <span>{pelicula.duracion}</span>
        </div>

        <p className="detail-sinopsis">{pelicula.descripcion}</p>

        {/* Trailer */}
        {pelicula.trailer && (
          <div className="detail-trailer">
            <h3>Trailer oficial</h3>
            <div className="trailer-wrapper">
              <iframe
                src={pelicula.trailer}
                title={`Trailer de ${pelicula.titulo}`}
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