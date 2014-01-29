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

/**
 * Middleware to process the session token -- expects a userid and session token, processes it, and
 * then returns the user messages data on the res.userData;
 *
 * @param client client to use when talking to the user-api
 * @returns {{userMessages: userMessages}}
 */
module.exports = function (client) {

  return {
    userMessages: function(req, res, next) {
      var userId = req.params.userId;
      var sessionToken = req.headers['x-tidepool-session-token'];

      client.getUsersMessages(userId, sessionToken, function(err, userData){
        if (err) {
          if (err.statusCode != null) {
            res.send(err.statusCode);
            return next(false);
          }
          else {
            res.send(500);  // internal server error -- something broke
            return next(err);
          }
        }
        else if (userData == null) {
          // nothing found for this user
          res.send(204);
          return next(false);
        }
        else {
          res.userData = userData;
          return next();
        }
      });
    }
  };
};
