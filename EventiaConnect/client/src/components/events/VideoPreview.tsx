import { VideoPreviewProps } from "@/lib/types";
import { Play } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function VideoPreview({ url, thumbnailUrl, onPlay }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isYoutubeVideo, setIsYoutubeVideo] = useState(false);
  const [youtubeId, setYoutubeId] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Extract YouTube ID if it's a YouTube URL
  useEffect(() => {
    if (!url) return;
    
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      setIsYoutubeVideo(true);
      setYoutubeId(match[1]);
    } else {
      setIsYoutubeVideo(false);
    }
  }, [url]);
  
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    if (onPlay) onPlay();
  };
  
  const handleMouseEnter = () => {
    // Clear any existing timer
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    
    // Set a small delay before starting hover effect to avoid flashing on quick passes
    hoverTimerRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 200);
  };
  
  const handleMouseLeave = () => {
    // Clear timer
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    
    setIsHovered(false);
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);
  
  if (isPlaying && url) {
    if (isYoutubeVideo) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video player"
          aria-label="Event video preview"
        ></iframe>
      );
    } else {
      return (
        <video 
          ref={videoRef}
          src={url} 
          className="w-full h-full object-cover" 
          autoPlay 
          controls
          playsInline
          aria-label="Event video preview"
          controlsList="nodownload"
        >
          <track kind="captions" src="" label="English captions" />
          Your browser does not support the video tag.
        </video>
      );
    }
  }
  
  return (
    <div 
      className="w-full h-full relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label="Event preview image"
    >
      <img 
        src={thumbnailUrl || (isYoutubeVideo ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg` : '')} 
        alt="Event thumbnail" 
        loading="lazy"
        decoding="async"
        className={`
          w-full h-full object-cover transition-transform duration-700
          ${isHovered ? 'scale-110' : 'scale-100'}
        `}
      />
      
      {/* Overlay that darkens on hover */}
      <div 
        className={`
          absolute inset-0 bg-black transition-opacity duration-300
          ${isHovered ? 'opacity-30' : 'opacity-0'}
        `}
      />
      
      {url && (
        <button 
          className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            text-white bg-primary hover:bg-primary/90 p-3
            rounded-full shadow-lg transition-all duration-300
            ${isHovered ? 'scale-110 opacity-100' : 'scale-90 opacity-70'}
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
          `}
          onClick={handlePlay}
          aria-label="Play video"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handlePlay(e as unknown as React.MouseEvent);
            }
          }}
          tabIndex={0}
        >
          <Play className="h-6 w-6" />
          
          {/* Pulsing ring animation on hover */}
          <span className={`
            absolute inset-0 rounded-full border-4 border-white/30
            animate-ping ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}></span>
        </button>
      )}
    </div>
  );
}
