import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Language = 'es' | 'en';

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  registerTranslations: (translations: Record<Language, Record<string, string>>) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

// Global translation registry
const translationStore: Record<Language, Record<string, string>> = {
  es: {},
  en: {},
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem('hubert-lang');
    return (stored as Language) || 'es';
  });

  // Counter to force re-render when translations are registered
  const [, setVersion] = useState(0);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('hubert-lang', newLang);
    document.documentElement.setAttribute('lang', newLang);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const registerTranslations = useCallback((translations: Record<Language, Record<string, string>>) => {
    for (const l of Object.keys(translations) as Language[]) {
      Object.assign(translationStore[l], translations[l]);
    }
    setVersion(v => v + 1);
  }, []);

  const t = useCallback((key: string): string => {
    return translationStore[lang]?.[key] ?? translationStore['es']?.[key] ?? key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, registerTranslations }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};
