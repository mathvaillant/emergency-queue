package model

type Edge struct {
	Id     string `json:"id"`
	Source string `json:"source"`
	Target string `json:"target"`
}

type Node struct {
	Id       string `json:"id"`
	Type     string `json:"type"`
	Position struct {
		X float64 `json:"x"`
		Y float64 `json:"y"`
	} `json:"position"`
}

type TriageNode struct {
	Node
	Data struct {
		Value         string `json:"value"`
		IsRoot        bool   `json:"isRoot"`
		StepType      string `json:"stepType"`
		AssignedLabel string `json:"assignedLabel"`
	} `json:"data"`
}

type TriageOptionNode struct {
	Node
	ParentId string `json:"parentId"`
	Data     struct {
		Value string `json:"value"`
		Index int    `json:"index"`
	} `json:"data"`
}

// Map []T into []interface{}
func NodesToInterfaces[T any](nodes []T) []interface{} {
	result := make([]interface{}, len(nodes))
	for i, v := range nodes {
		result[i] = v
	}
	return result
}

// Merge []TriageNode and []TriageOptionNode into a single []interface{}
func MergeNodes(tnodes []*TriageNode, onodes []*TriageOptionNode) []interface{} {
	return append(NodesToInterfaces(tnodes), NodesToInterfaces(onodes)...)
}
