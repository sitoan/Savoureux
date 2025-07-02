

from flask import json


import requests
import json

url = "http://127.0.0.1:5000/recipe/create/f50967e4-24af-439a-83de-f4b411001c0c"

headers = {
  'Content-Type': 'application/json'
}

with open("data/recipe_warehouse.json", "r", encoding="utf-8") as f:
    payload = json.load(f)
    print(len(payload))
    for recipe in payload:
        response = requests.request("POST", url, headers=headers, data=json.dumps(recipe))
        print(response.text)


