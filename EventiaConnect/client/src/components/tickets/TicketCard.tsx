import { useLanguage } from "@/hooks/use-language";
import { Ticket, Event } from "@/lib/types";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Download, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface TicketCardProps {
  ticket: Ticket;
  event: Event;
}

export default function TicketCard({ ticket, event }: TicketCardProps) {
  const { language } = useLanguage();
  
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
  
  // Get status badge color based on ticket status
  const getStatusColor = () => {
    switch (ticket.status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "completed":
        return "bg-neutral-100 text-neutral-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };
  
  // Get status text based on ticket status
  const getStatusText = () => {
    if (language === 'ar') {
      switch (ticket.status) {
        case "confirmed":
          return "مؤكد";
        case "pending":
          return "قيد الانتظار";
        case "cancelled":
          return "ملغي";
        case "completed":
          return "مكتمل";
        default:
          return ticket.status;
      }
    } else {
      switch (ticket.status) {
        case "confirmed":
          return "Confirmed";
        case "pending":
          return "Pending";
        case "cancelled":
          return "Cancelled";
        case "completed":
          return "Completed";
        default:
          return ticket.status;
      }
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-24 h-24 bg-neutral-200 rounded-lg overflow-hidden">
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
                <span className="bg-accent bg-opacity-10 text-accent px-2 py-1 rounded-lg text-xs font-medium">
                  {event.category}
                </span>
              </div>
              
              <h3 className="font-bold text-lg mb-2">{event.title}</h3>
              
              <div className="space-y-1 text-sm text-neutral-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatTime(event.date)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{event.location}, {event.city}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-row md:flex-col justify-between md:justify-center md:items-end">
            <div className="text-right">
              <div className="text-sm text-neutral-500 mb-1">
                {language === 'ar' ? "رقم التذكرة" : "Ticket Number"}
              </div>
              <div className="font-medium text-primary ltr">{ticket.bookingReference}</div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                {language === 'ar' ? "تنزيل" : "Download"}
              </Button>
              <Button size="sm" variant="default">
                <QrCode className="h-4 w-4 mr-1" />
                {language === 'ar' ? "عرض" : "View"}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-neutral-200 flex flex-wrap justify-between gap-2">
          <div className="text-sm">
            <span className="text-neutral-500">
              {language === 'ar' ? "الكمية:" : "Quantity:"}
            </span>
            <span className="font-medium ml-1">{ticket.quantity}</span>
          </div>
          <div className="text-sm">
            <span className="text-neutral-500">
              {language === 'ar' ? "وسيلة الدفع:" : "Payment Method:"}
            </span>
            <span className="font-medium ml-1">
              {ticket.paymentMethod === "apple_pay" 
                ? "Apple Pay"
                : ticket.paymentMethod === "stc_pay"
                ? "STC Pay"
                : ticket.paymentMethod === "mada"
                ? "Mada"
                : "Credit Card"}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-neutral-500">
              {language === 'ar' ? "المبلغ الإجمالي:" : "Total Amount:"}
            </span>
            <span className="font-medium ml-1">{ticket.totalPrice} {language === 'ar' ? "ريال" : "SAR"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
