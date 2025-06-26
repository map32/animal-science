#opens provinces_species_names.json and species_info.json to apply ids to the names of species in the former file

import json

# Load species info
with open('./app/assets/species_info.json', 'r', encoding='utf-8') as f:
    species_info = json.load(f)

# Build a lookup for fast matching by korean_name
korean_name_to_info = {}
for entry in species_info:
    name = entry.get("korean_name")
    if name:
        korean_name_to_info[name] = entry

# Load province species names
with open('province_species_names.json', 'r', encoding='utf-8') as f:
    province_species = json.load(f)

# Prepare the result
matched_province_species = {}

for province, names in province_species.items():
    matched_list = []
    for name in names:
        info = korean_name_to_info.get(name)
        if info:
            matched_list.append({"id": info.get("id"), "name": name})
        else:
            matched_list.append({"id": None, "name": name})
    matched_province_species[province] = matched_list

# Save the result
with open('province_species_matched.json', 'w', encoding='utf-8') as f:
    json.dump(matched_province_species, f, ensure_ascii=False, indent=2)

print("Matching complete. Saved to province_species_matched.json")