import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { Home, Search, Ticket, User } from "lucide-react";

export default function MobileNavigation() {
  const { language } = useLanguage();
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  return (
    <div className="block md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-40">
      <div className="flex justify-around">
        <Link href="/">
          <div className={`flex flex-col items-center py-3 px-2 ${isActive('/') ? 'text-primary' : 'text-neutral-400'}`}>
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">{language === 'ar' ? "الرئيسية" : "Home"}</span>
          </div>
        </Link>
        <Link href="/events">
          <div className={`flex flex-col items-center py-3 px-2 ${isActive('/events') ? 'text-primary' : 'text-neutral-400'}`}>
            <Search className="h-6 w-6" />
            <span className="text-xs mt-1">{language === 'ar' ? "استكشف" : "Explore"}</span>
          </div>
        </Link>
        <Link href="/my-tickets">
          <div className={`flex flex-col items-center py-3 px-2 ${isActive('/my-tickets') ? 'text-primary' : 'text-neutral-400'}`}>
            <Ticket className="h-6 w-6" />
            <span className="text-xs mt-1">{language === 'ar' ? "تذاكري" : "Tickets"}</span>
          </div>
        </Link>
        <Link href="/profile">
          <div className={`flex flex-col items-center py-3 px-2 ${isActive('/profile') ? 'text-primary' : 'text-neutral-400'}`}>
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">{language === 'ar' ? "حسابي" : "Profile"}</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
