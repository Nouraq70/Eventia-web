import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNavigation from "@/components/layout/MobileNavigation";
import { useParams } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, Users, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useModals } from "@/hooks/use-modals";
import BookingModal from "@/components/events/BookingModal";
import SuccessModal from "@/components/events/SuccessModal";
import VideoPreview from "@/components/events/VideoPreview";

export default function EventDetailsPage() {
  const { language } = useLanguage();
  const { id } = useParams();
  const { openBookingModal } = useModals();
  
  const { data: event, isLoading, error } = useQuery<Event>({
    queryKey: [`/api/events/${id}`],
  });
  
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
  
  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div>
            <Skeleton className="h-[400px] w-full rounded-xl mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-6 w-1/3 mb-6" />
                <div className="space-y-2 mb-6">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-500">
            {language === 'ar' ? "حدث خطأ أثناء تحميل تفاصيل الفعالية" : "Error loading event details"}
          </div>
        ) : event ? (
          <>
            <div className="relative aspect-[21/9] bg-neutral-200 rounded-xl overflow-hidden mb-8">
              <VideoPreview url={event.videoUrl} thumbnailUrl={event.imageUrl} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-accent text-white px-2 py-1 rounded-lg text-sm font-medium">
                    {event.category}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-neutral-600">
                    <MapPin className="h-5 w-5 mr-1" />
                    <span>{event.location}, {event.city}</span>
                  </div>
                  <div className="flex items-center text-neutral-600">
                    <Calendar className="h-5 w-5 mr-1" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-neutral-600">
                    <Clock className="h-5 w-5 mr-1" />
                    <span>{formatTime(event.date)}</span>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-3">
                    {language === 'ar' ? "عن الفعالية" : "About the Event"}
                  </h2>
                  <p className="text-neutral-600">{event.description}</p>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-3">
                    {language === 'ar' ? "المنظم" : "Organizer"}
                  </h2>
                  <div className="flex items-center p-4 bg-neutral-50 rounded-lg">
                    <div className="bg-neutral-200 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                      {event.organizer.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold">{event.organizer}</p>
                      <p className="text-sm text-neutral-500">
                        {language === 'ar' ? "منظم فعاليات" : "Event Organizer"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm h-fit sticky top-20">
                <h2 className="text-xl font-bold mb-4">
                  {language === 'ar' ? "تفاصيل التذكرة" : "Ticket Details"}
                </h2>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-neutral-600">
                    {language === 'ar' ? "السعر" : "Price"}
                  </span>
                  <span className="text-xl font-bold">{event.price} {language === 'ar' ? "ريال" : "SAR"}</span>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <span className="text-neutral-600">
                    {language === 'ar' ? "التذاكر المتبقية" : "Remaining Tickets"}
                  </span>
                  <span className="text-neutral-600">{event.remainingTickets}</span>
                </div>
                
                <Button 
                  className="w-full bg-accent hover:bg-opacity-90 text-white py-3 rounded-lg font-bold text-lg transition"
                  onClick={() => openBookingModal(event)}
                  disabled={event.remainingTickets <= 0}
                >
                  {event.remainingTickets > 0 
                    ? (language === 'ar' ? "احجز الآن" : "Book Now")
                    : (language === 'ar' ? "نفذت التذاكر" : "Sold Out")}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-3"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  {language === 'ar' ? "مشاركة" : "Share"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-8 text-neutral-500">
            {language === 'ar' ? "لم يتم العثور على الفعالية" : "Event not found"}
          </div>
        )}
      </main>
      
      <Footer />
      <MobileNavigation />
      
      {/* Modals */}
      <BookingModal />
      <SuccessModal />
    </>
  );
}
