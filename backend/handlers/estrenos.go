package handlers

import (
	"net/http"
	"tucineencolombia/database"
	"tucineencolombia/models"

	"github.com/gin-gonic/gin"
)

func GetEstrenos(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, titulo, descripcion, imagen, trailer, genero, anio, duracion, tipo, destacada FROM peliculas")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var internacionales, nacionales []models.Pelicula
	for rows.Next() {
		var p models.Pelicula
		rows.Scan(&p.ID, &p.Titulo, &p.Descripcion, &p.Imagen, &p.Trailer, &p.Genero, &p.Anio, &p.Duracion, &p.Tipo, &p.Destacada)
		if p.Tipo == "internacional" {
			internacionales = append(internacionales, p)
		} else {
			nacionales = append(nacionales, p)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"internacionales": internacionales,
		"nacionales":      nacionales,
	})
}