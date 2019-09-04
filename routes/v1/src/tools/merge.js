/**
 * Merging module.
 * @module Merge
 */

const mean = require( './operations' ).mean;
const strategies = {
	default: function( tripletsArray ) {
		const pleasure = tripletsArray.forEach( ( element ) => {
			return element[ 0 ];
		} );
		const arousal = tripletsArray.forEach( ( element ) => {
			return element[ 1 ];
		} );
		const dominance = tripletsArray.forEach( ( element ) => {
			return element[ 2 ];
		} );
		return [ mean( pleasure ), mean( arousal ), mean( dominance ) ];
	}
};

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
