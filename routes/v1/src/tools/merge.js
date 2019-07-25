const mean = require( 'operations' ).mean;
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

module.exports.getMergingDataStrategy = function( strategyName ) {
	let strategy = strategies.default;
	switch ( strategyName ) {
		case 'case1':
			strategy = strategies.case1;
			break;
	}
	return strategy;
}
