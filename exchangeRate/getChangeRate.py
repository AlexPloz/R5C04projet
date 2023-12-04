import requests

# Votre clé API
api_key = '9f34809d774769928e6c51c6'

# Lire le fichier unique_currencies.txt et récupérer les codes de devise
with open('C:\\wamp64\\www\\R5C04projet\\unique_currencies.txt', 'r') as file:
    currencies = [line.split()[0] for line in file.readlines() if line.strip()]

# Récupérer les taux de change pour chaque devise
exchange_rates = {}
for currency_code in currencies:
    if currency_code != 'NA':  # Exclure les entrées non valides
        response = requests.get(f'https://v6.exchangerate-api.com/v6/{api_key}/latest/{currency_code}')
        if response.status_code == 200:
            exchange_rates[currency_code] = response.json().get('conversion_rates', {}).get('EUR')

# Écrire les taux de change dans un nouveau fichier texte
output_path = 'C:\\wamp64\\www\\R5C04projet\\exchange_rates.txt'
with open(output_path, 'w') as file:
    for currency_code, rate in exchange_rates.items():
        file.write(f'{currency_code}: {rate}\n')

print(f'Exchange rates have been written to {output_path}')
