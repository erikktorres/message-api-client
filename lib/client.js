/*
  == BSD2 LICENSE ==
  Copyright (c) 2014, Tidepool Project

  This program is free software; you can redistribute it and/or modify it under
  the terms of the associated License, which is identical to the BSD 2-Clause
  License as published by the Open Source Initiative at opensource.org.

  This program is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE. See the License for more details.

  You should have received a copy of the License along with this program; if
  not, you can obtain one from Tidepool Project at tidepool.org.
  == BSD2 LICENSE ==
 */

/***
  Setup: require('message-api-client')(config, hostGetter, request);
  Params:
    config -- an object containing configuration parameters
    hostGetter -- an object from hakken
    request -- (optional) -- the result of require('request'). If not supplied a new one will be created.
  
  Generates an object with the members listed below.

  Heading: Members
 */

'use strict';

var url = require('url');
var util = require('util');

var pre = require('amoeba').pre;

module.exports = function (hostGetter, config, request) {
  if (config == null) {
    config = {};
  }
  if (request == null) {
    request = require('request');
  }

  pre.defaultProperty(config, 'pathPrefix', '');

  if (config.pathPrefix[config.pathPrefix.length - 1] === '/') {
    config.pathPrefix = config.pathPrefix.substr(0, config.pathPrefix.length - 1);
  }

  function requestTo(path) {
    var options = {
      method: 'GET',
      headers: {}
    };

    var statusHandlers = {};

    return {
      withMethod: function(method){
        options.method = method;
        return this;
      },
      withHeader: function(header, value) {
        options.headers[header] = value;
        return this;
      },
      withParams:function(params){
        options.params = params;
        return this;
      },
      withToken: function(token) {
        return this.withHeader('x-tidepool-session-token', token);
      },
      withBody: function(body) {
        options.body = body;
        return this;
      },

      /**
       * Registers a function to handle a specific response status code.
       *
       * The return value of the function will be passed to the callback provided on the go() method
       *
       * @param status either a numeric status code or an array of numeric status codes.
       * @param fn A function(response, body){} to use to extract the value from the response
       * @returns {exports}
       */
      whenStatus: function(status, fn) {
        if (Array.isArray(status)) {
          for (var i = 0; i < status.length; ++i) {
            this.whenStatus(status[i], fn);
          }
          return this;
        }

        statusHandlers[status] = fn;
        return this;
      },

      /**
       * Issues the request and calls the given callback.
       * @param cb An idiomatic function(error, result){} callback
       * @returns {*}
       */
      go: function(cb) {
        var hostSpecs = hostGetter.get();
        if (hostSpecs.length < 1) {
          return cb({ statusCode: 503, message: 'No hosts found' }, null);
        }
        options.url = util.format('%s%s%s', url.format(hostSpecs[0]), config.pathPrefix, path);

        request(options, function (err, res, body) {
          if (err != null) {
            return cb(err);
          } else if (statusHandlers[res.statusCode] != null) {
            return cb(null, statusHandlers[res.statusCode](res, body));
          } else {
            return cb({ statusCode: res.statusCode, message: util.inspect(body) });
          }
        });
      }
    };
  }

  function parseJson(res, body) {
    return JSON.parse(body);
  }

  return {

    /***
      Function: getThreadMessages(parentMessageId, token, cb)
      Desc: Retrieves the collection of messages in a thread
      Args: parentMessageId -- the ID of the message at the top of the thread
            token -- a server token or the user token
            cb(err, response) -- the callback
      CallbackArgs: err -- null if no error, else an object
            response -- result from the /messages/thread/:messageid api call
    **/
    getThreadMessages: function(parentMessageId, token, cb) {
      pre.notNull(parentMessageId, 'Must specify a parentMessageId');
      pre.notNull(token, 'Must specify a token');

      requestTo(util.format('/thread/%s', parentMessageId))
        .withMethod('GET')
        .withToken(token)
        .whenStatus(200, parseJson)
        .go(cb);

    },
    /***
      Function: addToThread(message, parentMessageId, token, cb)
      Desc: Retrieves the collection of messages in a thread
      Args: message -- the body of the message as spec'd by the message-api
            parentMessageId -- the ID of the message at the top of the thread
            token -- a server token or the user token
            cb(err, response) -- the callback
      CallbackArgs: err -- null if no error, else an object
            response -- result from the /messages/reply/:messageid api call
    **/
    addToThread: function(message, parentMessageId, token, cb) {
      pre.notNull(message, 'Must specify a message');
      pre.notNull(parentMessageId, 'Must specify the parentMessageId');
      pre.notNull(token, 'Must specify a token');

      requestTo(util.format('/reply/%s', parentMessageId))
        .withMethod('POST')
        .withToken(token)
        .withParams({message:message})
        .whenStatus(200, parseJson)
        .go(cb);

    },
    /***
      Function: startNewThread(message, groupId, token, cb)
      Desc: Retrieves the collection of messages in a thread
      Args: message -- the body of the message as spec'd by the message-api
            groupId -- the Id of the group to whom the message is being posted
            token -- a server token or the user token
            cb(err, response) -- the callback
      CallbackArgs: err -- null if no error, else an object
            response -- result from the /messages/thread/:messageid api call
    **/
    startNewThread: function(message, groupId, token, cb) {
      pre.notNull(message, 'Must specify a message');
      pre.notNull(groupId, 'Must specify the groupId');
      pre.notNull(token, 'Must specify a token');

      requestTo(util.format('/send/%s', groupId))
        .withMethod('POST')
        .withToken(token)
        .withParams({message:message})
        .whenStatus(200, parseJson)
        .go(cb);

    },
    /***
      Function: getUsersMessages(userId, token, cb)
      Desc: Retrieves the collection of messages in a thread
      Args: userId -- the ID of the user whose messages you are retrieving
            token -- a server token or the user token
            cb(err, response) -- the callback
      CallbackArgs: err -- null if no error, else an object
            response -- result from the /messages/thread/:messageid api call
    **/
    getUsersMessages: function(userId, token, cb) {
      pre.notNull(userId, 'Must specify a userId');
      pre.notNull(token, 'Must specify a token');

      requestTo(util.format('/all/%s', userId))
        .withMethod('GET')
        .withToken(token)
        .whenStatus(200, parseJson)
        .go(cb);

    }
  };
};