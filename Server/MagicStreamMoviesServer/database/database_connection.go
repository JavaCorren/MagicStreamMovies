package database

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func Connect() *mongo.Client {
	_ = godotenv.Load(".env")

	MongoDbUri := os.Getenv("MONGODB_URI")

	if MongoDbUri == "" {
		log.Println("MongoDB_URI not set!")
	}
	log.Println("MongoDB URI: ", MongoDbUri)

	clientOptions := options.Client().ApplyURI(MongoDbUri)

	client, err := mongo.Connect(clientOptions)

	if err != nil {
		return nil
	}

	return client
}

var Client *mongo.Client = Connect()

func OpenCollection(collectionName string, cl *mongo.Client) *mongo.Collection {
	_ = godotenv.Load(".env")

	databaseName := os.Getenv("DATABASE_NAME")
	fmt.Println("DATABASE_NAME: ", databaseName)
	collection := cl.Database(databaseName).Collection(collectionName)

	if collection == nil {
		return nil
	}

	return collection
}
