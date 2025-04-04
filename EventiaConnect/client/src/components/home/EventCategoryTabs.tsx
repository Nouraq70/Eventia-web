import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { CATEGORIES } from "@/lib/constants";
import { EventCategory } from "@/lib/types";
import { useState } from "react";

interface EventCategoryTabsProps {
  onSelectCategory: (category: EventCategory | "all") => void;
}

export default function EventCategoryTabs({ onSelectCategory }: EventCategoryTabsProps) {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "all">("all");
  
  const handleSelectCategory = (category: EventCategory | "all") => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };
  
  const getCategoryName = (category: EventCategory | "all"): string => {
    if (category === "all") {
      return language === 'ar' ? "الكل" : "All";
    }
    
    // Translation mapping for categories
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
    <section className="mb-8">
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            className={`whitespace-nowrap rounded-full font-medium ${
              selectedCategory === "all" ? "bg-primary text-white" : "bg-white hover:bg-neutral-200"
            }`}
            onClick={() => handleSelectCategory("all")}
          >
            {getCategoryName("all")}
          </Button>
          
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`whitespace-nowrap rounded-full font-medium ${
                selectedCategory === category ? "bg-primary text-white" : "bg-white hover:bg-neutral-200"
              }`}
              onClick={() => handleSelectCategory(category)}
            >
              {getCategoryName(category)}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
