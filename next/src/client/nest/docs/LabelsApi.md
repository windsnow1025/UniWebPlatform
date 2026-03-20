# LabelsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**labelsControllerCreate**](#labelscontrollercreate) | **POST** /labels | |
|[**labelsControllerDelete**](#labelscontrollerdelete) | **DELETE** /labels/{id} | |
|[**labelsControllerFind**](#labelscontrollerfind) | **GET** /labels | |
|[**labelsControllerFindOne**](#labelscontrollerfindone) | **GET** /labels/{id} | |
|[**labelsControllerUpdate**](#labelscontrollerupdate) | **PATCH** /labels/{id} | |

# **labelsControllerCreate**
> LabelResDto labelsControllerCreate(labelReqDto)


### Example

```typescript
import {
    LabelsApi,
    Configuration,
    LabelReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new LabelsApi(configuration);

let labelReqDto: LabelReqDto; //

const { status, data } = await apiInstance.labelsControllerCreate(
    labelReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **labelReqDto** | **LabelReqDto**|  | |


### Return type

**LabelResDto**

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

# **labelsControllerDelete**
> LabelResDto labelsControllerDelete()


### Example

```typescript
import {
    LabelsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LabelsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.labelsControllerDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**LabelResDto**

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

# **labelsControllerFind**
> Array<LabelResDto> labelsControllerFind()


### Example

```typescript
import {
    LabelsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LabelsApi(configuration);

const { status, data } = await apiInstance.labelsControllerFind();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<LabelResDto>**

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

# **labelsControllerFindOne**
> LabelResDto labelsControllerFindOne()


### Example

```typescript
import {
    LabelsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LabelsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.labelsControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**LabelResDto**

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

# **labelsControllerUpdate**
> LabelResDto labelsControllerUpdate(labelReqDto)


### Example

```typescript
import {
    LabelsApi,
    Configuration,
    LabelReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new LabelsApi(configuration);

let id: number; // (default to undefined)
let labelReqDto: LabelReqDto; //

const { status, data } = await apiInstance.labelsControllerUpdate(
    id,
    labelReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **labelReqDto** | **LabelReqDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**LabelResDto**

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

