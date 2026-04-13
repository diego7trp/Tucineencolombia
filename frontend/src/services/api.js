import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:8080' })

export const getPeliculas = () => API.get('/peliculas')
export const getPelicula = (id) => API.get(`/peliculas/${id}`)
export const getEstrenos = () => API.get('/estrenos')
export const getNoticias = () => API.get('/noticias')
export const getFestivales = () => API.get('/festivales')
export const getStreaming = () => API.get('/streaming')
export const getCartelera = () => API.get('/cartelera')
export const getDetalleTMDB = (id) => API.get(`/cartelera/${id}`)

// Firma nueva: getResenas({ itemId, itemTipo, origen })
// Compatibilidad antigua: getResenas(peliculaId)
export const getResenas = (input) => {
  if (typeof input === 'object' && input !== null) {
    const { itemId, itemTipo = 'pelicula', origen = 'local' } = input
    return API.get('/resenas', { params: { item_id: itemId, item_tipo: itemTipo, origen } })
  }

  return API.get(`/peliculas/${input}/resenas`)
}

// Firma nueva: createResena({ item_id, item_tipo, origen, ... })
// Compatibilidad antigua: createResena(peliculaId, payload)
export const createResena = (input, payload) => {
  if (payload) {
    return API.post(`/peliculas/${input}/resenas`, payload)
  }

  return API.post('/resenas', input)
}

export const deleteResena = (resenaId) => API.delete(`/resenas/${resenaId}`)
