/* eslint-disable no-var */
var str = "userId=1lol3rwk2nkjemo; Path=/";
var reg = new RegExp( /=([a-zA-Z0-9]*);/ );
var result = reg.exec( str );
console.log( result );
