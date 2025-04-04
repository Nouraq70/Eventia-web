import { useLanguage } from "@/hooks/use-language";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Eye, EyeOff } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { EventCategory } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterForm() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { registerMutation } = useAuth();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    preferences: [] as string[]
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Use the register mutation from auth context
  const isPending = registerMutation.isPending;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryToggle = (category: string) => {
    setFormData(prev => {
      const preferences = [...prev.preferences];
      if (preferences.includes(category)) {
        return { ...prev, preferences: preferences.filter(p => p !== category) };
      } else {
        return { ...prev, preferences: [...preferences, category] };
      }
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: language === 'ar' ? "كلمات المرور غير متطابقة" : "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    const { confirmPassword, ...userData } = formData;
    registerMutation.mutate(userData, {
      onSuccess: () => {
        navigate('/');
      }
    });
  };
  
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };
  
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(prev => !prev);
  };
  
  // Translation mapping for categories
  const getCategoryName = (category: EventCategory): string => {
    if (language === 'en') {
      const translations: Record<EventCategory, string> = {
        "ثقافي": "Cultural",
        "رياضي": "Sports",
        "موسيقي": "Music",
        "تعليمي": "Educational",
        "ترفيهي": "Entertainment",
        "عائلي": "Family",
        "أعمال": "Business"
      };
      return translations[category];
    }
    
    return category;
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">
          {language === 'ar' ? "الاسم الكامل" : "Full Name"}
        </Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          required
          placeholder={language === 'ar' ? "أدخل اسمك الكامل" : "Enter your full name"}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">
          {language === 'ar' ? "البريد الإلكتروني" : "Email"}
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder={language === 'ar' ? "أدخل بريدك الإلكتروني" : "Enter your email"}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="username">
          {language === 'ar' ? "اسم المستخدم" : "Username"}
        </Label>
        <Input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder={language === 'ar' ? "أدخل اسم المستخدم" : "Choose a username"}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">
          {language === 'ar' ? "كلمة المرور" : "Password"}
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
            placeholder={language === 'ar' ? "أدخل كلمة المرور" : "Create a password"}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center"
            onClick={toggleShowPassword}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-neutral-500" />
            ) : (
              <Eye className="h-4 w-4 text-neutral-500" />
            )}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          {language === 'ar' ? "تأكيد كلمة المرور" : "Confirm Password"}
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder={language === 'ar' ? "أكد كلمة المرور" : "Confirm your password"}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center"
            onClick={toggleShowConfirmPassword}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-neutral-500" />
            ) : (
              <Eye className="h-4 w-4 text-neutral-500" />
            )}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>
          {language === 'ar' ? "اختر فئات الفعاليات المفضلة لديك" : "Choose your preferred event categories"}
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category}`} 
                checked={formData.preferences.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              />
              <Label 
                htmlFor={`category-${category}`}
                className="text-sm"
              >
                {getCategoryName(category)}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-accent hover:bg-opacity-90"
        disabled={isPending}
      >
        {isPending 
          ? (language === 'ar' ? "جارٍ إنشاء الحساب..." : "Creating account...")
          : (language === 'ar' ? "إنشاء حساب" : "Sign up")}
      </Button>
      
      <div className="text-center text-sm">
        {language === 'ar' 
          ? "بالتسجيل، أنت توافق على شروط الاستخدام وسياسة الخصوصية الخاصة بنا" 
          : "By signing up, you agree to our Terms of Service and Privacy Policy"}
      </div>
    </form>
  );
}
