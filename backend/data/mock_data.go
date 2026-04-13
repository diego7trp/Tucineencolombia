package data

import "tucineencolombia/models"

var Peliculas = []models.Pelicula{
    {
        ID: 1, Titulo: "Dune: Parte 2",
        Descripcion: "Paul Atreides se une a los Fremen y busca venganza...",
        Imagen:   "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
        Trailer:  "https://www.youtube.com/embed/Way9Dexny3w",
        Genero:   "Ciencia ficción", Anio: 2024, Duracion: "166 min",
        Tipo: "internacional", Destacada: true,
        DondeVer: []models.DondeVer{
            {Plataforma: "Cine Colombia", Tipo: "En cartelera"},
            {Plataforma: "Max", Tipo: "Streaming"},
        },
    },
    {
        ID: 2, Titulo: "Páramo",
        Descripcion: "Thriller colombiano sobre desapariciones en las montañas andinas.",
        Imagen:   "https://via.placeholder.com/300x450?text=Paramo",
        Trailer:  "https://www.youtube.com/embed/dQw4w9WgXcQ",
        Genero:   "Thriller", Anio: 2024, Duracion: "110 min",
        Tipo: "nacional", Destacada: true,
        DondeVer: []models.DondeVer{
            {Plataforma: "Cine Colombia", Tipo: "En cartelera"},
        },
    },
    // Agrega más películas aquí...
}

var Noticias = []models.Noticia{
    {
        ID: 1,
        Titulo:  "El cine colombiano rompe récords en 2024",
        Imagen:  "https://via.placeholder.com/400x250?text=Noticia+1",
        Resumen: "Las producciones nacionales superaron el millón de espectadores...",
        Fecha:   "2024-03-15",
    },
}

var Festivales = []models.Festival{
    {
        ID: 1, Nombre: "Festival de Cine de Cartagena (FICCI)",
        Ubicacion:   "Cartagena, Colombia",
        Imagen:      "https://via.placeholder.com/400x250?text=FICCI",
        Descripcion: "El festival de cine más antiguo de América Latina, celebrado desde 1960.",
        Fecha:       "Marzo 2025",
    },
    {
        ID: 2, Nombre: "Bogoshorts",
        Ubicacion:   "Bogotá, Colombia",
        Imagen:      "https://via.placeholder.com/400x250?text=Bogoshorts",
        Descripcion: "Festival Internacional de Cortometrajes de Bogotá.",
        Fecha:       "Diciembre 2024",
    },
}

var StreamingItems = []models.Streaming{
    {
        ID: 1, Titulo: "La sociedad de la nieve",
        Imagen:     "https://via.placeholder.com/300x450?text=LSDN",
        Plataforma: "Netflix", Tipo: "pelicula",
        Fecha: "2024-04-01",
    },
}