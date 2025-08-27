import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher" role="group" aria-label="Language selection">
      <button
        onClick={() => changeLanguage('en')}
        className={`lang-button ${i18n.language === 'en' ? 'active' : ''}`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('pt')}
        className={`lang-button ${i18n.language === 'pt' ? 'active' : ''}`}
      >
        PT
      </button>
      <button
        onClick={() => changeLanguage('es')}
        className={`lang-button ${i18n.language === 'es' ? 'active' : ''}`}
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSwitcher;