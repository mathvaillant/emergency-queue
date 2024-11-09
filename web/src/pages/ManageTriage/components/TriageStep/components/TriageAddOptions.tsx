import { NodeProps, useNodes, useReactFlow } from "@xyflow/react";
import { CustomNodeTypes, TriageNode, TriageOptionNode } from "../../../../../types";
import { useCallback, useMemo } from "react";

export function TriageAddOptions(props: NodeProps<TriageNode>) {
  const nodes = useNodes();
  const { addNodes } = useReactFlow();

  const optionSiblings = useMemo(() => {
    return nodes.filter(({ parentId }) => parentId === props.id);
  }, [props.parentId, nodes]) as TriageOptionNode[];

  const onAddOption = useCallback(() => {
    const newSibling: TriageOptionNode = {
      id: crypto.randomUUID(),
      parentId: props.id,
      type: CustomNodeTypes.TriageOption,
      position: { x: 25, y: 0 },
      data: { value: '', index: optionSiblings.length }
    };

    let y = 0;

    if (optionSiblings.length) {
      const lastSibling = optionSiblings[optionSiblings.length - 1];
      y = lastSibling.position.y + 90;
    } else {
      y = props.height!;
    }

    newSibling.position = { x: 25, y };
    addNodes([newSibling]);
  }, [optionSiblings, props.id]);

  if (props.data.stepType === "label") return null;

  return (
    <>
      <h1 className="text-md font-bold mt-5">Options 📝</h1>
      <div
        onClick={onAddOption}
        className="nodrag flex items-center justify-center w-full h-10 border-dotted border-[3px] border-[lightgray] rounded-[10px] hover:bg-gray-100"
        style={{ marginBottom: 90 * optionSiblings.length + "px" }}
      >
        <h1 className="text-xl font-bold text-gray-400">+</h1>
      </div>
    </>
  );
}
