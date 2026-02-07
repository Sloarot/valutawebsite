// Main application entry point
import {
  initializeSourceCurrencyDropdown,
  initializeTargetCurrencyDropdown,
} from "./js/search.js";
import {
  getCachedData,
  setCachedData,
  fetchExchangeRates,
  displayResults,
} from "./js/api.js";
import {
  initializeSlidingBanner,
  showRevolutInfo,
  closeRevolutInfo,
  setupModalClickHandler,
} from "./js/utils.js";

// Main initialization
document.addEventListener("DOMContentLoaded", function () {
  // Initialize sliding banner
  initializeSlidingBanner();

  // Initialize currency dropdowns
  initializeSourceCurrencyDropdown();
  initializeTargetCurrencyDropdown();

  // Setup modal click handlers
  setupModalClickHandler();

  // Make Revolut info functions available globally
  window.showRevolutInfo = showRevolutInfo;
  window.closeRevolutInfo = closeRevolutInfo;
});

// Main fetch function
async function fetchWise() {
  // Validation part: check if amount was entered
  const quantity = document.getElementById("quantity").value;
  const notice = document.getElementById("notice");
  const noticeCurrency = document.getElementById("noticeCurrency");
  const button = document.querySelector(".button-9");
  const searchResults = document.getElementById("searchResults");

  if (!quantity) {
    // Prevent form submission
    notice.style.display = "block";
    // Show the notice
    return;
  } else {
    notice.style.display = "none";
  }

  // Below the variables which client provides
  let amountstring = document.getElementById("quantity").value;
  let amount = parseFloat(amountstring);

  // Validate amount is a positive number
  if (isNaN(amount) || amount <= 0) {
    notice.textContent = "Please enter a valid positive number!";
    notice.style.display = "block";
    return;
  }

  let sourceCurrency = document
    .querySelector(".select-btn span")
    .getAttribute("isocode");
  let targetCurrency = document
    .querySelector(".select-btnTarget span")
    .getAttribute("isocode");

  // Validation 2: Check if there's something wrong with currency input
  if (!sourceCurrency || !targetCurrency) {
    noticeCurrency.textContent = "Please select both currencies!";
    noticeCurrency.style.display = "block";
    return;
  } else if (sourceCurrency == targetCurrency) {
    noticeCurrency.textContent =
      "Source and target currencies cannot be the same!";
    noticeCurrency.style.display = "block";
    return;
  } else {
    noticeCurrency.style.display = "none";
  }

  // Check cache first
  const cachedData = getCachedData(sourceCurrency, targetCurrency, amount);

  let data;
  let timestamp;

  if (cachedData) {
    // Use cached data
    data = cachedData.result;
    timestamp = cachedData.timestamp;
    button.disabled = true;
    button.value = "Using cached data...";
  } else {
    // Show loading state
    button.disabled = true;
    button.value = "Loading...";
    searchResults.innerHTML =
      '<tr><td colspan="6" style="text-align: center; padding: 20px;"><div class="spinner"></div><p style="margin-top: 15px; color: #667eea; font-weight: 500;">Fetching best rates...</p></td></tr>';

    try {
      data = await fetchExchangeRates(sourceCurrency, targetCurrency, amount);
      timestamp = Date.now();

      // Cache the response
      setCachedData(sourceCurrency, targetCurrency, amount, data);
    } catch (error) {
      console.error("Error:", error);
      searchResults.innerHTML =
        '<tr><td colspan="5" style="text-align: center; padding: 20px; color: red;">Error fetching rates. Please try again later.</td></tr>';
      button.disabled = false;
      button.value = "Compare rates";
      return;
    }
  }

  // Display the results
  displayResults(data, amount, timestamp);
}

// Make fetchWise available globally for onclick handler
window.fetchWise = fetchWise;
