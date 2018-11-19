/*
const request = require( 'request' );
const fs = require( 'fs' );

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
		'Ocp-Apim-Subscription-Key': '*****************************'
	},
	json: true,
	body: {
		url: '*******************************'
	}
};

request( options, function( error, response, body ) {
	//console.log( error );
	if ( error ) {
		console.log( error );
	}
	//console.log( response );
	console.log( body );
	console.log( body[ 0 ].faceAttributes.emotion );
} );
*/

module.exports.initialize = function() {
	console.log( this.id + ' Initialize template' );
};
module.exports.extractEmotions = function() {
	console.log( this.id + ' extractEmotions template' );
};
module.exports.translateToPAD = function() {
	console.log( this.id + ' translateToPAD template' );
};
