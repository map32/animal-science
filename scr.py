import json

with open('districts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for feature in data['features']:
    print(feature['properties'])