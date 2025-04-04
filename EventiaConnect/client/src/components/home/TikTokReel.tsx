import { Event } from "@/lib/types";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import TikTokStyleVideo from "../events/TikTokStyleVideo";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function TikTokReel() {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<HTMLDivElement[]>([]);
  
  // Fetch trending events that have videos
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ["/api/events/trending"],
    select: (data) => data.filter(event => event.videoUrl),
  });
  
  // Auto-scroll to current video when index changes
  useEffect(() => {
    if (!events || events.length === 0 || !videoRefs.current[currentIndex]) return;
    
    videoRefs.current[currentIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [currentIndex, events]);
  
  // Set up intersection observer to detect which video is in view
  useEffect(() => {
    if (!events || events.length === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(index) && index !== currentIndex) {
              setCurrentIndex(index);
            }
          }
        });
      },
      { threshold: 0.7 } // 70% of the video must be visible
    );
    
    videoRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      videoRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [events, currentIndex]);
  
  // Navigate to previous video
  const goToPrev = () => {
    if (!events) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };
  
  // Navigate to next video
  const goToNext = () => {
    if (!events) return;
    setCurrentIndex((prev) => (prev < events.length - 1 ? prev + 1 : prev));
  };
  
  if (isLoading) {
    return (
      <div className="w-full aspect-[9/16] sm:aspect-video bg-muted rounded-lg overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }
  
  if (error || !events || events.length === 0) {
    return (
      <div className="w-full aspect-[9/16] sm:aspect-video bg-muted/30 rounded-lg flex items-center justify-center p-4 text-center">
        {language === 'ar' 
          ? "لا توجد فيديوهات متاحة حالياً" 
          : "No videos available at the moment"}
      </div>
    );
  }
  
  return (
    <div className="relative w-full aspect-[9/16] sm:aspect-video bg-black rounded-lg overflow-hidden" ref={containerRef}>
      {/* Video Container */}
      <div className="absolute inset-0 h-full w-full">
        {events.map((event, index) => (
          <div
            key={event.id}
            ref={(el) => el && (videoRefs.current[index] = el)}
            data-index={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-300 
              ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <TikTokStyleVideo 
              event={event} 
              isCurrent={index === currentIndex}
              autoPlay={index === currentIndex}
            />
          </div>
        ))}
      </div>
      
      {/* Navigation Controls */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
        <button 
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className={`p-2 rounded-full bg-black/30 text-white 
            ${currentIndex === 0 ? 'opacity-30' : 'opacity-80 hover:opacity-100'}`}
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      </div>
      
      <div className="absolute left-4 top-1/2 transform translate-y-1/2 z-20">
        <button 
          onClick={goToNext}
          disabled={currentIndex === events.length - 1}
          className={`p-2 rounded-full bg-black/30 text-white
            ${currentIndex === events.length - 1 ? 'opacity-30' : 'opacity-80 hover:opacity-100'}`}
        >
          <ChevronDown className="h-6 w-6" />
        </button>
      </div>
      
      {/* Progress Indicator */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-1.5">
        {events.map((_, index) => (
          <div 
            key={index}
            className={`h-5 w-1.5 rounded-full cursor-pointer
              ${index === currentIndex ? 'bg-white' : 'bg-white/30'}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}