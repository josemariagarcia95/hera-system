import requests as request
import json

r = request.get('http://localhost:3000/api/v1/')
user_id_cookies = r.cookies

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

r = request.post('http://localhost:3000/api/v1/init',
                 json=init_data,
                 cookies=user_id_cookies)
