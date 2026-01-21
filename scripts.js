const wrapper = document.querySelector(".wrapper");
selectBtn = wrapper.querySelector(".select-btn");
searchInp = wrapper.querySelector("input");
options = wrapper.querySelector(".options");
const button9 = document.querySelector(".button-9");

/* let countries = ["Euro", "GBP - British Pound", "USD - US Dollar","BRL - Brazilian Real", "COP - Colombian Peso", "Portugal"]; */

let currencies = [
  ["EUR - Euro", "eu", "EUR"],
  ["GBP - United Kingdom", "gb", "GBP"],
  ["USD - United States", "us", "USD"],
  ["BRL - Brazilian Real", "br", "BRL"],
  ["JPY - Japanese Yen", "jp", "JPY"],
  ["BGN - Bulgarian Lev", "bg", "BGN"],
  ["HUF - Hungarian Forint", "hu", "HUF"],
  ["NOK - Norwegian Krone", "no", "NOK"],
  ["CAD - Canadian Dollar", "ca", "CAD"],
  ["AUD - Australian Dollar", "au", "AUD"],
  ["NZD - New Zealand Dollar", "nz", "NZD"],
  ["CHF - Swiss Franc", "ch", "CHF"],
  ["SEK - Swedish Krona", "se", "SEK"],
  ["DKK - Danish Krone", "dk", "DKK"],
  ["PLN - Polish Zloty", "pl", "PLN"],
  ["CZK - Czech Koruna", "cz", "CZK"],
  ["RON - Romanian Leu", "ro", "RON"],
  ["TRY - Turkish Lira", "tr", "TRY"],
  ["INR - Indian Rupee", "in", "INR"],
  ["MXN - Mexican Peso", "mx", "MXN"],
  ["ZAR - South African Rand", "za", "ZAR"],
  ["SGD - Singapore Dollar", "sg", "SGD"],
  ["HKD - Hong Kong Dollar", "hk", "HKD"],
  ["KRW - South Korean Won", "kr", "KRW"],
  ["THB - Thai Baht", "th", "THB"],
  ["MYR - Malaysian Ringgit", "my", "MYR"],
  ["PHP - Philippine Peso", "ph", "PHP"],
  ["IDR - Indonesian Rupiah", "id", "IDR"],
  ["CNY - Chinese Yuan", "cn", "CNY"],
  ["AED - UAE Dirham", "ae", "AED"],
  ["ILS - Israeli Shekel", "il", "ILS"],
  ["RUB - Russian Ruble", "ru", "RUB"],
  ["ARS - Argentine Peso", "ar", "ARS"],
  ["CLP - Chilean Peso", "cl", "CLP"],
  ["COP - Colombian Peso", "co", "COP"],
];

function addCountry(selectedCountry) {
  options.innerHTML = "";

  currencies.forEach((country) => {
    let isSelected = country == selectedCountry ? "selected" : "";
    let li = `<li onclick="updateName(this)" isocode=${country[2]} class="${isSelected}">${country[0]}<span class="fi fi-${country[1]}"></span></li>`;
    options.insertAdjacentHTML("beforeend", li);
  });
}
addCountry();

function updateName(selectedLi) {
  searchInp.value = "";
  let Isocode = selectedLi.attributes.isocode.value;

  addCountry(selectedLi.innerText);
  wrapper.classList.remove("active");
  button9.classList.remove("upupup");
  selectBtn.firstElementChild.setAttribute("ISOcode", Isocode);
  selectBtn.firstElementChild.innerText = selectedLi.innerText;
}

searchInp.addEventListener("keyup", () => {
  let arr = [];
  //filter down full array to array with just the names like 'BRL Brazilian Real'
  let filteredArray = currencies.map((currencySubarray) => currencySubarray[0]);
  let ISOArray = currencies.map((ISOsubarray) => ISOsubarray[2]);
  //the value of the search field
  let searchedVal = searchInp.value.toLowerCase();

  //the filtered down array first gets checked if theres values that start with the typed in value and put in array.
  // then the map function puts them in a new arr with the li tags
  arr = currencies
    .filter((currency) => {
      return currency[0].toLowerCase().startsWith(searchedVal);
    })
    .map(
      (currency) =>
        `<li onclick="updateName(this)" isocode="${currency[2]}">${currency[0]}<span class="fi fi-${currency[1]}"></span></li>`,
    )
    .join("");

  options.innerHTML = arr ? arr : `<p>Oops, currency not found</p>`;
});

selectBtn.addEventListener("click", () => {
  wrapper.classList.toggle("active");
  button9.classList.toggle("upupup");
});

// second Target list
const wrapperTarget = document.querySelector(".wrapperTarget");
selectBtnTarget = wrapperTarget.querySelector(".select-btnTarget");
searchInpTarget = wrapperTarget.querySelector("input");
optionsTarget = wrapperTarget.querySelector(".optionsTarget");
const buttonTarget = document.querySelector(".button-9");

function addCountry2(selectedCountry) {
  optionsTarget.innerHTML = "";

  currencies.forEach((country) => {
    let isSelected = country == selectedCountry ? "selected" : "";
    let li = `<li onclick="updateName2(this)" isocode=${country[2]} class="${isSelected}">${country[0]}<span class="fi fi-${country[1]}"></span></li>`;
    optionsTarget.insertAdjacentHTML("beforeend", li);
  });
}
addCountry2();

function updateName2(selectedLi) {
  searchInpTarget.value = "";
  let Isocode = selectedLi.attributes.isocode.value;

  addCountry2(selectedLi.innerText);
  wrapperTarget.classList.remove("active");
  buttonTarget.classList.remove("hide");
  selectBtnTarget.firstElementChild.setAttribute("ISOcode", Isocode);
  selectBtnTarget.firstElementChild.innerText = selectedLi.innerText;
}

searchInpTarget.addEventListener("keyup", () => {
  let arr = [];
  //filter down full array to array with just the names like 'BRL Brazilian Real'
  let filteredArray = currencies.map((currencySubarray) => currencySubarray[0]);
  let ISOArray = currencies.map((ISOsubarray) => ISOsubarray[2]);
  //the value of the search field
  let searchedVal = searchInpTarget.value.toLowerCase();

  //the filtered down array first gets checked if theres values that start with the typed in value and put in array.
  // then the map function puts them in a new arr with the li tags
  arr = currencies
    .filter((currency) => {
      return currency[0].toLowerCase().startsWith(searchedVal);
    })
    .map(
      (currency) =>
        `<li onclick="updateName2(this)" isocode="${currency[2]}">${currency[0]}<span class="fi fi-${currency[1]}"></span></li>`,
    )
    .join("");

  optionsTarget.innerHTML = arr ? arr : `<p>Oops, currency not found</p>`;
});

selectBtnTarget.addEventListener("click", () => {
  wrapperTarget.classList.toggle("active");
  buttonTarget.classList.toggle("hide");
});

function EuropeanFormat(number) {
  return number.toLocaleString("de-DE");
} // 'de-DE' for German locale }

// Helper function to safely escape HTML and prevent XSS
function escapeHtml(unsafe) {
  const div = document.createElement("div");
  div.textContent = unsafe;
  return div.innerHTML;
}

// Cache management functions
function getCachedData(sourceCurrency, targetCurrency, amount) {
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

function setCachedData(sourceCurrency, targetCurrency, amount, result) {
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

function clearOldCache() {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith("wise_")) {
      localStorage.removeItem(key);
    }
  });
}

// Click tracking for provider links with affiliate attribution
function trackProviderClick(
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
function calculateRevolutRate(
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

// Get provider URL based on provider info with affiliate tracking
function getProviderUrl(provider, sourceCurrency, targetCurrency, amount) {
  const baseUrls = {
    39: `https://wise.com/send?sourceCurrency=${sourceCurrency}&targetCurrency=${targetCurrency}&sourceAmount=${amount}`, // Wise
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

  // Add affiliate parameters based on provider
  const affiliateMap = {
    39: AFFILIATE_CONFIG.wise,
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

  // Add UTM parameters for tracking
  const utmParams = `utm_source=currencycomparison&utm_medium=affiliate&utm_campaign=comparison_tool`;
  const separator = url.includes("?") ? "&" : "?";
  if (url !== "#") {
    url += separator + utmParams;
  }

  return url;
}

function updateLastUpdatedDisplay(timestamp) {
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

async function fetchWise() {
  //first the validation part: 1/check if an mount was entered.
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

  // Below the variables wich clients provides
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

  // validation 2 Check if there's something wrong with currency input
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

    // prepare the API call
    var requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: {
        Accept: "application/json",
      },
    };
    try {
      const response = await fetch(
        `https://api.transferwise.com/v3/comparisons/?sourceCurrency=${sourceCurrency}&targetCurrency=${targetCurrency}&sendAmount=${amount}`,
        requestOptions,
      );
      data = await response.json();
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
  // Process the data (whether cached or fresh)
  const providers = data.providers;
  const filterbyID = [39, 6, 23, 22, 121, 127]; // Removed 44 (Revolut) - adding manually
  const filteredProviders = providers.filter((provider) =>
    filterbyID.includes(provider.id),
  );

  // Get Wise mid-market rate to calculate Revolut's rate
  const wiseProvider = providers.find((p) => p.id === 39);
  if (wiseProvider && wiseProvider.quotes && wiseProvider.quotes[0]) {
    const wiseMidMarketRate = wiseProvider.quotes[0].rate;
    const revolutRate = calculateRevolutRate(
      sourceCurrency,
      targetCurrency,
      amount,
      wiseMidMarketRate,
    );

    // Create manual Revolut provider object
    const revolutProvider = {
      id: 44,
      name: "Revolut",
      logo: "img/revolut_logo.png",
      website: `https://www.revolut.com/send-money/?from=${sourceCurrency}&to=${targetCurrency}&amount=${amount}`,
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
      infoIconSpan.onclick = showRevolutInfo;
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
    if (rowIndex <= 3) {
      dataRow.classList.add("best-deal-row");
    }

    const linkCell = document.createElement("td");

    // Replace "Go" button with badges for top 3 deals
    if (rowIndex === 1) {
      const bestDealLink = document.createElement("span");
      bestDealLink.className = "best-deal-link";
      bestDealLink.innerHTML = "🏆 Best Deal";
      linkCell.appendChild(bestDealLink);
    } else if (rowIndex === 2) {
      const greatDealLink = document.createElement("span");
      greatDealLink.className = "great-deal-link";
      greatDealLink.innerHTML = "GREAT DEAL";
      linkCell.appendChild(greatDealLink);
    } else if (rowIndex === 3) {
      const goodDealLink = document.createElement("span");
      goodDealLink.className = "good-deal-link";
      goodDealLink.innerHTML = "GOOD DEAL";
      linkCell.appendChild(goodDealLink);
    } else {
      const link = document.createElement("a");
      link.href = getProviderUrl(
        provider,
        sourceCurrency,
        targetCurrency,
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
          sourceCurrency,
          targetCurrency,
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
function viewClickAnalytics() {
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
// Revolut tooltip functions
function showRevolutInfo(event) {
  event.stopPropagation(); // Prevent row click events
  const modal = document.getElementById("revolutTooltip");
  modal.style.display = "block";
}

function closeRevolutInfo() {
  const modal = document.getElementById("revolutTooltip");
  modal.style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function (event) {
  const modal = document.getElementById("revolutTooltip");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
