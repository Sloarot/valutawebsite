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
import { initI18n, setLanguage, t } from "./js/i18n.js";

// Main initialization
document.addEventListener("DOMContentLoaded", async function () {
  // Load translations first so the page renders in the right language
  await initI18n();

  // Initialize sliding banner
  initializeSlidingBanner();

  // Initialize currency dropdowns
  initializeSourceCurrencyDropdown();
  initializeTargetCurrencyDropdown();

  // Setup modal click handlers
  setupModalClickHandler();

  // Make Revolut info functions available globally (used by api.js)
  window.showRevolutInfo = showRevolutInfo;
  window.closeRevolutInfo = closeRevolutInfo;

  // Language switcher button
  document.getElementById("langSelected").addEventListener("click", () => {
    document.getElementById("langDropdown").classList.toggle("open");
  });

  // Language menu items (event delegation via data-lang attribute)
  document.getElementById("langMenu").addEventListener("click", async (e) => {
    const li = e.target.closest("[data-lang]");
    if (li) await setLanguage(li.getAttribute("data-lang"));
  });

  // Compare button
  document.querySelector(".button-9").addEventListener("click", fetchWise);

  // Tooltip close button
  document.querySelector(".tooltip-close").addEventListener("click", closeRevolutInfo);

  // Close language dropdown when clicking outside
  document.addEventListener("click", (e) => {
    const dropdown = document.getElementById("langDropdown");
    if (dropdown && !dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
    }
  });
});

// Minimum milliseconds required between API requests
const FETCH_COOLDOWN_MS = 3000;
let lastFetchTime = 0;

// Main fetch function
async function fetchWise() {
  // Rate limiting: ignore rapid repeated clicks
  const now = Date.now();
  if (now - lastFetchTime < FETCH_COOLDOWN_MS) return;
  lastFetchTime = now;

  // Validation part: check if amount was entered
  const quantity = document.getElementById("quantity").value;
  const notice = document.getElementById("notice");
  const noticeCurrency = document.getElementById("noticeCurrency");
  const button = document.querySelector(".button-9");
  const searchResults = document.getElementById("searchResults");

  if (!quantity) {
    // Prevent form submission
    notice.style.display = "block";
    // Show the notice (text is already set via data-i18n in HTML)
    return;
  } else {
    notice.style.display = "none";
  }

  // Below the variables which client provides
  let amountstring = document.getElementById("quantity").value;
  let amount = parseFloat(amountstring);

  // Validate amount is a positive number and within a reasonable range
  if (isNaN(amount) || amount <= 0) {
    notice.textContent = t("invalid_amount");
    notice.style.display = "block";
    return;
  }
  if (amount > 1_000_000) {
    notice.textContent =
      t("amount_too_large") || "Amount exceeds maximum allowed (1,000,000).";
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
    noticeCurrency.textContent = t("select_both_currencies");
    noticeCurrency.style.display = "block";
    return;
  } else if (sourceCurrency == targetCurrency) {
    noticeCurrency.textContent = t("same_currency");
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
    button.value = t("using_cache");
  } else {
    // Show loading state
    button.disabled = true;
    button.value = t("loading");
    searchResults.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px;"><div class="spinner"></div><p style="margin-top: 15px; color: #667eea; font-weight: 500;">${t("fetching_rates")}</p></td></tr>`;

    try {
      data = await fetchExchangeRates(sourceCurrency, targetCurrency, amount);
      timestamp = Date.now();

      // Cache the response
      setCachedData(sourceCurrency, targetCurrency, amount, data);
    } catch (error) {
      console.error("Error:", error);
      searchResults.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: red;">${t("error_fetching")}</td></tr>`;
      button.disabled = false;
      button.value = t("compare_btn");
      return;
    }
  }

  // Display the results
  displayResults(data, amount, timestamp);
}

// Make fetchWise available globally for onclick handler
window.fetchWise = fetchWise;
