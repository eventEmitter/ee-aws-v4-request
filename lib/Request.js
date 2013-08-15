

	var   log 			= require( "ee-log" )
		, Class 		= require( "ee-class" )
		, Events 		= require( "ee-event" )
		, sign 			= require( "ee-aws-v4-signature" )
		, req 			= require( "request" )
		, Service 		= require( "./Service" );


	module.exports = new Class( {
		inherits: Events


		, init: function( options ){
			this.url 			= "https://" + options.service.toLowerCase() + "." + options.region.toLowerCase() + ".amazonaws.com";
			this.version 		= options.version;
			this.key			= options.key;
			this.secret			= options.secret;
			this.region			= options.region;
			this.service		= options.service;


			this.services = new Service( {
				  version: 		this.version
				, service: 		this.service
			} );
		}


		, request: function( options, callback ){				
			var makeDate = function( d ){ return new Date( d.substr( 0, 4 ) + "-" + d.substr( 4, 2 ) + "-" + d.substr( 6, 5 ) + ":" + d.substr( 11, 2 ) + ":" + d.substr( 13, 2 ) + ".000Z" ); };
			var headers = {};

			if ( typeof options.headers === "object" ){
				var k = Object.keys( options.headers ), i = k.length;
				while( i-- ) {		

					// date needs a special treatment				
					if ( k[ i ].toLowerCase().trim() === "date" || k[ i ].toLowerCase().trim() === "x-amz-date" ){
						if ( typeof options.headers[ k[ i ] ] === "string" ){
							// aws format
							if ( /^[0-9]{8}T[0-9]{6}Z$/i.test( options.headers[ k[ i ] ] ).trim() ){
								headers.date = makeDate( options.headers[ k[ i ] ].trim() );
							}
							else if ( !isNaN( new Date( options.headers[ k[ i ] ] ).valueOf() ) ) {
								headers.date = new Date( options.headers[ k[ i ] ] );
							}
							else {
								headers.date = new Date();
							}
						}
						else if ( typeof options.headers[ k[ i ] ] === "object" && options.headers[ k[ i ] ].constructor && /function Date\(/i.test( options.headers[ k[ i ] ].constructor.toString() ) ){
							headers.date = options.headers[ k[ i ] ];
						}
						else {
							headers.date = new Date();
						}
					}
					else {
						headers[ k[ i ] ] = options.headers[ k[ i ] ];
					}
				}
			}


			if ( !headers.date ) headers.date = new Date();
			headers[ "User-Agent" ] = "eventEmitter/1.0 (http://github.com/eventEmitter/ee-aws-v4-request)";
			headers[ "Content-Type" ] = this.services.contentType;


		 	headers.Authorization = sign( {
		 		  method: 	options.method || "get"
		 		, url: 		options.url || ( this.url + ( options.path || "" ) )
		 		, service: 	this.service
		 		, query: 	options.query
		 		, region: 	this.region
		 		, key: 		this.key
		 		, secret: 	this.secret
		 		, payload: 	options.payload || ""
		 		, version: 	this.version
		 		, headers: 	headers
		 	} );

			req( {
				  url: 		options.url || ( this.url + ( options.path || "" ) )
				, method: 	options.method || "get"
				, body: 	options.payload || ""
		 		, qs: 		options.query
				, headers: 	headers
			}, function( err, res, body ){
				if ( err ) callback( err );
				else {
					this.services.decode( body, function( err, data ){
						if ( err ) callback( err );
						else {
							if ( res.statusCode !== 200 ) {
								err = this.services.getErrorDetail( res.statusCode, data );
								callback( err, res.statusCode, data );
							}
							else callback( null, res.statusCode, data );
						}
					}.bind( this ) );
				}
			}.bind( this ) );
		}
	} );