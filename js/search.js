// Currency search and dropdown functionality
import { t } from "./i18n.js";

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

export function initializeSourceCurrencyDropdown() {
  const wrapper = document.querySelector(".wrapper");
  const selectBtn = wrapper.querySelector(".select-btn");
  const searchInp = wrapper.querySelector("input");
  const options = wrapper.querySelector(".options");
  const button9 = document.querySelector(".button-9");

  function addCountry(selectedCountry) {
    options.innerHTML = "";

    currencies.forEach((country) => {
      let isSelected = country == selectedCountry ? "selected" : "";
      let li = `<li isocode="${country[2]}" class="${isSelected}">${country[0]}<span class="fi fi-${country[1]}"></span></li>`;
      options.insertAdjacentHTML("beforeend", li);
    });
  }

  function updateName(selectedLi) {
    searchInp.value = "";
    let Isocode = selectedLi.getAttribute("isocode");

    addCountry(selectedLi.innerText);
    wrapper.classList.remove("active");
    button9.classList.remove("upupup");
    selectBtn.firstElementChild.setAttribute("isocode", Isocode);
    selectBtn.firstElementChild.innerText = selectedLi.innerText;
  }

  options.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (li) updateName(li);
  });

  searchInp.addEventListener("keyup", () => {
    let arr = [];
    let searchedVal = searchInp.value.toLowerCase();

    arr = currencies
      .filter((currency) => {
        return currency[0].toLowerCase().startsWith(searchedVal);
      })
      .map(
        (currency) =>
          `<li isocode="${currency[2]}">${currency[0]}<span class="fi fi-${currency[1]}"></span></li>`,
      )
      .join("");

    options.innerHTML = arr ? arr : `<p>${t("currency_not_found")}</p>`;
  });

  selectBtn.addEventListener("click", () => {
    wrapper.classList.toggle("active");
    button9.classList.toggle("upupup");
  });

  addCountry();
}

export function initializeTargetCurrencyDropdown() {
  const wrapperTarget = document.querySelector(".wrapperTarget");
  const selectBtnTarget = wrapperTarget.querySelector(".select-btnTarget");
  const searchInpTarget = wrapperTarget.querySelector("input");
  const optionsTarget = wrapperTarget.querySelector(".optionsTarget");
  const buttonTarget = document.querySelector(".button-9");

  function addCountry2(selectedCountry) {
    optionsTarget.innerHTML = "";

    currencies.forEach((country) => {
      let isSelected = country == selectedCountry ? "selected" : "";
      let li = `<li isocode="${country[2]}" class="${isSelected}">${country[0]}<span class="fi fi-${country[1]}"></span></li>`;
      optionsTarget.insertAdjacentHTML("beforeend", li);
    });
  }

  function updateName2(selectedLi) {
    searchInpTarget.value = "";
    let Isocode = selectedLi.getAttribute("isocode");

    addCountry2(selectedLi.innerText);
    wrapperTarget.classList.remove("active");
    buttonTarget.classList.remove("hide");
    selectBtnTarget.firstElementChild.setAttribute("isocode", Isocode);
    selectBtnTarget.firstElementChild.innerText = selectedLi.innerText;
  }

  optionsTarget.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (li) updateName2(li);
  });

  searchInpTarget.addEventListener("keyup", () => {
    let arr = [];
    let searchedVal = searchInpTarget.value.toLowerCase();

    arr = currencies
      .filter((currency) => {
        return currency[0].toLowerCase().startsWith(searchedVal);
      })
      .map(
        (currency) =>
          `<li isocode="${currency[2]}">${currency[0]}<span class="fi fi-${currency[1]}"></span></li>`,
      )
      .join("");

    optionsTarget.innerHTML = arr ? arr : `<p>${t("currency_not_found")}</p>`;
  });

  selectBtnTarget.addEventListener("click", () => {
    wrapperTarget.classList.toggle("active");
    buttonTarget.classList.toggle("hide");
  });

  addCountry2();
}
