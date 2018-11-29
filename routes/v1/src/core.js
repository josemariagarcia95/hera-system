const base = require( './detectors/detector' );
const present = require( 'present' );
const fs = require( 'fs' );
/**
 *
 * @param {string} id - Name of the detector.
 * @param {string} category
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
	realTime,
	url,
	otherOptions,
	initialize,
	extractEmotions,
	translateToPAD ) {
	const newDetector = new base.Detector(
		id, category, realTime, url, otherOptions );
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
	fs.readdirSync( __dirname + '/' + detectorObj.category + '/benchmark-files' ).forEach( function( fileName, index, array ) {
		let startTime = present();
		const times = [];
		const callback = function( data ) {
			times.push( present() - startTime );
			startTime = present();
			if ( index + 1 === array.length ) {
				const mean = ( list ) => list.reduce( ( a, b ) => a + b, 0 ) / list.length;
				detectorObj.delay = mean( times );
				detectorObj.realTime = detectorObj.delay < 2000;
			}
		}
		detectorObj.extractEmotions( './' + detectorObj.category + '/benchmark-files/' + fileName );
	} );
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
