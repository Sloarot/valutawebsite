// Internationalization (i18n) module

let translations = {};

// Whitelist of supported language codes — add new codes here when adding locale files
const SUPPORTED_LANGUAGES = [
  "en",
  "fr",
  "nl",
  "pl",
  "bg",
  "ro",
  "es",
  "pt",
  "it",
  "cs",
  "ru",
  "hu",
  "el",
];

// Persist language selection across page loads
export let currentLanguage = localStorage.getItem("ui-language") || "en";

/**
 * Returns the translated string for the given key,
 * falling back to the key itself if not found.
 */
export function t(key) {
  return translations[key] !== undefined ? translations[key] : key;
}

/**
 * Loads the JSON translation file for the given language code.
 */
async function loadTranslations(lang) {
  const response = await fetch(`./locales/${lang}.json`);
  if (!response.ok) throw new Error(`Failed to load translations for: ${lang}`);
  translations = await response.json();
}

/**
 * Applies all loaded translations to data-i18n* elements in the DOM,
 * updates the page title, and refreshes the active language button.
 */
function applyTranslations() {
  // Page title
  if (translations.page_title) {
    document.title = translations.page_title;
  }

  // Text content
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[key] !== undefined) el.textContent = translations[key];
  });

  // HTML content (for entries containing bold/italic markup)
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (translations[key] !== undefined) el.innerHTML = translations[key];
  });

  // Input / textarea placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[key] !== undefined) el.placeholder = translations[key];
  });

  // Input[type="button"] value attribute
  document.querySelectorAll("[data-i18n-value]").forEach((el) => {
    const key = el.getAttribute("data-i18n-value");
    if (translations[key] !== undefined && !el.disabled) {
      el.value = translations[key];
    }
  });

  // Currency dropdown default labels – only update when no currency is selected yet
  const sourceSpan = document.querySelector(".select-btn span");
  if (
    sourceSpan &&
    !sourceSpan.getAttribute("isocode") &&
    translations.base_currency
  ) {
    sourceSpan.textContent = translations.base_currency;
  }

  const targetSpan = document.querySelector(".select-btnTarget span");
  if (
    targetSpan &&
    !targetSpan.getAttribute("isocode") &&
    translations.target_currency
  ) {
    targetSpan.textContent = translations.target_currency;
  }

  // Re-translate live table headers if results are currently displayed
  const theadRow = document.querySelector("#resultsTable thead tr");
  if (theadRow && theadRow.children.length > 0) {
    const headerKeys = [
      "th_provider",
      "th_exchange_rate",
      "th_fees",
      "th_total_cost",
      "th_you_get",
      "th_action",
    ];
    Array.from(theadRow.children).forEach((th, i) => {
      if (headerKeys[i] && translations[headerKeys[i]]) {
        th.textContent = translations[headerKeys[i]];
      }
    });
  }

  // Update the dropdown trigger: flag + label + close the menu
  const flagMap = {
    en: "gb",
    fr: "fr",
    nl: "nl",
    pl: "pl",
    bg: "bg",
    ro: "ro",
    es: "es",
    pt: "pt",
    it: "it",
    cs: "cz",
    ru: "ru",
    hu: "hu",
    el: "gr",
  };
  const labelMap = {
    en: "EN",
    fr: "FR",
    nl: "NL",
    pl: "PL",
    bg: "BG",
    ro: "RO",
    es: "ES",
    pt: "PT",
    it: "IT",
    cs: "CS",
    ru: "RU",
    hu: "HU",
    el: "EL",
  };
  const langFlag = document.getElementById("langFlag");
  const langLabel = document.getElementById("langLabel");
  const langDropdown = document.getElementById("langDropdown");
  if (langFlag) {
    langFlag.className = `fi fi-${flagMap[currentLanguage] ?? currentLanguage}`;
  }
  if (langLabel) {
    langLabel.textContent =
      labelMap[currentLanguage] ?? currentLanguage.toUpperCase();
  }
  if (langDropdown) {
    langDropdown.classList.remove("open");
  }
}

/**
 * Switches to the given language: loads its JSON, stores the preference,
 * and re-applies all translations to the page.
 */
export async function setLanguage(lang) {
  await loadTranslations(lang);
  currentLanguage = lang;
  localStorage.setItem("ui-language", lang);
  applyTranslations();
}

/**
 * Initialises i18n on page load using the stored or default language.
 * Call and await this before wiring up the rest of the app.
 */
export async function initI18n() {
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get("lang");
  if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang)) {
    currentLanguage = urlLang;
  }
  await setLanguage(currentLanguage);
}
