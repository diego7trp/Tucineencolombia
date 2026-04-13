package models

import "time"

// ── Modelos existentes ──────────────────────────────

type DondeVer struct {
	Plataforma string `json:"plataforma"`
	Tipo       string `json:"tipo"`
}

type Pelicula struct {
	ID          int        `json:"id"`
	Titulo      string     `json:"titulo"`
	Descripcion string     `json:"descripcion"`
	Imagen      string     `json:"imagen"`
	Trailer     string     `json:"trailer"`
	Genero      string     `json:"genero"`
	Anio        int        `json:"anio"`
	Duracion    string     `json:"duracion"`
	Tipo        string     `json:"tipo"`
	Destacada   bool       `json:"destacada"`
	DondeVer    []DondeVer `json:"donde_ver"`
}

type Noticia struct {
	ID      int    `json:"id"`
	Titulo  string `json:"titulo"`
	Imagen  string `json:"imagen"`
	Resumen string `json:"resumen"`
	Fecha   string `json:"fecha"`
}

type Festival struct {
	ID          int    `json:"id"`
	Nombre      string `json:"nombre"`
	Ubicacion   string `json:"ubicacion"`
	Imagen      string `json:"imagen"`
	Descripcion string `json:"descripcion"`
	Fecha       string `json:"fecha"`
}

type Streaming struct {
	ID         int    `json:"id"`
	Titulo     string `json:"titulo"`
	Imagen     string `json:"imagen"`
	Plataforma string `json:"plataforma"`
	Tipo       string `json:"tipo"`
	Fecha      string `json:"fecha"`
}

// ── Modelos nuevos para TMDB ────────────────────────

type CineDisponible struct {
	Nombre string `json:"nombre"`
	Ciudad string `json:"ciudad"`
	Logo   string `json:"logo"`
}

type PeliculaTMDB struct {
	ID           int              `json:"id"`
	Titulo       string           `json:"titulo"`
	Descripcion  string           `json:"descripcion"`
	Imagen       string           `json:"imagen"`
	Trailer      string           `json:"trailer"`
	Genero       string           `json:"genero"`
	Duracion     string           `json:"duracion"`
	FechaEstreno string           `json:"fecha_estreno"`
	Calificacion float64          `json:"calificacion"`
	Cines        []CineDisponible `json:"cines"`
}

type Resena struct {
	ID           int       `json:"id"`
	PeliculaID   *int      `json:"pelicula_id,omitempty"`
	ItemID       string    `json:"item_id"`
	ItemTipo     string    `json:"item_tipo"`
	Origen       string    `json:"origen"`
	Autor        string    `json:"autor"`
	Calificacion int       `json:"calificacion"`
	Comentario   string    `json:"comentario"`
	Fecha        time.Time `json:"fecha"`
}
