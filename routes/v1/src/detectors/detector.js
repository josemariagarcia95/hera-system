/**
 * Detector module. It holds the Detector class.
 * @module Detector
 */

const applyStrategy = require( './tools/merge' ).applyStrategy;

/**
 * Detector constructor function. It defines the common prototype
 * for future detectors.
 * @constructs Detector
 * @param {string} id - Id of the detector. This id would be use in
 * HTTP request.
 * @param {string} category - Category of the detector. Values can be
 * 'face', 'voice','body', 'physio' and 'others'.
 * @param {Array} media - Types of media the service can handle.
 * @param {boolean} realTime - Boolean indicating if the API works in realTime.
 * @param {string} url - Url to which the request will be sent.
 * @param {Object} otherOptions - Other options, such as API keys, and so on.
 */
function Detector( id, category, media, realTime, url, otherOptions ) {
	this.id = id;
	this.category = category;
	this.media = media;
	this.realTime = realTime;
	this.delay = 1000000000;
	this.url = url;
	this.otherOptions = otherOptions;
	this.rawResults = [];
	this.padResults = [];
}

/**
 * Auxiliar method to log in and perform other initialization tasks.
 * If you need to add new parameters to your Detector object, you can do it here.
 * @async
 * @function initialize
 * @memberof Detector
 */
Detector.prototype.initialize = async function() {
	console.log( 'Initialize method in Detector class' );
};

/**
 * Send the media passed to the correspondent API.
 * @function extractEmotions
 * @memberof Detector
 * @param {Object} context - Context in which auxiliar functions will be called. Context will be 'this' most of the times.
 * @param {string} media - Media to analyse. This media will be sent to the Detector's API.
 * This string will be an absolute path/url pointing to where the media is stored.
 * @param {Function} callback - Callback used to auxiliar tasks, like measuring times.
 */
Detector.prototype.extractEmotions = function( context, media, callback = () => {} ) {
	console.log( 'extractEmotions method in Detector class' );
};

/**
 * Translated the raw results to the PAD format.
 * @function translateToPAD
 * @memberof Detector
 * @param {Object} results - Results from the API that will be translated to the PAD space.
 * @return {Object} Results expressed in the PAD space.
 */
Detector.prototype.translateToPAD = function( results ) {
	console.log( 'Translate method in Detector class' );
	return {};
};

/**
 * Add the raw results and the PAD-translated version to the results arrays.
 * @function addResults
 * @memberof Detector
 * @param {Object} results - Results as they come from the 3rd party emotion detection service.
 */
Detector.prototype.addResults = function( results ) {
	this.rawResults.push( results );
	this.padResults.push( this.translateToPAD( results ) );
};

/**
 * Delete all the previous results.
 * @function cleanResults
 * @memberof Detector
 */
Detector.prototype.cleanResults = function() {
	this.rawResults = [];
	this.padResults = [];
};

/**
 * Translated the raw results to the PAD format.
 * @function getResults
 * @memberof Detector
 * @param {string} resultsType - String with the type of results requested, i.e., 'pad' or 'raw'.
 * @return {Array} Results requested.
 */
Detector.prototype.getResults = function( resultsType ) {
	return this[ resultsType + 'Results' ];
};

/**
 * Apply aggregation strategy to array of triplets.
 * @function applyStrategy
 * @memberof Detector
 * @param {String} strategy - Name of the strategy which will be used to aggregate the PAD results.
 * one triplet.
 * @return {Array} Aggregated results.
 */
Detector.prototype.applyStrategy = function( strategy ) {
	return applyStrategy( strategy, this.getResults( 'pad' ) );
};

module.exports.Detector = Detector;
