import { useLanguage } from "@/hooks/use-language";
import { Event } from "@/lib/types";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Video, Sparkles, Star } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VideoPreview from "./VideoPreview";
import { useModals } from "@/hooks/use-modals";
import { useState } from "react";

interface EventCardProps {
  event: Event;
  showAiBadge?: boolean;
}

export default function EventCard({ event, showAiBadge }: EventCardProps) {
  const { language } = useLanguage();
  const { openEventModal, openBookingModal } = useModals();
  const [isHovered, setIsHovered] = useState(false);
  
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return language === 'ar' 
      ? new Intl.DateTimeFormat('ar-SA').format(dateObj)
      : format(dateObj, 'MMM d');
  };
  
  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openBookingModal(event);
  };
  
  // Function to translate category
  const getCategoryName = (category: string): string => {
    if (language === 'en') {
      const translations: Record<string, string> = {
        "ثقافي": "Cultural",
        "رياضي": "Sports",
        "موسيقي": "Music",
        "تعليمي": "Educational",
        "ترفيهي": "Entertainment",
        "عائلي": "Family",
        "أعمال": "Business"
      };
      return translations[category] || category;
    }
    return category;
  };
  
  // Determine if event is happening soon (within the next 3 days)
  const isHappeningSoon = () => {
    const eventDate = new Date(event.date);
    const now = new Date();
    const diffTime = Math.abs(eventDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && eventDate >= now;
  };
  
  // Check if event is limited availability (less than 20% tickets remaining)
  const isLimitedAvailability = () => {
    return (event.remainingTickets / event.capacity) < 0.2;
  };
  
  return (
    <div 
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer border border-neutral-200 transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:transform hover:-translate-y-1"
      onClick={() => openEventModal(event)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`${event.title} - ${getCategoryName(event.category)} event in ${event.city}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openEventModal(event);
        }
      }}
    >
      <div className="relative aspect-video bg-neutral-200">
        <VideoPreview 
          url={event.videoUrl} 
          thumbnailUrl={event.imageUrl} 
        />
        
        {/* Category badge */}
        <div className="absolute top-2 right-2 z-10">
          <Badge className={`text-white font-medium ${isHovered ? 'bg-primary' : 'bg-accent'} transition-colors duration-300`}>
            {getCategoryName(event.category)}
          </Badge>
        </div>
        
        {/* AI recommended badge - shown only when AI recommended */}
        {showAiBadge && (
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              {language === 'ar' ? "موصى به" : "For You"}
            </Badge>
          </div>
        )}
        
        {/* Video indicator */}
        {event.videoUrl && (
          <div className="absolute bottom-2 right-2 z-10">
            <div className="bg-black/60 p-1.5 rounded-full">
              <Video className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
        
        {/* Event info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-white mr-1" />
              <span className="text-white font-medium text-sm">
                {formatDate(event.date)}
              </span>
            </div>
            
            {event.trending && (
              <div className="flex items-center bg-red-500/80 px-2 py-0.5 rounded text-white text-xs font-bold">
                <Star className="h-3 w-3 mr-1" />
                {language === 'ar' ? "رائج" : "Trending"}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-lg line-clamp-2 hover:text-primary transition-colors duration-300">
            {event.title}
          </h3>
          
          {/* Price tag */}
          <div className={`${isHovered ? 'bg-accent text-white' : 'bg-neutral-100 text-neutral-800'} px-3 py-1 rounded-full text-sm font-bold transition-colors duration-300 ml-2 flex-shrink-0`}>
            {event.price === 0 
              ? (language === 'ar' ? "مجاني" : "Free") 
              : `${event.price} ${language === 'ar' ? "ريال" : "SAR"}`
            }
          </div>
        </div>
        
        <div className="flex items-center mt-3 text-sm text-neutral-600">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0 text-neutral-400" />
          <span className="truncate">{event.location}, {event.city}</span>
        </div>
        
        <div className="mt-3 flex items-center text-sm text-neutral-500">
          <Users className="h-4 w-4 mr-1 flex-shrink-0 text-neutral-400" />
          <span>
            {language === 'ar' 
              ? `${event.remainingTickets} تذكرة متبقية` 
              : `${event.remainingTickets} tickets left`
            }
          </span>
          
          {/* Status indicators */}
          <div className="flex-grow" />
          {isHappeningSoon() && (
            <Badge variant="outline" className="ml-2 text-amber-600 bg-amber-50 border-amber-200 text-xs">
              {language === 'ar' ? "قريباً" : "Soon"}
            </Badge>
          )}
          
          {isLimitedAvailability() && (
            <Badge variant="outline" className="ml-2 text-red-600 bg-red-50 border-red-200 text-xs">
              {language === 'ar' ? "محدود" : "Limited"}
            </Badge>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-end">
          <Button 
            onClick={handleBookNow}
            className={`transition-all duration-300 text-white ${
              isHovered 
                ? 'bg-primary hover:bg-primary/90 px-5' 
                : 'bg-accent hover:bg-accent/90'
            }`}
            size="sm"
          >
            {language === 'ar' ? "احجز الآن" : "Book Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
