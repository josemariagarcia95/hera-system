const AudioContext = require( 'web-audio-api' ).AudioContext;
const fs = require( 'fs' );
context = new AudioContext();

const soundfile = 'Happines_Enthusiasm_Friendliness_1.wav';
decodeSoundFile( soundfile );

// eslint-disable-next-line require-jsdoc
function decodeSoundFile( soundfile ) {
	console.log( 'decoding mp3 file', soundfile, ' ..... ' );
	fs.readFile( soundfile, function( err, buf ) {
		if ( err ) throw err;
		context.decodeAudioData( buf, function( audioBuffer ) {
			console.log( 'Sample rate: ' + audioBuffer.sampleRate, audioBuffer.duration );
			pcmdata = ( audioBuffer.getChannelData( 0 ) );
			samplerate = audioBuffer.sampleRate; // store sample rate
			maxvals = [];
		}, function( err ) {
			throw err;
		} );
	} );
}
