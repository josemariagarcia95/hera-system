const request = require('request');
// FACE++
const formData = {
    //POST request data
};

const options = {
    //url, type of HTTP requests
    formData: formData
};

request(options, function (error, response, body) {
   //handle response
});

// DUMMY DETECTOR
const options1 = {
    //url, type of HTTP requests
    headers: {
        'user-agent': 'node.js'
    }
};

request(options1, function (error, response, body) {
    //handle response
});