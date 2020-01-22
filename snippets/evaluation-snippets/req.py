import requests as request
import json

form_data = {
    "api_key": ".........",
    "api_secret": ".......",
    "return_attributes": "emotion",
    "image_url": "......",
}

r = request.post("url", data=form_data)
print(r.text)
