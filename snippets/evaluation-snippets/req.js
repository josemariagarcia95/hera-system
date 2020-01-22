const request = require('request');
// FACE++
const formData = {
    api_key: '......',
    api_secret: '......',
    return_attributes: 'emotion',
    image_url: '..........'
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
    image_url: 'https://josemariagarcia.es/img/perfil-viejo-1.jpg',
    headers: {
        'user-agent': 'node.js'
    }
};

request(options1, function (error, response, body) {
    //handle response
});