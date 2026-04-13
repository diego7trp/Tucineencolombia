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
	ItemID       string `json:"item_id"`
	ItemTipo     string `json:"item_tipo"`
	Origen       string `json:"origen"`
}

func normalizarContextoResena(itemID, itemTipo, origen string) (string, string, string) {
	itemID = strings.TrimSpace(itemID)
	itemTipo = strings.ToLower(strings.TrimSpace(itemTipo))
	origen = strings.ToLower(strings.TrimSpace(origen))

	if itemTipo == "" {
		itemTipo = "pelicula"
	}
	if origen == "" {
		origen = "local"
	}

	return itemID, itemTipo, origen
}

func GetResenasByPelicula(c *gin.Context) {
	peliculaID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de película inválido"})
		return
	}

	resenas, err := listResenasByContext(strconv.Itoa(peliculaID), "pelicula", "local")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resenas)
}

func GetResenas(c *gin.Context) {
	itemID, itemTipo, origen := normalizarContextoResena(
		c.Query("item_id"),
		c.Query("item_tipo"),
		c.Query("origen"),
	)

	if itemID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "item_id es obligatorio"})
		return
	}

	resenas, err := listResenasByContext(itemID, itemTipo, origen)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resenas)
}

func listResenasByContext(itemID, itemTipo, origen string) ([]models.Resena, error) {
	query := `
		SELECT id, pelicula_id, item_id, item_tipo, origen, autor, calificacion, comentario, fecha
		FROM resenas
		WHERE item_id = ? AND item_tipo = ? AND origen = ?
		ORDER BY fecha DESC, id DESC
	`

	rows, err := database.DB.Query(query, itemID, itemTipo, origen)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	resenas := make([]models.Resena, 0)
	for rows.Next() {
		var r models.Resena
		if err := rows.Scan(&r.ID, &r.PeliculaID, &r.ItemID, &r.ItemTipo, &r.Origen, &r.Autor, &r.Calificacion, &r.Comentario, &r.Fecha); err != nil {
			return nil, err
		}
		resenas = append(resenas, r)
	}

	return resenas, nil
}

func CreateResenaByPelicula(c *gin.Context) {
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

	req.ItemID = strconv.Itoa(peliculaID)
	req.ItemTipo = "pelicula"
	req.Origen = "local"

	created, status, errMsg := createResena(req, &peliculaID)
	if errMsg != "" {
		c.JSON(status, gin.H{"error": errMsg})
		return
	}

	c.JSON(http.StatusCreated, created)
}

func CreateResena(c *gin.Context) {
	var req createResenaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "JSON inválido"})
		return
	}

	req.ItemID, req.ItemTipo, req.Origen = normalizarContextoResena(req.ItemID, req.ItemTipo, req.Origen)
	if req.ItemID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "item_id es obligatorio"})
		return
	}

	created, status, errMsg := createResena(req, nil)
	if errMsg != "" {
		c.JSON(status, gin.H{"error": errMsg})
		return
	}

	c.JSON(http.StatusCreated, created)
}

func createResena(req createResenaRequest, peliculaID *int) (models.Resena, int, string) {
	autor := strings.TrimSpace(req.Autor)
	comentario := strings.TrimSpace(req.Comentario)
	if autor == "" {
		return models.Resena{}, http.StatusBadRequest, "El autor es obligatorio"
	}
	if req.Calificacion < 1 || req.Calificacion > 5 {
		return models.Resena{}, http.StatusBadRequest, "La calificación debe estar entre 1 y 5"
	}

	insertQuery := `
		INSERT INTO resenas (pelicula_id, item_id, item_tipo, origen, autor, calificacion, comentario)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`
	result, err := database.DB.Exec(insertQuery, peliculaID, req.ItemID, req.ItemTipo, req.Origen, autor, req.Calificacion, comentario)
	if err != nil {
		return models.Resena{}, http.StatusInternalServerError, err.Error()
	}

	resenaID, err := result.LastInsertId()
	if err != nil {
		return models.Resena{}, http.StatusInternalServerError, err.Error()
	}

	var created models.Resena
	selectQuery := `
		SELECT id, pelicula_id, item_id, item_tipo, origen, autor, calificacion, comentario, fecha
		FROM resenas
		WHERE id = ?
	`
	err = database.DB.QueryRow(selectQuery, resenaID).Scan(
		&created.ID,
		&created.PeliculaID,
		&created.ItemID,
		&created.ItemTipo,
		&created.Origen,
		&created.Autor,
		&created.Calificacion,
		&created.Comentario,
		&created.Fecha,
	)
	if err != nil {
		return models.Resena{}, http.StatusInternalServerError, err.Error()
	}

	return created, http.StatusCreated, ""
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
