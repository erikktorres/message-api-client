message-api-client
==================

Client library to make it easier to use the message-api

# Docs

## Setup
```require('message-api-client')(config, hostGetter, request);```

  * ```config``` -- an object containing configuration parameters
  * ```hostGetter``` -- an object from hakken
  * ```request``` -- (optional) -- the result of require('request'). If not supplied a new one will be created.
  
  Generates an object with the members listed below.

## Members


### getThreadMessages
* ```getThreadMessages (parentMessageId, token, cb)```
*Retrieves the collection of messages in a thread*
    * ```parentMessageId``` -- the ID of the message at the top of the thread
    * ```token``` -- a server token or the user token
    * ```cb (err, response)```
        * ```err``` -- null if no error, else an object
        * ```response``` -- result from the /messages/thread/:messageid api call

### addToThread
* ```addToThread (message, parentMessageId, token, cb)```
*Retrieves the collection of messages in a thread*
    * ```message``` -- the body of the message as spec'd by the message-api
    * ```parentMessageId``` -- the ID of the message at the top of the thread
    * ```token``` -- a server token or the user token
    * ```cb (err, response)```
        * ```err``` -- null if no error, else an object
        * ```response``` -- result from the /messages/reply/:messageid api call

### startNewThread
* ```startNewThread (message, groupId, token, cb)```
*Retrieves the collection of messages in a thread*
    * ```message``` -- the body of the message as spec'd by the message-api
    * ```groupId``` -- the Id of the group to whom the message is being posted
    * ```token``` -- a server token or the user token
    * ```cb (err, response)```
        * ```err``` -- null if no error, else an object
        * ```response``` -- result from the /messages/thread/:messageid api call

### getUsersMessages
* ```getUsersMessages (userId, token, cb)```
*Retrieves the collection of messages in a thread*
    * ```userId``` -- the ID of the user whose messages you are retrieving
    * ```token``` -- a server token or the user token
    * ```cb (err, response)```
        * ```err``` -- null if no error, else an object
        * ```response``` -- result from the /messages/thread/:messageid api call
