const users = require( './users.js' );
const uniqid = require( 'uniqid' );

const a = uniqid();
users.addUser( a );
console.log( users.users );
console.log( users.getUser( a ) );
