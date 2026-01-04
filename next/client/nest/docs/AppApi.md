# AppApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**appControllerGetRoot**](#appcontrollergetroot) | **GET** / | |

# **appControllerGetRoot**
> appControllerGetRoot()


### Example

```typescript
import {
    AppApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppApi(configuration);

const { status, data } = await apiInstance.appControllerGetRoot();
```

### Parameters
This endpoint does not have any parameters.


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

