// Loads the environment and makes it accessible,
// and also has sensible defaults

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

var fs = require('fs');

module.exports = (function() {
  var env = {};

  env.logName = process.env.LOG_NAME || 'messageapiclient';

  //groups
  env.groupsApiService = process.env.GROUPS_API_SERVICE;

  if (env.groupsApiService == null) {
    throw new Error('Must specify a GROUPS_API_SERVICE in your environment.');
  }
  //messages
  env.messagesApiService = process.env.MESSAGES_API_SERVICE;

  if (env.messagesApiService == null) {
    throw new Error('Must specify a MESSAGES_API_SERVICE in your environment.');
  }

  return env;
})();