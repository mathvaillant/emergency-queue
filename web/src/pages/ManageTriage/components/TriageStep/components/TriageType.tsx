import { NodeProps, useReactFlow } from "@xyflow/react";
import { StepTypes, TriageNode, TriageTags } from "../../../../../types";
import { useCallback } from "react";
import clsx from "clsx";

const colors = {
  [TriageTags.Emergency]: '!bg-red-400',
  [TriageTags.Delayed]: '!bg-yellow-400',
  [TriageTags.Minor]: '!bg-green-400'
};

export function TriageType(props: NodeProps<TriageNode>) {
  const { updateNodeData } = useReactFlow();

  const updateStepType = useCallback((stepType: StepTypes) => {
    updateNodeData(props.id, { stepType, assignedLabel: undefined });
  }, [props.id]);

  if (props.data.isRoot) return null;

  return (
    <div className={clsx(
      'absolute bg-white w-[270px] flex flex-row items-center content-center left-[16px] top-[-48px] gap-[40px] px-4 py-2 rounded-se-[30px] rounded-ss-[30px] shadow-md',
      props.data.stepType === StepTypes.Label && props.data.assignedLabel && colors[props.data.assignedLabel]
    )}>
      {[StepTypes.Step, StepTypes.Label].map((option) => (
        <div
          key={option}
          onClick={() => updateStepType(option)}
          className={clsx(
            'font-bold text-sm flex items-center justify-center px-3 py-1 border-dotted border-[2px] border-[lightgray] rounded-[20px] mr-[-25px]',
            props.data.stepType === option ? "bg-black text-white border-[darkgray]" : "bg-white hover:bg-gray-100 text-black"
          )}
        >
          {option === 'step' ? 'Triage Step' : 'Assign Label'}
        </div>
      ))}
    </div>
  );
}
