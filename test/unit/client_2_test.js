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
var expect = require('chai').expect;
var mockedRequest = require('../mock/mockRequest');

describe('messages client', function() {

  var port = 21001;
  var hostGetter = {
    get: function() { return [{ protocol: 'http', host: 'localhost:' + port }]; }
  };

  var client = require('../../lib/client_2')(hostGetter, null, mockedRequest);

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

  describe('getThreadMessages', function() {

    it('returns messages for the thread', function(done) {

      handler = function(req, res, next) {
        expect(req.path()).equals('/thread/userId');
        expect(req.method).equals('GET');
        expect(req.headers).to.have.property('x-tidepool-session-token').that.equals('1234');
        next();
      };
      client.getThreadMessages('userId', '1234', function(err, res){
        expect(err).to.not.exist;
        expect(res).to.exist;
        expect(res).to.be.a('array');
        done();
      });

    });

  });

  describe('startNewThread', function() {

    it('returns the id for added message', function(done) {

      var theMessage = {
        messagetext:'some new message'
      };

      handler = function(req, res, next) {
        expect(req.path()).equals('/send/groupid');
        expect(req.method).equals('POST');
        expect(req.method).equals({message:theMessage});
        expect(req.headers).to.have.property('x-tidepool-session-token').that.equals('1234');
        next();
      };
      client.startNewThread('groupid', theMessage, '1234', function(err, res){
        expect(err).to.not.exist;
        expect(res).to.exist;
        done();
      });

    });

  });

  describe('addToThread', function() {

    it('returns the id for added message', function(done) {

      var theComment = {
        messagetext:'some text'
      };

      handler = function(req, res, next) {
        expect(req.path()).equals('/reply/userId');
        expect(req.method).equals('POST');
        expect(req.method).equals({message:theComment});
        expect(req.headers).to.have.property('x-tidepool-session-token').that.equals('1234');
        next();
      };
      client.addToThread('userId', theComment, '1234', function(err, id){
        expect(err).to.not.exist;
        console.log('id? ',id);
        expect(id).to.exist;
        done();
      });

    });

  });

  describe('getUsersMessages', function() {

    it('returns the id for added message', function(done) {

      handler = function(req, res, next) {
        expect(req.path()).equals('/all/userId');
        expect(req.method).equals('GET');
        expect(req.headers).to.have.property('x-tidepool-session-token').that.equals('1234');
        next();
      };

      client.getUsersMessages('userId', '1234', function(err, messages){
        expect(err).to.not.exist;
        expect(messages).to.exist;
        expect(messages).to.be.a('array');
        done();
      });

    });

  });

});
