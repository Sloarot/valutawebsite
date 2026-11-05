// Currency list and searchable currency picker
import { tx, onLanguageChange } from "./i18n.js";

export const currencies = [
  ["EUR - Euro", "eu", "EUR"],
  ["GBP - United Kingdom", "gb", "GBP"],
  ["USD - United States", "us", "USD"],
  ["AED - UAE Dirham", "ae", "AED"],
  ["AFN - Afghan Afghani", "af", "AFN"],
  ["ALL - Albanian Lek", "al", "ALL"],
  ["AMD - Armenian Dram", "am", "AMD"],
  ["ANG - Netherlands Antillean Guilder", "cw", "ANG"],
  ["AOA - Angolan Kwanza", "ao", "AOA"],
  ["ARS - Argentine Peso", "ar", "ARS"],
  ["AUD - Australian Dollar", "au", "AUD"],
  ["AWG - Aruban Florin", "aw", "AWG"],
  ["AZN - Azerbaijani Manat", "az", "AZN"],
  ["BAM - Bosnia-Herz. Conv. Mark", "ba", "BAM"],
  ["BBD - Barbadian Dollar", "bb", "BBD"],
  ["BDT - Bangladeshi Taka", "bd", "BDT"],
  ["BGN - Bulgarian Lev", "bg", "BGN"],
  ["BHD - Bahraini Dinar", "bh", "BHD"],
  ["BIF - Burundian Franc", "bi", "BIF"],
  ["BMD - Bermudian Dollar", "bm", "BMD"],
  ["BND - Brunei Dollar", "bn", "BND"],
  ["BOB - Bolivian Boliviano", "bo", "BOB"],
  ["BRL - Brazilian Real", "br", "BRL"],
  ["BSD - Bahamian Dollar", "bs", "BSD"],
  ["BTN - Bhutanese Ngultrum", "bt", "BTN"],
  ["BWP - Botswana Pula", "bw", "BWP"],
  ["BYN - Belarusian Ruble", "by", "BYN"],
  ["BZD - Belizean Dollar", "bz", "BZD"],
  ["CAD - Canadian Dollar", "ca", "CAD"],
  ["CDF - Congolese Franc", "cd", "CDF"],
  ["CHF - Swiss Franc", "ch", "CHF"],
  ["CLP - Chilean Peso", "cl", "CLP"],
  ["CNY - Chinese Yuan", "cn", "CNY"],
  ["COP - Colombian Peso", "co", "COP"],
  ["CRC - Costa Rican Colon", "cr", "CRC"],
  ["CUP - Cuban Peso", "cu", "CUP"],
  ["CVE - Cape Verdean Escudo", "cv", "CVE"],
  ["CZK - Czech Koruna", "cz", "CZK"],
  ["DJF - Djiboutian Franc", "dj", "DJF"],
  ["DKK - Danish Krone", "dk", "DKK"],
  ["DOP - Dominican Peso", "do", "DOP"],
  ["DZD - Algerian Dinar", "dz", "DZD"],
  ["EGP - Egyptian Pound", "eg", "EGP"],
  ["ERN - Eritrean Nakfa", "er", "ERN"],
  ["ETB - Ethiopian Birr", "et", "ETB"],
  ["FJD - Fijian Dollar", "fj", "FJD"],
  ["FKP - Falkland Islands Pound", "fk", "FKP"],
  ["GEL - Georgian Lari", "ge", "GEL"],
  ["GHS - Ghanaian Cedi", "gh", "GHS"],
  ["GIP - Gibraltar Pound", "gi", "GIP"],
  ["GMD - Gambian Dalasi", "gm", "GMD"],
  ["GNF - Guinean Franc", "gn", "GNF"],
  ["GTQ - Guatemalan Quetzal", "gt", "GTQ"],
  ["GYD - Guyanese Dollar", "gy", "GYD"],
  ["HKD - Hong Kong Dollar", "hk", "HKD"],
  ["HNL - Honduran Lempira", "hn", "HNL"],
  ["HTG - Haitian Gourde", "ht", "HTG"],
  ["HUF - Hungarian Forint", "hu", "HUF"],
  ["IDR - Indonesian Rupiah", "id", "IDR"],
  ["ILS - Israeli Shekel", "il", "ILS"],
  ["INR - Indian Rupee", "in", "INR"],
  ["IQD - Iraqi Dinar", "iq", "IQD"],
  ["IRR - Iranian Rial", "ir", "IRR"],
  ["ISK - Icelandic Krona", "is", "ISK"],
  ["JMD - Jamaican Dollar", "jm", "JMD"],
  ["JOD - Jordanian Dinar", "jo", "JOD"],
  ["JPY - Japanese Yen", "jp", "JPY"],
  ["KES - Kenyan Shilling", "ke", "KES"],
  ["KGS - Kyrgyzstani Som", "kg", "KGS"],
  ["KHR - Cambodian Riel", "kh", "KHR"],
  ["KMF - Comorian Franc", "km", "KMF"],
  ["KRW - South Korean Won", "kr", "KRW"],
  ["KWD - Kuwaiti Dinar", "kw", "KWD"],
  ["KYD - Cayman Islands Dollar", "ky", "KYD"],
  ["KZT - Kazakhstani Tenge", "kz", "KZT"],
  ["LAK - Lao Kip", "la", "LAK"],
  ["LBP - Lebanese Pound", "lb", "LBP"],
  ["LKR - Sri Lankan Rupee", "lk", "LKR"],
  ["LRD - Liberian Dollar", "lr", "LRD"],
  ["LSL - Lesotho Loti", "ls", "LSL"],
  ["LYD - Libyan Dinar", "ly", "LYD"],
  ["MAD - Moroccan Dirham", "ma", "MAD"],
  ["MDL - Moldovan Leu", "md", "MDL"],
  ["MGA - Malagasy Ariary", "mg", "MGA"],
  ["MKD - Macedonian Denar", "mk", "MKD"],
  ["MMK - Myanmar Kyat", "mm", "MMK"],
  ["MNT - Mongolian Tugrik", "mn", "MNT"],
  ["MOP - Macanese Pataca", "mo", "MOP"],
  ["MRU - Mauritanian Ouguiya", "mr", "MRU"],
  ["MUR - Mauritian Rupee", "mu", "MUR"],
  ["MVR - Maldivian Rufiyaa", "mv", "MVR"],
  ["MWK - Malawian Kwacha", "mw", "MWK"],
  ["MXN - Mexican Peso", "mx", "MXN"],
  ["MYR - Malaysian Ringgit", "my", "MYR"],
  ["MZN - Mozambican Metical", "mz", "MZN"],
  ["NAD - Namibian Dollar", "na", "NAD"],
  ["NGN - Nigerian Naira", "ng", "NGN"],
  ["NIO - Nicaraguan Cordoba", "ni", "NIO"],
  ["NOK - Norwegian Krone", "no", "NOK"],
  ["NPR - Nepalese Rupee", "np", "NPR"],
  ["NZD - New Zealand Dollar", "nz", "NZD"],
  ["OMR - Omani Rial", "om", "OMR"],
  ["PAB - Panamanian Balboa", "pa", "PAB"],
  ["PEN - Peruvian Sol", "pe", "PEN"],
  ["PGK - Papua New Guinean Kina", "pg", "PGK"],
  ["PHP - Philippine Peso", "ph", "PHP"],
  ["PKR - Pakistani Rupee", "pk", "PKR"],
  ["PLN - Polish Zloty", "pl", "PLN"],
  ["PYG - Paraguayan Guarani", "py", "PYG"],
  ["QAR - Qatari Riyal", "qa", "QAR"],
  ["RON - Romanian Leu", "ro", "RON"],
  ["RSD - Serbian Dinar", "rs", "RSD"],
  ["RUB - Russian Ruble", "ru", "RUB"],
  ["RWF - Rwandan Franc", "rw", "RWF"],
  ["SAR - Saudi Riyal", "sa", "SAR"],
  ["SBD - Solomon Islands Dollar", "sb", "SBD"],
  ["SCR - Seychellois Rupee", "sc", "SCR"],
  ["SDG - Sudanese Pound", "sd", "SDG"],
  ["SEK - Swedish Krona", "se", "SEK"],
  ["SGD - Singapore Dollar", "sg", "SGD"],
  ["SHP - Saint Helena Pound", "sh", "SHP"],
  ["SLL - Sierra Leonean Leone", "sl", "SLL"],
  ["SOS - Somali Shilling", "so", "SOS"],
  ["SRD - Surinamese Dollar", "sr", "SRD"],
  ["SSP - South Sudanese Pound", "ss", "SSP"],
  ["STN - Sao Tome and Principe Dobra", "st", "STN"],
  ["SYP - Syrian Pound", "sy", "SYP"],
  ["SZL - Swazi Lilangeni", "sz", "SZL"],
  ["THB - Thai Baht", "th", "THB"],
  ["TJS - Tajikistani Somoni", "tj", "TJS"],
  ["TMT - Turkmenistani Manat", "tm", "TMT"],
  ["TND - Tunisian Dinar", "tn", "TND"],
  ["TOP - Tongan Paanga", "to", "TOP"],
  ["TRY - Turkish Lira", "tr", "TRY"],
  ["TTD - Trinidad and Tobago Dollar", "tt", "TTD"],
  ["TWD - Taiwanese Dollar", "tw", "TWD"],
  ["TZS - Tanzanian Shilling", "tz", "TZS"],
  ["UAH - Ukrainian Hryvnia", "ua", "UAH"],
  ["UGX - Ugandan Shilling", "ug", "UGX"],
  ["UYU - Uruguayan Peso", "uy", "UYU"],
  ["UZS - Uzbekistani Som", "uz", "UZS"],
  ["VES - Venezuelan Bolivar", "ve", "VES"],
  ["VND - Vietnamese Dong", "vn", "VND"],
  ["VUV - Vanuatu Vatu", "vu", "VUV"],
  ["WST - Samoan Tala", "ws", "WST"],
  ["XAF - Central African CFA Franc", "cf", "XAF"],
  ["XCD - East Caribbean Dollar", "ag", "XCD"],
  ["XOF - West African CFA Franc", "sn", "XOF"],
  ["XPF - CFP Franc", "pf", "XPF"],
  ["YER - Yemeni Rial", "ye", "YER"],
  ["ZAR - South African Rand", "za", "ZAR"],
  ["ZMW - Zambian Kwacha", "zm", "ZMW"],
];

const byCode = Object.fromEntries(currencies.map(([label, flag, code]) => [code, { label, flag, code, name: label.split(" - ").slice(1).join(" - ") }]));
export const getCurrency = (code) => byCode[code];

const openPickers = new Set();

/**
 * Turns an empty host element into a searchable currency picker.
 * createCurrencyPicker(host, { id, value, labelKey, onChange }) -> { value, set(code), close() }
 */
export function createCurrencyPicker(host, { id, value = null, labelKey, onChange } = {}) {
  host.classList.add("fxp");
  host.innerHTML = `
    <button type="button" class="fxp-btn" id="${id}" aria-haspopup="listbox" aria-expanded="false">
      <span class="fxp-flag fi fis"></span>
      <span class="fxp-text"><span class="fxp-code"></span><span class="fxp-name"></span></span>
      <svg class="fxp-caret" viewBox="0 0 12 8" width="12" height="8" aria-hidden="true"><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="fxp-pop" hidden>
      <div class="fxp-searchwrap">
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M11 11l3.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        <input class="fxp-search" id="${id}-search" type="text" autocomplete="off" spellcheck="false">
      </div>
      <ul class="fxp-list" role="listbox"></ul>
    </div>`;

  const btn = host.querySelector(".fxp-btn");
  const flagEl = host.querySelector(".fxp-flag");
  const pop = host.querySelector(".fxp-pop");
  const input = host.querySelector(".fxp-search");
  const list = host.querySelector(".fxp-list");
  let items = [];
  let active = 0;

  function paintButton() {
    const c = byCode[value];
    flagEl.className = `fxp-flag fi fis${c ? " fi-" + c.flag : " is-empty"}`;
    host.querySelector(".fxp-code").textContent = c ? c.code : "";
    host.querySelector(".fxp-name").textContent = c ? c.name : tx(labelKey);
    btn.setAttribute("aria-label", tx(labelKey) + (c ? ": " + c.label : ""));
  }

  function renderList() {
    const q = input.value.trim().toLowerCase();
    items = Object.values(byCode).filter((c) => !q || c.code.toLowerCase().startsWith(q) || c.name.toLowerCase().includes(q));
    if (!items.length) {
      list.innerHTML = `<li class="fxp-empty">${tx("currency_not_found")}</li>`;
      return;
    }
    active = Math.max(0, Math.min(active, items.length - 1));
    list.innerHTML = items
      .map((c, i) => `<li class="fxp-item${i === active ? " is-active" : ""}" role="option" aria-selected="${c.code === value}" data-code="${c.code}"><span class="fi fis fi-${c.flag}"></span><b>${c.code}</b><span class="fxp-item-name">${c.name}</span></li>`)
      .join("");
  }

  const scrollActive = () => list.querySelector(".is-active")?.scrollIntoView({ block: "nearest" });

  function open() {
    openPickers.forEach((p) => p !== api && p.close());
    pop.hidden = false;
    host.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    input.placeholder = tx("search_placeholder");
    input.value = "";
    active = Math.max(0, Object.keys(byCode).indexOf(value));
    renderList();
    openPickers.add(api);
    setTimeout(() => {
      input.focus();
      scrollActive();
    }, 0);
  }

  function close() {
    pop.hidden = true;
    host.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    openPickers.delete(api);
  }

  function choose(code) {
    value = code;
    paintButton();
    close();
    btn.focus();
    onChange?.(code);
  }

  btn.addEventListener("click", () => (pop.hidden ? open() : close()));
  input.addEventListener("input", () => {
    active = 0;
    renderList();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { active = Math.min(active + 1, items.length - 1); renderList(); scrollActive(); e.preventDefault(); }
    else if (e.key === "ArrowUp") { active = Math.max(active - 1, 0); renderList(); scrollActive(); e.preventDefault(); }
    else if (e.key === "Enter") { if (items[active]) choose(items[active].code); e.preventDefault(); }
    else if (e.key === "Escape") { close(); btn.focus(); }
  });
  list.addEventListener("click", (e) => {
    const li = e.target.closest("[data-code]");
    if (li) choose(li.dataset.code);
  });
  document.addEventListener("click", (e) => {
    if (!host.contains(e.target)) close();
  });

  const api = {
    get value() { return value; },
    set(code) { value = code; paintButton(); },
    close,
  };
  onLanguageChange(paintButton);
  paintButton();
  return api;
}
