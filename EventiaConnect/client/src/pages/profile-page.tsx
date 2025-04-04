import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNavigation from "@/components/layout/MobileNavigation";
import { useLanguage } from "@/hooks/use-language";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from "@/components/profile/ProfileForm";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function ProfilePage() {
  const { language } = useLanguage();
  
  // Mock user ID - in a real implementation this would come from auth context
  const userId = 1;
  
  // Fetch user data
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: [`/api/user`],
  });
  
  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-6 min-h-[70vh]">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              {language === 'ar' ? "الملف الشخصي" : "Profile"}
            </h1>
            <Button variant="outline" className="gap-2 text-red-500 border-red-200 hover:bg-red-50">
              <LogOut className="h-4 w-4" />
              {language === 'ar' ? "تسجيل الخروج" : "Logout"}
            </Button>
          </div>
          
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center gap-4 mb-8">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-white rounded-xl shadow-sm">
              <div className="text-red-500 mb-4">
                {language === 'ar' ? "حدث خطأ أثناء تحميل بيانات المستخدم" : "Error loading user data"}
              </div>
              <Link href="/auth">
                <Button>
                  {language === 'ar' ? "تسجيل الدخول" : "Login"}
                </Button>
              </Link>
            </div>
          ) : user ? (
            <Tabs defaultValue="account">
              <TabsList className="mb-8">
                <TabsTrigger value="account">
                  {language === 'ar' ? "الحساب" : "Account"}
                </TabsTrigger>
                <TabsTrigger value="preferences">
                  {language === 'ar' ? "التفضيلات" : "Preferences"}
                </TabsTrigger>
                <TabsTrigger value="security">
                  {language === 'ar' ? "الأمان" : "Security"}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="account">
                <ProfileForm user={user} />
              </TabsContent>
              
              <TabsContent value="preferences">
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-xl font-bold mb-6">
                    {language === 'ar' ? "تفضيلات الفعاليات" : "Event Preferences"}
                  </h2>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">
                      {language === 'ar' ? "فئات الفعاليات المفضلة" : "Preferred Event Categories"}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {["ثقافي", "رياضي", "موسيقي", "تعليمي", "ترفيهي", "عائلي", "أعمال"].map((category) => (
                        <div key={category} className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={category} 
                            className="mr-2"
                            defaultChecked={user.preferences?.includes(category)} 
                          />
                          <label htmlFor={category}>{category}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">
                      {language === 'ar' ? "المدن المفضلة" : "Preferred Cities"}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {["الرياض", "جدة", "الدمام", "مكة", "المدينة", "الطائف"].map((city) => (
                        <div key={city} className="flex items-center">
                          <input type="checkbox" id={city} className="mr-2" />
                          <label htmlFor={city}>{city}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button>
                    {language === 'ar' ? "حفظ التغييرات" : "Save Changes"}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="security">
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-xl font-bold mb-6">
                    {language === 'ar' ? "الأمان" : "Security"}
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">
                        {language === 'ar' ? "تغيير كلمة المرور" : "Change Password"}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {language === 'ar' ? "كلمة المرور الحالية" : "Current Password"}
                          </label>
                          <input 
                            type="password" 
                            className="w-full p-2 border border-neutral-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {language === 'ar' ? "كلمة المرور الجديدة" : "New Password"}
                          </label>
                          <input 
                            type="password" 
                            className="w-full p-2 border border-neutral-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {language === 'ar' ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"}
                          </label>
                          <input 
                            type="password" 
                            className="w-full p-2 border border-neutral-300 rounded-md"
                          />
                        </div>
                        <Button>
                          {language === 'ar' ? "تحديث كلمة المرور" : "Update Password"}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-neutral-200">
                      <h3 className="font-medium mb-3 text-red-500">
                        {language === 'ar' ? "حذف الحساب" : "Delete Account"}
                      </h3>
                      <p className="text-sm text-neutral-500 mb-4">
                        {language === 'ar' 
                          ? "حذف حسابك سيؤدي إلى إزالة جميع بياناتك بشكل دائم. هذا الإجراء لا يمكن التراجع عنه."
                          : "Deleting your account will remove all your data permanently. This action cannot be undone."}
                      </p>
                      <Button variant="destructive">
                        {language === 'ar' ? "حذف الحساب" : "Delete Account"}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center p-8 bg-white rounded-xl shadow-sm">
              <p className="mb-4">
                {language === 'ar' ? "يرجى تسجيل الدخول لعرض الملف الشخصي" : "Please login to view your profile"}
              </p>
              <Link href="/auth">
                <Button>
                  {language === 'ar' ? "تسجيل الدخول" : "Login"}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      <MobileNavigation />
    </>
  );
}
