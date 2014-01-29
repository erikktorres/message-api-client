// == BSD2 LICENSE ==
// Copyright (c) 2014, Tidepool Project
// 
// This program is free software; you can redistribute it and/or modify it under
// the terms of the associated License, which is identical to the BSD 2-Clause
// License as published by the Open Source Initiative at opensource.org.
// 
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the License for more details.
// 
// You should have received a copy of the License along with this program; if
// not, you can obtain one from Tidepool Project at tidepool.org.
// == BSD2 LICENSE ==

var url = require('url');
var util = require('util');

var amoeba = require('amoeba');
var pre = amoeba.pre;

module.exports = function(groupsHostGetter, messagesHostGetter,request) {

  if(request == null) {
    request = require('request');
  }
  
  pre.notNull(groupsHostGetter, "Must have a groupsHostGetter");
  pre.notNull(messagesHostGetter, "Must have a messagesHostGetter");

  function withGroupsApiHost(errorCb, happyCb) {
    var hostSpec = groupsHostGetter.get();
    if (hostSpec.length < 1) {
      return errorCb({ message: "No armarda hosts available", statusCode: 503 });
    }
    happyCb(url.format(hostSpec[0]));
  }

  function withMessagesApiHost(errorCb, happyCb) {
    var hostSpec = messagesHostGetter.get();
    if (hostSpec.length < 1) {
      return errorCb({ message: "No messages hosts available", statusCode: 503 });
    }
    happyCb(url.format(hostSpec[0]));
  }

  //call to armarda to get the groups 
  function getUserGroups(userid, token, cb){
    withGroupsApiHost(cb, function(apiHost){

      var options = {
        url: apiHost + '/membership/'+userid+'/member',
        method: 'get',
        headers: {
          'X-Tidepool-Session-Token': token
        }
      };

      request(options, function (err, res, body) {
        if (err) {
          return cb(err);
        }

        if (res.statusCode == 200) {
          var groups = JSON.parse(body);
          return cb(null, groups);
        } else {
          return cb({ message: util.format('No groups returned or bad statusCode[%s]', res.statusCode), statusCode: 503 });
        }
      });
    });
  }

  function getGroupMessages(groupid,token,cb)
  {
     withMessagesApiHost(cb, function(apiHost){

      var options = {
        url: apiHost + '/all/'+groupid+'?starttime&endtime',
        method: 'get',
        headers: {
          'X-Tidepool-Session-Token': token
        }
      };

      request(options, function (err, res, body) {
        if (err) {
          return cb(err);
        }

        if (res.statusCode == 200) {
          var messages = JSON.parse(body);
          return cb(null, messages);
        } else {
          return cb({ message: util.format('No messages returned or bad statusCode[%s]', res.statusCode), statusCode: 503 });
        }
      });
    });
  }

  function withUserGroups(userid, token, errorCb, happyCb) {
    return getUserGroups(userid, token, function(err, groups){
   
      if (err != null) {
        return errorCb(err);
      }

      return happyCb(groups);
    });
  }

  function withGroupMessages(groupid,token,errorCb, happyCb) {
    return getGroupMessages(groupid,token,function(err, messages){
   
      if (err != null) {
        return errorCb(err);
      }

      return happyCb(messages);
    });
  }

  function withGroupsAndMessages(userId, token, errorCb, happyCb) {

    withUserGroups(userId, token, errorCb, function(groups) {

      //console.log('## got groups ##',groups);
      var userData = {
        groups : []
      };
      groups.forEach(function(group){

        group.messages = [];
        withGroupMessages(group.id,token,errorCb, function(messages){
          group.messages = messages;
        });
        userData.groups.push(group);

      });
      happyCb(userData);
    });
  }

  return {
    getUsersMessages: function(userId, sessionToken, cb) {

      withGroupsAndMessages(userId, sessionToken, cb, function(userData) {

        if(userData){
          return cb(null, userData);
        }
        return cb(null,null);
      
      });
    }
  }
}