import { useLanguage } from "@/hooks/use-language";
import { CATEGORIES } from "@/lib/constants";
import { EventCategory } from "@/lib/types";
import { Link } from "wouter";

const CATEGORY_IMAGES: Record<EventCategory, string> = {
  "موسيقي": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
  "رياضي": "https://images.unsplash.com/photo-1518091043644-c1d4457512c6",
  "ثقافي": "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
  "عائلي": "https://images.unsplash.com/photo-1501426026826-31c667bdf23d",
  "تعليمي": "https://images.unsplash.com/photo-1558008258-3256797b43f3",
  "أعمال": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
  "ترفيهي": "https://images.unsplash.com/photo-1563841930606-67e2bce48b78"
};

export default function FeaturedCategories() {
  const { language } = useLanguage();
  
  // Translation mapping for categories
  const getCategoryName = (category: EventCategory): string => {
    if (language === 'en') {
      const translations: Record<EventCategory, string> = {
        "ثقافي": "Cultural",
        "رياضي": "Sports",
        "موسيقي": "Music",
        "تعليمي": "Educational",
        "ترفيهي": "Entertainment",
        "عائلي": "Family",
        "أعمال": "Business"
      };
      return translations[category];
    }
    
    return category;
  };
  
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">
        {language === 'ar' ? "استكشف حسب الفئة" : "Explore by Category"}
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((category) => (
          <Link key={category} href={`/events/category/${category}`} className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition">
            <div className="aspect-square relative bg-neutral-100">
              <img 
                src={CATEGORY_IMAGES[category]} 
                alt={getCategoryName(category)} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                <h3 className="text-white font-bold">{getCategoryName(category)}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
