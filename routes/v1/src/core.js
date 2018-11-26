const base = require( './detectors/detector' );

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
}
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
