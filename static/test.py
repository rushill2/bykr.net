import requests

resp = requests.get("https://www.google.com/search?q="+"Electrical+Computer+Engineering+Building")
print(resp.content)