import json
import requests
from bs4 import BeautifulSoup

convert = {
        "서울": "서울특별시",
        "서울시": "서울특별시",
        "서울특별시": "서울특별시",
        "부산": "부산광역시",
        "부산시": "부산광역시",
        "부산광역시": "부산광역시",
        "대구": "대구광역시",
        "대구시": "대구광역시",
        "대구광역시": "대구광역시",
        "인천": "인천광역시",
        "인천시": "인천광역시",
        "인천광역시": "인천광역시",
        "광주": "광주광역시",
        "광주시": "광주광역시",
        "광주광역시": "광주광역시",
        "대전": "대전광역시",
        "대전시": "대전광역시",
        "대전광역시": "대전광역시",
        "울산": "울산광역시",
        "울산시": "울산광역시",
        "울산광역시": "울산광역시",
        "세종": "세종특별자치시",
        "세종시": "세종특별자치시",
        "세종특별자치시": "세종특별자치시",
        "경기": "경기도",
        "경기도": "경기도",
        "강원": "강원특별자치도",
        "강원도": "강원특별자치도",
        "강원특별자치도": "강원특별자치도",
        "충북": "충청북도",
        "충청북도": "충청북도",
        "충남": "충청남도",
        "충청남도": "충청남도",
        "전북": "전북특별자치도",
        "전라북도": "전북특별자치도",
        "전북특별자치도": "전북특별자치도",
        "전남": "전라남도",
        "전라남도": "전라남도",
        "경북": "경상북도",
        "경상북도": "경상북도",
        "경남": "경상남도",
        "경상남도": "경상남도",
        "제주": "제주특별자치도",
        "제주도": "제주특별자치도",
        "제주특별자치도": "제주특별자치도"
    }

def call(payload):
    response = requests.post("https://www.code.go.kr/stdcode/regCodeL.do", data=payload)
    soup = BeautifulSoup(response.text, "html.parser")
    # Find all tables with class 'table'
    tables = soup.find_all('table', class_='table')
    td = tables[1].find("td", class_="table_left")
    if td:
        code = td.text.strip()[0:5]
        if not code.isnumeric():
            return 'err'
    return code

def map_codes_to_species_distribution():
    with open('./app/assets/species_distribution.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    failures = []

    for division in data:
        if division.get('districts_distribution') is None:
            continue
        dists = division['districts_distribution']
        division_name = division['name']
        for dist in dists:
            payload = {
                "cPage": "1",
                "regionCd_pk": "",
                "chkWantCnt": "0",
                "reqSggCd": "*",
                "reqUmdCd": "*",
                "reqRiCd": "*",
                "searchOk": "0",
                "codeseId": "00002",
                "pageSize": "10",
                "regionCd": "",
                "locataddNm": f"{convert[division_name]} {dist['name']}",
                "sidoCd": "*",
                "sggCd": "*",
                "umdCd": "*",
                "riCd": "*",
                "disuseAt": "0",
                "stdate": "",
                "enddate": ""
            }
            response = requests.post("https://www.code.go.kr/stdcode/regCodeL.do", data=payload)
            soup = BeautifulSoup(response.text, "html.parser")
            # Find all tables with class 'table'
            tables = soup.find_all('table', class_='table')
            td = tables[1].find("td", class_="table_left")
            if td:
                print(f"{convert[division_name]} {dist['name']}" + ' '+td.text.strip()[0:5])
                dist['code'] = td.text.strip()[0:5]
                if not dist['code'].isnumeric():
                    failures.append({'division': division_name, 'district': dist['name'], 'code': dist['code']})

    with open('failures.json', 'w', encoding='utf-8') as f:
        json.dump(failures, f, ensure_ascii=False, indent=4)

    with open('output.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def map_between_obsolete_and_current_codes():
    with open('./app/assets/district_codes.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    failures = []
    mapping = {}
    for i, key in enumerate(data):
        district = data[key]
        district_name = district['SIG_KOR_NM']
        province_name = district['Province']
        payload = {
            "cPage": "1",
            "regionCd_pk": "",
            "chkWantCnt": "0",
            "reqSggCd": "*",
            "reqUmdCd": "*",
            "reqRiCd": "*",
            "searchOk": "0",
            "codeseId": "00002",
            "pageSize": "10",
            "regionCd": "",
            "locataddNm": f"{convert[province_name]} {district_name}",
            "sidoCd": "*",
            "sggCd": "*",
            "umdCd": "*",
            "riCd": "*",
            "disuseAt": "ALL",
            "stdate": "",
            "enddate": ""
        }
        oldCode = call(payload)
        newPayload = {
            "cPage": "1",
            "regionCd_pk": "",
            "chkWantCnt": "0",
            "reqSggCd": "*",
            "reqUmdCd": "*",
            "reqRiCd": "*",
            "searchOk": "0",
            "codeseId": "00002",
            "pageSize": "10",
            "regionCd": "",
            "locataddNm": f"{convert[province_name]} {district_name}",
            "sidoCd": "*",
            "sggCd": "*",
            "umdCd": "*",
            "riCd": "*",
            "disuseAt": "0",
            "stdate": "",
            "enddate": ""
        }
        newCode = call(newPayload)
        print(newCode, oldCode)
        if oldCode == newCode:
            if oldCode == 'err' or newCode == 'err':
                failures.append(f"{district['SIG_KOR_NM']} {district['Province']}")
            continue
        else:
            mapping[oldCode] = newCode
        print(f"{i}/{len(data)}")
        with open('mapping_failure.json', 'w', encoding='utf-8') as f:
            json.dump(failures, f, ensure_ascii=False, indent=4)
        with open('mapping.json', 'w', encoding='utf-8') as f:
            json.dump(mapping, f, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    print('Pick a type of script:')
    print('1. Map district codes to species_distribution.json')
    print('2. Map between obsolete and current codes')
    print('5. Quit')
    choice = input('Enter your choice (1 or 2): ')
    if choice == '1':
        map_codes_to_species_distribution()
    elif choice == '2':
        map_between_obsolete_and_current_codes()
    else:
        print("Exiting the scraper.")
        exit(0)
            