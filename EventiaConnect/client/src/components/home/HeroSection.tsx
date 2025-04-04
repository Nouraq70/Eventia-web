import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { ArrowRight, Video, Calendar, Star, MapPin } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

export default function HeroSection() {
  const { language } = useLanguage();
  const { user } = useAuth();

  return (
    <section className="mb-14">
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
            <path d="M0 0 L100 0 L100 100 L0 100 Z" fill="white"></path>
            <path d="M0 0 L100 0 L0 100 Z" fill="white"></path>
          </svg>
        </div>
        
        <div className="absolute -bottom-16 -right-16 opacity-20 w-64 h-64 rounded-full bg-accent blur-2xl"></div>
        <div className="absolute -top-16 -left-16 opacity-20 w-64 h-64 rounded-full bg-white blur-2xl"></div>
        
        {/* Main content */}
        <div className="grid md:grid-cols-2 gap-8 relative z-10">
          <div className="flex flex-col justify-center">
            <Badge variant="secondary" className="mb-4 self-start px-4 py-1 text-sm font-bold bg-white text-primary">
              {language === 'ar' ? "الأكثر ذكاءً" : "Most Intelligent"}
            </Badge>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {language === 'ar' 
                ? "اكتشف فعاليات فريدة في السعودية" 
                : "Discover Unique Events in Saudi Arabia"}
            </h1>
            
            <p className="mb-8 text-lg opacity-90 max-w-md">
              {language === 'ar' 
                ? "المنصة الذكية الأولى التي تساعدك على اكتشاف وحجز الفعاليات التي تناسب اهتماماتك بمساعدة الذكاء الاصطناعي" 
                : "The first AI-powered platform that helps you discover and book events that match your interests"}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-accent hover:bg-opacity-90 text-white px-6 py-3 rounded-lg font-bold text-lg transition duration-200 shadow-lg"
                asChild
              >
                <Link href="/events">
                  <span>{language === 'ar' ? "استكشف الفعاليات" : "Explore Events"}</span>
                  <ArrowRight className="h-5 w-5 mr-2" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 px-6 py-3 rounded-lg font-bold text-lg"
                asChild
              >
                <Link href="/videos">
                  <Video className="h-5 w-5 mr-2" />
                  <span>{language === 'ar' ? "شاهد الفيديوهات" : "Watch Videos"}</span>
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col justify-center items-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl transform hover:scale-105 transition duration-300 w-full max-w-sm">
              <h3 className="text-xl font-bold mb-4">
                {language === 'ar' ? "مميزات إيفينتيا" : "Eventia Features"}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-accent/20 p-2 rounded-full">
                    <Star className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {language === 'ar' ? "توصيات ذكية بالـ AI" : "AI-Powered Recommendations"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-accent/20 p-2 rounded-full">
                    <Video className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {language === 'ar' ? "مقاطع فيديو قصيرة للفعاليات" : "Short Video Previews"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-accent/20 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {language === 'ar' ? "حجز سهل وسريع" : "Quick & Easy Booking"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-accent/20 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {language === 'ar' ? "فعاليات في جميع أنحاء المملكة" : "Events All Around Saudi Arabia"}
                    </p>
                  </div>
                </div>
              </div>
              
              {!user && (
                <Button className="w-full mt-6 bg-white text-primary hover:bg-white/90" asChild>
                  <Link href="/auth">
                    {language === 'ar' ? "سجل الآن" : "Sign Up Now"}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-neutral-50 p-4 rounded-xl text-center shadow-sm border border-neutral-100">
          <p className="text-2xl md:text-3xl font-bold text-primary">+1000</p>
          <p className="text-neutral-600 text-sm">
            {language === 'ar' ? "فعالية نشطة" : "Active Events"}
          </p>
        </div>
        <div className="bg-neutral-50 p-4 rounded-xl text-center shadow-sm border border-neutral-100">
          <p className="text-2xl md:text-3xl font-bold text-primary">+50</p>
          <p className="text-neutral-600 text-sm">
            {language === 'ar' ? "مدينة" : "Cities"}
          </p>
        </div>
        <div className="bg-neutral-50 p-4 rounded-xl text-center shadow-sm border border-neutral-100">
          <p className="text-2xl md:text-3xl font-bold text-primary">+200</p>
          <p className="text-neutral-600 text-sm">
            {language === 'ar' ? "منظم فعاليات" : "Organizers"}
          </p>
        </div>
        <div className="bg-neutral-50 p-4 rounded-xl text-center shadow-sm border border-neutral-100">
          <p className="text-2xl md:text-3xl font-bold text-primary">+25K</p>
          <p className="text-neutral-600 text-sm">
            {language === 'ar' ? "مستخدم نشط" : "Active Users"}
          </p>
        </div>
      </div>
    </section>
  );
}
