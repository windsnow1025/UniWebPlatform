# ConversationsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**conversationsControllerAddUserForUsers**](#conversationscontrolleradduserforusers) | **POST** /conversations/conversation/{id}/users | |
|[**conversationsControllerCloneForSpecificUser**](#conversationscontrollercloneforspecificuser) | **POST** /conversations/conversation/{id}/clone | |
|[**conversationsControllerCreate**](#conversationscontrollercreate) | **POST** /conversations/conversation | |
|[**conversationsControllerDelete**](#conversationscontrollerdelete) | **DELETE** /conversations/conversation/{id} | |
|[**conversationsControllerFind**](#conversationscontrollerfind) | **GET** /conversations | |
|[**conversationsControllerFindOne**](#conversationscontrollerfindone) | **GET** /conversations/conversation/{id} | |
|[**conversationsControllerFindPublicOne**](#conversationscontrollerfindpublicone) | **GET** /conversations/public/conversation/{id} | |
|[**conversationsControllerFindVersions**](#conversationscontrollerfindversions) | **GET** /conversations/versions | |
|[**conversationsControllerUpdate**](#conversationscontrollerupdate) | **PUT** /conversations/conversation/{id} | |
|[**conversationsControllerUpdateLabelLink**](#conversationscontrollerupdatelabellink) | **PUT** /conversations/conversation/{id}/label | |
|[**conversationsControllerUpdateName**](#conversationscontrollerupdatename) | **PUT** /conversations/conversation/{id}/name | |
|[**conversationsControllerUpdatePublic**](#conversationscontrollerupdatepublic) | **PUT** /conversations/conversation/{id}/public | |

# **conversationsControllerAddUserForUsers**
> ConversationResDto conversationsControllerAddUserForUsers(userUsernameReqDto)


### Example

```typescript
import {
    ConversationsApi,
    Configuration,
    UserUsernameReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let id: number; // (default to undefined)
let ifMatch: string; // (default to undefined)
let userUsernameReqDto: UserUsernameReqDto; //

const { status, data } = await apiInstance.conversationsControllerAddUserForUsers(
    id,
    ifMatch,
    userUsernameReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userUsernameReqDto** | **UserUsernameReqDto**|  | |
| **id** | [**number**] |  | defaults to undefined|
| **ifMatch** | [**string**] |  | defaults to undefined|


### Return type

**ConversationResDto**

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

# **conversationsControllerCloneForSpecificUser**
> ConversationResDto conversationsControllerCloneForSpecificUser(userUsernameReqDto)


### Example

```typescript
import {
    ConversationsApi,
    Configuration,
    UserUsernameReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let id: number; // (default to undefined)
let userUsernameReqDto: UserUsernameReqDto; //

const { status, data } = await apiInstance.conversationsControllerCloneForSpecificUser(
    id,
    userUsernameReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userUsernameReqDto** | **UserUsernameReqDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ConversationResDto**

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

# **conversationsControllerCreate**
> ConversationResDto conversationsControllerCreate(conversationReqDto)


### Example

```typescript
import {
    ConversationsApi,
    Configuration,
    ConversationReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let conversationReqDto: ConversationReqDto; //

const { status, data } = await apiInstance.conversationsControllerCreate(
    conversationReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **conversationReqDto** | **ConversationReqDto**|  | |


### Return type

**ConversationResDto**

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

# **conversationsControllerDelete**
> ConversationResDto conversationsControllerDelete()


### Example

```typescript
import {
    ConversationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.conversationsControllerDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ConversationResDto**

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

# **conversationsControllerFind**
> Array<ConversationResDto> conversationsControllerFind()


### Example

```typescript
import {
    ConversationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

const { status, data } = await apiInstance.conversationsControllerFind();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ConversationResDto>**

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

# **conversationsControllerFindOne**
> ConversationResDto conversationsControllerFindOne()


### Example

```typescript
import {
    ConversationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.conversationsControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ConversationResDto**

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

# **conversationsControllerFindPublicOne**
> ConversationResDto conversationsControllerFindPublicOne()


### Example

```typescript
import {
    ConversationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.conversationsControllerFindPublicOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ConversationResDto**

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

# **conversationsControllerFindVersions**
> Array<ConversationVersionResDto> conversationsControllerFindVersions()


### Example

```typescript
import {
    ConversationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

const { status, data } = await apiInstance.conversationsControllerFindVersions();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ConversationVersionResDto>**

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

# **conversationsControllerUpdate**
> ConversationResDto conversationsControllerUpdate(conversationReqDto)


### Example

```typescript
import {
    ConversationsApi,
    Configuration,
    ConversationReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let id: number; // (default to undefined)
let ifMatch: string; // (default to undefined)
let conversationReqDto: ConversationReqDto; //

const { status, data } = await apiInstance.conversationsControllerUpdate(
    id,
    ifMatch,
    conversationReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **conversationReqDto** | **ConversationReqDto**|  | |
| **id** | [**number**] |  | defaults to undefined|
| **ifMatch** | [**string**] |  | defaults to undefined|


### Return type

**ConversationResDto**

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

# **conversationsControllerUpdateLabelLink**
> ConversationResDto conversationsControllerUpdateLabelLink(conversationLabelReqDto)


### Example

```typescript
import {
    ConversationsApi,
    Configuration,
    ConversationLabelReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let id: number; // (default to undefined)
let ifMatch: string; // (default to undefined)
let conversationLabelReqDto: ConversationLabelReqDto; //

const { status, data } = await apiInstance.conversationsControllerUpdateLabelLink(
    id,
    ifMatch,
    conversationLabelReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **conversationLabelReqDto** | **ConversationLabelReqDto**|  | |
| **id** | [**number**] |  | defaults to undefined|
| **ifMatch** | [**string**] |  | defaults to undefined|


### Return type

**ConversationResDto**

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

# **conversationsControllerUpdateName**
> ConversationResDto conversationsControllerUpdateName(conversationNameReqDto)


### Example

```typescript
import {
    ConversationsApi,
    Configuration,
    ConversationNameReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let id: number; // (default to undefined)
let ifMatch: string; // (default to undefined)
let conversationNameReqDto: ConversationNameReqDto; //

const { status, data } = await apiInstance.conversationsControllerUpdateName(
    id,
    ifMatch,
    conversationNameReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **conversationNameReqDto** | **ConversationNameReqDto**|  | |
| **id** | [**number**] |  | defaults to undefined|
| **ifMatch** | [**string**] |  | defaults to undefined|


### Return type

**ConversationResDto**

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

# **conversationsControllerUpdatePublic**
> ConversationResDto conversationsControllerUpdatePublic(conversationPublicReqDto)


### Example

```typescript
import {
    ConversationsApi,
    Configuration,
    ConversationPublicReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let id: number; // (default to undefined)
let ifMatch: string; // (default to undefined)
let conversationPublicReqDto: ConversationPublicReqDto; //

const { status, data } = await apiInstance.conversationsControllerUpdatePublic(
    id,
    ifMatch,
    conversationPublicReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **conversationPublicReqDto** | **ConversationPublicReqDto**|  | |
| **id** | [**number**] |  | defaults to undefined|
| **ifMatch** | [**string**] |  | defaults to undefined|


### Return type

**ConversationResDto**

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

