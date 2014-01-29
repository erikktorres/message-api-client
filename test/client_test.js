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
var mockedRequest = require('./mock/mockRequest');

describe('messages client', function() {

    var client;

    before(function(){
        var groupsHostGetter = require('./mock/mockHakkenWatcher')('localhost','8080');
        var messagesHostGetter = require('./mock/mockHakkenWatcher')('localhost','8082');
        client = require('../lib/client')(groupsHostGetter, messagesHostGetter, mockedRequest);
    });

    it('returns groups and associated messages for user', function(done) {

        client.getUsersMessages('1234','fakeit',function(err,userMessages){
            if(err) done(err);

            expect(userMessages).to.exist;
            expect(userMessages.groups).to.exist;

            var oneGroup = userMessages.groups[0];
            expect(oneGroup.messages).to.exist;

            done();
        });

    });

    it('returns two groups', function(done) {

        client.getUsersMessages('1234','fakeit',function(err,userMessages){
            if(err) done(err);

            expect(userMessages.groups).to.exist;
            expect(userMessages.groups.length).to.equal(2);

            done();
        });

    });

    it('returns three messages for the first group', function(done) {

        client.getUsersMessages('1234','fakeit',function(err,userMessages){
            if(err) done(err);

            var oneGroup = userMessages.groups[0];
            expect(oneGroup.messages.length).to.equal(3);
            done();
        });

    });

    it('returns one message for the second group', function(done) {

        client.getUsersMessages('1234','fakeit',function(err,userMessages){
            if(err) done(err);

            var oneGroup = userMessages.groups[1];
            expect(oneGroup.messages.length).to.equal(1);
            done();
        });

    });

});

describe('messages client cannot talk to hosts', function() {

    var client;

    before(function(){

        var emptyGetter = require('./mock/mockEmptyHakkenWatcher')();

        client = require('../lib/client')(emptyGetter, emptyGetter, mockedRequest);
    });

    it('returns an error code and message as the host cannot be found', function(done) {

        client.getUsersMessages('1234','fakeit',function(err,userMessages){

            expect(err.statusCode).to.equal(503);
            expect(err.message).to.exist;
            done();           
            
        });

    });

});