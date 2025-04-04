import { Language } from "@/lib/types";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "@/lib/constants";
import { createContext, ReactNode, useContext, useState, useEffect } from "react";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getSupportedLanguages: () => typeof SUPPORTED_LANGUAGES;
  getCurrentLanguageInfo: () => (typeof SUPPORTED_LANGUAGES)[0];
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

// Simple translations
const translations: Record<string, Partial<Record<Language, string>>> = {
  "welcome": {
    "ar": "مرحبًا بك في Eventia",
    "en": "Welcome to Eventia",
    "fr": "Bienvenue sur Eventia",
    "es": "Bienvenido a Eventia",
    "zh": "欢迎来到 Eventia",
    "ur": "Eventia میں خوش آمدید",
    "hi": "Eventia में आपका स्वागत है",
    "tl": "Maligayang pagdating sa Eventia"
  },
  "events": {
    "ar": "الفعاليات",
    "en": "Events",
    "fr": "Événements",
    "es": "Eventos",
    "zh": "活动",
    "ur": "تقریبات",
    "hi": "कार्यक्रम",
    "tl": "Mga Kaganapan"
  },
  "login": {
    "ar": "تسجيل الدخول",
    "en": "Login",
    "fr": "Connexion",
    "es": "Iniciar sesión",
    "zh": "登录",
    "ur": "لاگ ان",
    "hi": "लॉगिन",
    "tl": "Mag-login"
  },
  "register": {
    "ar": "التسجيل",
    "en": "Register",
    "fr": "S'inscrire",
    "es": "Registrarse",
    "zh": "注册",
    "ur": "رجسٹر کریں",
    "hi": "पंजीकरण",
    "tl": "Magparehistro"
  },
  "bookNow": {
    "ar": "احجز الآن",
    "en": "Book Now",
    "fr": "Réserver",
    "es": "Reservar ahora",
    "zh": "立即预订",
    "ur": "ابھی بک کریں",
    "hi": "अभी बुक करें",
    "tl": "Mag-book Ngayon"
  }
  // Add more translations as needed
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Try to get language from localStorage or use default
  const savedLanguage = typeof window !== 'undefined' ? 
    localStorage.getItem('eventia-language') as Language || DEFAULT_LANGUAGE : 
    DEFAULT_LANGUAGE;
    
  const [language, setLanguageState] = useState<Language>(savedLanguage);
  const [isRtl, setIsRtl] = useState<boolean>(
    SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage)?.dir === 'rtl'
  );
  
  // Set language with localStorage persistence
  const setLanguage = (lang: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eventia-language', lang);
    }
    setLanguageState(lang);
    
    // Update RTL status
    const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    setIsRtl(langInfo?.dir === 'rtl');
  };
  
  // Set HTML dir attribute based on language
  useEffect(() => {
    const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === language);
    if (!langInfo) return;
    
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', langInfo.dir);
    
    // Apply appropriate font family based on direction
    if (langInfo.dir === 'rtl') {
      document.body.classList.add('font-tajawal');
      document.body.classList.remove('font-poppins');
    } else {
      document.body.classList.add('font-poppins');
      document.body.classList.remove('font-tajawal');
    }
    
    // Set meta description for accessibility and SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      if (language === 'ar') {
        metaDescription.setAttribute('content', 'إيفينتيا - المنصة الذكية لاكتشاف وحجز الفعاليات في السعودية');
      } else if (language === 'en') {
        metaDescription.setAttribute('content', 'Eventia - The Smart Platform for Event Discovery and Booking in Saudi Arabia');
      }
    }
  }, [language]);
  
  // Enhanced translation function with fallback to English
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language] as string;
    }
    
    // Fallback to English if translation doesn't exist
    if (translations[key] && translations[key]['en']) {
      return translations[key]['en'] as string;
    }
    
    return key;
  };
  
  // Helper to get supported languages
  const getSupportedLanguages = () => SUPPORTED_LANGUAGES;
  
  // Get current language info
  const getCurrentLanguageInfo = () => {
    return SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  };
  
  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      getSupportedLanguages, 
      getCurrentLanguageInfo,
      isRtl
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
