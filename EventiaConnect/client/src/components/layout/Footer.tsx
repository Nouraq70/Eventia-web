import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  const { language, t } = useLanguage();
  
  return (
    <footer className="bg-white py-10 border-t border-neutral-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/">
              <div className="text-primary font-bold text-2xl mb-4 inline-block">
                <span className="text-accent">E</span>ventia
              </div>
            </Link>
            <p className="text-neutral-500 mb-4">
              {language === 'ar' 
                ? "المنصة الذكية الأولى لاكتشاف وحجز الفعاليات في السعودية" 
                : "The first smart platform for discovering and booking events in Saudi Arabia"}
            </p>
            <div className="flex gap-4">
              <button className="text-primary hover:text-accent transition">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="text-primary hover:text-accent transition">
                <Instagram className="h-5 w-5" />
              </button>
              <button className="text-primary hover:text-accent transition">
                <Facebook className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">
              {language === 'ar' ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <div className="text-neutral-500 hover:text-primary transition">
                    {language === 'ar' ? "الرئيسية" : "Home"}
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/events">
                  <div className="text-neutral-500 hover:text-primary transition">
                    {language === 'ar' ? "استكشف الفعاليات" : "Explore Events"}
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/my-tickets">
                  <div className="text-neutral-500 hover:text-primary transition">
                    {language === 'ar' ? "تذاكري" : "My Tickets"}
                  </div>
                </Link>
              </li>
              <li>
                <button className="text-neutral-500 hover:text-primary transition">
                  {language === 'ar' ? "للمنظمين" : "For Organizers"}
                </button>
              </li>
              <li>
                <button className="text-neutral-500 hover:text-primary transition">
                  {language === 'ar' ? "عن Eventia" : "About Eventia"}
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">
              {language === 'ar' ? "فئات الفعاليات" : "Event Categories"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/events/category/ثقافي">
                  <div className="text-neutral-500 hover:text-primary transition">
                    {language === 'ar' ? "ثقافية" : "Cultural"}
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/events/category/رياضي">
                  <div className="text-neutral-500 hover:text-primary transition">
                    {language === 'ar' ? "رياضية" : "Sports"}
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/events/category/موسيقي">
                  <div className="text-neutral-500 hover:text-primary transition">
                    {language === 'ar' ? "موسيقية" : "Music"}
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/events/category/تعليمي">
                  <div className="text-neutral-500 hover:text-primary transition">
                    {language === 'ar' ? "تعليمية" : "Educational"}
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/events/category/ترفيهي">
                  <div className="text-neutral-500 hover:text-primary transition">
                    {language === 'ar' ? "ترفيهية" : "Entertainment"}
                  </div>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">
              {language === 'ar' ? "الدعم" : "Support"}
            </h3>
            <ul className="space-y-2">
              <li>
                <button className="text-neutral-500 hover:text-primary transition">
                  {language === 'ar' ? "اتصل بنا" : "Contact Us"}
                </button>
              </li>
              <li>
                <button className="text-neutral-500 hover:text-primary transition">
                  {language === 'ar' ? "الأسئلة الشائعة" : "FAQ"}
                </button>
              </li>
              <li>
                <button className="text-neutral-500 hover:text-primary transition">
                  {language === 'ar' ? "سياسة الخصوصية" : "Privacy Policy"}
                </button>
              </li>
              <li>
                <button className="text-neutral-500 hover:text-primary transition">
                  {language === 'ar' ? "الشروط والأحكام" : "Terms & Conditions"}
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-neutral-200 text-center text-neutral-500 text-sm">
          <p>
            {language === 'ar' 
              ? "© ٢٠٢٣ Eventia. جميع الحقوق محفوظة" 
              : "© 2023 Eventia. All rights reserved"}
          </p>
        </div>
      </div>
    </footer>
  );
}
