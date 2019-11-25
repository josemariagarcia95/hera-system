const request = require( 'request' );
const fs = require( 'fs' );
const WaveFile = require( 'wavefile' );

const apiKey = JSON.parse(
	fs.readFileSync( '..\\..\\..\\..\\..\\credentials.json' )
)[ 'deepaffects' ][ 'otherOptions' ][ 'api_key' ];

const wavBuffer = new WaveFile( fs.readFileSync( './benchmark-files/Anger_Dislike_Stress_3.wav' ) );

const requestOptions = {
	url: 'https://proxy.api.deepaffects.com/audio/generic/api/v2/sync/recognise_emotion?apikey=' + apiKey,
	method: 'POST',
	body: {
		encoding: wavBuffer.format,
		sampleRate: wavBuffer.fmt.sampleRate,
		content: wavBuffer.toBase64()
	},
	json: true
};

request( requestOptions, function( error, response, body ) {
	console.log( 'Results DeepAffect' );
	if ( error ) {
		console.log( error );
		return error;
	}
	if ( body ) {
		console.log( body );
	}
} );
