# Subscriptions

Register your own endpoints to receive notifications for call activity and events. When an activity occurs for which you have subscribed, your endpoint will receive a POST request containing the details for this activity.

* [Overview](#overview)
* [Create](#create-a-subscription)
* [Renew](#renew-a-subscription)
* [Read](#get-subscription-details)
* [Messages](#subscription-messages)
* [Delete](#remove-subscription)

## Overview

Subscribing to activities and events ensures you have up to date information without having to consume the additional network and cpu resources which would be required if you continuously polled for the data. To receive notifications you indicate the actives you wish to receive updates for as well as provide an endpoint which Net2Phone can POST data to. 
**NOTE:** All POST messages will contain JSON data.

![subscriptions data flow](assets/images/subscriptions.svg "subscriptions data flow")

## Create A Subscription

Before you can receive subscriptions from Integrate you must first set up and endpoint on your application server which will receive the subscribed to data. When the objects you are interested in are created or updated your subscribed endpoint will be notified. The important thing to ensure is that your provided endpoint is able to receive POST requests and provide a successful response (200, 204 response). **NOTE:** The JSON message will be provided in a POST request to your subscribed endpoint. If you would like to renew an existing subscription simply issue your subscribe request again.

**Method:** POST  
**API Documentation:** [Documentations](/docs/apis#post-/subscriptions/)  
**URL:** `https://integrate.versature.com/api/subscriptions/`
**Request:**  
```bash
  curl -X POST \
  https://integrate.versature.com/api/subscriptions/ \
  -H 'Accept:application/vnd.integrate.v1.8.0+json' \
  -H 'Authorization: Bearer abce14243asdf823kk32323' \
  -d "{\"post_uri\":\"https://your_url.com/uPfkGQ99uSLYLDg6OLLVyifp\",\"calls\":true,\"expires_in\":\"604800\"}"
```
**Response:**
```json
{
  "id": "0123456789012345",
  "post_uri": "https://integrate.versature.com/",
  "expires": "2016-03-28T16:15:50.488920",
  "events": {
    "type": "calls"
  }
}
```

### Subscription Initialization

Subscriptions are set up asynchronously and can take a few seconds to initialize after a successful creation. You will receive two messages at your endpoint (subscribed url) as we initialize your subscription.

    {"msg": "Preparing subscription for: calls", "state": "preparing"}

    {"msg": "You have been subscribed to your requested subscriptions.", "state": "ready"}

### Request Parameters

Your subscription request will contain the following parameters.

|Field|Description|
|-----|-----------|
|post_uri|The endpoint which is notified when an event occurs.|
|expires_in|The number of seconds until the subscription expires. The maximum value is **604800**|
|calls|A boolean value which will be set to True if you wish to subscribe to Call events.|
|cdrs|A boolean value which will be set to True if you wish to subscribe to Call Detail Records (CDRs).|
|user|The users for which you would like to receive notifications for. This property can be repeated so that you can subscribe to multiple users.|

### Success Response

If your subscription request is successful your response will contain the following data

|Field|Description|
|-----|-----------|
|id|The unique id of this subscription.|
|expires|When the subscription expires. This Date/Time is UTC and is in ISO-8601 format.|
|post_uri|The endpoint which is notified when an event occurs.|
|type|The type of events which notifications will be sent for.|

## Renew A Subscription

If you would like to renew an existing subscription simply resend the request you used to create the subscription before your subscription expires. The `expires_in` field will set a new expiry date in the future and your subscription (with the same ID) will remain active.

## Get Subscription Details

The **ID** that is acquired when first creating a subscription can be used to get the details about an existing subscription. You can confirm when the subscription will expire as well as the events which are subscribed to.

**Method:** GET  
**API Documentation:** [Documentation](/docs/apis#get-/subscriptions/-subscriptionId-/)
**URL:** `https://integrate.versature.com/api/subscriptions/{subscriptionId}/`
**Request:**
```bash
curl GET
https://integrate.versature.com/api/subscriptions/0123456789012345/
-H 'Accept:application/vnd.integrate.v1.8.0+json'
-H 'Authorization: Bearer abce14243asdf823kk32323'
```
**Response:**
```json
{
  "events": [
    {
      "type": "calls",
      "user": "8814"
    }
  ],
  "expires": "2018-01-18T16:27:53.362820",
  "id": 5754713652854784,
  "post_uri": "https://www.example.com/callback/"
}
```

## Subscription Messages

Requests will be delivered to your subscribed endpoint for each event you are interested in. These JSON messages will contain information about new or updated objects.

### Call Messages

Once you have successfully subscribed to call events, your endpoint will receive POST requests Progressing, Ringing, Active, and Ended call events. These events and the various states can be used to serve multiple purposes: screen pop on an incoming call, kick off post processing events in custom CRMs, maintain user presence and availability, or create any number of custom alerts.

[comment]: <> (TODO [i1] udpate link)
**API Documentation:** [Documentation](#)  

|Field|Description|
|-----|-----------|
|on_net|True if this call is between Net2Phone sip devices and False if one of the devices is a PSTN device.|
|time_start|When the `from` user initiated the call.|
|time_answer|When the `to` user picked up the call.|
|from|The details about the originator of the call.|
|to|The details about the termination point for this call.|
|user|The Net2Phone extension/user if applicable which handled the call.|
|domain|The Net2Phone domain which handled the call.|
|id|The phone number or sip address associated to the endpoint. **Note:** Phone numbers will be in e164 notation.|
|call_id|The unique id for the call endpoint|
|state|The state of this call endpoint.<br />`active` if the call is up,<br/>`progressing` if it is waiting on the other side<br />`ringing` if the endpoint is ringing<br />`ended` when the call terminated|

**Example Message:**
```json
{
  "calls": {
    "on_net": false,
    "from": {
      "user": null,
      "state": "progressing",
      "name": "David Ward",
      "domain": null,
      "id": "+16133246100",
      "call_id": "e351b3325aa18832e3aa36948d012424"
    },
    "to": {
      "is_human": true,
      "state": "ringing",
      "id": "+16132379329",
      "domain": "versature.com",
      "user": "126",
      "call_id": "abcdb3325aa18832e3aa36948d012424"
    },
    "time_answer": null,
    "time_start": "2016-11-24 15:53:12",
    "by_call_id": null
  }
}
```

### CDR Messages                                   

Call Detail Record (CDR) Subscriptions are currently in BETA and should not be used in production systems, CDRs are available shortly after a call has terminated.

[comment]: <> (TODO [i1] udpate link)
**API Documentation:** [Documentation](#)

|Field|Description|
|-----|-----------|
|start_time|When the `from` user initiated the call.|
|answer_time|When the `to` user picked up the call.|
|end_time|When the call ended.|
|duration|How many seconds the call lasted.|
|from|The details about the originator of the call.|
|to|The details about the termination point for this call.|
|user|The Net2Phone extension/user if applicable which handled the call.|
|domain|The Net2Phone domain which handled the call.|
|id|The phone number or sip address associated to the endpoint. **Note:** Phone numbers will be in e164 notation.|
|call_id|The unique id for the call endpoint|

**Example Message:**
```json
[
  {
    "to": {
      "call_id": "2350150304190117063148-7ac5d753bddb15fb2f5900018ca04s746",
      "domain": "cc.example.com",
      "id": null,
      "user": "101"
    },
    "from": {
      "call_id": "20150304190127063799-a5ce697165aca204d39dde1a4446c1a0",
      "domain": "cc.example.com",
      "name": "John Smith",
      "id": null,
      "user": "100"
    },
    "answer_time": "Fri, 03 Mar 2017 18:47:50 +0000",
    "start_time": "Fri, 03 Mar 2017 18:47:39 +0000",
    "end_time": "Fri, 03 Mar 2017 18:48:26 +0000",
    "duration": 20
  },
  {
    "to": {
      "call_id": "50150304190117063148-7ac5d753bddb15fb2f5900018ca04sdfd",
      "domain": null,
      "id": "+16132379329",
      "user": null
    },
    "from": {
      "call_id": "20150304190117063148-7ac5d753bddb15fb2f5900018ca06e24",
      "domain": "cc.example.com",
      "name": "Jane Doe",
      "id": null,
      "user": "100"
    },
    "answer_time": "Fri, 03 Mar 2017 18:49:39 +0000",
    "start_time": "Fri, 03 Mar 2017 18:49:39 +0000",
    "end_time": "Fri, 03 Mar 2017 18:49:49 +0000",
    "duration": 10
  }
]
```

## Remove Subscription

Delete a subscription with the provided **ID**. Subscriptions will terminate on their own on their expiry date/time but they can be removed prior to this date/time through a delete request.

**Method:** DELETE  
**API Documentation:** [Documentation](/docs/apis#delete-/subscriptions/-subscriptionId-/)  
**URL:** `https://integrate.versature.com/api/subscriptions/{subscriptionId}/`  
**Request:**
```bash
curl -X DELETE \
-H 'Accept:application/vnd.integrate.v1.8.0+json' \
-H 'Authorization: Bearer abce14243asdf823kk32323' \
https://integrate.versature.com/api/subscriptions/0123456789012345/
```
**Response:**  
`HTTP/1.1 204 OK`
