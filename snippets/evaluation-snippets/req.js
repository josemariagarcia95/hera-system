const request = require('request');
// FACE++
const formData = {
    api_key: 'lWMTqYOBCFvPIqRrcBpdBX6FTyMNdi7Y',
    api_secret: 'fE6OCbIshDawTnXZZzm78_eWfAdG9jQz',
    return_attributes: 'emotion',
    image_url: 'https://josemariagarcia.es/img/perfil-viejo-1.jpg'
};

const options = {
    url: 'https://api-us.faceplusplus.com/facepp/v3/detect',
    method: 'POST',
    formData: formData
};

request(options, function (error, response, body) {
    if (error) {
        console.log(error);
        return error;
    }
    if (body) {
        const parsedBody = JSON.parse(body);
        const results = parsedBody['faces'][0]['attributes']['emotion'];
        console.log(results);
    }
});
// DUMMY DETECTOR
const options1 = {
    url: 'https://josemariagarcia.es/php/dummydetector.php',
    method: 'GET',
    image_url: 'https://josemariagarcia.es/img/perfil-viejo-1.jpg',
    headers: {
        'user-agent': 'node.js'
    }
};

request(options1, function (error, response, body) {
    if (error) {
        console.log(error);
        return error;
    }
    if (body) {
        console.log(JSON.parse(body));
    }
});