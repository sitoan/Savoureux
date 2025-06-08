

from flask import json


import requests
import json

url = "http://127.0.0.1:5000/recipe/create"

headers = {
  'Content-Type': 'application/json'
}

with open("data/recipe/recipe_warehouse.json", "r", encoding="utf-8") as f:
    payload = json.load(f)
    for recipe in payload:
        response = requests.request("POST", url, headers=headers, data=json.dumps(recipe))
        print(response.text)


