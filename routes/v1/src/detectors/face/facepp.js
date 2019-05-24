const request = require( 'request' );
const fs = require( 'fs' );

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
		if ( body ) {
			const results = JSON.parse( body )[ 'faces' ][ 0 ][ 'attributes' ][ 'emotion' ];
			context.addResults( results );
			callback( results );
		}
	} );
};
module.exports.translateToPAD = function() {
	console.log( this.id + ' translateToPAD template' );
};
