const request = require( 'request' );
const fs = require( 'fs' );

const formData = {
	image_file: fs.createReadStream( __dirname + '/prueba.jpg' ),
	api_key: 'lWMTqYOBCFvPIqRrcBpdBX6FTyMNdi7Y',
	api_secret: 'fE6OCbIshDawTnXZZzm78_eWfAdG9jQz',
	return_attributes: 'emotion'
};

const options = {
	url: 'https://api-us.faceplusplus.com/facepp/v3/detect',
	method: 'POST',
	formData: formData
};

request( options, function( error, response, body ) {
	//console.log( error );
	if ( error ) {
		return console.log( error );
	}
	console.log( body );
} );
