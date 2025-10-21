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
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("Warning: Unable to find .env file")
	}

	MongoDbUri := os.Getenv("MONGODB_URI")

	if MongoDbUri == "" {
		log.Fatal("MongoDB_URI not set!")
	}
	fmt.Println("MongoDB URI: ", MongoDbUri)

	clientOptions := options.Client().ApplyURI(MongoDbUri)

	client, err := mongo.Connect(clientOptions)

	if err != nil {
		return nil
	}

	return client
}

var Client *mongo.Client = Connect()

func OpenCollection(collectionName string, cl *mongo.Client) *mongo.Collection {
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("Warning: unable to find .env file")
	}
	databaseName := os.Getenv("DATABASE_NAME")
	fmt.Println("DATABASE_NAME: ", databaseName)
	collection := cl.Database(databaseName).Collection(collectionName)

	if collection == nil {
		return nil
	}

	return collection
}
