// API calls, caching, and provider data management

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Cache management functions
export function getCachedData(sourceCurrency, targetCurrency, amount) {
  const cacheKey = `wise_${sourceCurrency}_${targetCurrency}_${amount}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;
    const data = JSON.parse(cached);
    if (Date.now() - data.timestamp < CACHE_TTL_MS) return data;
    localStorage.removeItem(cacheKey); // expired
  } catch (e) {
    /* storage unavailable or corrupt entry */
  }
  return null;
}

export function setCachedData(sourceCurrency, targetCurrency, amount, result) {
  const cacheKey = `wise_${sourceCurrency}_${targetCurrency}_${amount}`;
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ result, timestamp: Date.now() }));
  } catch (e) {
    // Storage full, clear old cache entries
    if (e.name === "QuotaExceededError") clearOldCache();
  }
}

export function clearOldCache() {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("wise_")) localStorage.removeItem(key);
    });
  } catch (e) {
    /* storage unavailable */
  }
}

// Function to calculate Revolut rates based on Wise mid-market rate
export function calculateRevolutRate(amount, wiseMidMarketRate) {
  const isWeekend = [0, 6].includes(new Date().getDay()); // 0 = Sunday, 6 = Saturday

  // Revolut pricing structure (Standard account):
  // free within limits on weekdays, 1% markup on weekends
  const markup = isWeekend ? 0.01 : 0;
  const effectiveRate = wiseMidMarketRate * (1 - markup);

  return {
    rate: effectiveRate,
    fee: 0, // Revolut doesn't show explicit transfer fees
    receivedAmount: amount * effectiveRate,
    isWeekend,
  };
}

// Build Wise affiliate link with deeplink for dynamic currency and amount
function buildWiseAffiliateLink(sourceCurrency, targetCurrency, amount) {
  // The actual Wise page you want to send users to
  const wiseDestination = `https://wise.com/send?sourceCurrency=${sourceCurrency}&targetCurrency=${targetCurrency}&sourceAmount=${amount}`;
  // Your FULL Partnerize affiliate link
  const affiliateBase = "https://wise.prf.hn/click/camref:1101l3RA2L";
  // Add pubref to track that this came from your comparison tool
  const pubref = `comparison-${sourceCurrency}-${targetCurrency}-${amount}`;
  return `${affiliateBase}/pubref:${pubref}/destination:${encodeURIComponent(wiseDestination)}`;
}

// Get provider URL – uses hardcoded deep-links where available,
// then falls back to the API-supplied website URL for any provider not listed.
export function getProviderUrl(provider, sourceCurrency, targetCurrency, amount) {
  // Wise uses a custom Partnerize affiliate deep-link with pubref tracking
  if (provider.id === 39) return buildWiseAffiliateLink(sourceCurrency, targetCurrency, amount);

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

// Fetch exchange rates from API
export async function fetchExchangeRates(sourceCurrency, targetCurrency, amount) {
  const response = await fetch(
    `https://api.transferwise.com/v3/comparisons/?sourceCurrency=${sourceCurrency}&targetCurrency=${targetCurrency}&sendAmount=${amount}`,
    { method: "GET", redirect: "follow", headers: { Accept: "application/json" } },
  );
  if (!response.ok) throw new Error(`Comparison API returned ${response.status}`);
  return response.json();
}

// Local logo overrides – used when the API returns a broken/relative logo URL
export const LOCAL_LOGO_OVERRIDES = {
  6: "img/paypal.jpg",
  22: "img/westerunion.png",
  23: "img/moneygram_logo.png",
  39: "img/wise_logo.png",
  44: "img/revolut-logo.png",
  121: "img/Paysera_logo.png",
};

// Providers we show (Revolut, 44, is appended last with an estimated rate)
const PROVIDER_IDS = [
  39, // Wise
  6, // PayPal
  22, // Western Union
  23, // MoneyGram
  41, // Xoom
  104, // Remitly
  121, // Paysera
  127, // Payoneer
  161, // WorldRemit  (verify ID)
  140, // OFX         (verify ID)
  45, // Skrill      (verify ID)
  253, // Airwallex   (verify ID)
];

const BADGES = ["best_deal", "great_deal", "good_deal"];

/**
 * Turns an API response into ranked display rows:
 * filtered, sorted by received amount, Revolut estimate appended, top 3 badged.
 */
export function buildResults(data, amount) {
  const sourceCurrency = data.sourceCurrency;
  const targetCurrency = data.targetCurrency;
  const providers = data.providers || [];

  const filtered = providers.filter((p) => PROVIDER_IDS.includes(p.id) && p.quotes?.[0]);
  filtered.sort((a, b) => b.quotes[0].receivedAmount - a.quotes[0].receivedAmount);

  // Append Revolut last – its rate is estimated, not sourced from the API
  const wise = providers.find((p) => p.id === 39);
  if (wise?.quotes?.[0]) {
    const revolut = calculateRevolutRate(amount, wise.quotes[0].rate);
    filtered.push({
      id: 44,
      name: "Revolut",
      website: `https://www.revolut.com/send-money/?from=${sourceCurrency}&to=${targetCurrency}&amount=${amount}`,
      quotes: [revolut],
      isEstimated: true,
      isWeekend: revolut.isWeekend,
    });
  }

  let rank = 0;
  return filtered.map((p) => {
    const q = p.quotes[0];
    const totalCost = amount + q.fee;
    if (!p.isEstimated) rank++;
    return {
      id: p.id,
      name: p.name,
      logo: LOCAL_LOGO_OVERRIDES[p.id] ?? p.logo ?? "",
      rate: q.rate,
      fee: q.fee,
      totalCost,
      received: q.receivedAmount,
      effective: q.receivedAmount / totalCost, // true cost per unit after fees
      isEstimated: !!p.isEstimated,
      rank: p.isEstimated ? null : rank,
      badge: !p.isEstimated && rank <= 3 ? BADGES[rank - 1] : null,
      url: getProviderUrl(p, sourceCurrency, targetCurrency, amount),
    };
  });
}
