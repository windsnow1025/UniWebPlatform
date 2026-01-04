# SystemPromptsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**systemPromptsControllerCreate**](#systempromptscontrollercreate) | **POST** /system-prompts/system-prompt | |
|[**systemPromptsControllerDelete**](#systempromptscontrollerdelete) | **DELETE** /system-prompts/system-prompt/{id} | |
|[**systemPromptsControllerFind**](#systempromptscontrollerfind) | **GET** /system-prompts | |
|[**systemPromptsControllerFindOne**](#systempromptscontrollerfindone) | **GET** /system-prompts/system-prompt/{id} | |
|[**systemPromptsControllerUpdate**](#systempromptscontrollerupdate) | **PUT** /system-prompts/system-prompt/{id} | |
|[**systemPromptsControllerUpdateName**](#systempromptscontrollerupdatename) | **PUT** /system-prompts/system-prompt/{id}/name | |

# **systemPromptsControllerCreate**
> SystemPromptResDto systemPromptsControllerCreate(systemPromptReqDto)


### Example

```typescript
import {
    SystemPromptsApi,
    Configuration,
    SystemPromptReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemPromptsApi(configuration);

let systemPromptReqDto: SystemPromptReqDto; //

const { status, data } = await apiInstance.systemPromptsControllerCreate(
    systemPromptReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **systemPromptReqDto** | **SystemPromptReqDto**|  | |


### Return type

**SystemPromptResDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **systemPromptsControllerDelete**
> SystemPromptResDto systemPromptsControllerDelete()


### Example

```typescript
import {
    SystemPromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemPromptsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.systemPromptsControllerDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**SystemPromptResDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **systemPromptsControllerFind**
> Array<SystemPromptResDto> systemPromptsControllerFind()


### Example

```typescript
import {
    SystemPromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemPromptsApi(configuration);

const { status, data } = await apiInstance.systemPromptsControllerFind();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<SystemPromptResDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **systemPromptsControllerFindOne**
> SystemPromptResDto systemPromptsControllerFindOne()


### Example

```typescript
import {
    SystemPromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemPromptsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.systemPromptsControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**SystemPromptResDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **systemPromptsControllerUpdate**
> SystemPromptResDto systemPromptsControllerUpdate(systemPromptReqDto)


### Example

```typescript
import {
    SystemPromptsApi,
    Configuration,
    SystemPromptReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemPromptsApi(configuration);

let id: number; // (default to undefined)
let ifMatch: string; // (default to undefined)
let systemPromptReqDto: SystemPromptReqDto; //

const { status, data } = await apiInstance.systemPromptsControllerUpdate(
    id,
    ifMatch,
    systemPromptReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **systemPromptReqDto** | **SystemPromptReqDto**|  | |
| **id** | [**number**] |  | defaults to undefined|
| **ifMatch** | [**string**] |  | defaults to undefined|


### Return type

**SystemPromptResDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **systemPromptsControllerUpdateName**
> SystemPromptResDto systemPromptsControllerUpdateName(systemPromptNameReqDto)


### Example

```typescript
import {
    SystemPromptsApi,
    Configuration,
    SystemPromptNameReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemPromptsApi(configuration);

let id: number; // (default to undefined)
let ifMatch: string; // (default to undefined)
let systemPromptNameReqDto: SystemPromptNameReqDto; //

const { status, data } = await apiInstance.systemPromptsControllerUpdateName(
    id,
    ifMatch,
    systemPromptNameReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **systemPromptNameReqDto** | **SystemPromptNameReqDto**|  | |
| **id** | [**number**] |  | defaults to undefined|
| **ifMatch** | [**string**] |  | defaults to undefined|


### Return type

**SystemPromptResDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

