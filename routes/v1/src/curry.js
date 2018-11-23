// Keep calm and curry on
function curry( func, ctx ) {
	var args = Array.prototype.slice.call( arguments, 2 );
	return function() {
		var args2 = args.concat( Array.prototype.slice.call( arguments, 0 ) );
		if( args2.length >= func.length ) {
			return func.apply( ctx || null, args2 );
		} else {
			args2.unshift( func, ctx );
			return curry.apply( null, args2 );
		}
	};
}

// eslint-disable-next-line require-jsdoc
let extractEmotion = curry( function( callback, media ) {
	console.log( 'This is extractEmotions' );
	callback( media );
} );

let test = function( media ) {
	console.log( 'I\'m the callback and I\'ve received: ' + media );
};



extractEmotion_ = extractEmotion( test );
extractEmotion_( 'Hello, World!' );
