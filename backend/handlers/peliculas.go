package handlers

import (
	"net/http"
	"strconv"
	"tucineencolombia/database"
	"tucineencolombia/models"

	"github.com/gin-gonic/gin"
)

func GetPeliculas(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, titulo, descripcion, imagen, trailer, genero, anio, duracion, tipo, destacada FROM peliculas")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var peliculas []models.Pelicula
	for rows.Next() {
		var p models.Pelicula
		rows.Scan(&p.ID, &p.Titulo, &p.Descripcion, &p.Imagen, &p.Trailer, &p.Genero, &p.Anio, &p.Duracion, &p.Tipo, &p.Destacada)
		p.DondeVer = getDondeVer(p.ID)
		peliculas = append(peliculas, p)
	}
	c.JSON(http.StatusOK, peliculas)
}

func GetPeliculaByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var p models.Pelicula
	row := database.DB.QueryRow("SELECT id, titulo, descripcion, imagen, trailer, genero, anio, duracion, tipo, destacada FROM peliculas WHERE id = ?", id)
	err = row.Scan(&p.ID, &p.Titulo, &p.Descripcion, &p.Imagen, &p.Trailer, &p.Genero, &p.Anio, &p.Duracion, &p.Tipo, &p.Destacada)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Película no encontrada"})
		return
	}

	p.DondeVer = getDondeVer(p.ID)
	c.JSON(http.StatusOK, p)
}

// helper interno — trae las plataformas de una película
func getDondeVer(peliculaID int) []models.DondeVer {
	rows, err := database.DB.Query("SELECT plataforma, tipo FROM donde_ver WHERE pelicula_id = ?", peliculaID)
	if err != nil {
		return nil
	}
	defer rows.Close()

	var lista []models.DondeVer
	for rows.Next() {
		var d models.DondeVer
		rows.Scan(&d.Plataforma, &d.Tipo)
		lista = append(lista, d)
	}
	return lista
}