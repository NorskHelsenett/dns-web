import type { Translations } from "./locales/nb";

// Makes t("...") type-checked against the translation keys.
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: { translation: Translations };
  }
}
