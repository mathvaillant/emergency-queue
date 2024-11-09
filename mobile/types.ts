export enum TriageTags {
  Emergency = 'Emergency',
  Delayed = 'Delayed',
  Minor = 'Minor'
}

export enum TagColors {
  Emergency = 'red',
  Delayed = 'yellow',
  Minor = 'green'
}

export type TriageOption = {
  value: string
  nextStep?: string
  assignedLabel?: TriageTags
}

export type TriageStep = {
  step: string
  options: TriageOption[]
}

export type PatientQueueData = {
  number: number
  assignedLabel: TriageTags
}

export type Queue = PatientQueueData[]
