import { useLanguage } from "@/hooks/use-language";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { Link, useLocation, Redirect } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function AuthPage() {
  const { language } = useLanguage();
  const [location] = useLocation();
  const { user, isLoading } = useAuth();
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }
  
  // Redirect to home if user is already logged in
  if (user) {
    return <Redirect to="/" />;
  }
  
  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Left Side - Forms */}
      <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
        <div className="mb-8">
          <Link href="/">
            <a className="inline-flex items-center text-neutral-600 hover:text-primary transition">
              <ArrowLeft className="h-5 w-5 mr-2" />
              {language === 'ar' ? "العودة للرئيسية" : "Back to Home"}
            </a>
          </Link>
        </div>
        
        <div className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {language === 'ar' ? "مرحباً بك في إيفينتيا" : "Welcome to Eventia"}
            </h1>
            <p className="text-neutral-500">
              {language === 'ar' 
                ? "اكتشف واحجز أفضل الفعاليات في السعودية" 
                : "Discover and book the best events in Saudi Arabia"}
            </p>
          </div>
          
          <Tabs defaultValue="login">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">
                {language === 'ar' ? "تسجيل الدخول" : "Login"}
              </TabsTrigger>
              <TabsTrigger value="register">
                {language === 'ar' ? "إنشاء حساب" : "Register"}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="text-center text-sm text-neutral-500 mt-8">
          {language === 'ar' 
            ? "بالاستمرار، أنت توافق على شروط الاستخدام وسياسة الخصوصية الخاصة بنا" 
            : "By continuing, you agree to our Terms of Service and Privacy Policy"}
        </div>
      </div>
      
      {/* Right Side - Hero Image */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-r from-primary to-secondary p-10">
        <div className="h-full flex flex-col justify-center text-white">
          <div className="text-primary font-bold text-3xl mb-6 bg-white inline-block px-4 py-2 rounded-lg">
            <span className="text-accent">إ</span>يفينتيا
          </div>
          
          <h2 className="text-4xl font-bold mb-4">
            {language === 'ar' 
              ? "منصة الفعاليات الذكية في السعودية" 
              : "The Smart Events Platform in Saudi Arabia"}
          </h2>
          
          <p className="text-lg mb-6 text-white text-opacity-90">
            {language === 'ar' 
              ? "انضم إلينا واكتشف الفعاليات التي تناسب اهتماماتك بمساعدة توصياتنا الذكية" 
              : "Join us and discover events that match your interests with our smart recommendations"}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-bold mb-2">
                {language === 'ar' ? "توصيات ذكية" : "Smart Recommendations"}
              </h3>
              <p className="text-sm text-white text-opacity-80">
                {language === 'ar'
                  ? "فعاليات مخصصة تناسب اهتماماتك وتفضيلاتك"
                  : "Personalized events that match your interests and preferences"}
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-bold mb-2">
                {language === 'ar' ? "حجز سهل" : "Easy Booking"}
              </h3>
              <p className="text-sm text-white text-opacity-80">
                {language === 'ar'
                  ? "احجز تذاكرك بسهولة مع خيارات دفع متعددة"
                  : "Book your tickets easily with multiple payment options"}
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-bold mb-2">
                {language === 'ar' ? "عروض فيديو" : "Video Previews"}
              </h3>
              <p className="text-sm text-white text-opacity-80">
                {language === 'ar'
                  ? "شاهد مقاطع فيديو للفعاليات قبل الحجز"
                  : "Watch event video previews before booking"}
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-bold mb-2">
                {language === 'ar' ? "تذاكر رقمية" : "Digital Tickets"}
              </h3>
              <p className="text-sm text-white text-opacity-80">
                {language === 'ar'
                  ? "احصل على تذاكرك الرقمية وعرض رمز QR للدخول"
                  : "Get your digital tickets and show QR code for entry"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
