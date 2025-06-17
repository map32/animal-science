import json
from bs4 import BeautifulSoup

def html_tables_to_json(html_content):
    """
    Converts HTML tables into a JSON object, where each table is a separate object.

    Args:
        html_content (str): The HTML content containing the tables.

    Returns:
        str: A JSON string representing the data from the tables.
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    all_tables_data = []

    tables = soup.find_all('table')

    for table_index, table in enumerate(tables):
        table_data = {}
        headers = []
        # Try to find a meaningful name for the table.
        # This is a heuristic and might need adjustment based on your HTML structure.
        # For example, if a table is preceded by an <h3> tag with the province name.
        # If no clear title is found, we'll use a generic name like "Table 1".
        table_name = f"Table {table_index + 1}"
        prev_sibling = table.find_previous_sibling()
        if prev_sibling and prev_sibling.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            table_name = prev_sibling.get_text(strip=True)
        elif table.caption:
            table_name = table.caption.get_text(strip=True)

        rows = table.find_all('tr')

        # Get headers from the first row (assuming it's a header row)
        if rows:
            header_row = rows[0]
            headers = [th.get_text(strip=True) for th in header_row.find_all('th')]
            # If no th found, try td in the first row
            if not headers:
                headers = [td.get_text(strip=True) for td in header_row.find_all('td')]

        # Process data rows
        table_rows_data = []
        # Start from the second row if headers were found in the first, otherwise from the first row
        start_row_index = 1 if headers else 0

        for row in rows[start_row_index:]:
            cells = [cell.get_text(strip=True) for cell in row.find_all(['td', 'th'])]
            row_data = {}
            if headers:
                for i, header in enumerate(headers):
                    if i < len(cells):
                        row_data[header] = cells[i]
            else:
                # If no headers, use generic column names
                for i, cell_value in enumerate(cells):
                    row_data[f"Column {i+1}"] = cell_value
            if row_data: # Only add if row_data is not empty
                table_rows_data.append(row_data)

        table_data[table_name] = table_rows_data
        all_tables_data.append(table_data)

    return json.dumps(all_tables_data, indent=4, ensure_ascii=False)

# Read the HTML content from the uploaded file
try:
    with open('test.html', 'r', encoding='utf-8') as f:
        html_content = f.read()
except FileNotFoundError:
    print("Error: test.html not found. Please make sure the file is in the same directory.")
    html_content = "" # Set empty to avoid further errors

if html_content:
    json_output = html_tables_to_json(html_content)

    # Save the JSON output to a file
    output_filename = 'tables_output.json'
    with open(output_filename, 'w', encoding='utf-8') as f:
        f.write(json_output)

    print(f"Successfully converted HTML tables to JSON and saved to '{output_filename}'")
    print("\nJSON Output Sample:")
    print(json_output[:1000]) # Print first 1000 characters of the JSON output