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

'use strict';
var expect = require('salinity').expect;

describe('messages client', function() {

  var port = 21001;
  var hostGetter = {
    get: function() { return [{ protocol: 'http', host: 'localhost:' + port }]; }
  };

  var client = require('../../lib/client')(hostGetter);

  var server = require('restify').createServer({ name: 'test' });
  var handler = null;

  before(function(done){
    var theFn = function (req, res, next) {
      handler(req, res, next);
    };
    server.get(/.*/, theFn);
    server.post(/.*/, theFn);
    server.put(/.*/, theFn);
    server.del(/.*/, theFn);
    server.on('uncaughtException', function(req, res, route, err){
      throw err;
    });
    server.listen(port, function(err){
      done();
    });
  });

  after(function(){
    server.close();
  });

  beforeEach(function(){
    handler = null;
  });

  it('returns messages for the thread', function(done) {


    var returnVal = [{
      id:'7234',
      parentmessage : '',
      userid: 'a3d6a658-6e6a-401b-bcb3-c99268ba1804',
      groupid: '1234',
      timestamp: '2013-11-28T23:07:40+00:00',
      messagetext: 'In three words I can sum up everything I have learned about life: it goes on.'
    }];

    handler = function(req, res, next) {
      expect(req.path()).equals('/thread/userId');
      expect(req.method).equals('GET');
      expect(req.headers).to.have.property('x-tidepool-session-token').that.equals('1234');
      res.send(200,returnVal);
      next();
    };

    client.getThreadMessages('userId', '1234', function(err, res){
      expect(err).to.not.exist;
      expect(res).to.exist;
      done();
    });

  });

  it('returns the id for added message', function(done) {

    var theMessage = {
      messagetext: 'some new message',
      userid : '12345'
    };

    handler = function(req, res, next) {
      
      expect(req.path()).equals('/send/groupid');
      expect(req.method).equals('POST');
      expect(req.headers).to.have.property('content-type').that.equals('application/x-www-form-urlencoded; charset=utf-8');
      expect(req.headers).to.have.property('x-tidepool-session-token').that.equals('1234');
      res.send(201,'33333');
      next();
    };

    client.startNewThread(theMessage,'groupid', '1234', function(err, res){
      expect(err).to.not.exist;
      expect(res).to.exist;
      done();
    });

  });

  it('returns the id for added message', function(done) {

    var theComment = {
      messagetext:'some text'
    };

    handler = function(req, res, next) {

      expect(req.path()).equals('/reply/userId');
      expect(req.method).equals('POST');
      expect(req.headers).to.have.property('content-type').that.equals('application/x-www-form-urlencoded; charset=utf-8');
      expect(req.headers).to.have.property('x-tidepool-session-token').that.equals('1234');
      res.send(201,'44444');
      next();
    };
    client.addToThread(theComment, 'userId', '1234', function(err, id){
      expect(err).to.not.exist;
      expect(id).to.exist;
      done();
    });

  });

  it('returns the id for added message', function(done) {

    var startTime = Date();
    var messages = [{messagetext:'some text'},{messagetext:'some more text'}];

    handler = function(req, res, next) {

      expect(req.path()).equals('/all/userId');
      expect(req._url.query).equals('starttime='+encodeURIComponent(startTime)+'&endtime=');
      expect(req.method).equals('GET');
      expect(req.headers).to.have.property('x-tidepool-session-token').that.equals('1234');
      res.send(200,messages);
      next();
    };

    client.getUsersMessages('userId', startTime, null,'1234', function(err, messages){
      expect(err).to.not.exist;
      expect(messages).to.exist;
      done();
    });

  });

});
