const mean = ( list ) => list.reduce( ( a, b ) => a + b, 0 ) / list.length;

module.exports.mean = mean;
