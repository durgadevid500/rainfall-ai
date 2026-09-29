import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",

  resources: {
    en: {
      translation: {
        welcome: "Welcome",
      },
    },

    ta: {
      translation: {
        welcome: "வரவேற்கிறோம்",
      },
    },

    hi: {
      translation: {
        welcome: "स्वागत है",
      },
    },

    te: {
      translation: {
        welcome: "స్వాగతం",
      },
    },

    kn: {
      translation: {
        welcome: "ಸ್ವಾಗತ",
      },
    },

    ml: {
      translation: {
        welcome: "സ്വാഗതം",
      },
    },

    bn: {
      translation: {
        welcome: "স্বাগতম",
      },
    },
  },

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;