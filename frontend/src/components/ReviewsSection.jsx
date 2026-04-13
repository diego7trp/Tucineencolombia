import { useEffect, useMemo, useState } from 'react'
import { createResena, deleteResena, getResenas } from '../services/api'

export default function ReviewsSection({ itemId, itemTipo = 'pelicula', origen = 'local' }) {
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
      const { data } = await getResenas({ itemId, itemTipo, origen })
      setResenas(data)
    } finally {
      setLoadingResenas(false)
    }
  }

  useEffect(() => {
    if (!itemId) return
    cargarResenas()
  }, [itemId, itemTipo, origen])

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
      await createResena({
        item_id: String(itemId),
        item_tipo: itemTipo,
        origen,
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

  return (
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
          placeholder="¿Qué te pareció?"
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
  )
}
