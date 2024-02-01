import { initReactI18next } from "react-i18next";
import i18n from "i18next";

i18n.use(initReactI18next).init({
  lng: "",
  resources: {
    en: {
      translation: {
        InoutPH: "Type something...",
        submitBtn: "THAT'S ALL",
        introText1: "Hey!",
        introText2: "What's up?",
        
      }
    },
    th: {
      translation: {
        InoutPH: "พิมพ์อะไรสักอย่างสิ...",
        submitBtn: "เรียบร้อยแล้ว",
        introText1: "หวัดดี!",
        introText2: "สบายดีไหม?",
      }
    },
  },
  keySeparator: false,
  interpolation: { escapeValue: false }
});

export default i18n;