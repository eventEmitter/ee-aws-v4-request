	( function(){


		var   log 			= require( "ee-log" )
			, Class 		= require( "ee-class" )
			, Events 		= require( "ee-event" )
			, sign 			= require( "ee-aws-v4-signature" )
			, request 		= require( "request" );


		module.exports = new Class( {
			inherits: Events


			, init: function( options ){
				this.url 			= "https://" + options.service + "." + options.region + ".amazonaws.com/";
				this.version 		= options.version;
				this.key			= options.key;
				this.secret			= options.secret;
				this.region			= options.region;
				this.service		= options.service;
			}


			 , request: function( target, payload, callback ){
			 	if ( typeof payload === "object" ) payload = JSON.stringify( payload );

			 	var headers = {
			 		  date: 			new Date()
		 			, "User-Agent": 	"eventEmitter/1.0 (http://github.com/eventEmitter/ee-aws-v4-request)"
		 			, "Content-Type": 	"application/x-amz-json-1.0"
		 			, "X-Amz-Target": 	this.service + "_" + this.version + "." + target
			 	};

			 	headers.Authorization = sign( {
			 		  method: 	"post"
			 		, url: 		this.url
			 		, service: 	this.service
			 		, region: 	this.region
			 		, key: 		this.key
			 		, secret: 	this.secret
			 		, payload: 	payload
			 		, version: 	this.version
			 		, headers: 	headers
			 	} );

				request( {
					  url: 		this.url
					, method: 	"POST"
					, body: 	payload
					, headers: 	headers
				}, function( err, res, body ){
					if ( err ) callback( err );
					else callback( null, res.statusCode, JSON.parse( body ) );
				}.bind( this ) );
			}
		} );










	} )();