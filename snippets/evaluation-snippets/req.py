import requests as request
import json

form_data = {
    #Set POST request parameters
}

# Use the data option to add the data for Face++
# r = request.post("url", data=form_data)

# Use the JSON option to add the data for the Tot server
r = request.post("url", json=form_data)
#Saving cookies por later
request_cookies = r.cookies
print(r.text)

sleep(2)

# Including previous cookies in next request
r = request.post("url", json=form_data, cookies=request_cookies)

