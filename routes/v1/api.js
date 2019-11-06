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

/**
 * <strong>ENDPOINT.</strong><br/>
 * The root (<tt>/</tt>) endpoint allows us to create a <strong>user session</strong>.<br/>
 * Tot groups each set of detectors (and hence results) under an user object
 * (see [Users]{@link module:Users}), univocally identified with an id (generated with
 * <a target="_blank" href="https://www.npmjs.com/package/uniqid">uniqid</a>) stored as a
 * <strong>cookie</strong>, so the users have to send their id along with their request in
 *  order to perform any operation. <strong>The users cannot communicate with any other
 * endpoint if they haven't been given an id</strong>.
 * When a new request for this endpoint arrives, the request's cookies are checked:
 * <ul>
 * 	<li>If there is no id, then a new user is created, and its unique id is stored in
 * the response's cookies.</li>
 * 	<li>If there is an user id in the cookies, then that user's session is refreshed.
 * If said id is from an expired user, then a new user (and id) is created.
 *
 * @function /
 */
router.get( '/', function( req, res, next ) {
	if ( req.cookies && users.userExists( req.cookies.userId ) ) {
		console.log( 'Existing user. Session refreshed' );
	} else {
		const userId = users.addUser( uniqid() );
		console.log( 'User added' );
		res.cookie( 'userId', userId );
	}
	res.send( 'respond with a resource' );
} );

/**
 * This middleware is set at the beginning of the API, after the <code>/</code> endpoint,
 * to check if the user has a valid id.<br/>
 * If there is no id information, or the id is from an expired user, an error is returned.
 * If the id stored in the cookies is valid, then the request can continue, (<code>next()</code>).
 * @name ID Checking Middleware
 */
router.use( function( req, res, next ) {
	if ( !req.cookies || !req.cookies.userId ) {
		res.status( 401 ).send( {
			status: 'Session wasn\'t initialized. Send request to "/" first.'
		} );
	} else if ( !users.userExists( req.cookies.userId ) ) {
		res.status( 401 ).send( {
			status: 'User doesn\'t exist. Expired session. Please, send request to / first.'
		} );
	} else {
		next();
	}
} );

/**
 * <strong>ENDPOINT.</strong><br/>
 * The <tt>/init</tt> endpoint allows us to initialize the whole system.<br/>
 * The setting information can be received through the request itself (<code><strong>settings</strong></code> parameter),
 *  or through a file, in which case the path to said file must be indicated in the request
 * (<code><strong>settingsPath</strong></code>). Please keep in mind that the route to the file starts at the root of the project
 * (<code>tot-system/...</code>).
 * @function /init
 */
router.post( '/init', function( req, res, next ) {
	console.log( '****************************INIT****************************' );
	const promises = [];
	let detectorsData = {};
	if ( req.body.settings ) {
		detectorsData = req.body.settings;
	} else if ( req.body.settingsFile ) {
		detectorsData = JSON.parse(
			fs.readFileSync( './' + req.body.settingsFile )
		);
	}
	//If there is data in detectorsData, we create the detectors
	if ( Object.keys( detectorsData ).length ) {
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
			users.setDetectorHandler( req.cookies.userId, detectorHandler );
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
	} else {
		//if detectorData is empty
		res.status( 400 ).send( {
			status: 'No detector data read'
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
	if ( Object.keys( preferences ).length !== 0 ) {
		try {
			const user = users.getUser( req.cookies.userId );
			const detectorsAffected = user.detectorHandler.setupDetectors( preferences );
			res.status( 200 ).send( {
				status: 'OK',
				detectorsAffected: detectorsAffected,
				detectorsUsed: user.detectorHandler.lengthDetectors()
			} );
		} catch ( errorData ) {
			console.error( errorData );
			res.status( 400 ).send( {
				status: 'error',
				error: errorData
			} );
		}
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
				try {
					users.getUser( req.cookies.userId ).detectorHandler
						.analyseMedia( mediaInfo.mediaType, mediaInfo.lookingFor, mediaInfo.mediaPath )
						.then( function( success ) {
							res.status( 200 ).send( 'Analyse started.' );
						} ).catch( function( error ) {
							console.log( error );
							res.status( 503 ).send( 'Detectors were not available/found' );
						} );
				} catch ( error ) {
					console.error( error );
					res.status( 400 ).send( {
						status: 'error',
						error: error
					} );
				}
			}
		};
		const fileIsLocal = fs.existsSync( mediaInfo.mediaPath );
		//We perform a HEAD request to check the file existence if the file is not local
		//If the HEAD request fails, the error is handled in the callback
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

/**
 * <strong>ENDPOINT.</strong><br/>
 * The <code>/results</code> endpoint returns a single triplet as a result of aggregating
 * all the previous results from emotion detectors in the PAD format. The aggregation process has three
 * levels:
 * <ol>
 * 	<li>Each <code>detector</code> aggregates its results applying the <code>localStrategy</code> strategy,
 * 	turning a PAD results array into a single PAD triplet. At this point, we have a PAD triplet per detector.</li>
 * 	<li>These triplets are aggregated again, using the <code>localStrategy</code> strategy, but grouping them
 * 	by <strong>channel</strong>. At this point, we have a PAD triplet per emotion channel.</li>
 * 	<li>Finally, these channels' triplets are aggregated using the <code>globalStrategy</code> strategy,
 * 	producing the final PAD triplet which is returned to the user.</li>
 * </ol>
 * @function /results
 * @param {Array} [channelsToMerge] - Array of emotion channels to merge.
 */
router.post( '/results', function( req, res, next ) {
	console.log( '****************************RESULTS****************************' );
	try {
		const mergedResults = users.getUser( req.cookies.userId ).detectorHandler.mergeResults(
			req.body.channelsToMerge,
			req.body.localStrategy,
			req.body.globalStrategy
		);
		res.status( 200 ).send( mergedResults );
	} catch ( error ) {
		console.error( error );
		res.status( 400 ).send( {
			status: 'error',
			error: error
		} );
	}
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
