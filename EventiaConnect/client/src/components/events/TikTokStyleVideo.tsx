import { Event } from "@/lib/types";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Heart, Share2, Calendar } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { Badge } from "@/components/ui/badge";
import { useModals } from "@/hooks/use-modals";

interface TikTokStyleVideoProps {
  event: Event;
  autoPlay?: boolean;
  isCurrent: boolean;
  onInView?: () => void;
}

export default function TikTokStyleVideo({ 
  event, 
  autoPlay = false, 
  isCurrent,
  onInView
}: TikTokStyleVideoProps) {
  const { language } = useLanguage();
  const { openEventModal, openBookingModal } = useModals();
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isYoutubeVideo, setIsYoutubeVideo] = useState(false);
  const [youtubeId, setYoutubeId] = useState("");
  
  // Extract YouTube ID from URL
  useEffect(() => {
    if (!event.videoUrl) return;
    
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = event.videoUrl.match(youtubeRegex);
    
    if (match && match[1]) {
      setIsYoutubeVideo(true);
      setYoutubeId(match[1]);
    } else {
      setIsYoutubeVideo(false);
    }
  }, [event.videoUrl]);
  
  // Play/pause controls
  const togglePlay = () => {
    if (isYoutubeVideo) {
      // YouTube video logic - we can't easily control YouTube through iframe
      // For now, we'll just toggle the UI state
      setIsPlaying(!isPlaying);
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Mute/unmute controls
  const toggleMute = () => {
    if (isYoutubeVideo) {
      // YouTube video logic - we can't easily control YouTube through iframe
      setIsMuted(!isMuted);
    } else if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Toggle like
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };
  
  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    }
  };
  
  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  // Auto-play when in viewport
  useEffect(() => {
    if (!isCurrent) {
      setIsPlaying(false);
      return;
    }
    
    if (isYoutubeVideo) {
      // We can't directly control YouTube video through simple iframe
      if (autoPlay) {
        setIsPlaying(true);
      }
    } else if (videoRef.current) {
      if (autoPlay) {
        videoRef.current.play().catch(e => console.error("Auto-play failed:", e));
        setIsPlaying(true);
      }
    }
    
    if (onInView) {
      onInView();
    }
  }, [isCurrent, autoPlay, onInView, isYoutubeVideo]);
  
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black overflow-hidden"
    >
      {/* Video Element - either YouTube iframe or native video */}
      {isYoutubeVideo ? (
        <>
          <div className="w-full h-full">
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${isCurrent && autoPlay ? '1' : '0'}&mute=${isMuted ? '1' : '0'}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&loop=1`}
              title={event.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
          {/* Fallback poster image for YouTube if video is not playing */}
          {!isPlaying && (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${event.imageUrl || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`})` }}
            ></div>
          )}
        </>
      ) : (
        <video
          ref={videoRef}
          src={event.videoUrl}
          poster={event.imageUrl}
          className="w-full h-full object-cover"
          loop
          playsInline
          muted={isMuted}
        />
      )}
      
      {/* Play/Pause Overlay */}
      <div 
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onClick={togglePlay}
      >
        {!isPlaying && (
          <div className="bg-black bg-opacity-30 rounded-full p-4">
            <Play className="h-12 w-12 text-white" />
          </div>
        )}
      </div>
      
      {/* Event Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
        <h3 className="text-xl font-bold">{event.title}</h3>
        <p className="text-sm mb-2">{event.description.substring(0, 100)}...</p>
        
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="bg-white/10 text-white border-none">
            {language === 'ar' ? event.category : event.category}
          </Badge>
          
          <div className="flex items-center text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(event.date)}
          </div>
          
          <div className="text-xs">
            {language === 'ar' ? `${event.city}` : `${event.city}`}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="default" 
            className="flex-1"
            onClick={() => openBookingModal(event)}
          >
            {language === 'ar' ? "احجز الآن" : "Book Now"}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => openEventModal(event)}
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Right-side Actions */}
      <div className="absolute right-3 bottom-24 flex flex-col space-y-4">
        <button 
          onClick={toggleLike}
          className="bg-black/30 rounded-full p-2"
        >
          <Heart className={`h-6 w-6 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
        </button>
        
        <button 
          onClick={handleShare}
          className="bg-black/30 rounded-full p-2"
        >
          <Share2 className="h-6 w-6 text-white" />
        </button>
        
        <button 
          onClick={toggleMute}
          className="bg-black/30 rounded-full p-2"
        >
          {isMuted ? 
            <VolumeX className="h-6 w-6 text-white" /> : 
            <Volume2 className="h-6 w-6 text-white" />
          }
        </button>
      </div>
    </div>
  );
}