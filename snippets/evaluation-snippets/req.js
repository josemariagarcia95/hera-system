const request = require( 'request' );
//Uncomment this if you need to use cookies in your request
/*
const request = require( 'request' ).defaults( {
	jar: true
} );
*/

//These functions are prepared so they're called one after another
function facepp( ) {
	// FACE++
	const formData = {
		//POST request data
	};

	const options = {
		//url, method (type of HTTP requests)
		formData: formData
	};

	request( options, function( error, response, body ) {
		//handle response
		setTimeout( dummy, 3000 );
	} );
}

// DUMMY DETECTOR
function dummy( ) {
	const options1 = {
		//url, method (type of HTTP requests)
		body: {

		},
		headers: {
			'user-agent': 'node.js'
		}
	};

	request( options1, function( error, response, body ) {
		//handle response
	} );
}

facepp( );
