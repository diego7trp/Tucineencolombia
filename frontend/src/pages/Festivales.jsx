import { useApi } from '../hooks/useApi'
import { getFestivales } from '../services/api'

export default function Festivales() {
  const { data: festivales, loading, error } = useApi(getFestivales)

  if (loading) return <p className="estado-msg">Cargando festivales...</p>
  if (error)   return <p className="estado-msg error">Error: {error}</p>

  return (
    <div className="container">
      <h1 className="page-title">Festivales de cine en Colombia</h1>
      <div className="festivales-grid">
        {(festivales || []).map(f => (
          <div key={f.id} className="festival-card">
            <img src={f.imagen} alt={f.nombre} onError={e => e.target.src='https://via.placeholder.com/400x200?text=Festival'} />
            <div className="festival-body">
              <h2>{f.nombre}</h2>
              <p className="festival-loc">📍 {f.ubicacion}</p>
              <p className="festival-fecha">🗓 {f.fecha}</p>
              <p className="festival-desc">{f.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}