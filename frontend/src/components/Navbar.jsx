import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/?buscar=${encodeURIComponent(query.trim())}`)
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">
        TuCine<span>En</span>Colombia
      </NavLink>

      <div className="navbar-links">
        <NavLink to="/"            end>Inicio</NavLink>
        <NavLink to="/cartelera"      >Cartelera</NavLink>
        <NavLink to="/estrenos"       >Próximos Estrenos</NavLink>
        <NavLink to="/streaming"      >Streaming</NavLink>
        <NavLink to="/festivales"     >Festivales</NavLink>
        <NavLink to="/noticias"       >Noticias</NavLink>
      </div>

      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar película..."
        />
        <button type="submit">&#9906;</button>
      </form>
    </nav>
  )
}