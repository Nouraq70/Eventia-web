import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@/lib/types";
import { useLanguage } from "@/hooks/use-language";
import TikTokStyleVideo from "@/components/events/TikTokStyleVideo";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function VideoFeedPage() {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const feedContainerRef = useRef<HTMLDivElement>(null);
  
  // Fetch all events with videos
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    select: (data) => data.filter(event => event.videoUrl),
  });
  
  // Handle swipe/scroll gesture
  useEffect(() => {
    const container = feedContainerRef.current;
    if (!container) return;
    
    let touchStartY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent default scrolling
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      
      if (Math.abs(diff) > 50) { // Threshold for swipe
        if (diff > 0) {
          // Swipe up - go to next
          handleNextVideo();
        } else {
          // Swipe down - go to previous
          handlePrevVideo();
        }
      }
    };
    
    let wheelTimeout = false;
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Throttle wheel events
      if (wheelTimeout) return;
      
      wheelTimeout = true;
      setTimeout(() => wheelTimeout = false, 300);
      
      if (e.deltaY > 0) {
        // Scroll down - go to next
        handleNextVideo();
      } else {
        // Scroll up - go to previous
        handlePrevVideo();
      }
    };
    
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [events]);
  
  const handleNextVideo = () => {
    if (!events) return;
    if (currentIndex < events.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };
  
  const handlePrevVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        handleNextVideo();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        handlePrevVideo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextVideo, handlePrevVideo]);
  
  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <Skeleton className="w-full h-full max-w-md" />
      </div>
    );
  }
  
  if (error || !events || events.length === 0) {
    return (
      <div className="w-full h-screen bg-black/90 flex items-center justify-center text-white p-4 text-center">
        <div>
          <p className="mb-4">
            {language === 'ar' 
              ? "لا توجد فيديوهات متاحة حالياً" 
              : "No videos available at the moment"}
          </p>
          <Link href="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              {language === 'ar' ? "العودة للصفحة الرئيسية" : "Back to Home"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={feedContainerRef}
      className="w-full h-screen bg-black overflow-hidden"
    >
      {/* Home button */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/">
          <Button size="icon" variant="secondary" className="rounded-full">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
      </div>
      
      {/* Progress indicator */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-1">
        {events.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 w-6 rounded-full transition-all ${
              i === currentIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
      
      {/* Videos */}
      <div className="relative w-full h-full">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`absolute inset-0 w-full h-full transition-transform duration-500 ${
              index === currentIndex 
                ? 'translate-y-0' 
                : index < currentIndex 
                  ? '-translate-y-full' 
                  : 'translate-y-full'
            }`}
          >
            <TikTokStyleVideo 
              event={event}
              isCurrent={index === currentIndex}
              autoPlay={index === currentIndex}
            />
          </div>
        ))}
      </div>
    </div>
  );
}