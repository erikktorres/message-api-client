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

var groups = [
  {id:'1234', members:['a3d6a658-6e6a-401b-bcb3-c99268ba1804','f87aeade-e663-4e23-9f86-f2cbd7400d27']},
  {id:'5678', members:['a3d6a658-6e6a-401b-bcb3-c99268ba1804']}
];

var message1234 = [
{
	id:'7234',
    parentmessage : '',
    userid: 'a3d6a658-6e6a-401b-bcb3-c99268ba1804',
    groupid: '1234',
    timestamp: '2013-11-28T23:07:40+00:00',
    messagetext: 'In three words I can sum up everything I have learned about life: it goes on.'
},
{
	id:'7345',
    parentmessage:'7234',
    userid: 'a3d6a658-6e6a-401b-bcb3-c99268ba1804',
    groupid: '1234',
    timestamp: '2013-11-29T23:05:40+00:00',
    messagetext: 'Second message.'
},
{
	id:'7890',
    parentmessage:'7234',
    userid: 'f87aeade-e663-4e23-9f86-f2cbd7400d27',
    groupid: '1234',
    timestamp: '2013-11-30T23:05:40+00:00',
    messagetext: 'Third message.'
}];

var message5678 = [
{
	id:'',
    parentmessage : '',
    userid: 'a3d6a658-6e6a-401b-bcb3-c99268ba1804',
    groupid: '5678',
    timestamp: '2013-11-28T23:07:40+00:00',
    messagetext: 'In three words I can sum up everything I have learned about life: it goes on.'
}];

module.exports = function(options, cb) {

	console.log('request opts',options);

	var res = {
		statusCode : 200
	};

	if(options.url.indexOf('/all/')){
		if(options.url.indexOf('/all/1234/')){

			console.log('return messages for 1234');
			return cb(null,res,JSON.stringify(message1234));

		}else if (options.url.indexOf('/all/5678/')){

			console.log('return messages for 5678');
			return cb(null,res,JSON.stringify(message5678));

		}
	}else if(options.url.indexOf('/membership/')){

		console.log('return groups')
		return cb(null,res,JSON.stringify(groups));

	}
};