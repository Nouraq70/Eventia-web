import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNavigation from "@/components/layout/MobileNavigation";
import EventCategoryTabs from "@/components/home/EventCategoryTabs";
import EventCard from "@/components/events/EventCard";
import EventModal from "@/components/events/EventModal";
import BookingModal from "@/components/events/BookingModal";
import SuccessModal from "@/components/events/SuccessModal";
import { useState } from "react";
import { EventCategory, Event } from "@/lib/types";
import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CITIES } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventsPage() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });
  
  const handleCategorySelect = (category: EventCategory | "all") => {
    setSelectedCategory(category);
  };
  
  const filteredEvents = events?.filter(event => {
    // Filter by category
    if (selectedCategory !== "all" && event.category !== selectedCategory) {
      return false;
    }
    
    // Filter by city
    if (selectedCity !== "all" && event.city !== selectedCity) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !event.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">
            {language === 'ar' ? "استكشف الفعاليات" : "Explore Events"}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder={language === 'ar' ? "ابحث عن الفعاليات..." : "Search events..."}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? "اختر المدينة" : "Select City"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {language === 'ar' ? "جميع المدن" : "All Cities"}
                </SelectItem>
                {CITIES.map(city => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? "التاريخ" : "Date"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">
                  {language === 'ar' ? "أي وقت" : "Any time"}
                </SelectItem>
                <SelectItem value="today">
                  {language === 'ar' ? "اليوم" : "Today"}
                </SelectItem>
                <SelectItem value="this-week">
                  {language === 'ar' ? "هذا الأسبوع" : "This week"}
                </SelectItem>
                <SelectItem value="this-month">
                  {language === 'ar' ? "هذا الشهر" : "This month"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <EventCategoryTabs onSelectCategory={handleCategorySelect} />
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-500">
            {language === 'ar' ? "حدث خطأ أثناء تحميل الفعاليات" : "Error loading events"}
          </div>
        ) : filteredEvents && filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-neutral-500">
            {language === 'ar' 
              ? "لا توجد فعاليات متطابقة مع معايير البحث" 
              : "No events match your search criteria"}
          </div>
        )}
      </main>
      
      <Footer />
      <MobileNavigation />
      
      {/* Modals */}
      <EventModal />
      <BookingModal />
      <SuccessModal />
    </>
  );
}
