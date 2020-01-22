import requests as request
import json

"""
form_data = {
    "api_key": "lWMTqYOBCFvPIqRrcBpdBX6FTyMNdi7Y",
    "api_secret": "fE6OCbIshDawTnXZZzm78_eWfAdG9jQz",
    "return_attributes": "emotion",
    "image_url": "https://josemariagarcia.es/img/perfil-viejo-1.jpg",
}

r = request.post("https://api-us.faceplusplus.com/facepp/v3/detect", data=form_data)
print(json.loads(r.text)["faces"][0]["attributes"]["emotion"])
"""
