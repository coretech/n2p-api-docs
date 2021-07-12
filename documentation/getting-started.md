# Getting Started

## REST API

This tutorial will show you how to get started with Net2Phone REST API. You will learn how to create the credentials required for your application, learn how to authenticate, and make your first request against our API. If you have any issues along the way please reach out to [support@net2phone.com](mailto:support@net2phone.com) and we will be glad to help.

### 1. Log Into The Developer Portal
    
The first thing you will need is credentials for your application. The required application credentials consist of a Client Id and Client Secret which can be created from **this** developer portal. Simply [log in](https://developer.versatureapps.com/login) using your existing Net2Phone credentials.
    
### 2. Add A New Application
    
Once you have logged into the developer portal, you will be able to "Add New App" and create the required credentials for your application.

![add a new application](assets/images/getting-started-2.png "add new application")
  
### 3. Select Your Authentication Flow
    
Select the **Client Credential Grant** flow for this tutorial. The Client Credential Grant authentication flow will provide API access to your entire domain. The authentication flow which is required for your integration will be based on the type of application you will are building. The supported authentication types, and their use cases are outlined on our [authentication page](/authentication).

![select auth flow](assets/images/getting-started-3.png "select auth flow")

### 4. Client Id and Client Secret

Once you have selected **Client Credentials Grant**, a Client ID and Client Secret will be generated for you. These keys are unique to your application and should be kept **secret**. You will exchange these keys for an Access Token which is valid for **1 hour** and will permit you to make requests against Net2Phone REST API.

![example of client credentials grant](assets/images/getting-started-4.png "example of client credentials grant")

### 5. Authenticate - Client Credentials Grant

Now that you have a Client Id and Client Secret you can obtain an Access Token **(Valid for 1 hour)** which will permit you to make requests against Net2Phone REST API.

#### Request

```bash
curl -X POST \
https://integrate.versature.com/api/oauth/token/ \
-d grant_type=client_credentials \
-d client_id=5768900281106432 \
-d client_secret=DZHkGtVGA0U90VOfGVrX4MzJZABqVgbDbjkd0JacpSNZX870z3
```

#### Response

```json
HTTP/1.1 200 OK
{
    "access_token": "7332170a208e270bc922d8ca54a5091f",
    "scope": "Office Manager",
    "token_type": "Bearer",
    "expires_in": 3599,
    "expires": "2016-11-11T16:05:10.301803"
}
```

### 6. API Request - Live Call Queue Stats

Once you have an Access Token you can make API Requests against the [Integrate API](http://integrate.versature.com/apidoc). Once such API Request is [Live Call Queue Stats](http://integrate.versature.com/apidoc/#api-CallQueuesStats-Live_Call_Queue_Stats) which will provide metrics about your call queues at that exact moment in time.

#### Request

```bash
curl -X GET \
-H 'Accept:application/vnd.integrate.v1.8.0+json' \
-H 'Authorization: Bearer abce14243asdf823kk32323' \
https://integrate.versature.com/api/call_queues/stats/live/
```

#### Response

```http request
HTTP/1.1 201 OK
[
  {
    "calls_waiting": 0,
    "avg_wait": 0,
    "available_agents": 1,
    "unavailable_agents": 9,
    "max_wait": 0,
    "num_agents": 10,
    "queue": "8001"
  },
  {
    "calls_waiting": 0,
    "avg_wait": 0,
    "available_agents": 2,
    "unavailable_agents": 15,
    "max_wait": 0,
    "num_agents": 17,
    "queue": "8002"
  }
]
```

#### 7. What's Next?

Now that you have a feel for Net2Phone API we recommend that you:

\- Have a look through our [API Documentation](/docs/apis) to see all the data is available to you.

\- Review the [Authentication](/authentication) documentation to ensure you select the authentication flow which is best for your application.
