var currentData = []; // Stocker les données JSON actuelles
var chartInstance = null; // Instance de Chart.js
var page = null; // Page actuelle

function getProfessionalExperience(data) {
  let experiences = data.map((item) => item["YearsCodePro"]);
  return [...new Set(experiences)].sort();
}

function calculateIncomeByExperience(data) {
  let incomes = {};
  getProfessionalExperience(data).forEach((experience) => {
    let filteredData = data.filter(
      (item) => item["YearsCodePro"] === experience
    );
    let totalIncome = filteredData.reduce(
      (sum, item) => sum + (parseFloat(item["CompTotal"]) || 0),
      0
    );
    incomes[experience] = totalIncome / filteredData.length || 0;
  });
  return incomes;
}

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

let chartInstances = []; // Tableau pour stocker les instances des graphiques

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

function updateChartData() {
  var continent = document.getElementById("continent-select").value;
  var country = document.getElementById("country-select").value;

  let filteredData = country
    ? currentData.filter((item) => item["Country"] === country)
    : currentData;

  let incomeByExperience = calculateIncomeByExperience(filteredData);

  createChart(incomeByExperience);
}

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

function updateCountrySelect(data) {
  let countrySelect = document.getElementById("country-select");
  let countries = [...new Set(data.map((item) => item["Country"]))].sort();
  countrySelect.innerHTML += `<option value="">-- Sélectionnez un pays --</option>`;
  countrySelect.innerHTML += countries
    .map((country) => `<option value="${country}"$>${country}</option>`)
    .join("");

  if (page == "techno") {
    updateDevtypeSelect(data);
  } else {
    updateChartData();
  }
}

function updateDevtypeSelect(data) {
  let devtypeSelect = document.getElementById("devtype-select");
  let devtype = [...new Set(data.map((item) => item["DevType"]))].sort();
  devtypeSelect.innerHTML = devtype
    .map((devtype) => `<option value="${devtype}">${devtype}</option>`)
    .join("");

  updateChartDataTech();
}

function loadChartData(continent) {
  let file = continent === "WE" ? dataWE : dataNA;
  $.ajax({
    type: "GET",
    url: file,
    dataType: "json",
  }).done(function (jsonData) {
    currentData = jsonData;
    updateCountrySelect(jsonData); // Passer le pays par défaut
  });
}

function calculateIncomeByExperience(data) {
  let incomes = {};
  getProfessionalExperience(data).forEach((experience) => {
    let filteredData = data.filter(
      (item) => item["YearsCodePro"] === experience
    );
    let totalIncome = filteredData.reduce(
      (sum, item) => sum + (parseFloat(item["CompTotal"]) || 0),
      0
    );
    incomes[experience] = totalIncome / filteredData.length || 0;
  });
  return incomes;
}

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

document
  .getElementById("continent-select")
  .addEventListener("change", function () {
    loadChartData(this.value);
  });

// Charger les données initiales pour l'Europe
loadChartData("WE", "France");
