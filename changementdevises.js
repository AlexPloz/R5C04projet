// Fonction pour charger le fichier JSON des taux de change
async function loadExchangeRates() {
  try {
    const response = await fetch("exchange_rates.json"); // Charger le fichier JSON
    if (!response.ok) {
      throw new Error("Impossible de charger les taux de change.");
    }
    const data = await response.json(); // Convertir la réponse en JSON
    return data; // Retourner les taux de change
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Fonction pour convertir le montant dans une devise donnée
async function changementdevise(montant, devise) {
  const exchangeRates = await loadExchangeRates(); // Charger les taux de change

  if (exchangeRates) {
    // Vérifier si la devise spécifiée existe dans les taux de change
    if (exchangeRates.hasOwnProperty(devise)) {
      // Calculer le montant converti en utilisant le taux de change de la devise spécifiée
      let montantConverti = montant * exchangeRates[devise];
      return montantConverti;
    } else {
      return "La devise spécifiée n'est pas disponible dans les taux de change.";
    }
  } else {
    return "Erreur lors du chargement des taux de change.";
  }
}

// Exemple d'utilisation de la fonction
let montantEnUSD = 100; // Montant en USD
let deviseCible = "JPY"; // Devise cible

// Appel de la fonction pour convertir le montant en devise cible
changementdevise(montantEnUSD, deviseCible)
  .then((montantConverti) => {
    console.log(
      `Le montant de ${montantEnUSD} ${deviseCible} equivaut à environ ${montantConverti}  EUR`
    );
  })
  .catch((error) => {
    console.error(error);
  });
