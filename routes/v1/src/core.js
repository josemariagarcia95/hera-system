const base = require( './detectors/detector' );
const present = require( 'present' );
const fs = require( 'fs' );

const realTimeThreshold = 4000;
/**
 *
 * @param {string} id - Name of the detector.
 * @param {string} category
 * @param {Array} media
 * @param {boolean} realTime
 * @param {string} url
 * @param {Object} otherOptions
 * @param {Function} initialize
 * @param {Function} extractEmotions
 * @param {Function} translateToPAD
 * @return {Object} New Detector object fully built
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
 */
function DetectorHandler() {
	this.detectors = {};
}

/**
 * Add a new detector to the DetectorHandler object.
 * @function addDetector
 * @param {Object} detectorObj - Detector object.
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

DetectorHandler.prototype.analyseMedia = function( media ) {

};

/**
 * Remove a whole category of detectors
 * @function quitCategory
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

DetectorHandler.prototype.getDetectors = function() {
	return [].concat( ...Object.values( this.detectors ) );
};

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
