/**
 * Operations module.
 * @module Operations
 */

const mean = function( list ) {
	if ( list.length !== 0 ) {
		return list.reduce( ( a, b ) => a + b, 0 ) / list.length;
	}
	return 0;
};

/**
 *  Normalize emotion results to PAD values (from 0 to 1)
 * @param {Array} triplet
 * @param {int} max
 * @param {int} min
 * @return {int} Normalized array
 */
function normalize( triplet, max, min ) {
	return triplet.map( ( value ) => ( value - min ) / ( max - min ) );
}

// const compose = (...functions) => args => functions.reduceRight((arg, fn) => fn(arg), args);

module.exports.mean = mean;
module.exports.normalize = normalize;
