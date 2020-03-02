import requests as request
import json
from time import sleep

ip = "http://172.19.194.129:3000/api/v1"
# Use the data option to add the data for Face++
# r = request.post("url", data=form_data)

# Use the 'json' option to add the data for the Tot server
r = request.get(ip + "/")
#Saving cookies por later
request_cookies = r.cookies
print(r.text)

# Sleep in order to wait for async results in server
sleep(2)

form_data = {
    #Set POST request parameters
}
# Including previous cookies in next request
r = request.post(ip + "/init", json=form_data, cookies=request_cookies)
sleep(2)

# Repeat for /analyse
# ...
# Repeat for /results
