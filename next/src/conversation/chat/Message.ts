export interface Message {
  id: string
  role: MessageRole
  text: string
  files: string[]
  display: string
}

export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
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
    if (role === MessageRole.System) {
      return RawEditableState.AlwaysTrue
    }
    if (role === MessageRole.User) {
      return RawEditableState.AlwaysTrue
    }
    if (role === MessageRole.Assistant) {
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

export enum ContentEditable {
  True = "true",
  False = "false",
  PlainTextOnly = "plaintext-only",
}