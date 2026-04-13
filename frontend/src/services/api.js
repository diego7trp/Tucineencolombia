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

export const getResenas = ({ itemId, itemTipo = 'pelicula', origen = 'local' }) =>
  API.get('/resenas', { params: { item_id: itemId, item_tipo: itemTipo, origen } })

export const createResena = (payload) => API.post('/resenas', payload)
export const deleteResena = (resenaId) => API.delete(`/resenas/${resenaId}`)
