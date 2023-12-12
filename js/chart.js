
var currentData = []; // Stocker les données JSON actuelles
var chartInstance = null; // Instance de Chart.js

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

function updateCountrySelect(data) {
  let countrySelect = document.getElementById("country-select");
  let countries = [
    ...new Set(data.map((item) => item["Country"])),
  ].sort();
  countrySelect.innerHTML = countries
    .map((country) => `<option value="${country}">${country}</option>`)
    .join("");
  updateChartData(); // Mettre à jour le graphique après avoir sélectionné les pays
}

function loadChartData(continent) {
  let file =
    continent === "WE"
      ? "survey_results_WE.json"
      : "survey_results_NA.json";
  $.ajax({
    type: "GET",
    url: file,
    dataType: "json",
  }).done(function (jsonData) {
    currentData = jsonData;
    updateCountrySelect(jsonData); // Mettre à jour les options de sélection du pays
  });
}

document
  .getElementById("continent-select")
  .addEventListener("change", function () {
    loadChartData(this.value);
  });

// Charger les données initiales pour l'Europe
loadChartData("WE");
