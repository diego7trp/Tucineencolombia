import { useNavigate } from 'react-router-dom'

export default function MovieCard({ movie, showBadge = false }) {
  const navigate = useNavigate()

  return (
    <div className="movie-card" onClick={() => navigate(`/pelicula/${movie.id}`)}>
      <div className="movie-card-poster">
        <img src={movie.imagen} alt={movie.titulo} onError={e => e.target.src = 'https://via.placeholder.com/300x450?text=Sin+imagen'} />
        <span className="movie-card-genre">{movie.genero}</span>
        {showBadge && movie.tipo === 'nacional' && (
          <span className="movie-card-co">CO</span>
        )}
      </div>
      <div className="movie-card-body">
        <h3>{movie.titulo}</h3>
        <p className="movie-card-meta">{movie.anio} · {movie.duracion}</p>
        <p className="movie-card-desc">{movie.descripcion?.slice(0, 90)}...</p>
        <button className="btn-primary">Ver detalles →</button>
      </div>
    </div>
  )
}