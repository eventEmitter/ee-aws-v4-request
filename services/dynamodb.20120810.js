
	module.exports = {
		  contentType:  	"application/x-amz-json-1.0"
		, type: 			"json"
		, getErrorType: 	function( d ){ return d && d.__type ? d.__type : ""; }
		, getErrorMessage: 	function( d ){ return d && d.message ? d.message : ""; }
		, errors: {
			  400: {
			  	  ResourceNotFoundException:		"The operation tried to access a nonexistent table or index. The resource may not be specified correctly, or its status may not be ACTIVE."
				, UnknownOperation: 				"The operation requested is unknown."
			}
			, 403: {}
			, 404: {}
			, 500: {
				  InternalServerError: 				"An error occurred on the server side."
			}
			, 503: {}
		}
	};