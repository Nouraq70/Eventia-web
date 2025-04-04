import { EventCategory, PaymentMethod } from "./types";

export const CATEGORIES: EventCategory[] = [
  "ثقافي",
  "رياضي", 
  "موسيقي", 
  "تعليمي", 
  "ترفيهي", 
  "عائلي", 
  "أعمال"
];

export const PAYMENT_METHODS: Array<{id: PaymentMethod, name: string, logo: string}> = [
  {
    id: "apple_pay",
    name: "آبل باي",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/1200px-Apple_Pay_logo.svg.png"
  },
  {
    id: "stc_pay", 
    name: "STC Pay",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/72/STC_Pay.png"
  },
  {
    id: "mada",
    name: "مدى",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Mada_Logo.svg/524px-Mada_Logo.svg.png"
  },
  {
    id: "credit_card",
    name: "بطاقة ائتمان",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
  }
];

export const DEFAULT_LANGUAGE = "ar";

export const SUPPORTED_LANGUAGES = [
  { code: "ar", name: "العربية", englishName: "Arabic", dir: "rtl", flag: "🇸🇦" },
  { code: "en", name: "English", englishName: "English", dir: "ltr", flag: "🇬🇧" },
  { code: "fr", name: "Français", englishName: "French", dir: "ltr", flag: "🇫🇷" },
  { code: "es", name: "Español", englishName: "Spanish", dir: "ltr", flag: "🇪🇸" },
  { code: "zh", name: "中文", englishName: "Chinese", dir: "ltr", flag: "🇨🇳" },
  { code: "ur", name: "اردو", englishName: "Urdu", dir: "rtl", flag: "🇵🇰" },
  { code: "hi", name: "हिन्दी", englishName: "Hindi", dir: "ltr", flag: "🇮🇳" },
  { code: "tl", name: "Tagalog", englishName: "Tagalog", dir: "ltr", flag: "🇵🇭" }
];

export const CITIES = [
  "الرياض",
  "جدة",
  "الدمام",
  "الخبر",
  "مكة",
  "المدينة",
  "الطائف",
  "تبوك",
  "أبها",
  "الدرعية",
  "العلا"
];

export const MAX_TICKETS_PER_BOOKING = 10;

export const TAX_RATE = 0.15; // 15% VAT
