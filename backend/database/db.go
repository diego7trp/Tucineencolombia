package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func Connect() {
	// Cambia usuario, contraseña y nombre de base de datos si es necesario
	dsn := "root:@tcp(127.0.0.1:3306)/tucineencolombia?parseTime=true"

	var err error
	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("Error abriendo conexión:", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("No se pudo conectar a MySQL:", err)
	}

	fmt.Println("✅ Conectado a MySQL")
}