/* eslint-disable */
$( function() {
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

	function init() {
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
					"facepp": {
						"category": "face",
						"media": [ "image" ],
						"realTime": false,
						"url": "https://api-us.faceplusplus.com/facepp/v3/detect",
						"otherOptions": {
							"api_key": "lWMTqYOBCFvPIqRrcBpdBX6FTyMNdi7Y",
							"api_secret": "fE6OCbIshDawTnXZZzm78_eWfAdG9jQz"
						},
						"callbacks": "./src/detectors/face/facepp.js"
					}
				}
			}
		} ).done( function( data, status, xhr ) {
			$( '#init' ).text( JSON.stringify( data ) );
			$( '#init' ).append( '✓' ).css( 'color', 'green' );
		} ).fail( function( data, status, xhr ) {
			$( '#init' ).append( data.responseText );
			$( '#init' ).append( JSON.stringify( status ) ).css( 'color', 'red' );

		} );
	}
} );
