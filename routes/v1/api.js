const fs = require( 'fs' );
const core = require( './src/core' );
const express = require( 'express' );
const router = express.Router();

router.get( '/', function( req, res, next ) {
	res.send( 'respond with a resource' );
} );

router.get( '/init', function( req, res, next ) {
	const detectors = JSON.parse( fs.readFileSync( '../../credentials.json' ) );
	for ( const detectorId in detectors ) {
		core.createDetector(
			detectorId,
			detectors[ detectorId ].category,
			detectors[ detectorId ].realTime,
			detectors[ detectorId ].url,
			detectors[ detectorId ].otherOptions,
			null,
			null,
			null
		);
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
