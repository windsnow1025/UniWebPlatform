# PromptsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**promptsControllerCreate**](#promptscontrollercreate) | **POST** /prompts/prompt | |
|[**promptsControllerDelete**](#promptscontrollerdelete) | **DELETE** /prompts/prompt/{id} | |
|[**promptsControllerFind**](#promptscontrollerfind) | **GET** /prompts | |
|[**promptsControllerFindOne**](#promptscontrollerfindone) | **GET** /prompts/prompt/{id} | |
|[**promptsControllerUpdate**](#promptscontrollerupdate) | **PUT** /prompts/prompt/{id} | |
|[**promptsControllerUpdateName**](#promptscontrollerupdatename) | **PUT** /prompts/prompt/{id}/name | |

# **promptsControllerCreate**
> PromptResDto promptsControllerCreate(promptReqDto)


### Example

```typescript
import {
    PromptsApi,
    Configuration,
    PromptReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let promptReqDto: PromptReqDto; //

const { status, data } = await apiInstance.promptsControllerCreate(
    promptReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promptReqDto** | **PromptReqDto**|  | |


### Return type

**PromptResDto**

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

# **promptsControllerDelete**
> PromptResDto promptsControllerDelete()


### Example

```typescript
import {
    PromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.promptsControllerDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**PromptResDto**

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

# **promptsControllerFind**
> Array<PromptResDto> promptsControllerFind()


### Example

```typescript
import {
    PromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

const { status, data } = await apiInstance.promptsControllerFind();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<PromptResDto>**

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

# **promptsControllerFindOne**
> PromptResDto promptsControllerFindOne()


### Example

```typescript
import {
    PromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.promptsControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**PromptResDto**

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

# **promptsControllerUpdate**
> PromptResDto promptsControllerUpdate(promptReqDto)


### Example

```typescript
import {
    PromptsApi,
    Configuration,
    PromptReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let id: number; // (default to undefined)
let ifMatch: string; // (default to undefined)
let promptReqDto: PromptReqDto; //

const { status, data } = await apiInstance.promptsControllerUpdate(
    id,
    ifMatch,
    promptReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promptReqDto** | **PromptReqDto**|  | |
| **id** | [**number**] |  | defaults to undefined|
| **ifMatch** | [**string**] |  | defaults to undefined|


### Return type

**PromptResDto**

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

# **promptsControllerUpdateName**
> PromptResDto promptsControllerUpdateName(promptNameReqDto)


### Example

```typescript
import {
    PromptsApi,
    Configuration,
    PromptNameReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let id: number; // (default to undefined)
let ifMatch: string; // (default to undefined)
let promptNameReqDto: PromptNameReqDto; //

const { status, data } = await apiInstance.promptsControllerUpdateName(
    id,
    ifMatch,
    promptNameReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promptNameReqDto** | **PromptNameReqDto**|  | |
| **id** | [**number**] |  | defaults to undefined|
| **ifMatch** | [**string**] |  | defaults to undefined|


### Return type

**PromptResDto**

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

