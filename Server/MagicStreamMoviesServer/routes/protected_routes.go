package routes

import (
	"net/http"

	controller "github.com/JavaCorren/MagicStreamMovies/Server/MagicStreamMoviesServer/controllers"
	"github.com/JavaCorren/MagicStreamMovies/Server/MagicStreamMoviesServer/middleware"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func SetupProtectedRoutes(router *gin.Engine, client *mongo.Client) {

	protected := router.Group("/")
	protected.Use(middleware.AuthMiddleware())

	protected.OPTIONS("/*path", func(c *gin.Context) {
		c.Status(http.StatusNoContent)
	})
	protected.GET("/movie/:imdb_id", controller.GetMovie(client))
	protected.POST("/addmovie", controller.AddMovie(client))
	protected.GET("/recommendedmovies", controller.GetRecommendedMovies(client))
	protected.PATCH("/updatereview/:imdb_id", controller.AdminReviewUpdate(client))

}
