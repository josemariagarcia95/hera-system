const request = require( 'request' ).defaults( {
	jar: true
} );

const ip = "http://.../api/v1"
const options = {
	method: 'GET',
	url: ip + '/'
};

request( options, function( error, response, body ) {
	console.log( "Cookie ok" );
	setTimeout( init, 2000 );
} );

function init( ) {
	request( {
			method: 'POST',
			url: ip + '/init',
			body: {
				settings: {
					"mockup": {
						"category": "face",
						"media": [ "image" ],
						"realTime": false,
						"url": "whatever",
						"otherOptions": {
							"api_key": "whatever"
						},
						"callbacks": "./src/detectors/other/mockup.js"
					},
					"another-name": {
						...
					}
				}
			},
			json: true

		},
		function( error, response, body ) {
			console.log( body );
			console.log( 'Init OK' );
			setTimeout( analyse, 2000 );
		} );
}

function analyse( ) {
	request( {
			method: 'POST',
			url: ip + '/analyse',
			body: {
				mediaType: 'image',
				lookingFor: 'face',
				mediaPath: '...jpg'
			},
			json: true
		},
		function( error, response, body ) {
			console.log( body );
			console.log( 'Analyse OK' );
			setTimeout( results, 4000 );
		} );
}

function results( ) {
	request( {
			method: 'POST',
			url: ip + '/results',
			body: {
				channelsToMerge: [ 'face' ],
				localStrategy: 'default',
				globalStrategy: 'default'
			},
			json: true
		},
		function( error, response, body ) {
			console.log( body );
			console.log( 'Results OK' );
		} );
}
