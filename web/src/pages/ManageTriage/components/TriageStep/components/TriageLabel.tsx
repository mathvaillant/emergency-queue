import { NodeProps, useReactFlow } from "@xyflow/react";
import { TriageNode, TriageTags } from "../../../../../types";
import clsx from "clsx";

export const colors = {
  [TriageTags.Emergency]: {
    selected: 'bg-red-400',
    default: 'bg-red-50 hover:bg-red-200'
  },
  [TriageTags.Delayed]: {
    selected: 'bg-yellow-400',
    default: 'bg-yellow-50 hover:bg-yellow-200'
  },
  [TriageTags.Minor]: {
    selected: 'bg-green-400',
    default: 'bg-green-50 hover:bg-green-200'
  }
};

export function TriageLabel(props: NodeProps<TriageNode>) {
  const { updateNodeData } = useReactFlow();

  if (props.data.stepType === "step") return null;

  return (
    <>
      {[TriageTags.Emergency, TriageTags.Delayed, TriageTags.Minor].map(tag => (
        <div
          key={tag}
          onClick={() => updateNodeData(props.id, { assignedLabel: tag })}
          className={clsx({
            'flex items-center justify-center w-full h-10 rounded-[10px] px-2 py-1 text-black font-bold': true,
            [colors[tag].selected]: props.data.assignedLabel === tag,
            [colors[tag].default]: props.data.assignedLabel !== tag,
          })}
        >{tag}</div>
      ))}
    </>
  );
}
