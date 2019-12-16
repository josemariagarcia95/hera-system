from time import sleep
import requests as request
import json

# First endpoint to get the cookie
api_endpoint = 'http://localhost:3000/api/v1'
r = request.get(api_endpoint + '/')
cookies = r.cookies
print(r.text)

init_data = {
    'settings': {
        'mockup': {
            'category': 'face',
            'media': ['image'],
            'realTime': 'false',
            'url': 'whatever',
            'otherOptions': {
                'api_key': 'whatever'
            },
            'callbacks': './src/detectors/other/mockup.js'
        },
        'facepp': {
            'category': 'face',
            'media': ['image'],
            'realTime': 'false',
            'url': 'https://api-us.faceplusplus.com/facepp/v3/detect',
            'otherOptions': {
                'api_key': 'lWMTqYOBCFvPIqRrcBpdBX6FTyMNdi7Y',
                'api_secret': 'fE6OCbIshDawTnXZZzm78_eWfAdG9jQz'
            },
            'callbacks': './src/detectors/face/facepp.js'
        }
    }
}
# Init endpoint, starts the detectors
r = request.post(api_endpoint + '/init', json=init_data, cookies=cookies)
print(r.text)

sleep(3)

setup_data = {'type': ['face'], 'delay': '3000'}

# Setup endpoint, filter detectors by their characteristics
r = request.post(api_endpoint + '/setup', json=setup_data, cookies=cookies)
print(r.text)

analyse_data = {
    'mediaType': 'image',
    'lookingFor': 'face',
    'mediaPath': 'http://josemariagarcia.es/img/perfil.jpg'
}

# Analyse endpoint, order the analyse of a picture
r = request.post(api_endpoint + '/analyse', json=analyse_data, cookies=cookies)
print(r.text)

sleep(3)

results_data = {
    'channelsToMerge': ['face'],
    'localStrategy': 'default',
    'globalStrategy': 'default'
}

r = request.post(api_endpoint + '/results', json=results_data, cookies=cookies)
print(r.text)
