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
        var messeagesHostGetter = require('./mock/mockHakkenWatcher')('localhost','8082');
        client = require('../lib/client')(groupsHostGetter, messeagesHostGetter, mockedRequest);
    });

    it('valid token returns us the user id', function(done) {

        client.getUsersMessages('1234','fakeit',function(err,userMessages){
            if(err) done(err);

            expect(userMessages).to.exist;
            done();
        });

    });


});