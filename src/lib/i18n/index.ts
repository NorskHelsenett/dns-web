import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./locales/en";
import { nb } from "./locales/nb";

/** Languages the app supports. */
export const locales = ["nb", "en"] as const;
export type Locale = (typeof locales)[number];

/**
 * Initialises translations. Call once at startup, before rendering.
 *
 * @param locale - The language to start in.
 */
export async function initI18n(locale: Locale): Promise<void> {
  await i18n.use(initReactI18next).init({
    lng: locale,
    fallbackLng: "nb",
    resources: {
      nb: { translation: nb },
      en: { translation: en },
    },
    interpolation: { escapeValue: false },
  });
  document.documentElement.lang = locale;
}
