/* eslint-disable require-jsdoc */
const request = require( 'request' );
const fs = require( 'fs' );
const normalize = require( '../../tools/operations' ).normalize;

module.exports.initialize = async function( ) {
	console.log( this.id + ' Initialize template' );
	return Promise.resolve( this.id + ' initialize method' );
};

module.exports.extractEmotions = function( context, media, callback = ( ) => {} ) {
	const formData = {
		api_key: this.otherOptions.api_key,
		api_secret: this.otherOptions.api_secret,
		return_attributes: 'emotion'
	};
	if ( fs.existsSync( media ) ) {
		formData.image_file = fs.createReadStream( media );
	} else {
		formData.image_url = media;
	}
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
		if ( body ) {
			const parsedBody = JSON.parse( body );
			const results = parsedBody[ 'faces' ][ 0 ][ 'attributes' ][ 'emotion' ];
			context.addResults( results );
			callback( results );
		}
	} );
};

module.exports.translateToPAD = function( results ) {
	console.log( 'Método en ' + this.id + 'js' );
	return normalize( [
		results[ 'happiness' ] - 0.4 * results[ 'disgust' ] - 0.2 * results[ 'sadness' ] -
		0.1 * results[ 'anger' ] - 0.3 * results[ 'fear' ],
		-0.7 * results[ 'sadness' ] + 0.3 * results[ 'disgust' ] + 0.3 * results[ 'surprise' ] +
		0.3 * results[ 'anger' ] + 0.2 * results[ 'fear' ] - 0.2 * results[ 'happiness' ],
		-0.7 * results[ 'fear' ] + 0.3 * results[ 'disgust' ] + 0.7 * results[ 'anger' ] + 0.3 * results[ 'happiness' ]
	], 100, 0 );
};
