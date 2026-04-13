import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:8080' })

export const getPeliculas   = ()   => API.get('/peliculas')
export const getPelicula    = (id) => API.get(`/peliculas/${id}`)
export const getEstrenos    = ()   => API.get('/estrenos')
export const getNoticias    = ()   => API.get('/noticias')
export const getFestivales  = ()   => API.get('/festivales')
export const getStreaming   = ()   => API.get('/streaming')
export const getCartelera   = ()   => API.get('/cartelera')
export const getDetalleTMDB = (id) => API.get(`/cartelera/${id}`)