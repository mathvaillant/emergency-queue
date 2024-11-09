import { Node } from "@xyflow/react";

export enum CustomNodeTypes {
  TriageStep = 'triageStep',
  TriageOption = 'triageOption',
}

export enum TriageTags {
  Emergency = 'Emergency',
  Delayed = 'Delayed',
  Minor = 'Minor',
}

export enum StepTypes {
  Step = 'step',
  Label = 'label',
}

export type TriageNode = Node<{
  value: string;
  isRoot: boolean;
  stepType: StepTypes;
  assignedLabel?: TriageTags
}>;

export type TriageOptionNode = Node<{
  value: string;
  index: number;
}>;

export type PatientQueueData = {
  number: number;
  assignedLabel: TriageTags;
}

export type Queue = PatientQueueData[];
