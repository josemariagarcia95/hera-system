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
	const newDetector = {};
	Detector.call( newDetector, id, category, realTime, url, otherOptions );
	newDetector.prototype = Object.create( Detector.prototype );
	newDetector.prototype.initialize = initialize;
	newDetector.prototype.extractEmotions = extractEmotions;
	newDetector.prototype.translateToPAD = translateToPAD;
	return newDetector;
}

//createDetector( 'azure', 'face', false, 'wwww', () => {}, () => {} );
