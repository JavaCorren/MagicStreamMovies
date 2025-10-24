package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/JavaCorren/MagicStreamMovies/Server/MagicStreamMoviesServer/database"
	"github.com/JavaCorren/MagicStreamMovies/Server/MagicStreamMoviesServer/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	router := gin.Default()

	router.GET("/hello", func(ctx *gin.Context) {
		ctx.String(200, "Hello, MagicStreamMovies")
	})

	err := godotenv.Load(".env")
	if err != nil {
		log.Println("Warning: err while loading .env file")
	}

	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")

	var origins []string
	if allowedOrigins != "" {
		origins = strings.Split(allowedOrigins, ",")
		for i := range origins {
			origins[i] = strings.TrimSpace(origins[i])
			log.Println("Allowed Origin:", origins[i])
		}
	} else {
		origins = []string{"http://localhost:5173"}
		log.Println("Allowed origin: http://localhost:5173")
	}

	router.Use(cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.Use(gin.Logger())

	client := database.Connect()

	if err := client.Ping(context.Background(), nil); err != nil {
		log.Fatalf("Failed to reach mongodb server: %v", err)
	}

	defer func() {
		err := client.Disconnect(context.Background())
		if err != nil {
			log.Fatalf("Failed to disconnect from mongodb server: %v", err)
		}
	}()

	routes.SetupUnprotectedRoutes(router, client)
	routes.SetupProtectedRoutes(router, client)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if err := router.Run("0.0.0.0:" + port); err != nil {
		fmt.Println("Failed to start server", err)
	}
}
