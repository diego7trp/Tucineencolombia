import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { createResena, deleteResena, getPelicula, getResenas } from '../services/api'

export default function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: pelicula, loading, error } = useApi(() => getPelicula(id), [id])

  const [resenas, setResenas] = useState([])
  const [loadingResenas, setLoadingResenas] = useState(true)
  const [form, setForm] = useState({ autor: '', calificacion: 0, comentario: '' })
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const promedio = useMemo(() => {
    if (!resenas.length) return 0
    const total = resenas.reduce((acc, r) => acc + r.calificacion, 0)
    return total / resenas.length
  }, [resenas])

  const cargarResenas = async () => {
    setLoadingResenas(true)
    try {
      const { data } = await getResenas(id)
      setResenas(data)
    } finally {
      setLoadingResenas(false)
    }
  }

  useEffect(() => {
    cargarResenas()
  }, [id])

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const seleccionarEstrella = (value) => {
    setForm((prev) => ({ ...prev, calificacion: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    if (!form.autor.trim()) {
      setFormError('El nombre es obligatorio.')
      return
    }
    if (form.calificacion < 1 || form.calificacion > 5) {
      setFormError('Selecciona una calificación entre 1 y 5 estrellas.')
      return
    }

    setSubmitting(true)
    try {
      await createResena(id, {
        autor: form.autor.trim(),
        calificacion: form.calificacion,
        comentario: form.comentario.trim(),
      })

      setForm({ autor: '', calificacion: 0, comentario: '' })
      await cargarResenas()
    } catch (err) {
      setFormError(err?.response?.data?.error || 'No se pudo guardar la reseña.')
    } finally {
      setSubmitting(false)
    }
  }

  const eliminarResena = async (resenaId) => {
    const prev = resenas
    setResenas((current) => current.filter((r) => r.id !== resenaId))

    try {
      await deleteResena(resenaId)
    } catch {
      setResenas(prev)
    }
  }

  if (loading) return <p className="estado-msg">Cargando película...</p>
  if (error) return <p className="estado-msg error">Película no encontrada.</p>
  if (!pelicula) return null

  return (
    <div className="container detail-layout">
      <div className="detail-left">
        <img
          className="detail-poster"
          src={pelicula.imagen}
          alt={pelicula.titulo}
          onError={(e) => (e.target.src = 'https://via.placeholder.com/300x450?text=Sin+imagen')}
        />

        {pelicula.donde_ver?.length > 0 && (
          <div className="donde-ver">
            <h3>Dónde ver en Colombia</h3>
            <ul>
              {pelicula.donde_ver.map((d, i) => (
                <li key={i}>
                  <span className="dv-plataforma">{d.plataforma}</span>
                  <span className={`dv-tipo ${d.tipo === 'Streaming' ? 'streaming' : 'cine'}`}>{d.tipo}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="detail-right">
        <button className="btn-back" onClick={() => navigate(-1)}>← Volver</button>

        {pelicula.tipo === 'nacional' && <span className="badge-nacional">Producción colombiana</span>}

        <h1 className="detail-titulo">{pelicula.titulo}</h1>

        <div className="detail-meta">
          <span>{pelicula.anio}</span>
          <span>·</span>
          <span>{pelicula.genero}</span>
          <span>·</span>
          <span>{pelicula.duracion}</span>
        </div>

        <p className="detail-sinopsis">{pelicula.descripcion}</p>

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

        <section className="resenas-box">
          <div className="resenas-header">
            <h3>Reseñas y calificaciones</h3>
            <p>
              <strong>{promedio.toFixed(1)}</strong> / 5 · {resenas.length} reseña{resenas.length === 1 ? '' : 's'}
            </p>
          </div>

          <form className="resena-form" onSubmit={onSubmit}>
            <input
              type="text"
              name="autor"
              value={form.autor}
              onChange={onChange}
              placeholder="Tu nombre"
              maxLength={100}
            />

            <div className="stars-picker" role="radiogroup" aria-label="Calificación">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={`star-btn ${form.calificacion >= star ? 'active' : ''}`}
                  onClick={() => seleccionarEstrella(star)}
                  aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              name="comentario"
              value={form.comentario}
              onChange={onChange}
              rows="3"
              placeholder="¿Qué te pareció la película?"
            />

            {formError && <p className="estado-msg error resena-error">{formError}</p>}

            <button className="btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Guardando...' : 'Publicar reseña'}
            </button>
          </form>

          <div className="resenas-list">
            {loadingResenas && <p className="estado-msg">Cargando reseñas...</p>}
            {!loadingResenas && !resenas.length && (
              <p className="estado-msg">Sé el primero en dejar una reseña.</p>
            )}

            {resenas.map((resena) => (
              <article key={resena.id} className="resena-item">
                <header>
                  <strong>{resena.autor}</strong>
                  <span>{'★'.repeat(resena.calificacion)}</span>
                </header>
                {resena.comentario && <p>{resena.comentario}</p>}
                <button type="button" className="resena-delete" onClick={() => eliminarResena(resena.id)}>
                  Eliminar
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
