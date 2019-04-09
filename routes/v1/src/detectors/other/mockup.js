const request = require( 'request' );
const fs = require( 'fs' );

module.exports.initialize = async function() {
	console.log( this.id + ' Initialize template' );
	return Promise.resolve( this.id + ' initialize method' );
};

module.exports.extractEmotions = function( context, media, callback = () => {} ) {
	context.addResults( {
		'happiness': 0.95
	} );
	callback( 'mockup' );
};
module.exports.translateToPAD = function() {
	return [ 1, 0.5, 0 ];
};
