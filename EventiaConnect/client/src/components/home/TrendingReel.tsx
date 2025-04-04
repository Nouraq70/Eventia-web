import { useLanguage } from "@/hooks/use-language";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import TikTokReel from "./TikTokReel";

export default function TrendingReel() {
  const { language } = useLanguage();
  
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {language === 'ar' ? "الأكثر رواجاً" : "Trending Now"}
        </h2>
        <div className="flex gap-4">
          <Link href="/videos" className="text-primary font-medium flex items-center">
            {language === 'ar' ? "تصفح كفيديو" : "Video Feed"}
            <ArrowRight className="h-5 w-5 mr-1" />
          </Link>
          <Link href="/events" className="text-primary font-medium flex items-center">
            {language === 'ar' ? "عرض الكل" : "View All"}
            <ArrowRight className="h-5 w-5 mr-1" />
          </Link>
        </div>
      </div>
      
      {/* TikTok-style video reel */}
      <div className="max-w-xl mx-auto">
        <TikTokReel />
      </div>
    </section>
  );
}
