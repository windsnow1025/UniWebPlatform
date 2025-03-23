import {MessageRoleEnum} from "@/client";

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
  role: MessageRoleEnum
): RawEditableState {
  if (editableState === RoleEditableState.RoleBased) {
    if (role === MessageRoleEnum.System) {
      return RawEditableState.AlwaysTrue
    }
    if (role === MessageRoleEnum.User) {
      return RawEditableState.AlwaysTrue
    }
    if (role === MessageRoleEnum.Assistant) {
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