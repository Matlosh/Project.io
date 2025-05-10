import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "~/lang/en";

i18n.
  use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      en: {
        translation: {
          ...en
        }
      }
    },
    lng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;