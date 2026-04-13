package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"tucineencolombia/models"

	"github.com/gin-gonic/gin"
)

const (
	TMDB_TOKEN   = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NjdhMzQ0YjhkMTk5NjAwNmE3YmRlZjVlMDE0MTY3NCIsIm5iZiI6MTc3NjAzMTUyNS43MTgwMDAyLCJzdWIiOiI2OWRjMTcyNTI1ZTdjNTAxZWFiNjUwNTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.GpK8-VgW-VtFfiREEHq7WXnfXvvJJg1S5uARuS7CexU" // ← pega tu token
	TMDB_BASE    = "https://api.themoviedb.org/3"
	TMDB_IMG     = "https://image.tmdb.org/t/p/w500"
	TMDB_TRAILER = "https://www.youtube.com/embed/"
)

// Structs para parsear respuesta de TMDB
type tmdbMovie struct {
	ID          int     `json:"id"`
	Title       string  `json:"title"`
	Overview    string  `json:"overview"`
	PosterPath  string  `json:"poster_path"`
	ReleaseDate string  `json:"release_date"`
	VoteAverage float64 `json:"vote_average"`
	GenreIDs    []int   `json:"genre_ids"`
}

type tmdbResponse struct {
	Results []tmdbMovie `json:"results"`
}

type tmdbDetail struct {
	ID       int    `json:"id"`
	Runtime  int    `json:"runtime"`
	Genres   []struct {
		Name string `json:"name"`
	} `json:"genres"`
	Videos struct {
		Results []struct {
			Key  string `json:"key"`
			Type string `json:"type"`
			Site string `json:"site"`
		} `json:"results"`
	} `json:"videos"`
}

// Cines disponibles en Colombia por ciudad
var cinesColombia = []models.CineDisponible{
	{Nombre: "Cine Colombia",  Ciudad: "Bogotá, Medellín, Cali, Barranquilla", Logo: "🎬"},
	{Nombre: "Royal Films",    Ciudad: "Bogotá, Medellín, Bucaramanga",        Logo: "👑"},
	{Nombre: "Cinépolis",      Ciudad: "Bogotá, Medellín, Cali",               Logo: "🎥"},
	{Nombre: "Procinal",       Ciudad: "Bogotá, Medellín, Pereira",            Logo: "🍿"},
	{Nombre: "Cinemark",       Ciudad: "Bogotá, Cali",                         Logo: "🎦"},
}

func tmdbRequest(url string) ([]byte, error) {
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("Authorization", TMDB_TOKEN)
	req.Header.Add("accept", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	return io.ReadAll(res.Body)
}

func GetCartelera(c *gin.Context) {
	// 1. Traer películas en cartelera en Colombia
	url := fmt.Sprintf("%s/movie/now_playing?language=es-CO&region=CO&page=1", TMDB_BASE)
	body, err := tmdbRequest(url)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error conectando con TMDB"})
		return
	}

	var tmdbResp tmdbResponse
	json.Unmarshal(body, &tmdbResp)

	var peliculas []models.PeliculaTMDB

	for _, m := range tmdbResp.Results {
		if m.PosterPath == "" {
			continue
		}

		// 2. Traer detalle de cada película (trailer + duración + géneros)
		detailURL := fmt.Sprintf("%s/movie/%d?language=es-CO&append_to_response=videos", TMDB_BASE, m.ID)
		detailBody, err := tmdbRequest(detailURL)
		if err != nil {
			continue
		}

		var detail tmdbDetail
		json.Unmarshal(detailBody, &detail)

		// Buscar trailer en YouTube
		trailer := ""
		for _, v := range detail.Videos.Results {
			if v.Type == "Trailer" && v.Site == "YouTube" {
				trailer = TMDB_TRAILER + v.Key
				break
			}
		}

		// Género principal
		genero := "General"
		if len(detail.Genres) > 0 {
			genero = detail.Genres[0].Name
		}

		// Duración
		duracion := "N/A"
		if detail.Runtime > 0 {
			duracion = fmt.Sprintf("%d min", detail.Runtime)
		}

		// Asignar cines (todos están disponibles en cartelera)
		pelicula := models.PeliculaTMDB{
			ID:          m.ID,
			Titulo:      m.Title,
			Descripcion: m.Overview,
			Imagen:      TMDB_IMG + m.PosterPath,
			Trailer:     trailer,
			Genero:      genero,
			Duracion:    duracion,
			FechaEstreno: m.ReleaseDate,
			Calificacion: m.VoteAverage,
			Cines:        cinesColombia, // todas las películas en cartelera
		}
		peliculas = append(peliculas, pelicula)
	}

	c.JSON(http.StatusOK, peliculas)
}

func GetDetalleTMDB(c *gin.Context) {
	id := c.Param("id")

	// Detalle principal
	detailURL := fmt.Sprintf("%s/movie/%s?language=es-CO&append_to_response=videos", TMDB_BASE, id)
	detailBody, err := tmdbRequest(detailURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error conectando con TMDB"})
		return
	}

	// Struct extendido para el detalle
	var raw struct {
		ID       int    `json:"id"`
		Title    string `json:"title"`
		Overview string `json:"overview"`
		Poster   string `json:"poster_path"`
		Release  string `json:"release_date"`
		Runtime  int    `json:"runtime"`
		Vote     float64 `json:"vote_average"`
		Genres   []struct {
			Name string `json:"name"`
		} `json:"genres"`
		Videos struct {
			Results []struct {
				Key  string `json:"key"`
				Type string `json:"type"`
				Site string `json:"site"`
			} `json:"results"`
		} `json:"videos"`
	}
	json.Unmarshal(detailBody, &raw)

	// Trailer
	trailer := ""
	for _, v := range raw.Videos.Results {
		if v.Type == "Trailer" && v.Site == "YouTube" {
			trailer = TMDB_TRAILER + v.Key
			break
		}
	}

	// Géneros
	genero := "General"
	if len(raw.Genres) > 0 {
		genero = raw.Genres[0].Name
	}

	duracion := "N/A"
	if raw.Runtime > 0 {
		duracion = fmt.Sprintf("%d min", raw.Runtime)
	}

	imagen := ""
	if raw.Poster != "" {
		imagen = TMDB_IMG + raw.Poster
	}

	pelicula := models.PeliculaTMDB{
		ID:           raw.ID,
		Titulo:       raw.Title,
		Descripcion:  raw.Overview,
		Imagen:       imagen,
		Trailer:      trailer,
		Genero:       genero,
		Duracion:     duracion,
		FechaEstreno: raw.Release,
		Calificacion: raw.Vote,
		Cines:        cinesColombia,
	}

	c.JSON(http.StatusOK, pelicula)
}