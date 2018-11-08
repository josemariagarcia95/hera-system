/*const request = require( 'request' );
const querystring = require( 'querystring' );

const requestData = {
	returnFaceId: 'true',
	returnFaceLandmarks: 'false',
	returnFaceAttributes: 'age,gender,headPose,smile,facialHair,' +
		'glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
};

const options = {
	url: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0' + querystring.stringify( requestData ),
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'Ocp-Apim-Subscription-Key': '6fec4c74c6974c43ad68954c9246c97b'
	},
	body: JSON.stringify( {
		url: 'http://josemariagarcia.es/img/perfil.jpg'
	} )
};

request( options, function( error, response, body ) {
	//console.log( error );
	if ( error ) {
		console.log( error );
	}
	console.log( response );
	console.log( body );
} );
*/
const XMLHttpRequest = require( 'xmlhttprequest' ).XMLHttpRequest;
const request = new XMLHttpRequest();

request.addEventListener( 'progress', logProgress, false );
request.addEventListener( 'load', logLoad, false );
request.addEventListener( 'error', logError, false );
request.addEventListener( 'abort', logAbort, false );

request.onreadystatechange = function() {
	if ( this.readyState == 4 && this.status == 200 ) {
		console.log( request.responseText );
	} else {
		console.log( 'Algo ha ido mal' );
		console.log( this );
	}
}

/**
 * AUX
 * @param {*} evt
 */
function logError( evt ) {
	console.error( 'Error' );
	console.log( evt );
}

/**
 * AUX
 * @param {*} evt
 */
function logProgress( evt ) {
	console.log( 'Progress' );
	console.log( evt );
}

/**
 * AUX
 * @param {*} evt
 */
function logLoad( evt ) {
	console.log( 'Load' );
	console.log( evt );
}

/**
 * AUX
 * @param {*} evt
 */
function logAbort( evt ) {
	console.log( 'Abort' );
	console.log( evt );
}

request.open( 'PUT', 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0?' +
	'returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=emotion', true );

request.setRequestHeader( 'Content-Type', 'application/json' );
request.setRequestHeader( 'Ocp-Apim-Subscription-Key',
	'6fec4c74c6974c43ad68954c9246c97b' );

request.send( null );
