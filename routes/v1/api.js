const fs = require( 'fs' );
const core = require( './src/core' );
const express = require( 'express' );
const router = express.Router();

const detectorHandler = new core.DetectorHandler();

router.get( '/', function( req, res, next ) {
	res.send( 'respond with a resource' );
} );

router.get( '/init', function( req, res, next ) {
	const promises = [];
	const detectorsData = JSON.parse(
		fs.readFileSync( './credentials.json' )
	);
	for ( const detectorId in detectorsData ) {
		const callbacks = require( detectorsData[ detectorId ].callbacks );
		const newDetector = core.createDetector(
			detectorId,
			detectorsData[ detectorId ].category,
			detectorsData[ detectorId ].realTime,
			detectorsData[ detectorId ].url,
			detectorsData[ detectorId ].otherOptions,
			callbacks.initialize,
			callbacks.extractEmotions,
			callbacks.translateToPAD
		);
		promises.push( newDetector.initialize() );
		detectorHandler.addDetector( newDetector );
	}
	Promise.all( promises ).then( function( results ) {
		results.forEach( function( value, ...args ) {
			console.log( value );
		} );
		res.status( 200 ).send( {
			status: 'Detectors initialized',
			det_number: results.length
		} );
	}, function( results ) {
		console.error( 'Something went horrible wrong' );
		res.status( 418 ).send( {
			status: 'Error on initialization'
		} );
	} );
} );

router.post( '/setup', function( req, res, next ) {
	const preferences = req.body;
	let detectorsAffected = 0;
	if ( preferences ) {
		for ( const propFilter in preferences ) {
			switch ( propFilter ) {
				case 'type':
					detectorsAffected += detectorHandler.filter( ( det ) => det.category === preferences[ propFilter ] );
					break;
				case 'realTime':
					detectorsAffected += detectorHandler.filter( ( det ) => det.realTime === preferences[ propFilter ] );
					break;
				case 'delay':
					detectorsAffected += detectorHandler.filter( ( det ) => det.delay <= preferences[ propFilter ] );
					break;
				default:
					break;
			}
		}
		res.status( 200 ).send( {
			status: 'OK',
			detectors_affected: detectorsAffected,
			detectors_used: detectorHandler.lengthDetectors()
		} );
	} else {
		res.status( 200 ).send( 'Preferences not set. Body request is empty. Every initial detector will be useds' );
	}
} );

router.post( '/analyse', function( req, res, next ) {
	const media = req.body;
	if ( preferences ) {

	} else {

	}
	res.status( 200 ).send( 'Todo ok' );
} );

router.get( '/results', function( req, res, next ) {
	const preferences = req.body;
	const detectors = [];
	const detectorsInfo = fs.readFileSync( '../../credentials.json' );
	if ( preferences ) {

	} else {

	}
	res.status( 200 ).send( 'Todo ok' );
} );

router.get( '/results/:channel', function( req, res, next ) {
	const preferences = req.body;
	const detectors = [];
	const detectorsInfo = fs.readFileSync( '../../credentials.json' );
	if ( preferences ) {

	} else {

	}
	res.status( 200 ).send( 'Todo ok' );
} );

router.get( '/results-raw', function( req, res, next ) {
	const preferences = req.body;
	const detectors = [];
	const detectorsInfo = fs.readFileSync( '../../credentials.json' );
	if ( preferences ) {

	} else {

	}
	res.status( 200 ).send( config );
} );

router.get( '/results-raw/:channel', function( req, res, next ) {
	const preferences = req.body;
	const detectors = [];
	const detectorsInfo = fs.readFileSync( '../../credentials.json' );
	if ( preferences ) {

	} else {

	}
	res.status( 200 ).send( 'Todo ok' );
} );

module.exports = router;
