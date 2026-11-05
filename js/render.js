// Renders the results column: empty state, loading, error, summary + provider cards
import { tx, currentLanguage } from "./i18n.js";
import { escapeHtml } from "./utils.js";

const fmt = (n, min = 2, max = min) =>
  Number(n).toLocaleString("de-DE", { minimumFractionDigits: min, maximumFractionDigits: max });

const timeStr = (ts) => new Date(ts).toLocaleTimeString(currentLanguage, { hour: "2-digit", minute: "2-digit" });

const el = () => document.getElementById("results");

export function renderEmpty() {
  el().innerHTML = `
    <div class="state state-empty">
      <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true"><rect x="3" y="9" width="26" height="26" rx="8" fill="currentColor" opacity=".18"/><rect x="15" y="9" width="26" height="26" rx="8" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>
      <p>${tx("empty_state")}</p>
    </div>`;
}

export function renderLoading() {
  const box = el();
  if (box.querySelector(".summary")) {
    box.classList.add("is-loading"); // keep old results visible but dimmed
    return;
  }
  box.innerHTML = `<div class="state"><div class="spinner" aria-hidden="true"></div><p>${tx("fetching_rates")}</p></div>`;
}

export function renderError() {
  el().classList.remove("is-loading");
  el().innerHTML = `<div class="state state-error"><p>${tx("error_fetching")}</p></div>`;
}

/**
 * result = { rows, source: 'live'|'cache', timestamp, sourceCurrency, targetCurrency, amount }
 * onInfo = callback for the Revolut info button
 */
export function renderResults(result, onInfo) {
  const box = el();
  box.classList.remove("is-loading");
  const { rows, sourceCurrency: s, targetCurrency: tg, amount } = result;

  if (!rows.length) {
    box.innerHTML = `<div class="state"><p>${tx("no_results")}</p></div>`;
    return;
  }

  const real = rows.filter((r) => !r.isEstimated);
  const best = real[0] || rows[0];
  const worst = real[real.length - 1] || best;
  const deltas = rows.map((r) => best.received - r.received);
  const maxDelta = Math.max(...deltas.map(Math.abs)) || 1;
  const sourceKey = result.source === "cache" ? "source_cache" : "source_live";

  let html = `
    <section class="summary">
      <div>
        <div class="lab">${tx("th_you_get")} · ${escapeHtml(best.name)}</div>
        <div class="big num">${fmt(best.received)} <small>${tg}</small></div>
        <div class="sum-line">${fmt(amount)} ${s} → ${tg} · ${tx("effective_rate")} <b class="num">${fmt(best.effective, 4, 6)}</b></div>
      </div>
      ${real.length > 1 ? `<div class="sum-save"><div class="lab">${escapeHtml(worst.name)} ${tx("vs_best")}</div><div class="num">+${fmt(best.received - worst.received)} ${tg}</div></div>` : ""}
      <div class="meta-line">
        <span><span class="live-dot${result.source === "cache" ? " is-cached" : ""}"></span>${tx(sourceKey)}</span>
        <span id="lastUpdated">${tx("last_updated")} ${timeStr(result.timestamp)}</span>
        <span>${rows.length} ${tx("providers").toLowerCase()}</span>
      </div>
    </section>`;

  html += rows
    .map((r, i) => {
      const pre = r.isEstimated ? "~" : "";
      const d = deltas[i];
      const isBestValue = Math.abs(d) < 0.005;
      const gain = d < -0.004;
      const deltaText = isBestValue ? tx(r.badge || "best_deal") : `${gain ? "+" : "−"}${fmt(Math.abs(d))} ${tg} ${tx("vs_best")}`;
      const chip = r.badge
        ? `<span class="chip chip-${r.rank}">${tx(r.badge)}</span>`
        : r.isEstimated
          ? `<span class="chip chip-est">${tx("estimated")}</span>`
          : "";
      const name = escapeHtml(r.name);
      const fee = r.fee === 0 ? `<b class="free">${tx("fee_free")}</b>` : `<b>${fmt(r.fee)} ${s}</b>`;

      return `
      <article class="card${r.rank === 1 ? " is-best" : ""}${r.isEstimated ? " is-estimated" : ""}">
        <span class="logo" data-initials="${escapeHtml(r.name.slice(0, 2))}">${r.logo ? `<img src="${escapeHtml(r.logo)}" alt="${name}">` : `<b>${escapeHtml(r.name.slice(0, 2))}</b>`}</span>
        <div class="name">${name}${chip}${r.isEstimated ? `<button type="button" class="info" data-info aria-label="${escapeHtml(tx("revolut_title"))}">i</button>` : ""}</div>
        <div class="get num">${pre}${fmt(r.received)} <small>${tg}</small></div>
        <div class="bar-row">
          <span class="bar${gain ? " is-gain" : ""}"><i data-width="${Math.min(100, (Math.abs(d) / maxDelta) * 100).toFixed(1)}"></i></span>
          <span class="delta${isBestValue ? " is-zero" : gain ? " is-gain" : ""}">${deltaText}</span>
        </div>
        <div class="act">
          <a class="cta" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">${tx("go_btn")}<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12L12 4M6 4h6v6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></a>
        </div>
        <div class="details num">
          <span>${tx("th_exchange_rate")} <b>${pre}${fmt(r.rate, 4, 6)}</b></span>
          <span>${tx("th_fees")} ${fee}</span>
          <span>${tx("th_total_cost")} <b>${fmt(r.totalCost)} ${s}</b></span>
          <span>${tx("effective_rate")} <b>${pre}${fmt(r.effective, 4, 6)}</b></span>
        </div>
        ${r.isEstimated ? `<div class="est-note">${tx("estimated_disclaimer")}</div>` : ""}
      </article>`;
    })
    .join("");

  box.innerHTML = html;

  // CSP blocks inline style attributes, so bar widths are set through the CSSOM
  box.querySelectorAll(".bar i[data-width]").forEach((bar) => (bar.style.width = bar.dataset.width + "%"));

  // Fallback: show initials if a logo fails to load (no inline onerror under CSP)
  box.querySelectorAll(".logo img").forEach((img) =>
    img.addEventListener("error", () => {
      const b = document.createElement("b");
      b.textContent = img.parentElement.dataset.initials;
      img.replaceWith(b);
    }),
  );

  box.querySelectorAll("[data-info]").forEach((btn) => btn.addEventListener("click", onInfo));
}
