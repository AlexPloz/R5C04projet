var exchangeRatesGlobal = null; // Variable globale pour stocker les taux de change

// Fonction pour charger les taux de change une seule fois
function loadExchangeRates() {
  return fetch("exchange_rates.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Impossible de charger les taux de change.");
      }
      return response.json();
    })
    .then(data => {
      exchangeRatesGlobal = data; // Stocker les données dans la variable globale
    })
    .catch(error => {
      console.error(error);
      exchangeRatesGlobal = null;
    });
}

// Appeler cette fonction au démarrage
loadExchangeRates();

// Fonction pour changer vers l'euro
function changementdevise(montant, devise) {
  if (exchangeRatesGlobal && exchangeRatesGlobal.hasOwnProperty(devise)) {
    return montant * exchangeRatesGlobal[devise];
  } else {
    throw new Error("La devise spécifiée n'est pas disponible dans les taux de change.");
  }
}

function convertToEuro(amount, currency) {
  if (currency === "NA" || !currency) {
    return null; // Retourne null pour les devises non valides ou 'NA'
  }

  let currencyCode = currency.substring(0, 3);

  if (exchangeRatesGlobal && exchangeRatesGlobal.hasOwnProperty(currencyCode)) {
    return amount * exchangeRatesGlobal[currencyCode];
  } else {
    console.error(`Devise non trouvée: ${currencyCode}`);
    throw new Error("La devise spécifiée n'est pas disponible dans les taux de change.");
  }
}



