#scraper for extracting code name pairs for crops in 농사로
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
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


if __name__ == "__main__":
    print('Pick a type of scraping:')
    print('1. Species HTMLs')
    print('2. HTML Extraction')
    print('3. Quit')
    choice = input('Enter your choice (1 or 2): ')
    if choice == '1':
        scrape_animal_html()
    elif choice == '2':
        res = extract_info_from_html()
    else:
        print("Exiting the scraper.")
        exit(0)
            