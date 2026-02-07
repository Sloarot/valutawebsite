// API calls, caching, and provider data management
import { escapeHtml } from "./utils.js";

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

// Click tracking for provider links with affiliate attribution
export function trackProviderClick(
  providerName,
  providerId,
  sourceCurrency,
  targetCurrency,
  amount,
) {
  const timestamp = new Date().toISOString();
  const clickData = {
    provider: providerName,
    providerId: providerId,
    currencies: `${sourceCurrency} → ${targetCurrency}`,
    amount: amount,
    timestamp: timestamp,
    affiliateTracking: true,
    url: getProviderUrl(
      { id: providerId, name: providerName },
      sourceCurrency,
      targetCurrency,
      amount,
    ),
  };

  // Store last clicked provider
  localStorage.setItem("lastClickedProvider", providerName);
  localStorage.setItem("lastClickTime", timestamp);

  // Get click history
  let clickHistory = JSON.parse(
    localStorage.getItem("providerClickHistory") || "[]",
  );
  clickHistory.push(clickData);

  // Keep only last 50 clicks to avoid storage issues
  if (clickHistory.length > 50) {
    clickHistory = clickHistory.slice(-50);
  }

  localStorage.setItem("providerClickHistory", JSON.stringify(clickHistory));

  // Count clicks per provider
  let providerCounts = JSON.parse(
    localStorage.getItem("providerClickCounts") || "{}",
  );
  providerCounts[providerName] = (providerCounts[providerName] || 0) + 1;
  localStorage.setItem("providerClickCounts", JSON.stringify(providerCounts));

  // Calculate potential affiliate revenue tracking (for analytics)
  let affiliateClicks = parseInt(
    localStorage.getItem("totalAffiliateClicks") || "0",
  );
  affiliateClicks++;
  localStorage.setItem("totalAffiliateClicks", affiliateClicks.toString());

  // Log for analytics (could be sent to your analytics service)
  console.log("🎯 Affiliate Click Tracked:", clickData);
  console.log(
    "📊 Total clicks for",
    providerName + ":",
    providerCounts[providerName],
  );
  console.log("💰 Total affiliate clicks:", affiliateClicks);
}

// Function to calculate Revolut rates based on Wise mid-market rate
export function calculateRevolutRate(
  sourceCurrency,
  targetCurrency,
  amount,
  wiseMidMarketRate,
) {
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

// Affiliate Configuration - Update these with your actual affiliate IDs
const AFFILIATE_CONFIG = {
  wise: "ref=yoursite123",
  paypal: "partner_id=YOUR_PAYPAL_ID",
  moneygram: "affiliate=YOUR_MG_ID",
  revolut: "referral=YOUR_REVOLUT_CODE",
  westernunion: "affid=YOUR_WU_ID",
  xoom: "partner=YOUR_XOOM_ID",
  // Add more as you get affiliate partnerships
};

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

// Get provider URL based on provider info with affiliate tracking
export function getProviderUrl(
  provider,
  sourceCurrency,
  targetCurrency,
  amount,
) {
  const baseUrls = {
    39: buildWiseAffiliateLink(sourceCurrency, targetCurrency, amount), // Wise dynamic affiliate link with tracking
    6: `https://www.paypal.com/myaccount/transfer/fx/calculator?from=${sourceCurrency}&to=${targetCurrency}&amount=${amount}`, // PayPal
    23: `https://www.moneygram.com/mgo/us/en/send?amount=${amount}&sourceCurrency=${sourceCurrency}&destinationCurrency=${targetCurrency}`, // MoneyGram
    44: `https://www.revolut.com/send-money/?from=${sourceCurrency}&to=${targetCurrency}&amount=${amount}`, // Revolut
    22: `https://www.westernunion.com/us/en/web/send-money?amount=${amount}`, // Western Union
    121: `https://www.paysera.com/v2/en/payment/currency-conversion`, // Paysera
    127: `https://www.payoneer.com/solutions/cross-border-payments/`, // Payoneer
    41: `https://www.xoom.com/send-money?amount=${amount}`, // Xoom
    104: `https://www.remitly.com/us/en`, // Remitly
  };

  let url = baseUrls[provider.id] || provider.website || "#";

  // FOR WISE: Return the affiliate link directly without any modifications
  if (provider.id === 39) {
    return url;
  }

  // For OTHER providers: Add affiliate parameters
  const affiliateMap = {
    6: AFFILIATE_CONFIG.paypal,
    23: AFFILIATE_CONFIG.moneygram,
    44: AFFILIATE_CONFIG.revolut,
    22: AFFILIATE_CONFIG.westernunion,
    41: AFFILIATE_CONFIG.xoom,
  };

  if (affiliateMap[provider.id] && url !== "#") {
    const separator = url.includes("?") ? "&" : "?";
    url += separator + affiliateMap[provider.id];
  }

  // Add UTM parameters for tracking (only for non-Wise providers)
  const utmParams = `utm_source=currencycomparison&utm_medium=affiliate&utm_campaign=comparison_tool`;
  const separator = url.includes("?") ? "&" : "?";
  if (url !== "#") {
    url += separator + utmParams;
  }

  return url;
}

export function updateLastUpdatedDisplay(timestamp) {
  const lastUpdated = document.getElementById("lastUpdated");
  if (lastUpdated) {
    const date = new Date(timestamp);
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    lastUpdated.textContent = `Last updated: ${timeStr}`;
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

  // Debug: Log full Wise provider data to see all available fields
  const wiseProviderData = data.providers?.find((p) => p.id === 39);
  if (wiseProviderData) {
    console.log(
      "🔍 Full Wise Provider Object:",
      JSON.stringify(wiseProviderData, null, 2),
    );
  }

  return data;
}

// Display results in table
export function displayResults(data, amount, timestamp) {
  const searchResults = document.getElementById("searchResults");
  const button = document.querySelector(".button-9");

  const providers = data.providers;
  const filterbyID = [
    39, // Wise
    6, // PayPal
    23, // MoneyGram
    22, // Western Union
    121, // Paysera
    127, // Payoneer
  ]; // Note: 44 (Revolut) is added manually with estimated rates
  const filteredProviders = providers.filter((provider) =>
    filterbyID.includes(provider.id),
  );

  // Get Wise mid-market rate to calculate Revolut's rate
  const wiseProvider = providers.find((p) => p.id === 39);
  if (wiseProvider && wiseProvider.quotes && wiseProvider.quotes[0]) {
    const wiseMidMarketRate = wiseProvider.quotes[0].rate;
    const revolutRate = calculateRevolutRate(
      data.sourceCurrency,
      data.targetCurrency,
      amount,
      wiseMidMarketRate,
    );

    // Create manual Revolut provider object
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
      isEstimated: true, // Flag to show asterisk
      isWeekend: revolutRate.isWeekend,
    };

    // Add Revolut to the filtered providers
    filteredProviders.push(revolutProvider);
  }

  // Sort all providers (including Revolut) by best rate
  filteredProviders.sort(
    (a, b) => b.quotes[0].receivedAmount - a.quotes[0].receivedAmount,
  );
  searchResults.innerHTML = "";

  // Update last updated timestamp
  updateLastUpdatedDisplay(timestamp);

  // header part
  const resultsTable = document.getElementById("resultsTable");
  resultsTable.style.width = "100%";
  const thead = document.querySelector("#resultsTable thead");
  // Clear the current content in thead
  thead.innerHTML = "";
  // Create the header row
  const headerRow = document.createElement("tr");
  const headers = [
    "Provider",
    "Exchange rate",
    "Fees",
    "Total Cost",
    "You Get",
    "Action",
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
    noResultsCell.innerHTML =
      "😕 No results found for this currency pair. Please try different currencies.";
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
    logoImg.src = provider.logo;
    logoImg.alt = escapeHtml(provider.name);
    logoCell.appendChild(logoImg);

    // Add info icon for estimated rates (positioned at top of logo)
    if (provider.isEstimated) {
      const infoIconSpan = document.createElement("span");
      infoIconSpan.className = "info-icon";
      infoIconSpan.innerHTML = "ⓘ"; // Info icon in circle
      infoIconSpan.onclick = window.showRevolutInfo;
      infoIconSpan.style.position = "absolute";
      infoIconSpan.style.top = "35%";
      infoIconSpan.style.transform = "translateY(-50%)";
      infoIconSpan.style.left = "calc(75% + 2px)"; // Position right next to logo
      infoIconSpan.style.fontSize = "2rem";
      infoIconSpan.style.color = "#555"; // Dark grey color
      logoCell.appendChild(infoIconSpan);
    }

    const rateCell = document.createElement("td");
    rateCell.textContent = provider.quotes[0].rate.toLocaleString("de-DE", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    });

    const feeCell = document.createElement("td");
    if (fee === 0) {
      feeCell.innerHTML =
        '<span style="color: green; font-weight: bold;">FREE</span>';
    } else {
      feeCell.textContent = `${fee.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${data.sourceCurrency}`;
    }

    const totalCostCell = document.createElement("td");
    totalCostCell.textContent = `${totalCost.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${data.sourceCurrency}`;
    totalCostCell.style.fontWeight = "bold";

    const amountCell = document.createElement("td");
    amountCell.innerHTML = `
      <div class="amount-display">
        <span class="received-amount">${receivedAmount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${data.targetCurrency}</span>
        <span class="effective-rate">Effective: ${effectiveRate.toLocaleString("de-DE", { minimumFractionDigits: 4, maximumFractionDigits: 6 })}</span>
      </div>
    `;
    amountCell.style.color = "#2a9d4e";
    amountCell.style.fontWeight = "bold";

    // Add styling for top 3 deals (border highlight only, no font size change)
    if (rowIndex === 1) {
      dataRow.classList.add("best-deal-row");
    }

    const linkCell = document.createElement("td");

    // Replace "Go" button with badges for top 3 deals - but make them clickable links
    if (rowIndex === 1) {
      const bestDealLink = document.createElement("a");
      bestDealLink.href = getProviderUrl(
        provider,
        data.sourceCurrency,
        data.targetCurrency,
        amount,
      );
      bestDealLink.className = "best-deal-link";
      bestDealLink.innerHTML = "🏆 Best Deal";
      bestDealLink.target = "_blank";
      bestDealLink.rel = "noopener noreferrer";

      // Add click tracking
      bestDealLink.addEventListener("click", () => {
        trackProviderClick(
          provider.name,
          provider.id,
          data.sourceCurrency,
          data.targetCurrency,
          amount,
        );
      });

      linkCell.appendChild(bestDealLink);
    } else if (rowIndex === 2) {
      const greatDealLink = document.createElement("a");
      greatDealLink.href = getProviderUrl(
        provider,
        data.sourceCurrency,
        data.targetCurrency,
        amount,
      );
      greatDealLink.className = "great-deal-link";
      greatDealLink.innerHTML = "GREAT DEAL";
      greatDealLink.target = "_blank";
      greatDealLink.rel = "noopener noreferrer";

      // Add click tracking
      greatDealLink.addEventListener("click", () => {
        trackProviderClick(
          provider.name,
          provider.id,
          data.sourceCurrency,
          data.targetCurrency,
          amount,
        );
      });

      linkCell.appendChild(greatDealLink);
    } else if (rowIndex === 3) {
      const goodDealLink = document.createElement("a");
      goodDealLink.href = getProviderUrl(
        provider,
        data.sourceCurrency,
        data.targetCurrency,
        amount,
      );
      goodDealLink.className = "good-deal-link";
      goodDealLink.innerHTML = "GOOD DEAL";
      goodDealLink.target = "_blank";
      goodDealLink.rel = "noopener noreferrer";

      // Add click tracking
      goodDealLink.addEventListener("click", () => {
        trackProviderClick(
          provider.name,
          provider.id,
          data.sourceCurrency,
          data.targetCurrency,
          amount,
        );
      });

      linkCell.appendChild(goodDealLink);
    } else {
      const link = document.createElement("a");
      link.href = getProviderUrl(
        provider,
        data.sourceCurrency,
        data.targetCurrency,
        amount,
      );
      link.className = "glow-button";
      link.textContent = "Go ➜";
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      // Add click tracking
      link.addEventListener("click", () => {
        trackProviderClick(
          provider.name,
          provider.id,
          data.sourceCurrency,
          data.targetCurrency,
          amount,
        );
      });

      linkCell.appendChild(link);
    }

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
  button.value = "Compare rates";
}

// Optional: Function to view analytics (can be called from console or a button)
export function viewClickAnalytics() {
  const history = JSON.parse(
    localStorage.getItem("providerClickHistory") || "[]",
  );
  const counts = JSON.parse(
    localStorage.getItem("providerClickCounts") || "{}",
  );
  const lastClicked = localStorage.getItem("lastClickedProvider");
  const lastTime = localStorage.getItem("lastClickTime");
  const totalAffiliateClicks = parseInt(
    localStorage.getItem("totalAffiliateClicks") || "0",
  );

  console.log("💰 AFFILIATE CLICK ANALYTICS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎯 Total Affiliate Clicks:", totalAffiliateClicks);
  console.log("📈 Click Counts by Provider:");
  console.table(counts);
  console.log("\n🕐 Last Clicked:", lastClicked, "at", lastTime);
  console.log("\n📝 Recent Click History (last 10):");
  console.table(history.slice(-10));
  console.log(
    "\n💡 Note: All clicks include UTM tracking and affiliate parameters",
  );
  console.log("💡 To clear analytics: localStorage.clear()");

  return { counts, history, lastClicked, lastTime, totalAffiliateClicks };
}
