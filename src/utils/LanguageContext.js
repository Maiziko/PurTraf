import React, { createContext, useState, useContext } from 'react';
import i18n from '../../i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.locale);

  const changeLanguage = (languageCode) => {
    i18n.locale = languageCode;
    setLanguage(languageCode);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
