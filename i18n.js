import * as Localization from 'expo-localization';
import {I18n} from 'i18n-js';

import en from './src/locales/en.json';
import id from './src/locales/id.json';


// Atur pasangan key-value untuk bahasa yang didukung
const i18n = new I18n({
  en,
  id,
});

// Set locale based on system language, default to 'en' if not 'id' or 'en'
const systemLocale = Localization.locale.startsWith('id') ? 'id' : Localization.locale.startsWith('en') ? 'en' : 'en';
i18n.locale = systemLocale;
i18n.fallbacks = true;

export default i18n;
