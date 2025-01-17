export interface Message {
  id: string
  role: string
  text: string
  files: string[]
}

export enum EditableState {
  RoleBased = "RoleBased",
  InteractionBased = "InteractionBased",
  AlwaysTrue = "AlwaysTrue",
  AlwaysFalse = "AlwaysFalse",
}