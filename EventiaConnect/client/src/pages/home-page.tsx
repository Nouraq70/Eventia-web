import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNavigation from "@/components/layout/MobileNavigation";
import HeroSection from "@/components/home/HeroSection";
import EventCategoryTabs from "@/components/home/EventCategoryTabs";
import RecommendedEvents from "@/components/home/RecommendedEvents";
import TrendingReel from "@/components/home/TrendingReel";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import DownloadApp from "@/components/home/DownloadApp";
import EventModal from "@/components/events/EventModal";
import BookingModal from "@/components/events/BookingModal";
import SuccessModal from "@/components/events/SuccessModal";
import { useState } from "react";
import { EventCategory } from "@/lib/types";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "all">("all");
  
  const handleCategorySelect = (category: EventCategory | "all") => {
    setSelectedCategory(category);
    // In a real implementation, we would filter events based on the selected category
  };
  
  return (
    <>
      <main className="container mx-auto px-4 py-6">
        <HeroSection />
        <EventCategoryTabs onSelectCategory={handleCategorySelect} />
        <RecommendedEvents />
        <TrendingReel />
        <FeaturedCategories />
        <DownloadApp />
      </main>
      
      <MobileNavigation />
      
      {/* Modals */}
      <EventModal />
      <BookingModal />
      <SuccessModal />
    </>
  );
}
