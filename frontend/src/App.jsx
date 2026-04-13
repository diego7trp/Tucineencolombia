import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar          from './components/Navbar'
import Footer          from './components/Footer'
import Home            from './pages/Home'
import Estrenos        from './pages/Estrenos'
import MovieDetail     from './pages/MovieDetail'
import Noticias        from './pages/Noticias'
import Festivales      from './pages/Festivales'
import Streaming       from './pages/Streaming'
import Cartelera       from './pages/Cartelera'
import CarteleraDetail from './pages/CarteleraDetail'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/estrenos"       element={<Estrenos />} />
          <Route path="/pelicula/:id"   element={<MovieDetail />} />
          <Route path="/noticias"       element={<Noticias />} />
          <Route path="/festivales"     element={<Festivales />} />
          <Route path="/streaming"      element={<Streaming />} />
          <Route path="/cartelera"      element={<Cartelera />} />
          <Route path="/cartelera/:id"  element={<CarteleraDetail />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}