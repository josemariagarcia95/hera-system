const express = require( 'express' );
const router = express.Router();

/* GET home page. */
router.get( '/', function( req, res, next ) {
	res.render( 'index', {
		title: 'Express'
	} );
} );

router.post( '/', function( req, res ) {
	res.send( 'Got a POST request' );
} );

module.exports = router;
