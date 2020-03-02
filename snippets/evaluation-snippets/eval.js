const request = require( 'request' ).defaults( {
	jar: true
} );

const ip = "http://172.19.194.129:3000/api/v1"
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
					"facepp": {
						"category": "face",
						"media": [ "image" ],
						"realTime": false,
						"url": "https://api-us.faceplusplus.com/facepp/v3/detect",
						"otherOptions": {
							"api_key": "lWMTqYOBCFvPIqRrcBpdBX6FTyMNdi7Y",
							"api_secret": "fE6OCbIshDawTnXZZzm78_eWfAdG9jQz"
						},
						"callbacks": "./src/detectors/face/facepp.js"
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
				mediaPath: 'http://josemariagarcia.es/img/perfil.jpg'
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
