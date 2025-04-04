import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModals } from "@/hooks/use-modals";
import { Check } from "lucide-react";
import { Link } from "wouter";

export default function SuccessModal() {
  const { language } = useLanguage();
  const { successModalOpen, closeSuccessModal } = useModals();
  
  // Generate a random booking reference
  const bookingReference = `EVT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
  
  return (
    <Dialog open={successModalOpen} onOpenChange={closeSuccessModal}>
      <DialogContent className="bg-white rounded-xl max-w-sm w-full mx-4 p-6 text-center slide-up">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-12 w-12 text-green-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">
          {language === 'ar' ? "تم الحجز بنجاح!" : "Booking Successful!"}
        </h2>
        <p className="text-neutral-500 mb-6">
          {language === 'ar' 
            ? "تم إرسال تفاصيل الحجز إلى بريدك الإلكتروني" 
            : "Booking details have been sent to your email"}
        </p>
        
        <div className="border border-neutral-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-neutral-500">
              {language === 'ar' ? "رقم الحجز" : "Booking Reference"}
            </span>
            <span className="font-bold ltr">#{bookingReference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">
              {language === 'ar' ? "الحالة" : "Status"}
            </span>
            <span className="text-green-500 font-medium">
              {language === 'ar' ? "مؤكد" : "Confirmed"}
            </span>
          </div>
        </div>
        
        <Link href="/">
          <Button className="w-full bg-primary hover:bg-opacity-90 text-white py-3 rounded-lg font-bold text-lg transition mb-3">
            {language === 'ar' ? "العودة للرئيسية" : "Back to Home"}
          </Button>
        </Link>
        
        <Link href="/my-tickets">
          <Button variant="outline" className="w-full bg-white border border-neutral-200 hover:bg-neutral-50 py-3 rounded-lg font-bold text-lg transition">
            {language === 'ar' ? "عرض التذاكر" : "View Tickets"}
          </Button>
        </Link>
      </DialogContent>
    </Dialog>
  );
}
