/* eslint-disable require-jsdoc */
const request = require( 'request' );
const util = require( 'util' );

/*
const options = {
	url: 'http://localhost:3000/api/v1/init',
	method: 'POST',
	formData: {
		api_key: this.otherOptions.api_key,
		api_secret: this.otherOptions.api_secret,
		return_attributes: 'emotion'
	}
};
*/

const get = util.promisify( request.get );
const post = util.promisify( request.post );
console.log( 'Test file' );
init();


function init() {
	console.log( 'Init Endpoint' );
	get( 'http://localhost:3000/api/v1/init' )
		.then( ( res ) => {
			console.log( 'Success' );
			console.log( res.body );
		} )
		.catch( ( reason ) => {
			console.log( 'Error' );
			console.log( reason );
		} ).finally( () => setTimeout( setup, 4000 ) );
}

function setup() {
	console.log( 'Setup Endpoint' );
	post( {
		url: 'http://localhost:3000/api/v1/setup',
		body: {
			type: [ 'face' ],
			delay: 3000
		},
		json: true
	} ).then( ( res ) => {
		console.log( 'Success' );
		console.log( res.body );
	} ).catch( ( reason ) => {
		console.log( 'Error' );
		console.log( reason );
	} ).finally( () => setTimeout( analyse, 4000 ) );
}

function analyse() {
	console.log( 'Analyse Endpoint' );
	post( {
		url: 'http://localhost:3000/api/v1/analyse',
		body: {
			mediaType: 'image',
			lookingFor: 'face',
			mediaPath: 'http://josemariagarcia.es/img/perfil.jpg'
		},
		json: true
	} ).then( ( res ) => {
		console.log( 'Success' );
		console.log( res.body );
	} ).catch( ( reason ) => {
		console.log( 'Error' );
		console.log( reason );
	} ).finally( () => setTimeout( results, 6000 ) );
}

function results() {
	console.log( 'Results Endpoint' );
	post( {
		url: 'http://localhost:3000/api/v1/results',
		body: {
			localStrategy: 'default',
			globalStrategy: 'default'
		},
		json: true
	} ).then( ( res ) => {
		console.log( 'Success' );
		console.log( res.body );
	} ).catch( ( reason ) => {
		console.log( 'Error' );
		console.log( reason );
	} ).finally( () => setTimeout( () => {}, 4000 ) );
}
