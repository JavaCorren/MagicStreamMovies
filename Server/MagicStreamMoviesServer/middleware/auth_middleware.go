package middleware

import (
	"log"
	"net/http"

	"github.com/JavaCorren/MagicStreamMovies/Server/MagicStreamMoviesServer/utils"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		for _, cookie := range c.Request.Cookies() {
			log.Println("Received Cookie:", cookie.Name, cookie.Value)
		}

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		token, err := utils.GetAccessToken(c)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No token is provided"})
			c.Abort()
			return
		}
		claims, err := utils.ValidateNormalToken(token)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}

		c.Set("userId", claims.UserId)
		c.Set("role", claims.Role)

		c.Next()
	}
}
