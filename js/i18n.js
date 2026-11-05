// Internationalization (i18n) module

let translations = {};
let fallback = {}; // English, used when a key is missing in the active language
const listeners = [];

// Whitelist of supported language codes — add new codes here when adding locale files
export const SUPPORTED_LANGUAGES = ["en", "fr", "nl", "pl", "bg", "ro", "es", "pt", "it", "cs", "ru", "hu", "el"];

// Flag (flag-icons country code) and native name for each language
export const LANGUAGE_FLAGS = { en: "gb", fr: "fr", nl: "nl", pl: "pl", bg: "bg", ro: "ro", es: "es", pt: "pt", it: "it", cs: "cz", ru: "ru", hu: "hu", el: "gr" };
export const LANGUAGE_NAMES = { en: "English", fr: "Français", nl: "Nederlands", pl: "Polski", bg: "Български", ro: "Română", es: "Español", pt: "Português", it: "Italiano", cs: "Čeština", ru: "Русский", hu: "Magyar", el: "Ελληνικά" };

function readStoredLanguage() {
  try {
    return localStorage.getItem("ui-language");
  } catch (e) {
    return null;
  }
}

// Persist language selection across page loads
export let currentLanguage = SUPPORTED_LANGUAGES.includes(readStoredLanguage()) ? readStoredLanguage() : "en";

/** Returns the translated string for the key (falls back to English, then the key itself). */
export function t(key) {
  if (translations[key] !== undefined) return translations[key];
  if (fallback[key] !== undefined) return fallback[key];
  return key;
}

/** Same as t(), but without the emoji / arrow decorations some strings carry ("🏆 Best Deal", "Go ➜"). */
export function tx(key) {
  return t(key)
    .replace(/^[\s\p{Extended_Pictographic}✓✔ⓘ️‍]+/u, "")
    .replace(/\s*[\p{Extended_Pictographic}️➔-➿]+\s*/gu, " ")
    .trim();
}

/** Splits banner_header_rest ("the banks !!! 💵 Compare … ...") into headline parts. */
export function headline() {
  const [banks, sub = ""] = t("banner_header_rest").split(/!{2,}/);
  return {
    ditch: t("ditch_word").trim(),
    banks: banks.trim(),
    sub: sub.replace(/[\p{Extended_Pictographic}️]/gu, "").replace(/\s*\.{3}\s*$/, "").trim(),
  };
}

/** Register a callback that runs after every language change. */
export function onLanguageChange(fn) {
  listeners.push(fn);
}

async function loadJson(lang) {
  const response = await fetch(`./locales/${lang}.json`);
  if (!response.ok) throw new Error(`Failed to load translations for: ${lang}`);
  return response.json();
}

/** Applies translations to every data-i18n* element in the DOM. */
function applyTranslations() {
  if (translations.page_title) document.title = translations.page_title;
  document.documentElement.lang = currentLanguage;

  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = tx(el.dataset.i18n)));
  // Sentence fragments keep their leading/trailing spaces (tx() would trim them)
  document.querySelectorAll("[data-i18n-raw]").forEach((el) => (el.textContent = t(el.dataset.i18nRaw)));
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => (el.placeholder = tx(el.dataset.i18nPlaceholder)));
  document.querySelectorAll("[data-i18n-label]").forEach((el) => el.setAttribute("aria-label", tx(el.dataset.i18nLabel)));

  listeners.forEach((fn) => fn(currentLanguage));
}

/** Switches to the given language: loads its JSON, stores the preference, re-applies translations. */
export async function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) lang = "en";
  translations = lang === "en" ? fallback : await loadJson(lang);
  currentLanguage = lang;
  try {
    localStorage.setItem("ui-language", lang);
  } catch (e) {
    /* storage unavailable: language just won't persist */
  }
  applyTranslations();
}

/** Initialises i18n using ?lang=, the stored choice, or English. Await before wiring the app. */
export async function initI18n() {
  fallback = await loadJson("en");
  const urlLang = new URLSearchParams(window.location.search).get("lang");
  if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang)) currentLanguage = urlLang;
  await setLanguage(currentLanguage);
}
