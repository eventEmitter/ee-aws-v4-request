#ee-aws-v4-request

node.js class for making requests to dynamodb

# install

	npm install ee-aws-v4-request

# usage

	var Requester = require( "ee-aws-v4-request" );


	var requester = new Requester( {
		  key: 		"AKI..."
		, secret: 	"W5FF..."
    	, service: 	"DynamoDB"
    	, region: 	"eu-west-1"
    	, version: 	"20120810"
	} );


	requester.request( target, payload, function( err, statusCode, data ){
		if ( err ) thro new Error( "problems requesting aws!" );
		if ( statusCode === 200 ){
			console.log( "yeah!" );
			console.dir( data );   // prints the returned json object
		}
	} );



you may also extend other classes

	
	var Class = require( "ee-class" );


	var DynamoDBTable = new Class( {
		inherits: Requester


		, init: function( options ){
			this.parent.init( options );
			this.tableName = options.tableName;
		}


		, describe: function( callback ){
			this.request( "DescribeTable", { TableName: this.tableName }, function( err, status, data ){
				if ( err ) callback( err );
				else if ( status !== 200 ) callback( new Error( "request failed because ..." ) );
				else {
					callback( null, data );
				}
			}.bind( this ) );
		}
	} );



	var usertable = new DynamoDBTable( {
		  key: 			"AKI..."
		, secret: 		"W5FF..."
    	, service: 		"DynamoDB"
    	, region: 		"eu-west-1"
    	, version: 		"20120810"
    	, tableName: 	"user"
	} );

	usertable.describe( function( err, data ){

	} );