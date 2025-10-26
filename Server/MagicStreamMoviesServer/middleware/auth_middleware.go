package middleware

import (
	"net/http"

	"github.com/JavaCorren/MagicStreamMovies/Server/MagicStreamMoviesServer/utils"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		writeAuthError := func(msg string) {
			origin := c.GetHeader("Origin")
			if origin != "" {
				c.Header("Access-Control-Allow-Origin", origin)
				c.Header("Access-Control-Allow-Credentials", "true")
			}
			c.JSON(http.StatusUnauthorized, gin.H{"error": msg})
			c.Abort()
		}

		token, err := utils.GetAccessToken(c)
		if err != nil {
			writeAuthError(err.Error())
			return
		}
		if token == "" {
			writeAuthError("No token is provided")
			return
		}
		claims, err := utils.ValidateNormalToken(token)

		if err != nil {
			writeAuthError(err.Error())
			return
		}

		c.Set("userId", claims.UserId)
		c.Set("role", claims.Role)

		c.Next()
	}
}
