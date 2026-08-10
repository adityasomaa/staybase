/**
 * Languages offered by the translator.
 *
 * Google's own list is far longer; this is the set with enough speakers to be
 * worth putting in a switcher, each labelled in its own language because a
 * reader who needs the translator cannot necessarily read the English name.
 */
export interface Language {
  /** Google Translate language code. */
  code: string;
  label: string;
}

export const SOURCE_LANGUAGE = "en";

export const languages: Language[] = [
  { code: "en", label: "English" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ms", label: "Bahasa Melayu" },
  { code: "zh-CN", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" },
  { code: "hi", label: "हिन्दी" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
  { code: "bn", label: "বাংলা" },
  { code: "pt", label: "Português" },
  { code: "ru", label: "Русский" },
  { code: "ja", label: "日本語" },
  { code: "de", label: "Deutsch" },
  { code: "ko", label: "한국어" },
  { code: "tr", label: "Türkçe" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "it", label: "Italiano" },
  { code: "th", label: "ไทย" },
  { code: "fa", label: "فارسی" },
  { code: "pl", label: "Polski" },
  { code: "uk", label: "Українська" },
  { code: "nl", label: "Nederlands" },
  { code: "ta", label: "தமிழ்" },
  { code: "ur", label: "اردو" },
  { code: "tl", label: "Filipino" },
  { code: "sw", label: "Kiswahili" },
  { code: "he", label: "עברית" },
  { code: "el", label: "Ελληνικά" },
  { code: "sv", label: "Svenska" },
  { code: "cs", label: "Čeština" },
  { code: "ro", label: "Română" },
  { code: "hu", label: "Magyar" },
  { code: "da", label: "Dansk" },
  { code: "fi", label: "Suomi" },
  { code: "no", label: "Norsk" },
  { code: "my", label: "မြန်မာ" },
  { code: "km", label: "ខ្មែរ" },
  { code: "si", label: "සිංහල" },
  { code: "ne", label: "नेपाली" },
];

export const languageLabel = (code: string) =>
  languages.find((l) => l.code === code)?.label ?? code;
