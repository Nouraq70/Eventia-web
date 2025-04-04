import { useLanguage } from "@/hooks/use-language";
import { Event, PaymentMethod } from "@/lib/types";
import { format } from "date-fns";
import { Calendar, MapPin, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useModals } from "@/hooks/use-modals";
import { useState } from "react";
import { PAYMENT_METHODS, MAX_TICKETS_PER_BOOKING, TAX_RATE } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function BookingModal() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { bookingModalOpen, selectedEvent, closeBookingModal, openSuccessModal } = useModals();
  const [quantity, setQuantity] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("apple_pay");
  
  const { mutate: proceedToCheckout, isPending } = useMutation({
    mutationFn: async () => {
      if (!selectedEvent) throw new Error("No event selected");
      
      // Save booking data to localStorage for use on the checkout page
      const bookingData = {
        eventId: selectedEvent.id,
        quantity,
        paymentMethod: selectedPaymentMethod,
        totalAmount: calculateTotalWithTax(),
        eventTitle: selectedEvent.title,
        eventDate: selectedEvent.date,
        eventLocation: `${selectedEvent.location}, ${selectedEvent.city}`
      };
      
      localStorage.setItem('currentBooking', JSON.stringify(bookingData));
      
      return bookingData;
    },
    onSuccess: () => {
      closeBookingModal();
      // Navigate to checkout page instead of showing success modal
      window.location.href = '/checkout';
    },
    onError: (error) => {
      toast({
        title: language === 'ar' ? "فشل الحجز" : "Booking Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
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
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < MAX_TICKETS_PER_BOOKING && quantity < selectedEvent.remainingTickets) {
      setQuantity(quantity + 1);
    }
  };
  
  const calculateSubtotal = () => quantity * selectedEvent.price;
  const calculateTax = () => Math.round(calculateSubtotal() * TAX_RATE);
  const calculateTotalWithTax = () => calculateSubtotal() + calculateTax();
  
  const handleConfirmBooking = () => {
    proceedToCheckout();
  };
  
  return (
    <Dialog open={bookingModalOpen} onOpenChange={closeBookingModal}>
      <DialogContent className="max-w-md w-full max-h-[90vh] overflow-y-auto mx-4 slide-up">
        <DialogHeader className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {language === 'ar' ? "حجز التذاكر" : "Book Tickets"}
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full" 
            onClick={closeBookingModal}
          >
            <X className="h-6 w-6 text-neutral-600" />
          </Button>
        </DialogHeader>
        
        <div className="mb-6">
          <h3 className="font-bold mb-4">{selectedEvent.title}</h3>
          <div className="flex items-center text-neutral-500 mb-2">
            <Calendar className="h-5 w-5 ml-2" />
            <span>
              {formatDate(selectedEvent.date)} • {formatTime(selectedEvent.date)}
            </span>
          </div>
          <div className="flex items-center text-neutral-500">
            <MapPin className="h-5 w-5 ml-2" />
            <span>{selectedEvent.location}, {selectedEvent.city}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold mb-3">
            {language === 'ar' ? "عدد التذاكر" : "Number of Tickets"}
          </h3>
          <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
            <span>
              {language === 'ar' ? `بالغ (${selectedEvent.price} ريال)` : `Adult (${selectedEvent.price} SAR)`}
            </span>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-5 w-5 text-neutral-600" />
              </Button>
              <span className="font-medium text-lg">{quantity}</span>
              <Button 
                size="icon" 
                className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center"
                onClick={increaseQuantity}
                disabled={quantity >= MAX_TICKETS_PER_BOOKING || quantity >= selectedEvent.remainingTickets}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold mb-3">
            {language === 'ar' ? "طريقة الدفع" : "Payment Method"}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map(method => (
              <div 
                key={method.id}
                className={`border rounded-lg p-3 flex items-center justify-between cursor-pointer ${
                  selectedPaymentMethod === method.id 
                    ? "border-primary bg-primary bg-opacity-5" 
                    : "border-neutral-200"
                }`}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <div className="flex items-center">
                  <img src={method.logo} alt={method.name} className="h-8 ml-2" />
                  <span>{method.name}</span>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  selectedPaymentMethod === method.id 
                    ? "border-2 border-primary" 
                    : "border-2 border-neutral-300"
                }`}>
                  {selectedPaymentMethod === method.id && (
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-neutral-200 pt-4 mb-6">
          <div className="flex justify-between mb-2">
            <span>
              {language === 'ar' 
                ? `إجمالي التذاكر (${quantity})` 
                : `Tickets total (${quantity})`}
            </span>
            <span>{calculateSubtotal()} {language === 'ar' ? "ريال" : "SAR"}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>
              {language === 'ar' 
                ? `ضريبة القيمة المضافة (${TAX_RATE * 100}%)` 
                : `VAT (${TAX_RATE * 100}%)`}
            </span>
            <span>{calculateTax()} {language === 'ar' ? "ريال" : "SAR"}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>{language === 'ar' ? "الإجمالي" : "Total"}</span>
            <span>{calculateTotalWithTax()} {language === 'ar' ? "ريال" : "SAR"}</span>
          </div>
        </div>
        
        <Button 
          className="w-full bg-accent hover:bg-opacity-90 text-white py-3 rounded-lg font-bold text-lg transition"
          onClick={handleConfirmBooking}
          disabled={isPending}
        >
          {isPending 
            ? (language === 'ar' ? "جاري المعالجة..." : "Processing...") 
            : (language === 'ar' ? "المتابعة إلى الدفع" : "Proceed to Payment")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
