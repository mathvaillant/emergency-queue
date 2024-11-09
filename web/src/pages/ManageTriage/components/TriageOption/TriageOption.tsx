import { Handle, NodeProps, Position, useEdges, useNodes, useReactFlow } from "@xyflow/react";
import { CustomNodeTypes, StepTypes, TriageNode, TriageOptionNode } from "../../../../types";
import clsx from "clsx";
import { ChangeEvent, useCallback, useMemo } from "react";

export function triageOption(props: NodeProps<TriageOptionNode>) {
  const nodes = useNodes();
  const edges = useEdges();
  const { deleteElements, updateNodeData, updateNode, addNodes, addEdges } = useReactFlow();

  const parentNode = useMemo(() => {
    return nodes.find(({ id }) => id === props.parentId);
  }, [nodes, props.parentId]) as TriageNode;

  const siblings = useMemo(() => {
    return nodes.filter(({ parentId }) => parentId === props.parentId);
  }, [nodes, props.parentId]) as TriageOptionNode[];

  const onChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(props.id, { value: e.target.value });
  }, [props.id]);

  const onDeleteOption = useCallback(async () => {
    await deleteElements({ nodes: [{ id: props.id }] });

    siblings.forEach(({ data, id, position }) => {
      if (id !== props.id && data.index > props.data.index) {
        updateNode(id, { position: { x: 25, y: position.y - 90 } });
      }
    });
  }, [props.id, siblings]);

  const onAddNestedTriage = useCallback(() => {
    const newTriage: TriageNode = {
      id: crypto.randomUUID(),
      type: CustomNodeTypes.TriageStep,
      position: { x: 200, y: 100 },
      data: { value: '', isRoot: false, stepType: StepTypes.Step }
    };

    addNodes([newTriage]);
    addEdges([{
      id: crypto.randomUUID(),
      source: props.id,
      target: newTriage.id
    }]);
  }, [props.id, edges]);

  const isConnectable = useMemo(() => {
    return !edges.find(({ source }) => source === props.id);
  }, [edges, props.id]);

  if (parentNode.data.stepType === 'label') return null;

  return (
    <>
      <div
        key={props.id}
        className="nodrag flex items-center justify-between w-[210px] gap-2"
      >
        <button
          onClick={onDeleteOption}
          className="flex items-center justify-center w-[40px] h-[40px] border-dotted rounded-full bg-red-50 hover:bg-red-200"
        >
          ❌
        </button>
        <textarea
          value={props.data.value}
          onChange={onChange}
          maxLength={100}
          placeholder="Ex: Yes."
          className="w-5/6 rounded-[10px] px-2 py-1 bg-gray-100"
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id={props.id}
        isConnectable={isConnectable}
        onClick={onAddNestedTriage}
        className={clsx({
          'flex items-center justify-center w-[40px] h-[40px] rounded-full hover:bg-gray-200 mr-[-25px]': true,
          'bg-black border-none': !isConnectable,
          'border-dotted border-[2px] border-[lightgray] bg-white': isConnectable,
        })}
      >🔗</Handle>
    </>
  );
}
