/**
 * Detector constructor function. It defines the common prototype
 * for future detectors
 * @function Detector
 * @param {string} id - Id of the detector. This id would be use in
 * HTTP request.
 * @param {string} category - Category of the detector. Values can be
 * 'face', 'voice','body', 'physio' and 'others'.
 * @param {boolean} realTime - Boolean indicating if the API works in realTime.
 * @param {string} url - Url to which the request will be sent.
 * @param {Object} otherOptions - Other options, such as API keys, and so on.
 */
function Detector( id, category, realTime, url, otherOptions ) {
	this.id = id;
	this.category = category;
	this.realTime = realTime;
	this.url = url;
	this.otherOptions = otherOptions;
	this.rawResults = [];
	this.padResults = [];
}

/**
 * Auxiliar method to log in and perform other initialization tasks.
 * If you need to add new parameters to your Detector object, you can do it here.
 * @function initialize
 */
Detector.prototype.initialize = async function() {
	console.log( 'Initialize method in Detector class' );
};

/**
 * Send the media passed to the correspondent API
 * @function extractEmotions
 *  @param {string} media - Media to analyse. This media will be sent
 *  @param {Function} callback - Callback used to auxiliar tasks
 * to the Detector's API. This string will be an absolute route/url pointing to where the media is stored.
 */
Detector.prototype.extractEmotions = function( media, callback = () => {} ) {
	console.log( 'extractEmotions method in Detector class' );
};

/**
 * Send the media passed to the correspondent API
 * @function translateToPAD
 *  @param {Object} results - Results from the API that will be translated to the PAD space
 *  @return {Object} Results expressed in the PAD space
 */
Detector.prototype.translateToPAD = function( results ) {
	console.log( 'Translate method in Detector class' );
	return {};
};


Detector.prototype.addResults = function( results ) {
	this.rawResults.push( results );
	this.padResults.push( this.translateToPAD( results ) );
};

module.exports.Detector = Detector;
