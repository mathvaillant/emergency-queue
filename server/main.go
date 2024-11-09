package main

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/mathvaillant/emergency-queue-v1/handler"
	"github.com/mathvaillant/emergency-queue-v1/storage"
)

func main() {
	env := EnvConfig()
	db := DBConnection(env)
	pusher := Pusher(env)

	server := fiber.New(fiber.Config{
		AppName:      "Emergency-Queue",
		ServerHeader: "Fiber V2",
	})

	server.Use(cors.New(cors.Config{AllowOrigins: "*"}))

	triageStorage := storage.InitTriageStorage(db)
	queueStorage := storage.InitQueueStorage(db)

	handler.InitTriageHandler(server.Group("/triage"), triageStorage)
	handler.InitQueueHandler(server.Group("/queue"), queueStorage, pusher)

	server.Listen(fmt.Sprintf(":" + env.PORT))
}
