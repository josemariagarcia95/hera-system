/* eslint-disable require-jsdoc */
const request = require( 'request' );
const util = require( 'util' );

/*
const options = {
	url: 'http://localhost:3000/api/v1/init',
	method: 'POST',
	formData: {
		api_key: this.otherOptions.api_key,
		api_secret: this.otherOptions.api_secret,
		return_attributes: 'emotion'
	}
};
*/

const server = require( '../bin/www' );

const get = util.promisify( request.get );
const post = util.promisify( request.post );
console.log( 'Test file' );
setTimeout( test, 1000 );

function test() {
	get( 'http://localhost:3000/api/v1/init' )
		.then( ( res ) => console.log( res.body ) )
		.catch( ( res ) => console.log( res.body ) );
}
