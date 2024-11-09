package storage

import (
	"context"
	"slices"

	"github.com/mathvaillant/emergency-queue-v1/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type QueueStorage struct {
	db *mongo.Database
}

var priorityMap = map[string]int{
	"Emergency": 1,
	"Delayed":   2,
	"Minor":     3,
}

func (q *QueueStorage) GetQueue(ctx context.Context) ([]*model.QueueEntry, error) {
	queue := []*model.QueueEntry{}

	options := options.Find().SetSort(bson.D{{Key: "number", Value: 1}})

	cursor, err := q.db.Collection("queue").Find(ctx, bson.D{}, options)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var entry model.QueueEntry
		if err := cursor.Decode(&entry); err != nil {
			return nil, err
		}
		queue = append(queue, &entry)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	slices.SortFunc(queue, func(patientA, patientB *model.QueueEntry) int {
		if priorityMap[patientA.AssignedLabel] != priorityMap[patientB.AssignedLabel] {
			return priorityMap[patientA.AssignedLabel] - priorityMap[patientB.AssignedLabel]
		}
		return patientA.Number - patientB.Number
	})

	return queue, nil
}

func (q *QueueStorage) PushToQueue(ctx context.Context, patient *model.QueueEntry) (int, error) {
	queue, err := q.GetQueue(ctx)
	if err != nil {
		return 0, nil
	}

	patient.Number = len(queue) + 1
	queue = append(queue, patient)

	q.db.Collection("queue").Drop(ctx)
	if _, err := q.db.Collection("queue").InsertMany(ctx, model.QueueEntryToInterfaces(queue)); err != nil {
		return 0, err
	}

	return patient.Number, nil
}

func (q *QueueStorage) RemoveFromQueue(ctx context.Context, patientNumber int) error {
	var filter = bson.D{{Key: "number", Value: patientNumber}}
	if _, err := q.db.Collection("queue").DeleteOne(ctx, filter); err != nil {
		return err
	}
	return nil
}

func InitQueueStorage(db *mongo.Database) *QueueStorage {
	return &QueueStorage{
		db: db,
	}
}
