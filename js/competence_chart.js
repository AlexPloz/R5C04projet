// competence_chart.js

// Variables pour stocker les données JSON et l'instance de Chart.js
var currentCompetenceData = [];
var competenceChartInstance = null;

// Fonction pour charger les données en fonction du continent sélectionné
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
    updateCompetenceChartData(); // Initial call to display data
  }).fail(function (error) {
    console.error("Error loading data: ", error);
  });
}


// Function to update the chart based on selections
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

// Fonction pour mettre à jour les sélecteurs de pays et d'années d'expérience
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
  }); // Reattach event listener

  updateYearsSlider();
}

function updateYearsSlider() {
  var countrySelect = document.getElementById("country-select");
  var yearsSlider = document.getElementById("years-slider");
  var yearsDisplay = document.getElementById("years-display");
  var country = countrySelect.value;
  
  var filteredData = country ? currentCompetenceData.filter(item => item.Country === country) : currentCompetenceData;
  var uniqueYears = filteredData.map(item => parseInt(item.YearsCodePro)).filter(y => !isNaN(y));

  yearsSlider.min = 1; // Start at 1
  yearsSlider.max = Math.max(...uniqueYears) || 1; // Use max from filtered data or default to 1
  yearsSlider.value = yearsSlider.min; // Reset the slider value
  yearsDisplay.textContent = yearsSlider.value; // Reset the display
}


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

function getCloudPlatforms(data) {
  let platforms = new Set();
  data.forEach(item => {
    if (item.PlatformHaveWorkedWith && item.PlatformHaveWorkedWith !== "NA") {
      item.PlatformHaveWorkedWith.split(';').forEach(platform => platforms.add(platform));
    }
  });
  return Array.from(platforms).sort();
}

function createCompetenceChart(data, label) {
  // Trier les données par revenu décroissant avant de les afficher
  let sortedLabels = Object.keys(data).sort((a, b) => data[b] - data[a]);
  let sortedData = sortedLabels.map(label => data[label]);

  let ctx = document.getElementById("myChart").getContext("2d");
  if (competenceChartInstance) {
    competenceChartInstance.destroy(); // Destroy the previous instance if it exists
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
      indexAxis: 'y', // Change the bar chart to horizontal
      scales: {
        x: {
          beginAtZero: true
        }
      }
    }
  });
}

function updateSliderValue(value) {
  document.getElementById("years-display").textContent = value;
  updateCompetenceChartData(); // Update the chart when the slider value changes
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




document.getElementById("continent-select").addEventListener("change", function() {
  loadCompetenceData(); // Reload data when the continent changes
});

document.addEventListener('DOMContentLoaded', (event) => {
  loadCompetenceData();
});
document.getElementById("country-select").addEventListener("change", updateCompetenceChartData);
document.getElementById("years-slider").addEventListener("input", function() {
  updateSliderValue(this.value); // Appelle la fonction qui met à jour l'affichage et le graphique
});


// Charger les données initialement pour le continent sélectionné par défaut
loadCompetenceData();
