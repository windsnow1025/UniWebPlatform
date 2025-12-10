# AnnouncementApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**announcementControllerFind**](#announcementcontrollerfind) | **GET** /announcement | |
|[**announcementControllerUpdate**](#announcementcontrollerupdate) | **PUT** /announcement | |

# **announcementControllerFind**
> AnnouncementResDto announcementControllerFind()


### Example

```typescript
import {
    AnnouncementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AnnouncementApi(configuration);

const { status, data } = await apiInstance.announcementControllerFind();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**AnnouncementResDto**

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

# **announcementControllerUpdate**
> AnnouncementResDto announcementControllerUpdate(announcementReqDto)


### Example

```typescript
import {
    AnnouncementApi,
    Configuration,
    AnnouncementReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AnnouncementApi(configuration);

let announcementReqDto: AnnouncementReqDto; //

const { status, data } = await apiInstance.announcementControllerUpdate(
    announcementReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **announcementReqDto** | **AnnouncementReqDto**|  | |


### Return type

**AnnouncementResDto**

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

