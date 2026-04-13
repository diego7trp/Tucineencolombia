package handlers

import (
	"net/http"
	"strconv"
	"strings"
	"tucineencolombia/database"
	"tucineencolombia/models"

	"github.com/gin-gonic/gin"
)

type createResenaRequest struct {
	Autor        string `json:"autor"`
	Calificacion int    `json:"calificacion"`
	Comentario   string `json:"comentario"`
}

func GetResenasByPelicula(c *gin.Context) {
	peliculaID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de película inválido"})
		return
	}

	query := `
		SELECT r.id, r.pelicula_id, r.autor, r.calificacion, r.comentario, r.fecha
		FROM resenas r
		INNER JOIN peliculas p ON p.id = r.pelicula_id
		WHERE r.pelicula_id = ?
		ORDER BY r.fecha DESC, r.id DESC
	`

	rows, err := database.DB.Query(query, peliculaID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	resenas := make([]models.Resena, 0)
	for rows.Next() {
		var r models.Resena
		if err := rows.Scan(&r.ID, &r.PeliculaID, &r.Autor, &r.Calificacion, &r.Comentario, &r.Fecha); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		resenas = append(resenas, r)
	}

	c.JSON(http.StatusOK, resenas)
}

func CreateResena(c *gin.Context) {
	peliculaID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de película inválido"})
		return
	}

	var req createResenaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "JSON inválido"})
		return
	}

	autor := strings.TrimSpace(req.Autor)
	comentario := strings.TrimSpace(req.Comentario)
	if autor == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "El autor es obligatorio"})
		return
	}
	if req.Calificacion < 1 || req.Calificacion > 5 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "La calificación debe estar entre 1 y 5"})
		return
	}

	insertQuery := `
		INSERT INTO resenas (pelicula_id, autor, calificacion, comentario)
		VALUES (?, ?, ?, ?)
	`
	result, err := database.DB.Exec(insertQuery, peliculaID, autor, req.Calificacion, comentario)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	resenaID, err := result.LastInsertId()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var created models.Resena
	selectQuery := `
		SELECT id, pelicula_id, autor, calificacion, comentario, fecha
		FROM resenas
		WHERE id = ?
	`
	err = database.DB.QueryRow(selectQuery, resenaID).Scan(
		&created.ID,
		&created.PeliculaID,
		&created.Autor,
		&created.Calificacion,
		&created.Comentario,
		&created.Fecha,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, created)
}

func DeleteResena(c *gin.Context) {
	resenaID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de reseña inválido"})
		return
	}

	result, err := database.DB.Exec("DELETE FROM resenas WHERE id = ?", resenaID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Reseña no encontrada"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Reseña eliminada correctamente"})
}
