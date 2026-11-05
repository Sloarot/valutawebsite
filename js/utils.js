// Utility functions: escaping, Revolut info modal, language menu
import { tx, setLanguage, onLanguageChange, currentLanguage, SUPPORTED_LANGUAGES, LANGUAGE_FLAGS, LANGUAGE_NAMES } from "./i18n.js";

// Escape text for safe use in HTML content AND attribute values (prevents XSS)
export function escapeHtml(unsafe) {
  return String(unsafe ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

/* ---------- Revolut info modal ---------- */

function revolutContent() {
  return `
    <h3 id="revolutTitle">${tx("revolut_title")}</h3>
    <p><strong>${tx("revolut_estimate")}</strong></p>
    <ul class="rv-checks">
      <li>${tx("revolut_bullet1")}</li><li>${tx("revolut_bullet2")}</li><li>${tx("revolut_bullet3")}</li>
    </ul>
    <p><strong>${tx("revolut_varies")}</strong></p>
    <dl class="rv-vary">
      ${[1, 2, 3, 4].map((i) => `<div><dt>${tx(`revolut_vary${i}_label`)}</dt><dd>${tx(`revolut_vary${i}_text`)}</dd></div>`).join("")}
    </dl>
    <p class="rv-note">${tx("revolut_note")}</p>`;
}

let lastFocus = null;

export function showRevolutInfo(event) {
  event?.stopPropagation();
  const modal = document.getElementById("revolutTooltip");
  if (!modal) return;
  lastFocus = document.activeElement;
  modal.querySelector("[data-rv-body]").innerHTML = revolutContent();
  modal.hidden = false;
  modal.querySelector("[data-rv-close]").focus();
}

export function closeRevolutInfo() {
  const modal = document.getElementById("revolutTooltip");
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  lastFocus?.focus?.();
}

// Close on backdrop click, close button, or Escape; re-translate when language changes
export function setupModalClickHandler() {
  const modal = document.getElementById("revolutTooltip");
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-rv-close]")) closeRevolutInfo();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeRevolutInfo();
  });
  onLanguageChange(() => {
    if (!modal.hidden) modal.querySelector("[data-rv-body]").innerHTML = revolutContent();
  });
}

/* ---------- Language menu ---------- */

export function initLanguageMenu(host) {
  host.classList.add("fxl");
  host.innerHTML = `
    <button type="button" class="fxl-btn" id="langSelected" aria-haspopup="true" aria-expanded="false">
      <span class="fi fis" id="langFlag"></span><span id="langLabel"></span>
      <svg viewBox="0 0 12 8" width="10" height="7" aria-hidden="true"><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>
    <ul class="fxl-list" id="langMenu" hidden>
      ${SUPPORTED_LANGUAGES.map((l) => `<li><button type="button" data-lang="${l}"><span class="fi fis fi-${LANGUAGE_FLAGS[l]}"></span><b>${l.toUpperCase()}</b><span>${LANGUAGE_NAMES[l]}</span></button></li>`).join("")}
    </ul>`;

  const btn = host.querySelector(".fxl-btn");
  const list = host.querySelector(".fxl-list");
  const setOpen = (open) => {
    list.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
  };

  function paint() {
    host.querySelector("#langFlag").className = `fi fis fi-${LANGUAGE_FLAGS[currentLanguage]}`;
    host.querySelector("#langLabel").textContent = currentLanguage.toUpperCase();
    list.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-current", String(b.dataset.lang === currentLanguage)));
  }

  btn.addEventListener("click", () => setOpen(list.hidden));
  list.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-lang]");
    if (!b) return;
    setOpen(false);
    await setLanguage(b.dataset.lang);
  });
  document.addEventListener("click", (e) => {
    if (!host.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  onLanguageChange(paint);
  paint();
}
