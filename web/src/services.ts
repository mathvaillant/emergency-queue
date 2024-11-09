import { Edge, Node } from "@xyflow/react";
import { CustomNodeTypes, Queue, TriageNode, TriageOptionNode } from "./types";

const URL = "http://127.0.0.1:3000"

export async function callForAssessment(patientNumber: number): Promise<Response> {
  return fetch(`${URL}/queue/${patientNumber}`, {
    method: "DELETE"
  })
}

export async function getQueue(): Promise<Queue> {
  return fetch(`${URL}/queue`)
    .then(res => res.json())
}

export async function getTriage(): Promise<{nodes: Node[], edges: Edge[]}> {
  return fetch(`${URL}/triage`)
    .then(async res => {
      const data = await res.json();
      return {
        nodes: data?.nodes || [],
        edges: data?.edges || [],
      }
    })
}

export async function saveTriage(nodes: Node[], edges: Edge[]): Promise<Response> {
  const TNodesDTO = nodes.reduce((acc: TriageNode[], node) => {
    if (node.type === CustomNodeTypes.TriageStep) {
      const TNodeDTO = {
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      } as TriageNode
      acc.push(TNodeDTO)
    }
    return acc;
  }, [])

  const ONodesDTO = nodes.reduce((acc: TriageOptionNode[], node) => {
    if (node.type === CustomNodeTypes.TriageOption) {
      const ONodeDTO = {
        id: node.id,
        type: node.type,
        position: node.position,
        parentId: node.parentId,
        data: node.data,
      } as TriageOptionNode
      acc.push(ONodeDTO)
    }
    return acc;
  }, [])
  
  const edgesDTO = edges.map(({ source, target, id }) => ({
    source, target, id
  }));

  return fetch(`${URL}/triage`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nodes: TNodesDTO,
      optionNodes: ONodesDTO,
      edges: edgesDTO,
    })
  })
}
