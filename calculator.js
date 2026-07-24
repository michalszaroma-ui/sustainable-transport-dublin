// Michal - CO2 Commute Calculator
// Reads commute inputs from the DOM, validates them,
// and writes the annual CO2 saving to the page with no reload.

var emissionFactors = {car:150, bus:18, luas:9, cycling:0, dart:10}; // g CO2 per passenger-km
var modeNames = {bus:'Dublin Bus', luas:'Luas', cycling:'Cycling / Walking', dart:'DART / Rail'};
var errorEl = document.getElementById('calcError');
var resultEl = document.getElementById('calcResult');

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.add('show');
  resultEl.style.display = 'none';
}

function calculateCO2() {
  errorEl.textContent = '';
  errorEl.classList.remove('show');
  resultEl.style.display = 'none';

  var distance = parseFloat(document.getElementById('distance').value);
  var days = parseInt(document.getElementById('days').value, 10);
  var mode = document.getElementById('mode').value;

  if (isNaN(distance) || distance <= 0) {
    showError('Please enter a commute distance greater than 0 km.');
    return;
  }
  if (distance > 500) {
    showError('Please enter a realistic commute distance under 500 km.');
    return;
  }
  if (isNaN(days) || days < 1 || days > 7) {
    showError('Please enter working days between 1 and 7.');
    return;
  }
  if (!mode) {
    showError('Please select a transport mode to switch to.');
    return;
  }

  var yearlyKm = distance * 2 * days * 48;
  var carCO2 = (emissionFactors.car * yearlyKm) / 1000;
  var modeCO2 = (emissionFactors[mode] * yearlyKm) / 1000;
  var saving = carCO2 - modeCO2;
  var trees = Math.max(0, Math.round(saving / 21));

  resultEl.innerHTML = `
    <h3>Your Results</h3>
    <div class="result-row"><span>Round trip per day</span><span>${(distance*2).toFixed(1)} km</span></div>
    <div class="result-row"><span>Car emissions/year</span><span>${carCO2.toFixed(0)} kg CO₂</span></div>
    <div class="result-row"><span>${modeNames[mode]}/year</span><span>${modeCO2.toFixed(0)} kg CO₂</span></div>
    <div class="result-total">You save ${saving.toFixed(0)} kg CO₂ per year!</div>
    <div class="result-trees">That's like planting about ${trees} trees a year (${(saving/1000).toFixed(2)} tonnes)</div>
  `;
  resultEl.style.display = 'block';
}

document.getElementById('calcBtn').addEventListener('click', calculateCO2);