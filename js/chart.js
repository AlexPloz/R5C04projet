// Variables globales pour stocker les données et les instances de graphiques
var currentData = []; // Stocke les données JSON pour les pages index et experience
var chartInstance = null; // Instance de Chart.js pour la page experience
let chartInstances = []; // Tableau pour stocker les instances des graphiques pour index.html
var page = null; // Variable pour déterminer la page actuelle
var currentCompetenceData = []; // Stocke les données JSON pour la page competence
var competenceChartInstance = null; // Instance de Chart.js pour la page competence


// FONCTIONS pour index.html :

// Calcule et renvoie les données du top OS par type de développeur
function calculateTopOsByDevType(data) {
  let devtype = {};
  data.forEach((item) => {
    let os = item["OpSysProfessionaluse"];
    let dev = item["DevType"];
    if (os) {
      let techArray = os.split(";");
      if (devtype.hasOwnProperty(dev)) {
        techArray.forEach((tech) => {
          if (devtype[dev].hasOwnProperty(tech)) {
            devtype[dev][tech] += 1;
          } else {
            devtype[dev][tech] = 1;
          }
        });
      } else {
        devtype[dev] = {};
        techArray.forEach((tech) => {
          devtype[dev][tech] = 1;
        });
      }
    }
  });
  // Trier par ordre décroissant avant le retour
  for (let dev in devtype) {
    devtype[dev] = Object.entries(devtype[dev])
      .sort((a, b) => b[1] - a[1]) // Tri décroissant basé sur la fréquence
      .reduce((sorted, [key, value]) => {
        sorted[key] = value;
        return sorted;
      }, {});
  }
  return devtype;
}

// Calcule et renvoie les données du top outils de communication par type de développeur
function calculateTopComByDevType(data) {
  let devtype = {};
  data.forEach((item) => {
    let outils = item["OfficeStackSyncHaveWorkedWith"];
    let dev = item["DevType"];
    if (outils) {
      let techArray = outils.split(";");
      if (devtype.hasOwnProperty(dev)) {
        techArray.forEach((tech) => {
          if (devtype[dev].hasOwnProperty(tech)) {
            devtype[dev][tech] += 1;
          } else {
            devtype[dev][tech] = 1;
          }
        });
      } else {
        devtype[dev] = {};
        techArray.forEach((tech) => {
          devtype[dev][tech] = 1;
        });
      }
    }
  });
  // Trier les outils de communication par ordre décroissant
  for (let dev in devtype) {
    devtype[dev] = Object.entries(devtype[dev])
      .sort((a, b) => b[1] - a[1]) // Tri décroissant basé sur la fréquence
      .reduce((sorted, [key, value]) => {
        sorted[key] = value;
        return sorted;
      }, {});
  }
  return devtype;
}

// Crée un piechart
function createPieChart(data, id, top, title) {
  let ctx = document.getElementById(id).getContext("2d");
  // Vérifie si une instance existe pour l'ID donné
  let existingChartIndex = chartInstances.findIndex((chart) => chart.id === id);
  if (existingChartIndex !== -1) {
    chartInstances[existingChartIndex].instance.destroy(); // Détruit l'instance précédente si elle existe
    chartInstances.splice(existingChartIndex, 1); // Supprime l'ancienne instance du tableau
  }
  // Crée le graphique
  let labels = Object.keys(data).slice(0, top);
  let values = Object.values(data).slice(0, top);
  let backgroundColors = labels.map((label) => {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
  });
  let newChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          label: title,
          data: values,
          backgroundColor: backgroundColors,
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  // Stocke la nouvelle instance dans le tableau
  chartInstances.push({ id: id, instance: newChartInstance });
}

// Crée un bar chart
function createBarChart(data, id, top, title) {
  let ctx = document.getElementById(id).getContext("2d");
  // Vérifie si une instance existe pour l'ID donné
  let existingChartIndex = chartInstances.findIndex((chart) => chart.id === id);
  if (existingChartIndex !== -1) {
    chartInstances[existingChartIndex].instance.destroy(); // Détruit l'instance précédente si elle existe
    chartInstances.splice(existingChartIndex, 1); // Supprime l'ancienne instance du tableau
  }
  // Crée le graphique
  let labels = Object.keys(data).slice(0, top);
  let values = Object.values(data).slice(0, top);
  let backgroundColors = labels.map((label) => {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
  });
  let newChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: title,
          data: values,
          backgroundColor: backgroundColors,
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  // Stocke la nouvelle instance dans le tableau
  chartInstances.push({ id: id, instance: newChartInstance });
}

// Met à jour les données du graphique pour index.html
function updateChartDataTech() {
  var country = document.getElementById("country-select").value;
  var devtype = document.getElementById("devtype-select").value;
  var top = document.getElementById("top-select").value;
  document.getElementById("sliderValueTop").innerHTML = top;
  let filteredData = currentData.filter((item) => {
    return (
      (!country || item["Country"] === country) &&
      (!devtype || item["DevType"] === devtype)
    );
  });
  let topComByDevType = calculateTopComByDevType(filteredData);
  let topOsByDevType = calculateTopOsByDevType(filteredData);
  if (parseInt(top) > 5) {
    createBarChart(
      topOsByDevType[devtype],
      "myChartOS",
      parseInt(top),
      "Systèmes d'exploitation les plus utilisés"
    );
    createBarChart(
      topComByDevType[devtype],
      "myChartCommunication",
      parseInt(top),
      "Outils de communication les plus utilisés"
    );
  } else {
    createPieChart(
      topOsByDevType[devtype],
      "myChartOS",
      parseInt(top),
      "Systèmes d'exploitation les plus utilisés"
    );
    createPieChart(
      topComByDevType[devtype],
      "myChartCommunication",
      parseInt(top),
      "Outils de communication les plus utilisés"
    );
  }
  topcom = document.getElementById("topcom");
  topos = document.getElementById("topos");
  topcom.innerHTML = "";
  topos.innerHTML = "";
  console.log(topComByDevType[devtype]);
  for (let i = 0; i < top; i++) {
    let toolCom = Object.entries(topComByDevType[devtype])[i];
    let toolOs = Object.entries(topOsByDevType[devtype])[i];
    if (toolCom && toolOs) {
      let [toolComName, toolComCount] = toolCom;
      let [toolOsName, toolOsCount] = toolOs;
      numb = i + 1;
      topcom.innerHTML += `<li>[${numb}] ${toolComName} (${toolComCount})</li>`;
      topos.innerHTML += `<li>[${numb}] ${toolOsName} (${toolOsCount})</li>`;
    }
  }
}

// Met à jour le sélecteur de type de développeur pour index.html
function updateDevtypeSelect(data) {
  let devtypeSelect = document.getElementById("devtype-select");
  let devtype = [...new Set(data.map((item) => item["DevType"]))].sort();
  devtypeSelect.innerHTML = devtype
    .map((devtype) => `<option value="${devtype}">${devtype}</option>`)
    .join("");
  updateChartDataTech();
}













// FONCTION pour experience.html :

// Obtient les années d'expérience professionnelle à partir des données
function getProfessionalExperience(data) {
  let experiences = data.map((item) => item["YearsCodePro"]);
  return [...new Set(experiences)].sort();
}

// Calcule le revenu moyen par années d'expérience
function calculateIncomeByExperience(data) {
  let incomes = {};
  getProfessionalExperience(data).forEach((experience) => {
    let filteredData = data
      .filter((item) => item["YearsCodePro"] === experience)
      .map((item) => {
        return convertToEuro(
          parseFloat(item["CompTotal"]) || 0,
          item["Currency"]
        );
      })
      .filter((val) => val !== null); // Filtrer les anomalies : IQR = intervalle interquartile. Les valeurs en dehors de l'intervalle [Q1 - 1.5 * IQR, Q3 + 1.5 * IQR] sont exclues.
    // Calculer l'IQR
    filteredData.sort((a, b) => a - b);
    let q1 = filteredData[Math.floor(filteredData.length / 4)];
    let q3 = filteredData[Math.floor(filteredData.length * (3 / 4))];
    let iqr = q3 - q1;
    let lowerBound = q1 - 1.5 * iqr;
    let upperBound = q3 + 1.5 * iqr;
    // Filtrer les anomalies
    let validIncomes = filteredData.filter(
      (x) => x >= lowerBound && x <= upperBound
    );

    let totalIncome = validIncomes.reduce((sum, income) => sum + income, 0);
    incomes[experience] =
      validIncomes.length > 0 ? totalIncome / validIncomes.length : 0;
  });
  return incomes;
}

// Crée un graphique en barres pour la page experience
function createChart(data) {
  let ctx = document.getElementById("myChart").getContext("2d");
  if (chartInstance) {
    chartInstance.destroy(); // Détruit l'instance précédente si elle existe
  }
  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Revenu moyen par années d'expérience",
          data: Object.values(data),
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Met à jour les données du graphique pour experience.html
function updateChartData() {
  var continent = document.getElementById("continent-select").value;
  var country = document.getElementById("country-select").value;

  let filteredData = country
    ? currentData.filter((item) => item["Country"] === country)
    : currentData;

  let incomeByExperience = calculateIncomeByExperience(filteredData);

  createChart(incomeByExperience);
}

// Met à jour le sélecteur de pays en fonction des données disponibles
// Si la page est "techno", met également à jour le sélecteur de type de développeur
function updateCountrySelect(data, defaultCountry = "France") {
  let countrySelect = document.getElementById("country-select");
  let countries = [...new Set(data.map((item) => item["Country"]))].sort();
  countrySelect.innerHTML = countries
    .map(
      (country) =>
        `<option value="${country}"${
          country === defaultCountry ? " selected" : ""
        }>${country}</option>`
    )
    .join("");

  if (page == "techno") {
    updateDevtypeSelect(data);
  } else {
    updateChartData();
  }
}

// Charge les données JSON depuis un fichier spécifique basé sur le continent sélectionné
// Une fois les données chargées, met à jour le sélecteur de pays avec un pays par défaut
function loadChartData(continent, defaultCountry) {
  let file =
    continent === "WE" ? "survey_results_WE.json" : "survey_results_NA.json";
  $.ajax({
    type: "GET",
    url: file,
    dataType: "json",
  }).done(function (jsonData) {
    currentData = jsonData;
    updateCountrySelect(jsonData, defaultCountry);
  });
}





// FONCTIONS pour competence.html :

// Charge les données en fonction du continent sélectionné pour competence.html
function loadCompetenceData() {
  var continentSelect = document.getElementById("continent-select");
  var continent = continentSelect.value;
  var file = continent === "WE" ? "survey_results_WE.json" : "survey_results_NA.json";
  $.ajax({
    type: "GET",
    url: file,
    dataType: "json"
  }).done(function (jsonData) {
    currentCompetenceData = jsonData;
    updateSelectors();
    updateCompetenceChartData();
  }).fail(function (error) {
    console.error("Error loading data: ", error);
  });
}

// Met à jour le graphique en fonction des sélections pour competence.html
function updateCompetenceChartData() {
  var country = document.getElementById("country-select").value;
  var yearsExperience = document.getElementById("years-slider").value;

  var filteredData = currentCompetenceData.filter(item => {
    return (!country || item.Country === country) &&
           (!yearsExperience || item.YearsCodePro === yearsExperience);
  });
  var incomeByPlatform = calculateIncomeByCloudPlatform(filteredData);
  createCompetenceChart(incomeByPlatform, 'Revenus moyens (en €) par plateforme de cloud');
}

// Met à jour les sélecteurs de pays et d'années d'expérience pour competence.html
function updateSelectors() {
  var countrySelect = document.getElementById("country-select");
  var yearsSlider = document.getElementById("years-slider");
  var yearsDisplay = document.getElementById("years-display");
  var uniqueCountries = [...new Set(currentCompetenceData.map(item => item.Country))].sort();
  countrySelect.innerHTML = `<option value="">-- Sélectionnez un pays --</option>` + 
                            uniqueCountries.map(country => `<option value="${country}">${country}</option>`).join('');
  countrySelect.addEventListener("change", function() {
    updateYearsSlider();
    updateCompetenceChartData();
  });
  updateYearsSlider();
}

// Met à jour le curseur des années d'expérience pour competence.html
function updateYearsSlider() {
  var countrySelect = document.getElementById("country-select");
  var yearsSlider = document.getElementById("years-slider");
  var yearsDisplay = document.getElementById("years-display");
  var country = countrySelect.value;  
  var filteredData = country ? currentCompetenceData.filter(item => item.Country === country) : currentCompetenceData;
  var uniqueYears = filteredData.map(item => parseInt(item.YearsCodePro)).filter(y => !isNaN(y));
  yearsSlider.min = 1;
  yearsSlider.max = Math.max(...uniqueYears) || 1;
  yearsSlider.value = yearsSlider.min;
  yearsDisplay.textContent = yearsSlider.value;
}

// Calcule le revenu moyen par plateforme de cloud
function calculateIncomeByCloudPlatform(data) {
  let platforms = getCloudPlatforms(data);
  let incomeByPlatform = {};
  platforms.forEach(platform => {
    let filteredData = data.filter(item => item.PlatformHaveWorkedWith && item.PlatformHaveWorkedWith.includes(platform));
    let totalIncome = filteredData.reduce((sum, item) => {
      let incomeInEuro = convertToEuro(parseFloat(item.CompTotal), item.Currency);
      return sum + (incomeInEuro || 0);
    }, 0);
    incomeByPlatform[platform] = totalIncome / filteredData.length || 0;
  });

  return incomeByPlatform;
}

// Obtient la liste des plateformes de cloud à partir des données
function getCloudPlatforms(data) {
  let platforms = new Set();
  data.forEach(item => {
    if (item.PlatformHaveWorkedWith && item.PlatformHaveWorkedWith !== "NA") {
      item.PlatformHaveWorkedWith.split(';').forEach(platform => platforms.add(platform));
    }
  });
  return Array.from(platforms).sort();
}

// Crée un bar chart pour la page competence
function createCompetenceChart(data, label) {
  // Trier les données par revenu décroissant avant de les afficher
  let sortedLabels = Object.keys(data).sort((a, b) => data[b] - data[a]);
  let sortedData = sortedLabels.map(label => data[label]);
  let ctx = document.getElementById("myChart").getContext("2d");
  if (competenceChartInstance) {
    competenceChartInstance.destroy();
  }
  competenceChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: sortedLabels,
      datasets: [{
        label: label,
        data: sortedData,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true
        }
      }
    }
  });
}

// Met à jour la valeur affichée du curseur pour competence.html
function updateSliderValue(value) {
  document.getElementById("years-display").textContent = value;
  updateCompetenceChartData();
}

function getCloudPlatforms(data) {
  let platforms = new Set();
  data.forEach(item => {
    if (item.PlatformHaveWorkedWith && item.PlatformHaveWorkedWith !== "NA") {
      item.PlatformHaveWorkedWith.split(';').forEach(platform => platforms.add(platform));
    }
  });
  return Array.from(platforms).sort();
}





// FONCTIONS COMMUNES a experience.html et competence.html

// Initialise la page appropriée (experience.html ou competence.html)
function initializePage() {
  if (page === "experience") {
    // Configuration pour experience.html
    document.getElementById("continent-select").addEventListener("change", function () {
      loadChartData(this.value);
    });

    // Charger les données initiales pour l'Europe
    loadChartData("WE", "France");
  } else if (page === "competence") {
    // Configuration pour competence.html
    document.getElementById("continent-select").addEventListener("change", function() {
      loadCompetenceData();
    });

    document.addEventListener('DOMContentLoaded', (event) => {
      loadCompetenceData();
    });

    document.getElementById("country-select").addEventListener("change", updateCompetenceChartData);
    document.getElementById("years-slider").addEventListener("input", function() {
      updateSliderValue(this.value);
    });

    // Charger competence.html
    loadCompetenceData();
  }
}