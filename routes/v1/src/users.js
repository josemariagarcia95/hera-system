/**
 * Users module.
 * @module Users
 */
const core = require( './core' );

const userHandler = {
	users: [],
	/**
	 * Add a new user
	 * @function addUser
	 * @param {int} uniqueID - unique id value
	 * @return {int} User unique id
	 */
	addUser: function( uniqueID ) {
		const newUser = {
			id: uniqueID,
			detectorHandler: new core.DetectorHandler(),
			expires: new Date( Date.now() + 5000 ),
			active: 300000
		};
		this.users.push( newUser );
		if ( this.users.length === 1 ) {
			enableUserExpirationInterval();
		}
		return newUser.id;
	},
	/**
	 * @function userExists
	 * @param {int} id
	 * @return {boolean} Does the user exist?
	 */
	userExists: function( id ) {
		const foundUser = this.users.find( ( user ) => user.id === id );
		const userCheck = typeof foundUser !== 'undefined';
		if ( userCheck ) {
			this.refreshUserSession( foundUser );
		}
		return userCheck;
	},
	/**
	 * @function getUser
	 * @param {int} id
	 * @return {Object|undefined} User object or undefined if the user doesn't exist.
	 */
	getUser: function( id ) {
		return this.users.find( ( user ) => user.id === id );
	},
	/**
	 * @function refreshUserSession
	 * @param {Object} user
	 */
	refreshUserSession: function( user ) {
		user.expires = new Date( Date.now() + user.active );
	},
	/**
	 * @function expirationTime
	 */
	expirationTime: function() {
		const len = this.users.length;
		this.users = this.users.filter( ( user ) => Date.now() <= user.expires );
		if ( len !== this.users.length ) {
			console.log( len - this.users.length + ' users deleted' );
		}
	}
};

/**
 * @function enableUserExpirationInterval
 */
function enableUserExpirationInterval() {
	const expirationIntervalId = setInterval( function() {
		userHandler.expirationTime();
		if ( userHandler.users.length === 0 ) {
			console.log( 'no more users, interval stopped' );
			clearInterval( expirationIntervalId );
		}
	}, 1000 );
}


module.exports = userHandler;
