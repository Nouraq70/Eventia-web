import { useLanguage } from "@/hooks/use-language";
import { Event } from "@/lib/types";
import { format } from "date-fns";
import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoPreview from "./VideoPreview";
import { useModals } from "@/hooks/use-modals";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

export default function EventModal() {
  const { language } = useLanguage();
  const { eventModalOpen, selectedEvent, closeEventModal, openBookingModal } = useModals();
  
  if (!selectedEvent) return null;
  
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return language === 'ar' 
      ? new Intl.DateTimeFormat('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }).format(dateObj)
      : format(dateObj, 'MMMM d, yyyy');
  };
  
  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return language === 'ar'
      ? new Intl.DateTimeFormat('ar-SA', { hour: 'numeric', minute: 'numeric', hour12: true }).format(dateObj)
      : format(dateObj, 'h:mm a');
  };
  
  const handleBookNow = () => {
    closeEventModal();
    openBookingModal(selectedEvent);
  };
  
  return (
    <Dialog open={eventModalOpen} onOpenChange={closeEventModal}>
      <DialogContent className="max-w-md w-full max-h-[90vh] overflow-y-auto mx-4 slide-up p-0">
        <div className="relative">
          <div className="aspect-video bg-neutral-200">
            <VideoPreview 
              url={selectedEvent.videoUrl} 
              thumbnailUrl={selectedEvent.imageUrl} 
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md" 
            onClick={closeEventModal}
          >
            <X className="h-6 w-6 text-neutral-600" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-accent text-white px-2 py-1 rounded-lg text-sm font-medium">
              {selectedEvent.category}
            </span>
            <span className="text-neutral-500 text-sm">
              {formatDate(selectedEvent.date)}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">{selectedEvent.title}</h2>
          
          <div className="flex items-center text-neutral-500 mb-4">
            <MapPin className="h-5 w-5 ml-2" />
            <span>{selectedEvent.location}, {selectedEvent.city}</span>
          </div>
          
          <p className="mb-6">{selectedEvent.description}</p>
          
          <div className="border-t border-neutral-200 pt-4 mb-6">
            <h3 className="font-bold mb-2">
              {language === 'ar' ? "التفاصيل" : "Details"}
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-24 text-neutral-500">
                  {language === 'ar' ? "المدة:" : "Duration:"}
                </span>
                <span>
                  {selectedEvent.endDate 
                    ? `${Math.ceil((new Date(selectedEvent.endDate).getTime() - new Date(selectedEvent.date).getTime()) / (1000 * 60 * 60))} ${language === 'ar' ? "ساعات" : "hours"}`
                    : "3 ساعات"}
                </span>
              </li>
              <li className="flex items-center">
                <span className="w-24 text-neutral-500">
                  {language === 'ar' ? "الوقت:" : "Time:"}
                </span>
                <span>
                  {formatTime(selectedEvent.date)}
                  {selectedEvent.endDate && ` - ${formatTime(selectedEvent.endDate)}`}
                </span>
              </li>
              <li className="flex items-center">
                <span className="w-24 text-neutral-500">
                  {language === 'ar' ? "المنظم:" : "Organizer:"}
                </span>
                <span>{selectedEvent.organizer}</span>
              </li>
            </ul>
          </div>
          
          <div className="border-t border-neutral-200 pt-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-500">
                  {language === 'ar' ? "السعر" : "Price"}
                </p>
                <p className="text-xl font-bold text-primary">
                  {selectedEvent.price} {language === 'ar' ? "ريال" : "SAR"}
                </p>
              </div>
              <Button 
                onClick={handleBookNow}
                className="bg-accent hover:bg-opacity-90 text-white px-6 py-3 rounded-lg font-bold transition"
              >
                {language === 'ar' ? "احجز الآن" : "Book Now"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
