package model

type QueueEntry struct {
	AssignedLabel string `json:"assignedLabel"`
	Number        int    `json:"number"`
}

// Map []T into []interface{}
func QueueEntryToInterfaces[T any](q []T) []interface{} {
	result := make([]interface{}, len(q))
	for i, v := range q {
		result[i] = v
	}
	return result
}
