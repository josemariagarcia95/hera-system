// eslint-disable-next-line require-jsdoc
let extractEmotion = function( media, callback ) {
	console.log( 'This is extractEmotions' );
	callback( media );
};

let test = function( media ) {
	console.log( 'I\'m the callback and I\'ve received ' + media );
};

extractEmotion( 'Holi', test );

// eslint-disable-next-line require-jsdoc
function curryFunction( func, callback ) {
	return function( media ) {
		func( media, callback );
	};
}
test = function( media ) {
	console.log( 'I\'m the callback in curry and I\'ve received ' + media );
};


extractEmotion = curryFunction( extractEmotion, test );
extractEmotion( 'Holi' );
