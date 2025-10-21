package routes

import (
	controller "github.com/JavaCorren/MagicStreamMovies/Server/MagicStreamMoviesServer/controllers"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func SetupUnprotectedRoutes(router *gin.Engine, client *mongo.Client) {

	router.POST("/register", controller.RegisterUser(client))
	router.POST("/login", controller.LoginUser(client))
	router.GET("/movies", controller.GetMovies(client))
	router.GET("/genres", controller.GetGenres(client))
	router.POST("/refreshtoken", controller.RefreshToken(client))
	router.POST("/logout", controller.Logout(client))
}
