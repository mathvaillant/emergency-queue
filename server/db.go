package main

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func DBConnection(env *Env) *mongo.Database {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(env.MONGO_URI))

	if err != nil {
		log.Fatalf("Unable to connect to mongodb: %e", err)
	}

	db := client.Database(env.MONGO_DATABASE)

	return db
}
