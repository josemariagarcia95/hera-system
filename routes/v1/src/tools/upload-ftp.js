const Ftp = require( 'ftp' );

const ftpClient = new Ftp();

ftpClient.on( 'ready', function() {
	ftpClient.put( './prueba.jpg', '/www/img/prueba.jpg', function( err, list ) {
		if ( err ) throw err;
		ftpClient.end();
	} );
} );
// connect to localhost:21 as anonymous
ftpClient.connect( {
	'host': '*****************',
	'user': '***************',
	'password': '**************'
} );
