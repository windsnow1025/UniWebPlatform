# DefaultApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**convertMessagesMessagesConvertPost**](#convertmessagesmessagesconvertpost) | **POST** /messages/convert | Convert Messages|
|[**generateChatPost**](#generatechatpost) | **POST** /chat | Generate|
|[**getModelsModelGet**](#getmodelsmodelget) | **GET** /model | Get Models|
|[**rootGet**](#rootget) | **GET** / | Root|

# **convertMessagesMessagesConvertPost**
> any convertMessagesMessagesConvertPost(messagesConvertRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    MessagesConvertRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let messagesConvertRequest: MessagesConvertRequest; //

const { status, data } = await apiInstance.convertMessagesMessagesConvertPost(
    messagesConvertRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **messagesConvertRequest** | **MessagesConvertRequest**|  | |


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **generateChatPost**
> any generateChatPost(chatRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ChatRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let chatRequest: ChatRequest; //

const { status, data } = await apiInstance.generateChatPost(
    chatRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chatRequest** | **ChatRequest**|  | |


### Return type

**any**

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getModelsModelGet**
> Array<ModelPrice> getModelsModelGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getModelsModelGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ModelPrice>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **rootGet**
> any rootGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.rootGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

