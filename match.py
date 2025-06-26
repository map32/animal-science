import json
with open('district_codes.json', 'r', encoding='utf-8') as f:
    district_codes = json.load(f)
with open('species_distribution.json', 'r', encoding='utf-8') as f:
    species_distribution = json.load(f)

matches = {}
not_found_on_species_distribution = []
not_found_on_geojson = []

for province in species_distribution:
    if 'districts_distribution' not in province:
        continue
    for district in province['districts_distribution']:
        code = district['code']
        matches[code] = {}
        matches[code]['species_distribution_name'] = district['name']
        if code in district_codes:
            matches[code]['codebook_name'] = district_codes[code]['SIG_KOR_NM']
        else:
            not_found_on_geojson.append({'code': code, 'name': f"{province['name']} {district['name']}"})

for i, code in enumerate(district_codes):
    if code not in matches:
        not_found_on_species_distribution.append({'code': code, 'name': district_codes[code]['SIG_KOR_NM']})

output = {
    "matches": matches,
    "not_found_on_species_distribution": not_found_on_species_distribution,
    "not_found_on_geojson": not_found_on_geojson
}
with open('district_matches_output.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)