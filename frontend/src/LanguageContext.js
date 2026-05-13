import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // İlk yüklənmədə localStorage-da dil varsa onu götür, yoxdursa 'aze'
  const [lang, setLang] = useState(localStorage.getItem('appLang') || 'aze');

  useEffect(() => {
    localStorage.setItem('appLang', lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);