import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import { createContext, useState } from 'react';

export const languageContext = createContext<
  | {
      currentLanguage: any | null;
      setCurrentLanguage: (data: any) => void;
      translation: ({
        translations: { en, fr, ar },
      }: {
        translations: {
          en: any;
          fr: any;
          ar: any;
        };
      }) => any;
    }
  | undefined
>(undefined);

export const LanguageProvider = ({
  children,
  lang,
}: {
  children: any;
  lang?: string | null;
}) => {
  const locale = getLocales();
  const [currentLanguage, setCurrentLanguage] = useState<any | null>(
    lang ?? locale[0].languageCode
  );
  // I18nManager.allowRTL(true);
  // I18nManager.forceRTL(true);

  const translation = ({
    translations,
  }: {
    translations: {
      en: any;
      fr: any;
      ar: any;
    };
  }) => {
    const i18n = new I18n(translations);

    i18n.defaultLocale = 'en';
    i18n.locale = currentLanguage ?? 'en';

    // i18n.locale = 'ar';
    i18n.enableFallback = true;

    return { i18n };
  };

  return (
    <languageContext.Provider
      value={{ currentLanguage, setCurrentLanguage, translation }}
    >
      {children}
    </languageContext.Provider>
  );
};
