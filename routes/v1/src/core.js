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

module.exports.createDetector = createDetector;
