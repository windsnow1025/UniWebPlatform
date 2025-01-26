export interface Message {
  id: string
  role: string
  text: string
  files: string[]
}

export enum RawEditableState {
  InteractionBased = "InteractionBased",
  AlwaysTrue = "AlwaysTrue",
  AlwaysFalse = "AlwaysFalse",
}

export enum RoleEditableState {
  RoleBased = "RoleBased",
  InteractionBased = "InteractionBased",
  AlwaysTrue = "AlwaysTrue",
  AlwaysFalse = "AlwaysFalse",
}

export function convertToRawEditableState(
  editableState: RoleEditableState,
  role: string
): RawEditableState {
  if (editableState === RoleEditableState.RoleBased) {
    if (role === "system") {
      return RawEditableState.AlwaysTrue
    }
    if (role === "user") {
      return RawEditableState.AlwaysTrue
    }
    if (role === "assistant") {
      return RawEditableState.AlwaysFalse
    }
  }
  if (editableState === RoleEditableState.InteractionBased) {
    return RawEditableState.InteractionBased;
  }
  if (editableState === RoleEditableState.AlwaysTrue) {
    return RawEditableState.AlwaysTrue;
  }
  if (editableState === RoleEditableState.AlwaysFalse) {
    return RawEditableState.AlwaysFalse;
  }
  return RawEditableState.InteractionBased; // unreachable
}
