import json

l = []
with open('app/assets/species_info.json', 'r', encoding='utf-8') as file:
    data = json.load(file)
    for entry in data:
        l.append({'korean': entry['korean_name'], 'scientific': entry['english_name']})

with open('species_names.json', 'w', encoding='utf-8') as file:
    json.dump(l, file, ensure_ascii=False, indent=2)