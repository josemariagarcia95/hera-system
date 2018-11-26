const fs = require( 'fs' );
const core = require( './src/core' );
const present = require( 'present' );
const express = require( 'express' );
const router = express.Router();

const detectors = [];
router.get( '/', function( req, res, next ) {
	res.send( 'respond with a resource' );
} );

// eslint-disable-next-line require-jsdoc
async function a() {}

router.get( '/init', function( req, res, next ) {
	const detectorsData = JSON.parse(
		fs.readFileSync( './credentials.json' )
	);
	for ( const detectorId in detectorsData ) {
		const callbacks = require( detectorsData[ detectorId ].callbacks );
		detectors.push(
			core.createDetector(
				detectorId,
				detectorsData[ detectorId ].category,
				detectorsData[ detectorId ].realTime,
				detectorsData[ detectorId ].url,
				detectorsData[ detectorId ].otherOptions,
				callbacks.initialize,
				callbacks.extractEmotions,
				callbacks.translateToPAD
			)
		);
	}

	for ( const det of detectors ) {
		det.initialize().then( function( value ) {

		}, function( value ) {
			console.log( 'Something went horribly wrong ' );
			console.error( '' );
		} );
		/*
		if ( det.category == 'face' ) {
			let data = {};
			const t1 = present();
			const pruebaCal = function( results ) {
				data = results;
				console.log( data );
				console.log( ( ( present() - t1 ) / 1000 ).toFixed( 2 ) + ' seconds' );
			};
			det.extractEmotions( __dirname + '/src/detectors/' +
				det.category + '/benchmark-files/photo1.jpg', pruebaCal );
		}*/
	}

	res.status( 200 ).send( {
		id: 1,
		status: 'OK'
	} );
} );

router.post( '/setup', function( req, res, next ) {
	const preferences = req.body;
	const detectors = [];
	const detectorsInfo = fs.readFileSync( '../../credentials.json' );
	if ( preferences ) {

	} else {

	}
	res.status( 200 ).send( config );
} );
module.exports = router;
