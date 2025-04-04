import { useLanguage } from "@/hooks/use-language";
import { Event } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles, Users, Zap, Brain, Lightbulb, Info } from "lucide-react";
import { Link } from "wouter";
import EventCard from "../events/EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RecommendedEventsProps {
  userId?: number;
}

export default function RecommendedEvents({ userId: propUserId }: RecommendedEventsProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const userId = propUserId || user?.id;
  
  const [recommendationType, setRecommendationType] = useState<"ai" | "collaborative" | "basic">("ai");
  
  // Choose API URL based on recommendation type and user login status
  const getApiUrl = () => {
    if (!userId) return "/api/events/featured";
    
    switch (recommendationType) {
      case "ai":
        return `/api/ai-recommendations/${userId}`;
      case "collaborative":
        return `/api/collaborative-recommendations/${userId}`;
      default:
        return `/api/recommendations/${userId}`;
    }
  };
  
  const apiUrl = getApiUrl();
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: [apiUrl],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Recommendation type descriptions
  const getRecommendationDescription = (type: string) => {
    if (language === 'ar') {
      switch (type) {
        case 'ai':
          return "توصيات مخصصة بناءً على تفضيلاتك واهتماماتك باستخدام تقنيات الذكاء الاصطناعي المتطورة.";
        case 'collaborative':
          return "فعاليات يفضلها مستخدمون آخرون لديهم اهتمامات مشابهة لاهتماماتك.";
        case 'basic':
          return "فعاليات مختارة بناءً على تفضيلاتك الأساسية والفئات التي تهتم بها.";
        default:
          return "";
      }
    } else {
      switch (type) {
        case 'ai':
          return "Personalized recommendations based on your preferences and interests using advanced AI techniques.";
        case 'collaborative':
          return "Events preferred by other users who have similar interests to yours.";
        case 'basic':
          return "Events selected based on your basic preferences and categories of interest.";
        default:
          return "";
      }
    }
  };
  
  // Get recommendation icon
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'ai':
        return <Brain className="h-5 w-5" />;
      case 'collaborative':
        return <Users className="h-5 w-5" />;
      case 'basic':
        return <Lightbulb className="h-5 w-5" />;
      default:
        return null;
    }
  };
  
  return (
    <section className="mb-14">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div className="flex items-center mb-3 md:mb-0">
          <h2 className="text-2xl font-bold mr-2">
            {language === 'ar' ? "موصى به لك" : "Recommended for You"}
          </h2>
          {userId && recommendationType === "ai" && (
            <Badge variant="outline" className="bg-primary/10 text-primary flex items-center ml-2">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              {language === 'ar' ? "ذكاء اصطناعي" : "AI"}
            </Badge>
          )}
        </div>
        <Link href="/events" className="text-primary font-medium flex items-center hover:underline">
          {language === 'ar' ? "عرض جميع الفعاليات" : "View All Events"}
          <ArrowRight className="h-5 w-5 ml-1" />
        </Link>
      </div>
      
      {userId ? (
        <div className="mb-6">
          <Tabs 
            defaultValue="ai" 
            value={recommendationType} 
            onValueChange={(value) => setRecommendationType(value as "ai" | "collaborative" | "basic")}
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <TabsList className="mb-3 sm:mb-0">
                <TabsTrigger value="ai" className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  {language === 'ar' ? "ذكاء اصطناعي" : "AI Powered"}
                </TabsTrigger>
                <TabsTrigger value="collaborative">
                  <Users className="h-4 w-4 mr-1" />
                  {language === 'ar' ? "اهتمامات مشتركة" : "Similar Users"}
                </TabsTrigger>
                <TabsTrigger value="basic">
                  <Lightbulb className="h-4 w-4 mr-1" />
                  {language === 'ar' ? "أساسي" : "Basic"}
                </TabsTrigger>
              </TabsList>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-sm text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                      <Info className="h-4 w-4 mr-1" />
                      {language === 'ar' ? "ما هذا؟" : "What's this?"}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm p-4 bg-white shadow-lg rounded-lg border border-neutral-200">
                    <div className="space-y-2">
                      <h3 className="font-bold">{language === 'ar' ? "أنواع التوصيات" : "Recommendation Types"}</h3>
                      <p className="text-sm">{getRecommendationDescription(recommendationType)}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* AI badge explanation */}
            <TabsContent value="ai" className="mt-0">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20 mb-6 flex items-start">
                <div className="bg-primary/20 p-2 rounded-full mr-3 mt-1">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-800 mb-1">
                    {language === 'ar' ? "توصيات مدعومة بالذكاء الاصطناعي" : "AI-Powered Recommendations"}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {language === 'ar' 
                      ? "نستخدم نماذج ذكاء اصطناعي متقدمة لتحليل اهتماماتك وتفضيلاتك وتاريخ مشاهداتك وحجوزاتك السابقة لاقتراح فعاليات تناسبك بشكل شخصي."
                      : "We use advanced AI models to analyze your interests, preferences, viewing history, and past bookings to suggest events that are personally tailored to you."}
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="collaborative" className="mt-0">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 mb-6 flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-800 mb-1">
                    {language === 'ar' ? "توصيات تعاونية" : "Collaborative Recommendations"}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {language === 'ar' 
                      ? "نوصي بفعاليات بناءً على ما يفضله أشخاص آخرون لديهم اهتمامات مشابهة لك. تساعد هذه الطريقة في اكتشاف فعاليات جديدة قد تعجبك."
                      : "We recommend events based on what other people with similar interests to you enjoy. This method helps you discover new events you might like."}
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="basic" className="mt-0">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200 mb-6 flex items-start">
                <div className="bg-amber-100 p-2 rounded-full mr-3 mt-1">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-800 mb-1">
                    {language === 'ar' ? "توصيات أساسية" : "Basic Recommendations"}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {language === 'ar' 
                      ? "توصيات بسيطة تعتمد على فئات الفعاليات التي اخترتها في تفضيلاتك، مثل الموسيقى أو الرياضة أو الثقافة."
                      : "Simple recommendations based on event categories you've selected in your preferences, such as music, sports, or culture."}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6 flex justify-between items-center">
          <div className="flex items-start">
            <div className="bg-primary/20 p-2 rounded-full mr-3">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-neutral-700">
                {language === 'ar' 
                  ? "سجل دخولك للحصول على توصيات مخصصة" 
                  : "Sign in to get personalized recommendations"}
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                {language === 'ar'
                  ? "اكتشف فعاليات تناسب اهتماماتك باستخدام الذكاء الاصطناعي"
                  : "Discover events that match your interests using AI"}
              </p>
            </div>
          </div>
          <Link href="/auth" className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            {language === 'ar' ? "تسجيل الدخول" : "Sign In"}
          </Link>
        </div>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-200">
              <Skeleton className="aspect-video w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
          <div className="text-red-500 mb-2">
            {language === 'ar' ? "حدث خطأ أثناء تحميل الفعاليات" : "Error loading events"}
          </div>
          <div className="text-sm text-neutral-600">
            {language === 'ar' ? "يرجى المحاولة مرة أخرى لاحقًا" : "Please try again later"}
          </div>
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              showAiBadge={userId !== undefined && recommendationType === "ai"}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="text-neutral-500 mb-2">
            {language === 'ar' ? "لا توجد فعاليات متاحة حالياً" : "No events available at the moment"}
          </div>
          <div className="text-sm text-neutral-600">
            {language === 'ar' 
              ? "يرجى التحقق مرة أخرى قريبًا لعرض الفعاليات الجديدة" 
              : "Please check back soon for new events"}
          </div>
        </div>
      )}
    </section>
  );
}
