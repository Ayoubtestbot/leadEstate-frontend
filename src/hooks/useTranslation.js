import { useLanguage } from '../contexts/LanguageContext'

// Safe translation hook that provides fallbacks
export const useTranslation = () => {
  const { t: originalT, language, changeLanguage, availableLanguages } = useLanguage()

  // Safe translation function with fallback
  const t = (key, params = {}) => {
    try {
      return originalT(key, params)
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error)
      // Return the key as fallback
      return key
    }
  }

  return {
    t,
    language,
    changeLanguage,
    availableLanguages
  }
}

export default useTranslation
