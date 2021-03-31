Authentication
--------------

Net2Phone Canada API uses the industry-standard OAuth 2.0 for authorization. If you are unfamiliar with this protocol please take a moment to do so by visiting [https://oauth.net/2/](https://oauth.net/2/). Once you are ready to authenticate you will be able to choose between a Client-Credential Grant and an Authorization Code Grant as your means of authentication. Below is a simple tutorial to help you authenticate.

*   [Introduction](#sec-introduction)
*   [Client Credentials Grant](#sec-clientCred)
*   [Authorization Code Grant](#sec-authCode)

Overview

OAuth 2.0 Authentication
------------------------

Authentication is performed with one of the multiple OAuth 2.0 Authentication Flows. Deciding which flow to implement depends on the integration you are witting and while there are a multiple OAuth2 Authorization Flows, there are two primary ones for use when integrating with Net2Phone Canada API.

*   ##### Client-Credential Grant
    
    If your integration will perform company-specific actions and/or requests such as obtaining your Call History for your company or Stats for a Call Queue, then the client-credential grant provides a simple means to access all of your company data.
    
*   ##### Authorization Code Grant
    
    If your integration will perform user-based actions and/or requests such as placing a phone call or logging in/out of a queue, then the Authorization Code Grant provides a way for individual users to authenticate in your application and access their data.
    

**If you haven't already, [Log In]() to the developer portal using your Net2Phone Canada Credentials and create some Oauth 2.0 Authentication Flows credentials. If you are not a Net2Phone Canada client and would like to develop, send an email to [support@versature.com](support@versature.com)**

Authentication Flow

Client-Credentials Grant
------------------------

Applications using the Client Credentials Grant will need to register with Net2Phone Canada to acquire a unique Client ID and Client Secret key. The Client Secret should not be shared or made public in any way. This is a unique value only for your registered application.

### Request

    curl -X POST
    https://integrate.versature.com/api/oauth/token/
    -dgrant_type=client_credentials
    -dclient_id=0123456789
    -dclient_secret=0123456789012345678901234567890
                    

**This gives you an access token that is valid for 1 hour. After this period you will need to request a new access token for more requests.**

### Response

    HTTP/1.1 200 OK
    {
        "access_token": "7332170a208e270bc922d8ca54a5091f",
        "scope": "Office Manager",
        "token_type": "Bearer",
        "expires_in": 3599,
        "expires": "2016-11-11T16:05:10.301803"
    }

##### [Request Parameters](#)

Your Client-Credential Authentication request will contain the following parameters.

Field

Value

Description

grant\_type

client\_credentials

Indicates the type of grant being presented in exchange for an access token.

client\_id

{% raw %}{{ Client Id }}{% endraw %}

The unique identifier for your application.

client\_secret

{% raw %}{{ Client Secret }}{% endraw %}

The secret key for your application.

##### [Success Response](#)

If your authentication request is successful your response will contain the following data

Field

Description

access\_token

The token used to authenticate requests.

scope

The permissions level granted to this user.

token\_type

The type of token provided.

expires\_in

How many seconds until the provided Access Token expires.

expires

When the Access Token will expire. Date Time is UTC and in ISO-8601 format.

Authentication Flow

Authorization Code Grant
------------------------

Applications using the Authorization Code Grant will need to register a redirect URL with Net2Phone Canada and acquire a unique Client ID and Client Secret. Once acquired, developers will need to direct users to the the authorize endpoint with their Client Id and Redirect URL where they will be able to authenticate with their Net2Phone Canada Credentials. Once authenticated users will be redirected to your redirect URL and a unique code will be provided. Your backend server will use this code along with your client id, client secret, and redirect uri to obtain an Access and Refresh Token for the authenticated user. The provided Access Token is valid for 1 hour and the Refresh Token is valid for 90 days. New Access Tokens can be obtained upon expiry with the use of the Refresh Token. Once the Refresh Token expires users will have to reauthenticate to obtain a new set of Tokens.

![]({{ url_for('static', filename='global/img/AuthCode.svg') }})

### Authentication Steps

*   ##### The Authorization Endpoint
    
    A user's username and password will never be seen by your application. As such you will need to direct the user to our authorization endpoint `https://integrate.versature.com/oauth/authorize/?response_type=code` and provide your Client Id and Redirect URL when you wish to authenticate a user.
    
        https://integrate.versature.com/api/oauth/authorize/?response_type=code&client_id=0123456789&redirect_uri=https://www.example.com/callback/
    
    ##### [Parameters](#)
    
    Field
    
    Description
    
    response\_type
    
    The type of response. This will always be "code"
    
    redirect\_uri
    
    The web address will be requested and a authorization code will be provided as a url argument.  
    **NOTE: This address must match the redirect\_uri provided when you created your Client Id and Secret.**
    
    client\_id
    
    The unique id of your integration
    
    state
    
    An optional but recommended value that allows your client to maintain state between the request and the callback. This will help prevent cross-site request forgery.
    
*   ##### User Authentication
    
    The user will now be able to authenticate with their Net2Phone Canada Credentials
    
    ![]({{ url_for('static', filename='global/img/login-screen.png') }})
    
*   ##### Authentication Code Callback
    
    Once the user has successfully authenticated they will be redirected back to your application through the provided redirect uri and a temporary code will be provided (This code is valid for 60 seconds). If supplied in the initial authorization request the state parameter will also be provided in this callback request. Your integration will now be able to exchange the provided code, along with your Client Id, Client Secret, and Redirect URI for an Access and Refresh Token for the provided user.
    
*   ##### Request Access and Refresh Token
    
    Once you have a code you will be able to make an Authorization Code request to obtain an Access Token and Refresh Token for the user.
    
    ### Request
    
        curl -X POST
        https://integrate.versature.com/api/oauth/token/
        -dgrant_type=authorization_code
        -dcode=00000000
        -dclient_id=0123456789
        -dclient_secret=0123456789012345678901234567890
        -dredirect_uri=https://www.example.com/callback/
                        
    
    ### Response
    
        HTTP/1.1 200 OK
        {
            "access_token": "7332170a208e270bc922d8ca54a5091f",
            "scope": "Office Manager",
            "token_type": "Bearer",
            "expires_in": 3599,
            "expires": "2016-11-11T16:05:10.301803"
        }
    
    ##### [Request Parameters](#)
    
    Your Authorization Code Grant Authentication request will contain the following parameters.
    
    Field
    
    Value
    
    Description
    
    grant\_type
    
    authorization\_code
    
    Indicates the type of grant being presented in exchange for an access token.
    
    client\_id
    
    {% raw %}{{ Client Id }}{% endraw %}
    
    The unique identifier for your application.
    
    client\_secret
    
    {% raw %}{{ Client Secret }}{% endraw %}
    
    The secret key for your application.
    
    code
    
    {% raw %}{{ Authorization Code }}{% endraw %}
    
    The temporary code provided in the authorization callback
    
    redirect\_uri
    
    {% raw %}{{ Your Redirect URI }}{% endraw %}
    
    The web address will be requested and a authorization code will be provided as a url argument.
    
    ##### [Success Response](#)
    
    If your authentication request is successful your response will contain the following data
    
    Field
    
    Description
    
    access\_token
    
    The token used to authenticate requests.
    
    scope
    
    The permissions level granted to this user.
    
    token\_type
    
    The type of token provided.
    
    expires\_in
    
    How many seconds until the provided Access Token expires.
    
    expires
    
    When the Access Token will expire. Date Time is UTC and in ISO-8601 format.