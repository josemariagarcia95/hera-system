const request = require( 'request' );
const fs = require( 'fs' );

module.exports.initialize = async function() {
	console.log( this.id + ' initialize method' );
	return Promise.resolve( this.id + ' initialize method' );
};
module.exports.extractEmotions = function( context, media, callback = () => {} ) {
	const requestData = {
		returnFaceId: 'true',
		returnFaceLandmarks: 'false',
		returnFaceAttributes: 'age,gender,headPose,smile,facialHair,' +
			'glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
	};
	const options = {
		url: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect',
		qs: requestData,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Ocp-Apim-Subscription-Key': this.otherOptions.key
		},
		json: true,
		body: {
			url: media
		}
	};
	request( options, function( error, response, body ) {
		//console.log( error );
		if ( error ) {
			console.log( error );
			return error;
		}
		//console.log( response );
		if ( body.length !== 0 ) {
			console.log( body[ 0 ].faceAttributes.emotion );
			context.addResults( body[ 0 ].faceAttributes.emotion );
			callback( body );
		}
		return {};
	} );
};

module.exports.translateToPAD = function() {
	console.log( this.id + ' translateToPAD template' );
};
