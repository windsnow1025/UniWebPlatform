# Component Splitting Conventions

## Core Principles

- Self-contained data fetching: Components fetch their own data via Logic classes
- Minimal props: Only pass what can't be fetched (entity + setter for mutations)
- Self-managed alerts: Each component handles its own `alertOpen/alertMessage/alertSeverity`
- Embedded dialogs: Related dialogs live inside the component

## Prop Patterns

| Pattern         | Example                           |
|-----------------|-----------------------------------|
| Entity + setter | `{conversation, setConversation}` |
| Callback        | `{onCreated, onDeleted}`          |
| Control         | `{open, onClose}`                 |
