const request = require( 'request' );
const fs = require( 'fs' );
const querystring = require( 'querystring' );


let accessToken = '';
const body = {
	grant_type: 'client_credentials',
	apiKey: 'f5a2d998-132e-41c3-b4f4-e36822e3da9a'
};

const options = {
	url: 'https://token.beyondverbal.com/token',
	method: 'POST',
	headers: {
		'Content-Type': 'x-www-form-urlencoded'
	},
	body: querystring.stringify( body )
};


request( options, function( error, response, body ) {
	console.log( 'First request - Token request' );
	if ( error ) {
		console.log( error );
		return error;
	}
	if ( body ) {
		//this.addResults( body );
		//callback( body );
		accessToken = JSON.parse( body ).access_token;
		let recordingId = '';
		const newOptions = {
			url: ' https://apiv5.beyondverbal.com/v5/recording/start',
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + accessToken
			},
			body: {
				dataFormat: {
					type: 'WAV'
				}
			},
			json: true
		};
		request( newOptions, function( error, response, body ) {
			console.log( 'Second request - Start recording' );
			if ( error ) {
				console.log( error );
				return error;
			}
			if ( body ) {
				console.log( body );
				recordingId = body.recordingId;
				const newnewOptions = {
					url: 'https://apiv5.beyondverbal.com/v5/recording/' + recordingId,
					method: 'POST',
					headers: {
						'Authorization': 'Bearer ' + accessToken
					},
					body: fs.createReadStream( './benchmark-files/Anger_Dislike_Stress_3.wav' )
				};
				request( newnewOptions, function( error, response, body ) {
					console.log( 'Third request - Results' );
					if ( error ) {
						console.log( error );
						return error;
					}
					if ( body ) {
						console.log( body );
					}
				} );
			}
		} );
	}
} );


/*
module.exports.initialize = async function() {
	console.log( this.id + ' Initialize template' );
	return Promise.resolve( this.id + ' initialize method' );
};

module.exports.extractEmotions = function( context, media, callback = () => {} ) {
	const formData = {
		image_file: fs.createReadStream( media ),
		api_key: this.otherOptions.api_key,
		api_secret: this.otherOptions.api_secret,
		return_attributes: 'emotion'
	};

	const options = {
		url: 'https://api-us.faceplusplus.com/facepp/v3/detect',
		method: 'POST',
		formData: formData
	};

	request( options, function( error, response, body ) {
		if ( error ) {
			console.log( error );
			return error;
		}
		console.log( body );
		if ( body ) {
			this.addResults( body );
			callback( body );
		}
		return body ? body : {};
	} );
};
module.exports.translateToPAD = function() {
	console.log( this.id + ' translateToPAD template' );
};
*/
