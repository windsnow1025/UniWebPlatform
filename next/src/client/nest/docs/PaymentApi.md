# PaymentApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**paymentControllerCreateCheckout**](#paymentcontrollercreatecheckout) | **POST** /payment/checkout | |
|[**paymentControllerGetProducts**](#paymentcontrollergetproducts) | **GET** /payment/products | |
|[**paymentControllerHandleCreemWebhook**](#paymentcontrollerhandlecreemwebhook) | **POST** /payment/webhook | |

# **paymentControllerCreateCheckout**
> CheckoutResDto paymentControllerCreateCheckout(checkoutReqDto)


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

**CheckoutResDto**

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

# **paymentControllerGetProducts**
> Array<ProductResDto> paymentControllerGetProducts()


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

**Array<ProductResDto>**

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
> string paymentControllerHandleCreemWebhook()


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

**string**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

