package main

import (
	"context"
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
	router.SetTrustedProxies(nil)

	router.GET("/hello", func(ctx *gin.Context) {
		ctx.String(200, "Hello, MagicStreamMovies")
	})

	_ = godotenv.Load(".env")

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

	router.Use(func(c *gin.Context) {
		log.Println("🌐 Incoming Request:", c.Request.Method, c.Request.URL.Path)
		log.Println("🔶 Origin:", c.Request.Header.Get("Origin"))
		log.Println("🔶 Headers:", c.Request.Header)
		c.Next()
		log.Println("🔷 Response Headers:", c.Writer.Header())
	})

	router.Use(gin.Logger(), gin.Recovery())

	client := database.Connect()

	if err := client.Ping(context.Background(), nil); err != nil {
		log.Println("Failed to reach mongodb server: ", err)
	}

	defer func() {
		err := client.Disconnect(context.Background())
		if err != nil {
			log.Println("Failed to disconnect from mongodb server: ", err)
		}
	}()

	routes.SetupUnprotectedRoutes(router, client)
	routes.SetupProtectedRoutes(router, client)

	if err := router.Run(":8080"); err != nil {
		log.Println("Failed to start server", err)
	}
}
