package main

import (
	"tucineencolombia/database"
	"tucineencolombia/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Conectar a MySQL primero
	database.Connect()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"GET"},
	}))

	r.GET("/peliculas", handlers.GetPeliculas)
	r.GET("/peliculas/:id", handlers.GetPeliculaByID)
	r.GET("/estrenos", handlers.GetEstrenos)
	r.GET("/noticias", handlers.GetNoticias)
	r.GET("/festivales", handlers.GetFestivales)
	r.GET("/streaming", handlers.GetStreaming)
	r.GET("/cartelera", handlers.GetCartelera)
	r.GET("/cartelera/:id", handlers.GetDetalleTMDB)

	r.Run(":8080")
}