import { initReactI18next } from "react-i18next";
import i18n from "i18next";

i18n.use(initReactI18next).init({
  lng: "",
  resources: {
    en: {
      translation: {
        InoutPH: "Type something...",
        submitBtn: "THAT'S ALL"
      }
    },
    th: {
      translation: {
        InoutPH: "พิมพ์อะไรสักอย่างสิ...",
        submitBtn: "เรียบร้อยแล้ว"
      }
    },
  },
  keySeparator: false,
  interpolation: { escapeValue: false }
});

export default i18n;