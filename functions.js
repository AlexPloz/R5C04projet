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

// Fonction modifiée pour utiliser la variable globale
function changementdevise(montant, devise) {
  if (exchangeRatesGlobal && exchangeRatesGlobal.hasOwnProperty(devise)) {
    return montant * exchangeRatesGlobal[devise];
  } else {
    throw new Error("La devise spécifiée n'est pas disponible dans les taux de change.");
  }
}