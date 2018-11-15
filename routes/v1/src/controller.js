const list = [ 'a', 'b' ];

for ( elem of list ) {
	const aux = require( './detectors/' + elem + '.js' );
	aux.print();
}
