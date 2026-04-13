package handlers

import (
	"net/http"
	"tucineencolombia/database"
	"tucineencolombia/models"

	"github.com/gin-gonic/gin"
)

func GetStreaming(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, titulo, imagen, plataforma, tipo, fecha FROM streaming ORDER BY fecha DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var items []models.Streaming
	for rows.Next() {
		var s models.Streaming
		rows.Scan(&s.ID, &s.Titulo, &s.Imagen, &s.Plataforma, &s.Tipo, &s.Fecha)
		items = append(items, s)
	}
	c.JSON(http.StatusOK, items)
}