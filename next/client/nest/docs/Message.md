# Message


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**role** | **string** |  | [default to undefined]
**contents** | [**Array&lt;Content&gt;**](Content.md) |  | [default to undefined]
**systemPromptId** | **number** |  | [optional] [default to undefined]
**thought** | **string** |  | [optional] [default to undefined]
**display** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { Message } from './api';

const instance: Message = {
    id,
    role,
    contents,
    systemPromptId,
    thought,
    display,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
