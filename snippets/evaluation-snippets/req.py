import requests as request
import json

form_data = {
    #Set POST request parameters
}

r = request.post("url", data=form_data)
print(r.text)

# When you need to use cookies, save the request cookies AFTER making the request using the next line
# request_cookies = r.cookies
# Add them to future requests using the cookies parameter

