# PaymentApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**paymentControllerCreateCheckout**](#paymentcontrollercreatecheckout) | **POST** /payment/checkout | Create a Creem checkout session Returns a checkout URL to redirect the user to|
|[**paymentControllerGetProducts**](#paymentcontrollergetproducts) | **GET** /payment/products | Get available products for purchase|
|[**paymentControllerHandleCreemWebhook**](#paymentcontrollerhandlecreemwebhook) | **POST** /payment/webhook/creem | Creem Webhook endpoint Receives payment events from Creem and processes them|

# **paymentControllerCreateCheckout**
> paymentControllerCreateCheckout(checkoutReqDto)


### Example

```typescript
import {
    PaymentApi,
    Configuration,
    CheckoutReqDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentApi(configuration);

let checkoutReqDto: CheckoutReqDto; //

const { status, data } = await apiInstance.paymentControllerCreateCheckout(
    checkoutReqDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **checkoutReqDto** | **CheckoutReqDto**|  | |


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **paymentControllerGetProducts**
> object paymentControllerGetProducts()


### Example

```typescript
import {
    PaymentApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentApi(configuration);

const { status, data } = await apiInstance.paymentControllerGetProducts();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**object**

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

# **paymentControllerHandleCreemWebhook**
> paymentControllerHandleCreemWebhook()


### Example

```typescript
import {
    PaymentApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentApi(configuration);

let creemSignature: string; // (default to undefined)

const { status, data } = await apiInstance.paymentControllerHandleCreemWebhook(
    creemSignature
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **creemSignature** | [**string**] |  | defaults to undefined|


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
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

