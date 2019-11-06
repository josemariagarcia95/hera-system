/**
 * Merging module.
 * @module Merge
 */

const mean = require( './operations' ).mean;

/**
 * @property {Object} strategies - Collection of strategies to aggregate PAD results. In order to
 *  aggregate new strategies, just add a new item to this object, and implement a function which
 * receives an array of triplets and returns a single triplet. Then, add another case to the switch in the
 * [getMergingDataStrategy]{@link module:Merge~getMergingDataStrategy} so there is a case which returns
 * this brand new strategy.
 */
const strategies = {
	default: function( tripletsArray ) {
		const pleasure = tripletsArray.map( ( element ) => {
			return element[ 0 ];
		} );
		const arousal = tripletsArray.map( ( element ) => {
			return element[ 1 ];
		} );
		const dominance = tripletsArray.map( ( element ) => {
			return element[ 2 ];
		} );
		return [ mean( pleasure ), mean( arousal ), mean( dominance ) ];
	}
};

/**
 * Retrieves the function to use in the PAD results merging process.
 * @function getMergingDataStrategy
 * @param {string} strategyName - String with the name of a strategy. This string should match one of
 * the cases in the switch-case block of this function.
 * @return {Function}
 */
const getMergingDataStrategy = function( strategyName ) {
	let strategy = strategies.default;
	switch ( strategyName ) {
		case 'case1':
			strategy = strategies.case1;
			break;
		default:
			strategy = strategies.default;
			break;
	}
	return strategy;
}

module.exports.getMergingDataStrategy = getMergingDataStrategy;

module.exports.applyStrategy = function( strategyName, tripletsArray ) {
	const strategy = getMergingDataStrategy( strategyName );
	return strategy( tripletsArray );
};
