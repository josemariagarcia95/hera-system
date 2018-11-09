const request = require( 'request' );

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
		'Ocp-Apim-Subscription-Key': '6fec4c74c6974c43ad68954c9246c97b'
	},
	json: true,
	body: {
		url: 'http://josemariagarcia.es/img/perfil.jpg'
	}
};

request( options, function( error, response, body ) {
	//console.log( error );
	if ( error ) {
		console.log( error );
	}
	//console.log( response );
	console.log( body );
	console.log( emotion );
} );

/*
const XMLHttpRequest = require( 'xmlhttprequest' ).XMLHttpRequest;
const request = new XMLHttpRequest();

request.addEventListener( 'progress', logProgress, false );
request.addEventListener( 'load', logLoad, false );
request.addEventListener( 'error', logError, false );
request.addEventListener( 'abort', logAbort, false );

request.onreadystatechange = function() {
	console.log( this.status + ' ' + this.statusText );
	if ( this.readyState == 4 && this.status == 200 ) {
		console.log( request.responseText );
	} else {
		console.log( 'Algo ha ido mal' );
		console.log( request.responseText );
	}
}

function logError( evt ) {
	console.error( 'Error' );
	//console.log( evt );
}


function logProgress( evt ) {
	console.log( 'Progress' );
	//console.log( evt );
}


function logLoad( evt ) {
	console.log( 'Load' );
	//console.log( evt );
}

function logAbort( evt ) {
	console.log( 'Abort' );
	//console.log( evt );
}

request.open( 'POST', 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?' +
	'returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=emotion', true );

request.setRequestHeader( 'Content-Type', 'application/json' );
request.setRequestHeader( 'Ocp-Apim-Subscription-Key',
	'6fec4c74c6974c43ad68954c9246c97b' );
console.log( request.responseText );
request.send( JSON.stringify( {
	url: 'http://josemariagarcia.es/img/perfil.jpg'
} ) );
console.log( request.responseText );
*/
