import { useApi } from '../hooks/useApi'
import { getNoticias } from '../services/api'

export default function Noticias() {
  const { data: noticias, loading, error } = useApi(getNoticias)

  if (loading) return <p className="estado-msg">Cargando noticias...</p>
  if (error)   return <p className="estado-msg error">Error: {error}</p>

  return (
    <div className="container">
      <h1 className="page-title">Noticias de cine</h1>
      <div className="noticias-grid">
        {(noticias || []).map(n => (
          <article key={n.id} className="noticia-card">
            <img src={n.imagen} alt={n.titulo} onError={e => e.target.src='https://via.placeholder.com/400x220?text=Noticia'} />
            <div className="noticia-body">
              <p className="noticia-fecha">{new Date(n.fecha).toLocaleDateString('es-CO', { day:'numeric', month:'long', year:'numeric' })}</p>
              <h2>{n.titulo}</h2>
              <p>{n.resumen}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}