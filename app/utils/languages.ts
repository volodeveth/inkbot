/**
 * Shared language definitions for InkBot.
 * Used by ai.server.ts (LANGUAGE_NAMES lookup) and frontend selectors (languageOptions).
 *
 * Includes all Shopify App Store languages plus regional variants.
 * ~120+ languages total.
 */

export const LANGUAGE_NAMES: Record<string, string> = {
  // --- Priority / Major world languages ---
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  "pt-BR": "Portuguese (Brazil)",
  "pt-PT": "Portuguese (Portugal)",
  pt: "Portuguese", // legacy fallback
  zh: "Chinese (Simplified)",
  "zh-TW": "Chinese (Traditional)",
  ja: "Japanese",
  ko: "Korean",


  // --- European ---
  af: "Afrikaans",
  sq: "Albanian",
  hy: "Armenian",
  az: "Azerbaijani",
  eu: "Basque",
  be: "Belarusian",
  bs: "Bosnian",
  bg: "Bulgarian",
  ca: "Catalan",
  hr: "Croatian",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  et: "Estonian",
  fi: "Finnish",
  gl: "Galician",
  ka: "Georgian",
  el: "Greek",
  hu: "Hungarian",
  is: "Icelandic",
  ga: "Irish",
  lv: "Latvian",
  lt: "Lithuanian",
  lb: "Luxembourgish",
  mk: "Macedonian",
  mt: "Maltese",
  no: "Norwegian",
  nb: "Norwegian (Bokmål)",
  nn: "Norwegian (Nynorsk)",
  pl: "Polish",
  ro: "Romanian",
  sr: "Serbian",
  sk: "Slovak",
  sl: "Slovenian",
  sv: "Swedish",
  uk: "Ukrainian",
  cy: "Welsh",

  // --- Middle East & Central Asia ---
  ar: "Arabic",
  "ar-na": "Arabic (North African)",
  he: "Hebrew",
  fa: "Persian (Farsi)",
  ku: "Kurdish",
  ps: "Pashto",
  tr: "Turkish",
  uz: "Uzbek",
  kk: "Kazakh",
  ky: "Kyrgyz",
  tk: "Turkmen",
  tg: "Tajik",
  mn: "Mongolian",

  // --- South Asia ---
  hi: "Hindi",
  bn: "Bengali",
  ur: "Urdu",
  pa: "Punjabi",
  gu: "Gujarati",
  mr: "Marathi",
  ta: "Tamil",
  te: "Telugu",
  kn: "Kannada",
  ml: "Malayalam",
  si: "Sinhala",
  ne: "Nepali",

  // --- Southeast Asia ---
  th: "Thai",
  vi: "Vietnamese",
  id: "Indonesian",
  ms: "Malay",
  tl: "Filipino",
  my: "Burmese",
  km: "Khmer",
  lo: "Lao",

  // --- East Asia ---
  // zh, zh-TW, ja, ko already listed above

  // --- Africa ---
  "fr-af": "French (African)",
  am: "Amharic",
  ha: "Hausa",
  ig: "Igbo",
  yo: "Yoruba",
  zu: "Zulu",
  xh: "Xhosa",
  sw: "Swahili",
  sn: "Shona",
  om: "Oromo",
  rw: "Kinyarwanda",
  so: "Somali",
  mg: "Malagasy",
  ny: "Chichewa",
  ti: "Tigrinya",
  ln: "Lingala",
  wo: "Wolof",
  ff: "Fula",
  st: "Sesotho",
  tn: "Setswana",

  // --- Other ---
  eo: "Esperanto",
  la: "Latin",
  haw: "Hawaiian",
  mi: "Maori",
  sm: "Samoan",
  jv: "Javanese",
  su: "Sundanese",
  ceb: "Cebuano",
  ht: "Haitian Creole",
};

/**
 * Language options for Select dropdowns.
 * English first, then alphabetically by label.
 */
export const languageOptions: Array<{ label: string; value: string }> = (() => {
  const entries = Object.entries(LANGUAGE_NAMES).map(([value, label]) => ({
    label,
    value,
  }));

  // English first
  const english = entries.find((e) => e.value === "en")!;
  const rest = entries
    .filter((e) => e.value !== "en")
    .sort((a, b) => a.label.localeCompare(b.label));

  return [english, ...rest];
})();
