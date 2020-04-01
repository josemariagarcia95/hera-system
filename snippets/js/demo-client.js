/* eslint-disable */
$( function( ) {
	$.ajax( {
		url: 'http://localhost:3000/api/v1',
		xhrFields: {
			withCredentials: true
		}
	} ).done( function( data, status, xhr ) {
		$( '#get-id' ).text( data );
		$( '#get-id' ).append( ' ✓ <br> Cookie: ' + $.cookie( 'userId' ) ).css( 'color', 'green' );
		setTimeout( init, 2000 );
	} );

	function init( ) {
		$.ajax( {
			url: 'http://localhost:3000/api/v1/init',
			method: 'POST',
			xhrFields: {
				withCredentials: true
			},
			data: {
				"settings": {
					"mockup": {
						"category": "face",
						"media": [ "image" ],
						"realTime": false,
						"url": "whatever",
						"otherOptions": {
							"api_key": "whatever"
						},
						"callbacks": "./src/detectors/other/mockup.js"
					},
					"another-name": {
						...
					}
				}
			}
		} ).done( function( data, status, xhr ) {
			$( '#init' ).text( JSON.stringify( data ) );
			$( '#init' ).append( '✓' ).css( 'color', 'green' );
			setTimeout( setup, 3000 );
		} ).fail( function( data, status, xhr ) {
			$( '#init' ).append( data.responseText );
			$( '#init' ).append( JSON.stringify( status ) ).css( 'color', 'red' );
		} );
	}
} );

function setup( ) {
	$.ajax( {
		url: 'http://localhost:3000/api/v1/setup',
		method: 'POST',
		xhrFields: {
			withCredentials: true
		},
		data: {
			type: [ 'face' ],
			delay: 3000
		}
	} ).done( function( data, status, xhr ) {
		$( '#setup' ).text( JSON.stringify( data ) );
		$( '#setup' ).append( '✓' ).css( 'color', 'green' );
		setTimeout( analyse, 3000 );
	} ).fail( function( data, status, xhr ) {
		$( '#setup' ).append( data.responseText );
		$( '#setup' ).append( JSON.stringify( status ) ).css( 'color', 'red' );

	} );
}

function analyse( ) {
	$.ajax( {
		url: 'http://localhost:3000/api/v1/analyse',
		method: 'POST',
		xhrFields: {
			withCredentials: true
		},
		data: {
			mediaType: 'image',
			lookingFor: 'face',
			mediaPath: '...jpg'
		}
	} ).done( function( data, status, xhr ) {
		$( '#analyse' ).text( JSON.stringify( data ) );
		$( '#analyse' ).append( '✓' ).css( 'color', 'green' );
		setTimeout( results, 4000 );
	} ).fail( function( data, status, xhr ) {
		$( '#analyse' ).append( data.responseText );
		$( '#analyse' ).append( JSON.stringify( status ) ).css( 'color', 'red' );
	} );
}

function results( ) {
	$.ajax( {
		url: 'http://localhost:3000/api/v1/results',
		method: 'POST',
		xhrFields: {
			withCredentials: true
		},
		data: {
			channelsToMerge: [ 'face' ],
			localStrategy: 'default',
			globalStrategy: 'default'
		}
	} ).done( function( data, status, xhr ) {
		$( '#results' ).text( JSON.stringify( data ) );
		$( '#results' ).append( '✓' ).css( 'color', 'green' );
	} ).fail( function( data, status, xhr ) {
		$( '#results' ).append( data.responseText );
		$( '#results' ).append( JSON.stringify( status ) ).css( 'color', 'red' );

	} );
}
