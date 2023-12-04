import json
import os

# Define the paths to the JSON files
path_to_we_json = 'C:\\wamp64\\www\\R5C04projet\\survey_results_WE.json'
path_to_na_json = 'C:\\wamp64\\www\\R5C04projet\\survey_results_NA.json'

output_file_path = 'C:\\wamp64\\www\\R5C04projet\\unique_currencies.txt'

# Function to load JSON data from a file
def load_json_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# Function to extract unique currencies
def extract_unique_currencies(data):
    return set(item['Currency'] for item in data if 'Currency' in item)

# Load the data from JSON files
data_we = load_json_data(path_to_we_json)
data_na = load_json_data(path_to_na_json)

# Combine the data from both files
combined_data = data_we + data_na

# Extract unique currencies
unique_currencies = extract_unique_currencies(combined_data)

# Write the unique currencies to a text file
with open(output_file_path, 'w', encoding='utf-8') as f:
    for currency in sorted(unique_currencies):
        f.write(currency + '\n')

print(f"Unique currencies have been written to {output_file_path}")
