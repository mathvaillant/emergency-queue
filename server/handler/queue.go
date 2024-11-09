package handler

import (
	"context"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/mathvaillant/emergency-queue-v1/model"
	"github.com/mathvaillant/emergency-queue-v1/storage"
	"github.com/pusher/pusher-http-go/v5"
)

type QueueHandler struct {
	storage *storage.QueueStorage
	pusher  *pusher.Client
}

func (h *QueueHandler) GetQueue(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	queue, err := h.storage.GetQueue(context)

	if err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	return ctx.Status(fiber.StatusOK).JSON(queue)
}

func (h *QueueHandler) PushToQueue(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	newPatient := &model.QueueEntry{}

	if err := ctx.BodyParser(newPatient); err != nil {
		return ctx.SendStatus(fiber.StatusUnprocessableEntity)
	}

	if err := validator.New().Struct(newPatient); err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	number, err := h.storage.PushToQueue(context, newPatient)
	if err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	h.pusher.Trigger("live-queue", "patient-in", number)

	return ctx.Status(fiber.StatusCreated).JSON(&fiber.Map{
		"number":        number,
		"assignedLabel": newPatient.AssignedLabel,
	})
}

func (h *QueueHandler) RemoveFromQueue(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	patientNumber, _ := ctx.ParamsInt("patientNumber")

	if err := h.storage.RemoveFromQueue(context, patientNumber); err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	h.pusher.Trigger("live-queue", "patient-out", patientNumber)

	return ctx.SendStatus(fiber.StatusOK)
}

func InitQueueHandler(router fiber.Router, storage *storage.QueueStorage, pusher *pusher.Client) {
	handler := &QueueHandler{
		storage: storage,
		pusher:  pusher,
	}

	router.Get("/", handler.GetQueue)
	router.Delete("/:patientNumber", handler.RemoveFromQueue)
	router.Post("/new-patient", handler.PushToQueue)
}
