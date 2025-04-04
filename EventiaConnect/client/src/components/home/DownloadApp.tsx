import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";

export default function DownloadApp() {
  const { language } = useLanguage();
  
  return (
    <section className="mb-12 bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 md:p-10 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0 md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'ar' ? "حمّل تطبيق إيفينتيا" : "Download Eventia App"}
          </h2>
          <p className="mb-6 text-lg">
            {language === 'ar' 
              ? "اكتشف، احجز، واستمتع بأفضل الفعاليات في السعودية من خلال تطبيقنا المجاني" 
              : "Discover, book, and enjoy the best events in Saudi Arabia through our free app"}
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="h-12 cursor-pointer">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" 
                alt="Google Play" 
                className="h-full"
              />
            </a>
            <a href="#" className="h-12 cursor-pointer">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1280px-Download_on_the_App_Store_Badge.svg.png" 
                alt="App Store" 
                className="h-full"
              />
            </a>
          </div>
        </div>
        <div className="w-full md:w-2/5">
          <img 
            src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7" 
            alt="Eventia App" 
            className="w-full max-w-xs mx-auto rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}
