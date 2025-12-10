# MarkdownsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**markdownsControllerCreate**](#markdownscontrollercreate) | **POST** /markdowns/markdown | |
|[**markdownsControllerDelete**](#markdownscontrollerdelete) | **DELETE** /markdowns/markdown/{id} | |
|[**markdownsControllerFindAll**](#markdownscontrollerfindall) | **GET** /markdowns | |
|[**markdownsControllerFindOne**](#markdownscontrollerfindone) | **GET** /markdowns/markdown/{id} | |
|[**markdownsControllerUpdate**](#markdownscontrollerupdate) | **PUT** /markdowns/markdown/{id} | |

# **markdownsControllerCreate**
> MarkdownResDto markdownsControllerCreate(markdownReqDto)


### Example

```typescript
import {
    MarkdownsApi,
    Configuration,
    MarkdownReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new MarkdownsApi(configuration);

let markdownReqDto: MarkdownReqDto; //

const { status, data } = await apiInstance.markdownsControllerCreate(
    markdownReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **markdownReqDto** | **MarkdownReqDto**|  | |


### Return type

**MarkdownResDto**

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

# **markdownsControllerDelete**
> markdownsControllerDelete()


### Example

```typescript
import {
    MarkdownsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MarkdownsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.markdownsControllerDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **markdownsControllerFindAll**
> Array<MarkdownResDto> markdownsControllerFindAll()


### Example

```typescript
import {
    MarkdownsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MarkdownsApi(configuration);

const { status, data } = await apiInstance.markdownsControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<MarkdownResDto>**

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

# **markdownsControllerFindOne**
> MarkdownResDto markdownsControllerFindOne()


### Example

```typescript
import {
    MarkdownsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MarkdownsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.markdownsControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**MarkdownResDto**

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

# **markdownsControllerUpdate**
> MarkdownResDto markdownsControllerUpdate(markdownReqDto)


### Example

```typescript
import {
    MarkdownsApi,
    Configuration,
    MarkdownReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new MarkdownsApi(configuration);

let id: number; // (default to undefined)
let ifMatch: string; // (default to undefined)
let markdownReqDto: MarkdownReqDto; //

const { status, data } = await apiInstance.markdownsControllerUpdate(
    id,
    ifMatch,
    markdownReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **markdownReqDto** | **MarkdownReqDto**|  | |
| **id** | [**number**] |  | defaults to undefined|
| **ifMatch** | [**string**] |  | defaults to undefined|


### Return type

**MarkdownResDto**

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

