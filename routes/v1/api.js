/**
 * API module.
 * @module API
 */
const fs = require( 'fs' );
const core = require( './src/core' );
const users = require( './src/users.js' );
const uniqid = require( 'uniqid' );
const request = require( 'request' );
const express = require( 'express' );
const router = express.Router();

const detectorHandler = new core.DetectorHandler();


router.get( '/', function( req, res, next ) {
	if ( req.cookie && users.userExists( req.cookie.userId ) ) {
		console.log( 'Existing user. Session refreshed' );
	} else {
		const userId = users.addUser( uniqid() );
		res.cookie( 'userId', userId );
	}
	res.send( 'respond with a resource' );
} );

/**
 * <strong>ENDPOINT.</strong><br/>
 * The <tt>/init</tt> endpoint allows us initialize the whole system.<br/>
 * The request receives no parameters, reads the <tt>crediantials.json</tt> file and instantiates all the detectors set in it.
 * @function /init
 */
router.get( '/init', function( req, res, next ) {
	console.log( '****************************INIT****************************' );
	if ( req.cookie && users.userExists( req.cookie.userId ) ) {
		const promises = [];
		let detectorsData = {};
		if ( req.body.settings ) {
			detectorsData = req.body.settings;
		} else if ( req.body.settingsFile ) {
			detectorsData = JSON.parse(
				fs.readFileSync( './' + req.body.settingsFile )
			);
		}
		const detectorHandler = new core.DetectorHandler();
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
	}
} );

/**
 * <strong>ENDPOINT.</strong><br/>
 * The <tt>/setup</tt> endpoint allows us to customize a little bit your set of detectores.
 * The request will recieve up to 3 parameters, all of them optional: <br/>
 * <ul>
 * 	<li><tt>type</tt>: Array of the detector categories you want to keep. Detector categories which are not in this array will be deteled.
 * 	An empty array deteles every category.</li>
 * 	<li><tt>realTime</tt>: Boolean which states if you want detectors which work in real time or not.</li>
 * 	<li><tt>delay</tt>: Upper threshold of the delay attribute. The delay attribute is set in the /initialize endpoint and represents the average time that
 * 	a certain detector needs to fulfil a request. Detectors whose delay attribute is bigger than the delay parameter will be deleted.</li>
 * </ul>
 * @function /setup
 */
router.post( '/setup', function( req, res, next ) {
	console.log( '****************************SETUP****************************' );
	const preferences = req.body;
	console.log( preferences );
	let detectorsAffected = 0;
	if ( Object.keys( preferences ).length !== 0 ) {
		for ( const propFilter in preferences ) {
			//We use the filter method from DetectorHandler to filter any detector on every channel
			//that doesn't satisfy the requirements from the request's body
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
		res.status( 400 ).send( 'Preferences not set. Body request is empty. Every initial detector will be used' );
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
	console.log( '****************************ANALYSE****************************' );
	const mediaInfo = req.body;
	if ( mediaInfo && !mediaInfo.mediaPath ) {
		res.status( 400 ).send( 'The request contais no path to media file. "mediaPath" attribute is missing' );
	} else {
		const analyseMedia = function( error, response, body ) {
			if ( error ) {
				res.status( 400 ).send( 'The media specified is not available either remotely or locally' );
			} else {
				detectorHandler.analyseMedia( mediaInfo.mediaType, mediaInfo.lookingFor, mediaInfo.mediaPath )
					.then( function( success ) {
						res.status( 200 ).send( 'Analyse started.' );
					} ).catch( function( error ) {
						console.log( error );
						res.status( 503 ).send( 'Detectors were not available/found' );
					} );
			}
		};
		const fileIsLocal = fs.existsSync( mediaInfo.mediaPath );
		//We perform a HEAD request to check the file existence if the file is not local
		if ( !fileIsLocal ) {
			const options = {
				url: mediaInfo.mediaPath,
				method: 'HEAD'
			};
			request( options, analyseMedia );
		} else {
			analyseMedia();
		}
	}
	//res.status( 400 ).send( 'Something went horribly wrong' );
	//We check if the file is in the system
} );

router.post( '/results', function( req, res, next ) {
	console.log( '****************************RESULTS****************************' );
	console.log( req.body );
	const localStrategy = req.body.localStrategy;
	const globalStrategy = req.body.globalStrategy;
	const mergedResults = detectorHandler.mergeResults( [ 'face' ], localStrategy, globalStrategy );
	res.status( 200 ).send( mergedResults );
} );

router.get( '/results/:channel/:type', function( req, res, next ) {
	console.log( '****************************RESULTS/CHANNEL****************************' );
	const preferences = req.body;
	const detectors = [];
	const detectorsInfo = fs.readFileSync( '../../credentials.json' );
	if ( preferences ) {

	} else {

	}
	res.status( 200 ).send( 'Todo ok' );
} );

router.get( '/results/:channel/:detector', function( req, res, next ) {
	console.log( '****************************RESULTS/CHANNEL/DETECTORS****************************' );
	if ( req.params.channel === void( 0 ) ) {
		const detector = detectorHandler.getDetectorFromChannel();
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
