import { NodeProps, useReactFlow } from "@xyflow/react";
import { TriageNode } from "../../../../../types";
import { ChangeEvent, useCallback } from "react";

export function TriageInput(props: NodeProps<TriageNode>) {
  const { updateNodeData } = useReactFlow();

  const onChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(props.id, { value: e.target.value });
  }, [props.id]);

  if (props.data.stepType === "label") return null;

  return (
    <>
      <h1 className="text-md font-bold">Question 📌</h1>
      <textarea
        id="text"
        name="text"
        maxLength={100}
        value={props.data.value}
        onChange={onChange}
        placeholder="Ex: Is the triage for you?"
        className="nodrag w-full rounded-[10px] px-2 py-1 bg-gray-100"
      />
    </>
  );
}
