package handlers

import (
	"net/http"
	"tucineencolombia/database"
	"tucineencolombia/models"

	"github.com/gin-gonic/gin"
)

func GetNoticias(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, titulo, imagen, resumen, fecha FROM noticias ORDER BY fecha DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var noticias []models.Noticia
	for rows.Next() {
		var n models.Noticia
		rows.Scan(&n.ID, &n.Titulo, &n.Imagen, &n.Resumen, &n.Fecha)
		noticias = append(noticias, n)
	}
	c.JSON(http.StatusOK, noticias)
}	