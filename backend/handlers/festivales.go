package handlers

import (
	"net/http"
	"tucineencolombia/database"
	"tucineencolombia/models"

	"github.com/gin-gonic/gin"
)

func GetFestivales(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, nombre, ubicacion, imagen, descripcion, fecha FROM festivales")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var festivales []models.Festival
	for rows.Next() {
		var f models.Festival
		rows.Scan(&f.ID, &f.Nombre, &f.Ubicacion, &f.Imagen, &f.Descripcion, &f.Fecha)
		festivales = append(festivales, f)
	}
	c.JSON(http.StatusOK, festivales)
}