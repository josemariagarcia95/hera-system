const fs = require( 'fs' );
const core = require( './src/core' );
const request = require( 'request' );
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
			detectorsData[ detectorId ].media,
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
			detectorNumber: results.length
		} );
	}, function( results ) {
		console.error( 'Something went horrible wrong' );
		res.status( 418 ).send( {
			status: 'Error on initialization'
		} );
	} );
} );

router.post( '/setup', function( req, res, next ) {
	console.log( 'Estoy en setup' );
	const preferences = req.body;
	console.log( preferences );
	let detectorsAffected = 0;
	if ( preferences ) {
		for ( const propFilter in preferences ) {
			switch ( propFilter ) {
				case 'type':
					detectorsAffected += detectorHandler.filter(
						( det ) => preferences[ propFilter ].indexOf( det.category ) !== -1
					);
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
			detectorsAffected: detectorsAffected,
			detectorsUsed: detectorHandler.lengthDetectors()
		} );
	} else {
		res.status( 200 ).send( 'Preferences not set. Body request is empty. Every initial detector will be used' );
	}
} );

/**
 * <strong>ENDPOINT.</strong><br/>
 * The <tt>/analyse</tt> endpoint allows us to request for the analysis of some media file.
 * The request will recieve up to 3 parameters: <br/>
 * <ul>
 * 	<li><tt>mediaType</tt>: Kind of media which will be sent. Options can be "image", "video", "sound" and "text".</li>
 * 	<li><tt>lookingFor</tt>: Feature we want to analyse. Options can be "face", "voice", "signal" and "body".</li>
 * 	<li><tt>mediaPath</tt>: Absolute path to the file which contains the media. This can be a local path or an Internet address.</li>
 * </ul>
 * @function /analyse
 */
router.post( '/analyse', function( req, res, next ) {
	const mediaInfo = req.body;
	if ( mediaInfo && !mediaInfo.mediaPath ) {
		res.status( 400 ).send( 'The request contais no path to media file. "path" attribute is missing' );
	}
	//We check if the file is in the system
	const fileIsLocal = fs.existsSync( mediaInfo.mediaPath );
	//If it's not in the system, it must be in some remote server
	if ( !fileIsLocal ) {
		const options = {
			url: mediaInfo.mediaPath,
			method: 'HEAD'
		};
		request( options, function( error, response, body ) {
			//if the remote request fails as well, then the given path is incorrect
			if ( error ) {
				res.status( 400 ).send( 'The media specified is available neither locally or remotely' );
			}
		} );
	}
	detectorHandler.analyseMedia( mediaInfo.mediaType, mediaInfo.lookingFor, mediaInfo.mediaPath )
		.then( function( success ) {
			res.status( 200 ).send( 'Analyse started.' );
		} ).catch( function( error ) {
			console.log( error );
			res.status( 503 ).send( 'Detectors were not available/found' );
		} );
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


/*
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
*/
module.exports = router;
