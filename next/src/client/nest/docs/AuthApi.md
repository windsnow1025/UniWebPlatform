# AuthApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authControllerCreateTokenByEmail**](#authcontrollercreatetokenbyemail) | **POST** /auth/token/email | |
|[**authControllerCreateTokenByUsername**](#authcontrollercreatetokenbyusername) | **POST** /auth/token/username | |

# **authControllerCreateTokenByEmail**
> AuthTokenResDto authControllerCreateTokenByEmail(authTokenEmailReqDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    AuthTokenEmailReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let authTokenEmailReqDto: AuthTokenEmailReqDto; //

const { status, data } = await apiInstance.authControllerCreateTokenByEmail(
    authTokenEmailReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authTokenEmailReqDto** | **AuthTokenEmailReqDto**|  | |


### Return type

**AuthTokenResDto**

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

# **authControllerCreateTokenByUsername**
> AuthTokenResDto authControllerCreateTokenByUsername(authTokenUsernameReqDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    AuthTokenUsernameReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let authTokenUsernameReqDto: AuthTokenUsernameReqDto; //

const { status, data } = await apiInstance.authControllerCreateTokenByUsername(
    authTokenUsernameReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authTokenUsernameReqDto** | **AuthTokenUsernameReqDto**|  | |


### Return type

**AuthTokenResDto**

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

