const fs = require( 'fs' );
const core = require( './src/core' );
const express = require( 'express' );
const router = express.Router();

const detectors = [];
router.get( '/', function( req, res, next ) {
	res.send( 'respond with a resource' );
} );

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
		det.initialize();
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
