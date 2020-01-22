const request = require( 'request' );
//EXAMPLE WITH FACE++
const formData = {
	api_key: '.......................',
	api_secret: '.................',
	return_attributes: 'emotion',
	image_url: '.........................'
};

const options = {
	//Set the options you need like the url, the type of HTTP request, etc.
	formData: formData
};

request( options, function( error, response, body ) {
	//handle request
} );
