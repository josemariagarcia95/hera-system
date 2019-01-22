/**
 * Core module.
 * @module Core
 */
const base = require( './detectors/detector' );
const present = require( 'present' );
const fs = require( 'fs' );

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
function DetectorHandler() {
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
	fs.readdirSync( __dirname + '\\detectors\\' + detectorObj.category +
		'\\benchmark-files' ).forEach( function( fileName, index, array ) {
		let startTime = present();
		const times = [];
		const callback = function( data ) {
			times.push( present() - startTime );
			startTime = present();
			if ( index + 1 === array.length ) {
				const mean = ( list ) => list.reduce( ( a, b ) => a + b, 0 ) / list.length;
				detectorObj.delay = mean( times );
				detectorObj.realTime = detectorObj.delay < realTimeThreshold;
				console.log( detectorObj );
			}
		};
		detectorObj.extractEmotions( detectorObj, __dirname + '\\detectors\\' + detectorObj.category +
			'/benchmark-files/' + fileName, callback );
	} );
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
		const analysisRequested = 0;
		for ( const category in this.detectors ) {
			if ( lookingFor.indexOf( category ) !== -1 ) {
				this.detectors[ category ].forEach( ( detector, index, detectorCategory ) => {
					if ( detector.media.indexOf( mediaType ) !== -1 ) {
						detector.extractEmotions( mediaPath, detector );
						analysisRequested++;
					}
				} );
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
 * @param {strign} channel - Name of the channel from which the results are requested.
 * @param {strign} resulsType - Format desired for the results. E.g. pad or raw.
 * @return {Array|string} Array with the results or a string with an error message.
 */
DetectorHandler.prototype.getChannelResults = function( channel, resulsType ) {
	if ( this.detectors.hasOwnProperty( channel ) ) {
		return Array.prototype.concat(
			this.detectors[ channel ].map( function( detector ) {
				const results = detector.getResults( resulsType );
				return results ? results : [];
			} ) );
	} else {
		return {
			error: 'Non existing channel'
		};
	}
};

/**
 * Return all the detectors in a single array
 * @function getDetectors
 * @memberof DetectorHandlers
 * @return {Array} Array with all the detectors in DetectorHandler.
 */
DetectorHandler.prototype.getDetectors = function() {
	return [].concat( ...Object.values( this.detectors ) );
};

/**
 * Return total number of detectors
 * @function lengthDetectors
 * @memberof DetectorHandler
 * @return {number} Total number of detectors.
 */
DetectorHandler.prototype.lengthDetectors = function() {
	return this.getDetectors().length;
};


DetectorHandler.prototype.mergeResults = function( channel = 'all' ) {
	//return process( this.getChannelResults( channel ) );
};

/**
 *
 */
function MergeStrategy() {
	this.name = 'strategy';
}

MergeStrategy.prototype.process = function( results ) {
	return {};
};

module.exports.createDetector = createDetector;
module.exports.DetectorHandler = DetectorHandler;
