/* eslint-disable prefer-rest-params */
/**
 * Core module.
 * @module Core
 */
const base = require( './detectors/detector' );
const present = require( 'present' );
const mean = require( './tools/operations' ).mean;
const fs = require( 'fs' );
//The merge.js file contains all the merging strategies
//We'll select this strategies using this function
const applyStrategy = require( './tools/merge' ).applyStrategy;


const realTimeThreshold = 4000;

/**
 * Initialises a detector using the arguments passed. Returns that new detector.
 * @function createDetector
 * @param {string} id - Name of the detector.
 * @param {string} category - Name of the category. E.g. face, voice, etc.
 * @param {Array} media - Type of media that can be processed. E.g. image, video, sound, etc.
 * @param {boolean} realTime - The detector answers in real time.
 * @param {string} url - API/Service URL.
 * @param {Object} otherOptions - Object to save other customized options.
 * @param {Function} initialize - Function to initiliaze the detector (sign into the service, request session token, etc.)
 * @param {Function} extractEmotions - Function to analyse some media.
 * @param {Function} translateToPAD - Function called with the results of the previous function.
 * @return {Detector} New Detector object fully built
 */
function createDetector(
	id,
	category,
	media,
	realTime,
	url,
	otherOptions,
	initialize,
	extractEmotions,
	translateToPAD ) {
	const newDetector = new base.Detector(
		id, category, media, realTime, url, otherOptions );
	newDetector.initialize = initialize;
	newDetector.extractEmotions = extractEmotions;
	newDetector.translateToPAD = translateToPAD;
	return newDetector;
}

/**
 * Handles all the detectors, organized in categories under the same object
 * @constructs DetectorHandler
 * Under each key in its <tt>detectors</tt> attribute there is an array of <tt>Detector</tt> objects
 */
function DetectorHandler( ) {
	this.detectors = {};
}

/**
 * Add a new detector to the DetectorHandler object.
 * @function addDetector
 * @memberof DetectorHandler
 * @param {Object} detectorObj - Detector object. It is added unded the corresponding category.
 * After adding it, the benchmarking process begins.
 * This process also sets the <tt>delay</tt> and <tt>realTime</tt> attributes.
 */
DetectorHandler.prototype.addDetector = function( detectorObj ) {
	if ( this.detectors.hasOwnProperty( detectorObj.category ) ) {
		this.detectors[ detectorObj.category ].push( detectorObj );
	} else {
		this.detectors[ detectorObj.category ] = [ detectorObj ];
	}
	//If there are benchmark-files, the benchmarking task starts
	if ( fs.existsSync( __dirname + '\\detectors\\' + detectorObj.category +
			'\\benchmark-files' ) ) {
		fs.readdirSync( __dirname + '\\detectors\\' + detectorObj.category +
			'\\benchmark-files' ).forEach( function( fileName, index, array ) {
			let startTime = present( );
			const times = [ ];
			const callback = function( data ) {
				times.push( present( ) - startTime );
				startTime = present( );
				if ( index + 1 === array.length ) {
					detectorObj.delay = mean( times );
					detectorObj.realTime = detectorObj.delay < realTimeThreshold;
					detectorObj.cleanResults( );
				}
			};
			console.log( __dirname + '\\detectors\\' + detectorObj.category +
				'\\benchmark-files\\' + fileName );
			detectorObj.extractEmotions( detectorObj, __dirname + '\\detectors\\' + detectorObj.category +
				'\\benchmark-files\\' + fileName, callback );
		} );
	}
};

/**
 * @function setupDetectors
 * @memberof DetectorHandler
 * @param {Object} preferences - JSON object with the setting information (see
 * [/setup]{@link module:API~/setup})
 * @return {number} Number of filtered (removed) detectors.
 */
DetectorHandler.prototype.setupDetectors = function( preferences ) {
	let detectorsAffected = 0;
	if ( Object.keys( preferences ).length !== 0 ) {
		for ( const propFilter in preferences ) {
			//We use the filter method from DetectorHandler to filter any detector on every channel
			//that doesn't satisfy the requirements from the request's body
			switch ( propFilter ) {
				case 'type':
					//Filter out detectors whose category is not in the setup request
					detectorsAffected += this.filter(
						( det ) => preferences[ propFilter ].indexOf( det.category ) !== -1
					);
					break;
				case 'realTime':
					detectorsAffected += this.filter( ( det ) => det.realTime === preferences[ propFilter ] );
					break;
				case 'delay':
					detectorsAffected += this.filter( ( det ) => det.delay <= preferences[ propFilter ] );
					break;
				default:
					break;
			}
		}
	}
	return detectorsAffected;
};

/**
 * Analyse the media passed as an argument looking for affective data.
 * @function analyseMedia
 * @memberof DetectorHandler
 * @param {string} mediaType - Type of media passed. E.g. image, video, sound or text.
 * @param {Array} lookingFor - List of affective channels that must be analysed. E.g. face, voice, text, signal, etc.
 * @param {string} mediaPath - Path to the media file, local or remote.
 * @return {Promise<number>} Promise with the number of detectors that could attend the request.
 */
DetectorHandler.prototype.analyseMedia = function( mediaType, lookingFor, mediaPath ) {
	return new Promise( ( resolve, reject ) => {
		let analysisRequested = 0;
		for ( const category in this.detectors ) {
			if ( lookingFor.indexOf( category ) !== -1 ) {
				this.detectors[ category ].forEach( ( detector, index, detectorCategory ) => {
					if ( detector.media.indexOf( mediaType ) !== -1 ) {
						detector.extractEmotions( detector, mediaPath );
						analysisRequested++;
					}
				} );
				console.log( analysisRequested );
				resolve( analysisRequested );
			}
		}
		if ( analysisRequested === 0 ) {
			reject( 'No analysis requested' );
		}
	} );
};

/**
 * Remove a whole category of detectors
 * @function quitCategory
 * @memberof DetectorHandler
 * @param {Array|string} types - String of a single type or array of several types.
 * @return {number} Number of detectors deleted
 */
DetectorHandler.prototype.quitCategory = function( types ) {
	let affected = 0;
	//if types is a list of types, i.e. ['face', 'voice', 'physical', 'body']
	if ( Array.isArray( types ) ) {
		types.forEach( ( type ) => {
			affected += this.detectors[ type ].length;
			delete this.detectors[ type ];
		} );
		// if types is just a string, 'face'
	} else if ( typeof( types ) == 'string' ) {
		affected += this.detectors[ types ].length;
		delete this.detectors[ types ];
	}
	return affected;
};

/**
 * Filter all detectors by a certain criteria
 * @function filter
 * @memberof DetectorHandler
 * @param {Function} filteringFunction - Function to apply in a filter.
 * @return {number} Number of detectors filtered
 */
DetectorHandler.prototype.filter = function( filteringFunction ) {
	let affected = 0;
	for ( const category in this.detectors ) {
		const oLength = this.detectors[ category ].length;
		this.detectors[ category ] = this.detectors[ category ].filter( filteringFunction );
		affected += oLength - this.detectors[ category ].length;
		if ( this.detectors[ category ].length === 0 ) {
			delete this.detectors[ category ];
		}
	}
	return affected;
};

/**
 * Get results from a specific channel in a specific format
 * @function getChannelResults
 * @memberof DetectorHandler
 * @param {string} channel - Name of the channel from which the results are requested.
 * @param {string} resulsType - Format desired for the results. E.g. pad or raw.
 * @return {Array|Object} Array with the results or a object with a string holding the error message.
 */
DetectorHandler.prototype.getChannelResults = function( channel, resulsType ) {
	if ( this.detectors.hasOwnProperty( channel ) ) {
		return [
			this.detectors[ channel ].map( function( detector ) {
				const results = detector.getResults( resulsType );
				return results ? results : [ ];
			} )
		];
	} else {
		return {
			error: 'Non existing channel'
		};
	}
};

/**
 * Return all the detectors in a single array
 * @function getDetectors
 * @memberof DetectorHandler
 * @return {Array} Array with all the detectors in DetectorHandler.
 */
DetectorHandler.prototype.getDetectors = function( ) {
	return [ ].concat( ...Object.values( this.detectors ) );
};

/**
 * Return total number of detectors
 * @function lengthDetectors
 * @memberof DetectorHandler
 * @return {number} Total number of detectors.
 */
DetectorHandler.prototype.lengthDetectors = function( ) {
	return this.getDetectors( ).length;
};

/**
 * Return array of channels
 * @function getChannelsKeys
 * @memberof DetectorHandler
 * @return {Array} Array of channels
 */
DetectorHandler.prototype.getChannelsKeys = function( ) {
	return Object.keys( this.detectors );
};

/**
 * Return array of channels
 * @function getChannels
 * @memberof DetectorHandler
 * @param {Array} channelNames - Array of strings of channel names.
 * @return {Array.<Detector>} Array of channels (being a channel an array of Detector)
 */
DetectorHandler.prototype.getChannels = function( channelNames ) {
	if ( channelNames.length === 0 ) {
		return [ ];
	} else {
		const channelArray = channelNames.map( ( channelName ) => {
			if ( this.detectors.hasOwnProperty( channelName ) ) {
				return this.detectors[ channelName ];
				//return this.getChannelResults( channelName, 'pad' );
			} else {
				return [ ];
			}
		} );
		return channelArray;
	}
};

/**
 * Return detectors of a channel
 * @memberof DetectorHandler
 * @param {String} channelName - Name of a channel.
 * @return {Array.<Detector>} Array of channels (being a channel an array of Detector)
 */
DetectorHandler.prototype.getChannelDetectors = function( channelName ) {
	if ( this.detectors.hasOwnProperty( channelName ) ) {
		return this.detectors[ channelName ];
	} else {
		return [ ];
	}
};

/**
 * Merge results from specified channels
 * @memberof DetectorHandler
 * @param {String|Array} channel - String 'all' or array of channel names
 * @param {String} localStrategy - Name of local strategy. This strategy can be found in <code>tools/merge.js</code>
 * @param {String} globalStrategy - Name of global strategy. This strategy can be found in <code>tools/merge.js</code>
 * @return {Array} Triplet of aggregated data.
 */
DetectorHandler.prototype.mergeResults = function( channel, localStrategy, globalStrategy ) {
	let channelsToMerge = undefined;
	//TODO: comprobar si es un string y luego comprobar si es 'all' o el nombre
	//de un canal
	if ( channel === 'all' ) {
		//Return all available channels
		channelsToMerge = this.getChannelsKeys( );
	} else if ( typeof channel !== 'Array' ) {
		//channel can be either undefined or a string
		channelsToMerge = [ channel ];
	}
	//Map the array of channel names: ['face', 'voice', 'other', ...]
	//so every detector in every channel (contained in the array)
	//aggregates its results in just one triplet
	const channelMergedResults = channelsToMerge.map( ( channelName ) => {
		//Get the detectors of each channel
		const detectors = this.getChannelDetectors( channelName );
		//Each detector applies the strategy to his own result
		//We get an array of triplets per detector
		//The strategies can be undefined at this point, and this will be handled in the
		//./tool/merge.js file.
		const aggregatedDetectorResults = detectors.map( ( det ) => det.applyStrategy( localStrategy ) );
		return applyStrategy( localStrategy, aggregatedDetectorResults );
	} );
	//we apply the global strategy to these locally aggregated data
	return applyStrategy( globalStrategy, channelMergedResults );
};

module.exports.createDetector = createDetector;
module.exports.DetectorHandler = DetectorHandler;
