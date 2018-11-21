const request = require( 'request' );
const fs = require( 'fs' );

module.exports.initialize = function() {
	console.log( this.id + ' Initialize template' );
};

module.exports.extractEmotions = function( media, callback ) {
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
			callback( body );
		}
		return body ? body : {};
	} );
};
module.exports.translateToPAD = function() {
	console.log( this.id + ' translateToPAD template' );
};
