// Main application entry point
import { createCurrencyPicker } from "./js/search.js";
import { getCachedData, setCachedData, fetchExchangeRates, buildResults } from "./js/api.js";
import { renderEmpty, renderLoading, renderError, renderResults } from "./js/render.js";
import { showRevolutInfo, setupModalClickHandler, initLanguageMenu } from "./js/utils.js";
import { initI18n, onLanguageChange, headline, tx } from "./js/i18n.js";

// Minimum milliseconds required between API requests
const FETCH_COOLDOWN_MS = 3000;
const MAX_AMOUNT = 1_000_000;

let lastFetchTime = 0;
let lastResult = null;
let sourcePicker;
let targetPicker;

const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", async () => {
  // Build language-dependent widgets first so the first translation pass reaches them
  initLanguageMenu($("lang"));
  sourcePicker = createCurrencyPicker($("sourcePicker"), { id: "sourceCurrency", value: "EUR", labelKey: "base_currency", onChange: hideNotices });
  targetPicker = createCurrencyPicker($("targetPicker"), { id: "targetCurrency", value: "USD", labelKey: "target_currency", onChange: hideNotices });
  setupModalClickHandler();

  onLanguageChange(() => {
    const h = headline();
    $("heroDitch").textContent = h.ditch;
    $("heroBanks").textContent = h.banks;
    $("heroSub").textContent = h.sub;
    if (!$("compareBtn").disabled) $("compareBtn").textContent = tx("compare_btn");
    if (lastResult) renderResults(lastResult, showRevolutInfo);
    else if (!$("results").querySelector(".spinner")) renderEmpty();
  });

  // Load translations (also triggers the language-change callbacks above)
  await initI18n();

  $("swapBtn").addEventListener("click", () => {
    const from = sourcePicker.value;
    sourcePicker.set(targetPicker.value);
    targetPicker.set(from);
    hideNotices();
  });
  $("compareBtn").addEventListener("click", compare);
  $("quantity").addEventListener("keydown", (e) => {
    if (e.key === "Enter") compare();
  });
  $("quantity").addEventListener("input", hideNotices);
});

function hideNotices() {
  $("notice").hidden = true;
}

function showNotice(key) {
  $("notice").textContent = tx(key);
  $("notice").hidden = false;
}

function setBusy(busy, labelKey = "loading") {
  const button = $("compareBtn");
  button.disabled = busy;
  button.setAttribute("aria-busy", String(busy));
  button.textContent = tx(busy ? labelKey : "compare_btn");
}

// Main compare flow
async function compare() {
  // Rate limiting: ignore rapid repeated clicks
  const now = Date.now();
  if (now - lastFetchTime < FETCH_COOLDOWN_MS) return;

  // Validation: amount (accepts "1000", "1 000", "1000,50")
  const raw = $("quantity").value.trim().replace(/\s/g, "").replace(",", ".");
  if (!raw) return showNotice("notice_amount");
  const amount = parseFloat(raw);
  if (isNaN(amount) || amount <= 0) return showNotice("invalid_amount");
  if (amount > MAX_AMOUNT) return showNotice("amount_too_large");

  // Validation: currencies
  const sourceCurrency = sourcePicker.value;
  const targetCurrency = targetPicker.value;
  if (!sourceCurrency || !targetCurrency) return showNotice("select_both_currencies");
  if (sourceCurrency === targetCurrency) return showNotice("same_currency");
  hideNotices();

  lastFetchTime = now;

  // Check cache first
  const cached = getCachedData(sourceCurrency, targetCurrency, amount);
  let data;
  let timestamp;
  let source;

  if (cached) {
    data = cached.result;
    timestamp = cached.timestamp;
    source = "cache";
  } else {
    setBusy(true, "loading");
    renderLoading();
    try {
      data = await fetchExchangeRates(sourceCurrency, targetCurrency, amount);
      timestamp = Date.now();
      source = "live";
      setCachedData(sourceCurrency, targetCurrency, amount, data);
    } catch (error) {
      console.error("Error:", error);
      lastResult = null;
      renderError();
      setBusy(false);
      return;
    }
  }

  lastResult = {
    rows: buildResults(data, amount),
    source,
    timestamp,
    sourceCurrency: data.sourceCurrency || sourceCurrency,
    targetCurrency: data.targetCurrency || targetCurrency,
    amount,
  };
  renderResults(lastResult, showRevolutInfo);
  setBusy(false);
}
