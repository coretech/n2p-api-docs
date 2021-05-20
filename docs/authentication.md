# Authentication

Net2Phone API uses the industry-standard OAuth 2.0 for authorization. If you are unfamiliar with this protocol please take a moment to do so by visiting [oauth.net/2](https://oauth.net/2/). Once you are ready to authenticate you will be able to choose between a Client-Credential Grant and an Authorization Code Grant as your means of authentication. Below is a simple tutorial to help you authenticate.

* [Overview](#overview---oauth-20-authentication)
* [Client Credentials Grant](#client-credentials-grant)
* [Authorization Code Grant](#authorization-code-grant)

<hr />

## Overview - OAuth 2.0 Authentication

Authentication is performed with one of the multiple OAuth 2.0 Authentication Flows. Deciding which flow to implement depends on the integration you are witting and while there are a multiple OAuth2 Authorization Flows, there are two primary ones for use when integrating with Net2Phone API.

### Client-Credential Grant
    
If your integration will perform company-specific actions and/or requests such as obtaining your Call History for your company or Stats for a Call Queue, then the client-credential grant provides a simple means to access all of your company data.
    
### Authorization Code Grant
    
If your integration will perform user-based actions and/or requests such as placing a phone call or logging in/out of a queue, then the Authorization Code Grant provides a way for individual users to authenticate in your application and access their data.

**If you haven't already, [log in](https://developer.versatureapps.com/login) to the developer portal using your Net2Phone Credentials and create some Oauth 2.0 Authentication Flows credentials. If you are not a Net2Phone client and would like to develop, send an email to [support@net2phone.com](mailto:support@net2phone.com)**

<hr />

## Client-Credentials Grant

Applications using the Client Credentials Grant will need to register with Net2Phone to acquire a unique Client ID and Client Secret key. The Client Secret should not be shared or made public in any way. This is a unique value only for your registered application.

![client credentials flow](assets/images/auth-client-credentials.png "client credentials flow")

### Request
```bash
curl -X POST \
https://integrate.versature.com/api/oauth/token/ \
-d grant_type=client_credentials \
-d client_id=0123456789 \
-d client_secret=0123456789012345678901234567890
``` 

**This gives you an access token that is valid for 1 hour. After this period you will need to request a new access token for more requests.**

### Response

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
    

#### Request Parameters

Your Client-Credential Authentication request will contain the following parameters.

|Field|Value|Description|
|----|----|----------|
|grant_type|client_credentials|Indicates the type of grant being presented in exchange for an access token.|
|client_id|`clientId`|The unique identifier for your application.|
|client_secret|`clientSecret`|The secret key for your application.|

#### Success Response

If your authentication request is successful your response will contain the following data

|Field|Description|
|----|----------|
|access_token|The token used to authenticate requests.|
|scope|The permissions level granted to this user.|
|token_type|The type of token provided.|
|expires_in|How many seconds until the provided Access Token expires.|
|expires|When the Access Token will expire. Date Time is UTC and in ISO-8601 format.|

<br />
<hr />

## Authorization Code Grant

Applications using the Authorization Code Grant will need to register a redirect URL with Net2Phone and acquire a unique Client ID and Client Secret. Once acquired, developers will need to direct users to the the authorize endpoint with their Client Id and Redirect URL where they will be able to authenticate with their Net2Phone Credentials. Once authenticated users will be redirected to your redirect URL and a unique code will be provided. Your backend server will use this code along with your client id, client secret, and redirect uri to obtain an Access and Refresh Token for the authenticated user. The provided Access Token is valid for 1 hour and the Refresh Token is valid for 90 days. New Access Tokens can be obtained upon expiry with the use of the Refresh Token. Once the Refresh Token expires users will have to reauthenticate to obtain a new set of Tokens.

![authorization code flow](assets/images/auth-authorization-code.png "authorization code flow")

### 1. The Authorization Endpoint
    
A user's username and password will never be seen by your application. As such you will need to direct the user to our authorization endpoint `https://integrate.versature.com/oauth/authorize/?response_type=code` and provide your Client Id and Redirect URL when you wish to authenticate a user.

```http
https://integrate.versature.com/api/oauth/authorize/?
response_type=code&client_id=0123456789&redirect_uri=https://www.example.com/callback/
```

#### Parameters

|Field|Description|
|-----|-----------|
|response_type|The type of response. This will always be "code"|
|redirect_uri|The web address will be requested and a authorization code will be provided as a url argument.<br />**NOTE: The `redirect_uri` must match the `redirect_uri` provided when you created your Client ID and Secret.**|
|client_id|The unique id of your integration|
|state|An optional but recommended value that allows your client to maintain state between the request and the callback.<br />This will help prevent cross-site request forgery.|

### 2. User Authentication
    
The user will now be able to authenticate with their Net2Phone Credentials
    
![login](assets/images/auth-login-screen.png "login")
    
### 3. Authentication Code Callback
    
Once the user has successfully authenticated they will be redirected back to your application through the provided redirect uri and a temporary code will be provided (This code is valid for 60 seconds). If supplied in the initial authorization request the state parameter will also be provided in this callback request. Your integration will now be able to exchange the provided code, along with your Client Id, Client Secret, and Redirect URI for an Access and Refresh Token for the provided user.
    
### 4. Request Access and Refresh Token
    
Once you have a code you will be able to make an Authorization Code request to obtain an Access Token and Refresh Token for the user.
    
#### Request
```bash
curl -X POST \
https://integrate.versature.com/api/oauth/token/ \
-d grant_type=authorization_code \
-d code=00000000 \
-d client_id=0123456789 \
-d client_secret=0123456789012345678901234567890 \
-d redirect_uri=https://www.example.com/callback/
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

#### Request Parameters
    
Your Authorization Code Grant Authentication request will contain the following parameters.

|Field|Value|Description|
|----|----|----------|
|grant_type| authorization_code|Indicates the type of grant being presented in exchange for an access token.|
|client_id|`clientId`|The unique identifier for your application.|
|client_secret|`clientSecret`|The secret key for your application.|
|code|`authorizationCode`|The temporary code provided in the authorization callback|
|redirect_uri|`redirectUri`|The web address will be requested and a authorization code will be provided as a url argument.|
    
#### Success Response
    
If your authentication request is successful your response will contain the following data

|Field|Description|
|----|----------|
|access_token|The token used to authenticate requests.|
|scope|The permissions level granted to this user.|
|token_type|The type of token provided.|
|expires_in|How many seconds until the provided Access Token expires.|
|expires|When the Access Token will expire. Date Time is UTC and in ISO-8601 format.|
