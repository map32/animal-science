#scraper for extracting code name pairs for crops in 농사로
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import requests
import math
from bs4 import BeautifulSoup
import os

def scrape_animal_html():
    # Initialize the Chrome driver
    driver = webdriver.Chrome()
    data = []
    for i in range(1,300):
        driver.get(f"https://www.nie.re.kr/nie/pgm/edSpecies/view.do?menuNo=200127&speciesSn={i}")
        try:
            # Check if the errorContent div exists (page does not exist)
            driver.find_element(By.CLASS_NAME, "errorContent")
            print(''+i+' not found')
            # If found, skip this page
            continue
        except:
            # If not found, page exists, download HTML
            html = driver.page_source
            data.append({"id": i, "html": html})
        # Write all data to a single JSON file
    with open("species_pages.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def extract_info_from_html():
    if not os.path.exists("species_pages.json"):
        print("species_pages.json not found.")
        return

    with open("species_pages.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    results = []
    # Iterate over only the first and last elements in data
    for (ind, entry) in enumerate(data):
        html = entry.get("html", "")
        soup = BeautifulSoup(html, "html.parser")
        # Skip if errorContent div exists
        if soup.find("div", class_="errorContent"):
            print('skipping f{ind}')
            continue
        category_div = soup.find("div", class_=lambda x: x and "ico-category" in x.split())
        class_type = None
        category = None
        korean_name = None
        english_name = None
        
        if category_div:
            # Find class type (Ⅰ or Ⅱ)
            span = category_div.find("span")
            if span and ("Ⅰ" in span.text.strip() or "Ⅱ" in span.text.strip()):
                if "Ⅰ" in span.text.strip():
                    class_type = "class 1"
                elif "Ⅱ" in span.text.strip():
                    class_type = "class 2"
            # Find category (last word of the div's text)
            div_text = span.get_text(separator=" ", strip=True)
            if div_text:
                words = div_text.split()
                if words:
                    category = words[-1]
            # Find Korean and English names
            p = category_div.find("p")
            if p:
                span_in_p = p.find("span")
                if span_in_p:
                    english_name = span_in_p.get_text(strip=True)
                    # Remove the span from p to get only the Korean name
                    span_in_p.extract()
                korean_name = p.get_text(strip=True)
        # Find image with id 'mainImage'
        img = soup.find("img", id="mainImage")
        image_url = None
        if img and img.has_attr("src"):
            src = img["src"]
            # Remove trailing '&downloadAt=' if present
            if src.endswith("&downloadAt="):
                src = src[:src.rfind("&downloadAt=")]
            image_url = "https://www.nie.re.kr" + src
        # Extract category hierarchy
        category_hierarchy = []
        ul = soup.find("ul", class_="category")
        if ul:
            for li in ul.find_all("li"):
                type_span = li.find("span")
                type_name = type_span.get_text(strip=True) if type_span else None
                p = li.find("p")
                korean = english = None
                pp = None
                if p:
                    parts = p.get_text(separator = '\n', strip = True).split('\n')
                    pp = parts
                    if len(parts) == 2:
                        korean = parts[0]
                        english = parts[1]
                    elif len(parts) == 1:
                        korean = parts[0]
                category_hierarchy.append({
                    "type": type_name,
                    "korean": korean,
                    "english": english,
                })
        # Extract conservation actions by institution
        conservation_actions = []
        step_div = soup.find("div", class_="step")
        if step_div:
            for p in step_div.find_all("p"):
                spans = p.find_all("span")
                if len(spans) >= 2:
                    action_type = spans[0].get_text(strip=True)
                    institution_html = spans[1].decode_contents()
                    institutions = BeautifulSoup(institution_html, "html.parser").get_text(strip=True)
                    conservation_actions.append({
                        "action_type": action_type,
                        "institutions": institutions
                    })
        # Extract conservation history from <ul class="list">
        conservation_history = []
        ul_list = soup.find("ul", class_="list")
        if ul_list:
            for li in ul_list.find_all("li"):
                text = li.get_text(strip=True)
                if text:
                    conservation_history.append(text)
        # Extract additional info from multiple <ul class="list-wrap">
        list_wrap_uls = soup.find_all("ul", class_="list-wrap")
        extra_sections = []
        for ul in list_wrap_uls:
            for li in ul.find_all("li"):
                title_p = li.find("p", class_="sub-iconTitle")
                content_p = li.find("p", class_="text")
                title = title_p.get_text(strip=True) if title_p else None
                content = content_p.get_text(strip=True) if content_p else None
                img_url = None
                if title == "분포":
                    img = li.find("img")
                    if img and img.has_attr("src"):
                        img_url = img["src"]
                        if not img_url.startswith("http"):
                            img_url = "https://www.nie.re.kr" + img_url
                if title or content:
                    section = {
                        "title": title,
                        "content": content
                    }
                    if img_url:
                        section["img_url"] = img_url
                    extra_sections.append(section)
        results.append({
            "id": entry.get("id"),
            "class_type": class_type,
            "category": category,
            "korean_name": korean_name,
            "english_name": english_name,
            "image_url": image_url,
            "category_hierarchy": category_hierarchy,
            "conservation_actions": conservation_actions,
            "conservation_history": conservation_history,
            "extra_sections": extra_sections
        })

        

    # Save extracted info
    with open("species_info.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print("Extraction complete. Results saved to species_info.json.")

def scrape_html_by_province():
    import math
    link = 'https://species.nibr.go.kr/research/getRlclsListAjax.do'
    provinces = [
        '강원도', '경기도', '경상남도', '경상북도', '광주광역시', '대구광역시', '대전광역시',
        '부산광역시', '서울특별시', '세종특별자치시', '울산광역시', '인천광역시',
        '전라남도', '전라북도', '제주특별자치도', '충청남도', '충청북도'
    ]
    all_results = []
    for province in provinces:
        print(f"Fetching species for {province}...")
        params = {
            "pageIndex": "1",
            "sch_comm_group": "",
            "sch_sido_nm": province,
            "sch_js_start": "2013-01-01",
            "sch_js_end": "2024-12-31",
            "sch_area_keyword": "",
            "sch_text": province,
            "groupNm": "",
            "page_type": "1"
        }
        response = requests.get(link, params=params)
        if response.status_code != 200:
            print(f"Failed to fetch data for {province}: {response.status_code}")
            continue

        soup = BeautifulSoup(response.text, "html.parser")
        total_span = soup.find("span", class_="fc-red fs16")
        total_count = 0
        if total_span:
            import re
            match = re.search(r"\(총\s*([\d,]+)건\)", total_span.text)
            if match:
                total_count = int(match.group(1).replace(",", ""))
        if total_count == 0:
            print(f"No species found for {province}.")
            continue

        pages = math.ceil(total_count / 5)
        print(f"{province}: {total_count} species, {pages} pages.")

        for page in range(1, pages + 1):
            params["pageIndex"] = str(page)
            resp = requests.get(link, params=params)
            if resp.status_code == 200:
                all_results.append({
                    "province": province,
                    "page": page,
                    "html": resp.text
                })
            else:
                print(f"Failed to fetch page {page} for {province}: {resp.status_code}")

    with open("province_species_list.json", "w", encoding="utf-8") as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
    print("Saved all province HTML results to province_species_list.json")
    extract_species_names_by_province()

def extract_species_names_by_province():
    import os
    from bs4 import BeautifulSoup

    if not os.path.exists("province_species_list.json"):
        print("province_species_list.json not found.")
        return

    with open("province_species_list.json", "r", encoding="utf-8") as f:
        all_results = json.load(f)

    province_species = {}

    for entry in all_results:
        province = entry["province"]
        html = entry["html"]
        soup = BeautifulSoup(html, "html.parser")
        tbody = soup.find("tbody")
        if not tbody:
            continue
        for tr in tbody.find_all("tr"):
            tds = tr.find_all("td")
            if len(tds) >= 2:
                species_name = tds[1].get_text(strip=True)
                if province not in province_species:
                    province_species[province] = []
                province_species[province].append(species_name)

    # Check for duplicates and notify if any
    has_duplicates = False
    for province, names in province_species.items():
        unique_names = list(dict.fromkeys(names))
        if len(unique_names) != len(names):
            print(f"Warning: Duplicates found in {province}")
            has_duplicates = True
        province_species[province] = unique_names

    if not has_duplicates:
        print("No duplicates found in any province.")

    with open("province_species_names.json", "w", encoding="utf-8") as f:
        json.dump(province_species, f, ensure_ascii=False, indent=2)
    print("Saved species names by province to province_species_names.json")

geojson_to_species_distribution = {
    "45111": "52111",  # 전주시 완산구 → 전라북도 전주시 완산구
    "45113": "52113",  # 전주시 덕진구 → 전라북도 전주시 덕진구
    "45130": "52130",  # 군산시 → 전라북도 군산시
    "45140": "52140",  # 익산시 → 전라북도 익산시
    "45180": "52180",  # 정읍시 → 전라북도 정읍시
    "45190": "52190",  # 남원시 → 전라북도 남원시
    "45210": "52210",  # 김제시 → 전라북도 김제시
    "45710": "52710",  # 완주군 → 전라북도 완주군
    "45720": "52720",  # 진안군 → 전라북도 진안군
    "45730": "52730",  # 무주군 → 전라북도 무주군
    "45740": "52740",  # 장수군 → 전라북도 장수군
    "45750": "52750",  # 임실군 → 전라북도 임실군
    "45770": "52770",  # 순창군 → 전라북도 순창군
    "45790": "52790",  # 고창군 → 전라북도 고창군
    "45800": "52800"   # 부안군 → 전라북도 부안군
}

def convCode(code):
    if code in geojson_to_species_distribution:
        return geojson_to_species_distribution[code]
    return code

def scrape_html_by_districts():
    link = 'https://species.nibr.go.kr/research/getRlclsListAjax.do'
    with open("./app/assets/district_codes.json", "r", encoding="utf-8") as f:
        districts = json.load(f)
    with open("./app/assets/species_distribution.json", "r", encoding="utf-8") as f:
        distribution_raw = json.load(f)
    distribution = {}
    for entry in distribution_raw:
        if 'districts_distribution' not in entry:
            continue
        for item in entry['districts_distribution']:
            distribution[item['code']] = item['total']
    tot = len(districts)
    def gangwon(text):
        if text == '강원' or text == '강원특별자치도':
            return "강원도"
        elif text =='전라북도':
            return
        return text
    all_results = []
    mismatches = []
    for i, code in enumerate(districts):
        district = districts[code]
        code_converted = convCode(code)
        print(f"Fetching species for {district}... {i+1}/{tot}")
        params = {
            "pageIndex": "1",
            "sch_comm_group": "",
            "sch_sido_nm": gangwon(district['Province']),
            "sch_js_start": "2013-01-01",
            "sch_js_end": "2024-12-31",
            "sch_area_keyword": district['SIG_KOR_NM'],
            "sch_text": f"{gangwon(district['Province'])} {district['SIG_KOR_NM']}",
            "groupNm": "",
            "page_type": "1"
        }
        response = requests.get(link, params=params)
        if response.status_code != 200:
            print(f"Failed to fetch data for {gangwon(district['Province'])} {district['SIG_KOR_NM']}: {response.status_code}")
            continue

        soup = BeautifulSoup(response.text, "html.parser")
        total_span = soup.find("span", class_="fc-red fs16")
        total_count = 0
        if total_span:
            import re
            match = re.search(r"\(총\s*([\d,]+)건\)", total_span.text)
            if match:
                total_count = int(match.group(1).replace(",", ""))
        if total_count == 0:
            print(f"No species found for {gangwon(district['Province'])} {district['SIG_KOR_NM']}.")
            try:
                if int(distribution[code_converted]) != total_count:
                    print(f"{gangwon(district['Province'])} {district['SIG_KOR_NM']} mismatch: {total_count} on webpage, {distribution[code_converted]} on json.")
                    mismatches.append(districts[code])
            except:
                print(f"{gangwon(district['Province'])} {district['SIG_KOR_NM']} not found in species_info.json")
                mismatches.append(districts[code])
            continue

        pages = math.ceil(total_count / 5)
        print(f"{gangwon(district['Province'])} {district['SIG_KOR_NM']}: {total_count} species, {pages} pages.")
        try:
            if int(distribution[code_converted]) != total_count:
                print(f"{gangwon(district['Province'])} {district['SIG_KOR_NM']} mismatch: {total_count} on webpage, {distribution[code_converted]} on json.")
                mismatches.append(districts[code])
        except:
            print(f"{gangwon(district['Province'])} {district['SIG_KOR_NM']} not found in species_info.json")
            mismatches.append(districts[code])
        for page in range(1, pages + 1):
            params["pageIndex"] = str(page)
            resp = requests.get(link, params=params)
            if resp.status_code == 200:
                all_results.append({
                    "code": code,
                    "page": page,
                    "html": resp.text
                })
            else:
                print(f"Failed to fetch page {page} for {gangwon(district['Province'])} {district['SIG_KOR_NM']}: {resp.status_code}")
    print("all mismatches: ", mismatches)
    with open("district_species_list.json", "w", encoding="utf-8") as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
    print("Saved all province HTML results to district_species_list.json")
    extract_species_names_by_district()

def extract_species_names_by_district():
    import os
    from bs4 import BeautifulSoup
    convert = {
        "Gymnadeniacucullata(L.) Rich.": "구름병아리난초",
        "Trientaliseuropaeavar.arcticaLedeb.": "기생꽃",
        "닺꽃": "참닺꽃",
        "꼬마잠자리": "한국꼬마잠자리",
        "LeontopodiumhallaisanenseHand.-Mazz.": "한라솜다리리"
    }
    def conv(text):
        if text in convert:
            return convert[text]
        return text
    if not os.path.exists("district_species_list.json"):
        print("district_species_list.json not found.")
        return

    with open("district_species_list.json", "r", encoding="utf-8") as f:
        all_results = json.load(f)
    with open("./app/assets/species_info.json", "r", encoding="utf-8") as f:
        info_raw = json.load(f)
    info = {}
    for entry in info_raw:
        info[entry['korean_name']] = entry['id']

    district_species = {}

    for entry in all_results:
        code = entry["code"]
        html = entry["html"]
        soup = BeautifulSoup(html, "html.parser")
        tbody = soup.find("tbody")
        if not tbody:
            continue
        for tr in tbody.find_all("tr"):
            tds = tr.find_all("td")
            if len(tds) >= 2:
                species_name = tds[1].get_text(strip=True)
                if code not in district_species:
                    district_species[code] = []
                district_species[code].append({"name": species_name, "id": None if conv(species_name) not in info else info[conv(species_name)]})

    # Check for duplicates and notify if any
    has_duplicates = False
    for district_code, names in district_species.items():
        unique_names = [i for n, i in enumerate(names) if i not in names[n + 1:]]
        if len(unique_names) != len(names):
            print(f"Warning: Duplicates found in district with code {district_code}")
            has_duplicates = True
        district_species[district_code] = unique_names

    if not has_duplicates:
        print("No duplicates found in any province.")

    with open("district_species_names.json", "w", encoding="utf-8") as f:
        json.dump(district_species, f, ensure_ascii=False, indent=2)
    print("Saved species names by province to district_species_names.json")

if __name__ == "__main__":
    print('Pick a type of scraping:')
    print('1. Species HTMLs')
    print('2. HTML Extraction')
    print('3. Species List By Province')
    print('4. Species List By District')
    print('5. Quit')
    choice = input('Enter your choice (1 or 2): ')
    if choice == '1':
        scrape_animal_html()
    elif choice == '2':
        res = extract_info_from_html()
    elif choice == '3':
        scrape_html_by_province()
    elif choice == '4':
        extract_species_names_by_district()
    else:
        print("Exiting the scraper.")
        exit(0)
            