/**
 * Operations module.
 * @module Operations
 */

const mean = ( list ) => list.reduce( ( a, b ) => a + b, 0 ) / list.length;

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

module.exports.mean = mean;
module.exports.normalize = normalize;
