// API calls, caching, and provider data management
import { escapeHtml } from "./utils.js";
import { t } from "./i18n.js";

// Cache management functions
export function getCachedData(sourceCurrency, targetCurrency, amount) {
  const cacheKey = `wise_${sourceCurrency}_${targetCurrency}_${amount}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    const data = JSON.parse(cached);
    const cacheAge = Date.now() - data.timestamp;
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (cacheAge < fiveMinutes) {
      return data;
    } else {
      // Cache expired, remove it
      localStorage.removeItem(cacheKey);
    }
  }
  return null;
}

export function setCachedData(sourceCurrency, targetCurrency, amount, result) {
  const cacheKey = `wise_${sourceCurrency}_${targetCurrency}_${amount}`;
  const data = {
    result: result,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (e) {
    // Storage full, clear old cache entries
    if (e.name === "QuotaExceededError") {
      clearOldCache();
    }
  }
}

export function clearOldCache() {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith("wise_")) {
      localStorage.removeItem(key);
    }
  });
}

// Function to calculate Revolut rates based on Wise mid-market rate
export function calculateRevolutRate(amount, wiseMidMarketRate) {
  const now = new Date();
  const isWeekend = [0, 6].includes(now.getDay()); // 0 = Sunday, 6 = Saturday

  // Revolut pricing structure
  // Standard account: 0.5% markup on weekends, free up to limits on weekdays
  // Premium/Metal: Better rates (for simplicity, showing Standard rates)
  const weekendMarkup = 0.01; // 1% markup on weekends
  const markup = isWeekend ? weekendMarkup : 0;

  // Calculate effective rate after markup
  const effectiveRate = wiseMidMarketRate * (1 - markup);
  const receivedAmount = amount * effectiveRate;
  const fee = 0; // Revolut doesn't show explicit transfer fees

  return {
    rate: effectiveRate,
    fee: fee,
    receivedAmount: receivedAmount,
    isWeekend: isWeekend,
  };
}

// Build Wise affiliate link with deeplink for dynamic currency and amount
function buildWiseAffiliateLink(sourceCurrency, targetCurrency, amount) {
  // The actual Wise page you want to send users to
  const wiseDestination = `https://wise.com/send?sourceCurrency=${sourceCurrency}&targetCurrency=${targetCurrency}&sourceAmount=${amount}`;

  // Your FULL Partnerize affiliate link
  const affiliateBase = "https://wise.prf.hn/click/camref:1101l3RA2L";

  // Encode the destination URL for the deeplink parameter
  const encodedDestination = encodeURIComponent(wiseDestination);

  // Add pubref to track that this came from your comparison tool
  const pubref = `comparison-${sourceCurrency}-${targetCurrency}-${amount}`;

  // Build complete affiliate link with pubref and deeplink
  return `${affiliateBase}/pubref:${pubref}/destination:${encodedDestination}`;
}

// Get provider URL – uses hardcoded deep-links where available,
// then falls back to the API-supplied website URL for any provider not listed.
export function getProviderUrl(
  provider,
  sourceCurrency,
  targetCurrency,
  amount,
) {
  // Wise uses a custom Partnerize affiliate deep-link with pubref tracking
  if (provider.id === 39) {
    return buildWiseAffiliateLink(sourceCurrency, targetCurrency, amount);
  }

  // Deep-link overrides for known providers.
  // Any provider not listed here will use provider.website from the API response.
  const deepLinks = {
    6: "https://www.paypal.com/",
    22: `https://www.westernunion.com/us/en/web/send-money?amount=${amount}`,
    23: `https://www.moneygram.com/mgo/us/en/send?amount=${amount}&sourceCurrency=${sourceCurrency}&destinationCurrency=${targetCurrency}`,
    41: `https://www.xoom.com/send-money?amount=${amount}`,
    44: "https://www.revolut.com/",
    104: "https://www.remitly.com/gb/en/",
    121: "https://www.paysera.com/v2/en/payment/currency-conversion",
    // 127 = Skrill (confirmed by API response; Payoneer falls back to provider.website)
    127: "https://www.skrill.com/en/",
  };

  return deepLinks[provider.id] ?? provider.website ?? "#";
}

export function updateLastUpdatedDisplay(timestamp) {
  const lastUpdated = document.getElementById("lastUpdated");
  if (lastUpdated) {
    const date = new Date(timestamp);
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    lastUpdated.textContent = `${t("last_updated")} ${timeStr}`;
    lastUpdated.style.display = "block";
  }
}

// Fetch exchange rates from API
export async function fetchExchangeRates(
  sourceCurrency,
  targetCurrency,
  amount,
) {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: {
      Accept: "application/json",
    },
  };

  const response = await fetch(
    `https://api.transferwise.com/v3/comparisons/?sourceCurrency=${sourceCurrency}&targetCurrency=${targetCurrency}&sendAmount=${amount}`,
    requestOptions,
  );

  const data = await response.json();

  return data;
}

// Local logo overrides – used when the API returns a broken/relative logo URL
const LOCAL_LOGO_OVERRIDES = {
  23: "img/moneygram_logo.png", // MoneyGram
};

// Display results in table
export function displayResults(data, amount, timestamp) {
  const searchResults = document.getElementById("searchResults");
  const button = document.querySelector(".button-9");

  const providers = data.providers;
  const filterbyID = [
    39, // Wise
    6, // PayPal
    22, // Western Union
    23, // MoneyGram
    41, // Xoom
    104, // Remitly
    121, // Paysera
    127, // Payoneer
    // Verify IDs below against a live API response:
    // console.log(data.providers.map(p => ({ id: p.id, name: p.name })))
    161, // WorldRemit  (verify ID)
    140, // OFX         (verify ID)
    45, // Skrill      (verify ID)
    253, // Airwallex   (verify ID)
  ]; // Revolut (44) is appended last with an estimated rate
  const filteredProviders = providers.filter((provider) =>
    filterbyID.includes(provider.id),
  );

  // Sort real API providers by best received amount first
  filteredProviders.sort(
    (a, b) => b.quotes[0].receivedAmount - a.quotes[0].receivedAmount,
  );

  // Append Revolut last – its rate is estimated, not sourced from the API
  const wiseProvider = providers.find((p) => p.id === 39);
  if (wiseProvider?.quotes?.[0]) {
    const wiseMidMarketRate = wiseProvider.quotes[0].rate;
    const revolutRate = calculateRevolutRate(amount, wiseMidMarketRate);
    const revolutProvider = {
      id: 44,
      name: "Revolut",
      logo: "img/revolut_logo.png",
      website: `https://www.revolut.com/send-money/?from=${data.sourceCurrency}&to=${data.targetCurrency}&amount=${amount}`,
      quotes: [
        {
          rate: revolutRate.rate,
          fee: revolutRate.fee,
          receivedAmount: revolutRate.receivedAmount,
        },
      ],
      isEstimated: true,
      isWeekend: revolutRate.isWeekend,
    };
    filteredProviders.push(revolutProvider);
  }
  searchResults.innerHTML = "";

  // Update last updated timestamp
  updateLastUpdatedDisplay(timestamp);

  // header part
  const thead = document.querySelector("#resultsTable thead");
  // Clear the current content in thead
  thead.innerHTML = "";
  // Create the header row
  const headerRow = document.createElement("tr");
  const headers = [
    t("th_provider"),
    t("th_exchange_rate"),
    t("th_fees"),
    t("th_total_cost"),
    t("th_you_get"),
    t("th_action"),
  ];
  headers.forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  // Append the header row to the thead
  thead.appendChild(headerRow);

  // Show ranking explanation
  const rankingExplanation = document.querySelector(".ranking-explanation");
  if (rankingExplanation) {
    rankingExplanation.style.display = "block";
  }

  // Check if there are no results
  if (filteredProviders.length === 0) {
    const noResultsRow = document.createElement("tr");
    const noResultsCell = document.createElement("td");
    noResultsCell.setAttribute("colspan", "6");
    noResultsCell.style.textAlign = "center";
    noResultsCell.style.padding = "40px 20px";
    noResultsCell.style.color = "#667eea";
    noResultsCell.style.fontSize = "1.1em";
    noResultsCell.textContent = t("no_results");
    noResultsRow.appendChild(noResultsCell);
    searchResults.appendChild(noResultsRow);

    // Restore button state
    button.disabled = false;
    button.value = "Compare rates";
    return;
  }

  // body part
  let rowIndex = 0;
  for (const provider of filteredProviders) {
    rowIndex++;
    // Create table row with data
    const dataRow = document.createElement("tr");
    if (provider.isEstimated) dataRow.classList.add("estimated-row");

    // Calculate total cost
    const fee = provider.quotes[0].fee;
    const totalCost = amount + fee;
    const receivedAmount = provider.quotes[0].receivedAmount;

    // Calculate effective rate (what really matters)
    const effectiveRate = receivedAmount / totalCost;

    // Safely create table cells with escaped content
    const logoCell = document.createElement("td");
    logoCell.style.position = "relative"; // For absolute positioning of info icon
    const logoImg = document.createElement("img");
    logoImg.src = LOCAL_LOGO_OVERRIDES[provider.id] ?? provider.logo;
    logoImg.alt = escapeHtml(provider.name);
    // Fallback: show provider name as text if the image fails to load
    logoImg.onerror = function () {
      this.style.display = "none";
      const nameSpan = document.createElement("span");
      nameSpan.textContent = provider.name;
      nameSpan.style.fontWeight = "bold";
      logoCell.appendChild(nameSpan);
    };
    logoCell.appendChild(logoImg);

    // Add info icon for estimated rates (positioned at top of logo)
    if (provider.isEstimated) {
      const infoIconSpan = document.createElement("span");
      infoIconSpan.className = "info-icon";
      infoIconSpan.innerHTML = "ⓘ"; // Info icon in circle
      infoIconSpan.onclick = window.showRevolutInfo;
      logoCell.appendChild(infoIconSpan);
    }

    const rateCell = document.createElement("td");
    const rateStr = provider.quotes[0].rate.toLocaleString("de-DE", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    });
    rateCell.textContent = provider.isEstimated ? `~${rateStr}` : rateStr;

    const feeCell = document.createElement("td");
    if (fee === 0) {
      feeCell.innerHTML = `<span style="color: green; font-weight: bold;">${t("fee_free")}</span>`;
    } else {
      feeCell.textContent = `${fee.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${data.sourceCurrency}`;
    }

    const totalCostCell = document.createElement("td");
    totalCostCell.textContent = `${totalCost.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${data.sourceCurrency}`;
    totalCostCell.style.fontWeight = "bold";

    const amountCell = document.createElement("td");
    const amtPrefix = provider.isEstimated ? "~" : "";
    amountCell.innerHTML = `
      <div class="amount-display">
        <span class="received-amount">${amtPrefix}${receivedAmount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${data.targetCurrency}</span>
        <span class="effective-rate">${t("effective_rate")} ${amtPrefix}${effectiveRate.toLocaleString("de-DE", { minimumFractionDigits: 4, maximumFractionDigits: 6 })}</span>
        ${provider.isEstimated ? `<span class="estimated-notice">${t("estimated_disclaimer")}</span>` : ""}
      </div>
    `;
    amountCell.style.color = "#2a9d4e";
    amountCell.style.fontWeight = "bold";

    // Add styling for top 3 deals (border highlight only, no font size change)
    if (rowIndex === 1 && !provider.isEstimated) {
      dataRow.classList.add("best-deal-row");
    }

    const linkCell = document.createElement("td");

    // Ranked badges for top 3 real API results; estimated providers always get plain glow-button
    const badgeMap = {
      1: ["best-deal-link", t("best_deal")],
      2: ["great-deal-link", t("great_deal")],
      3: ["good-deal-link", t("good_deal")],
    };
    const badge = !provider.isEstimated && badgeMap[rowIndex];
    const link = document.createElement("a");
    link.href = getProviderUrl(
      provider,
      data.sourceCurrency,
      data.targetCurrency,
      amount,
    );
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    if (badge) {
      link.className = badge[0];
      link.innerHTML = badge[1];
    } else {
      link.className = "glow-button";
      link.textContent = t("go_btn");
    }
    linkCell.appendChild(link);

    dataRow.appendChild(logoCell);
    dataRow.appendChild(rateCell);
    dataRow.appendChild(feeCell);
    dataRow.appendChild(totalCostCell);
    dataRow.appendChild(amountCell);
    dataRow.appendChild(linkCell);

    // Append the table to searchResults div
    searchResults.appendChild(dataRow);
  }

  // Restore button state
  button.disabled = false;
  button.value = t("compare_btn");
}
