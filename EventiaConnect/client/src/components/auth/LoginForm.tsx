import { useLanguage } from "@/hooks/use-language";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function LoginForm() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const { loginMutation } = useAuth();
  
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  // Handle login using the auth context
  const isPending = loginMutation.isPending;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData, {
      onSuccess: () => {
        navigate('/');
      }
    });
  };
  
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder={language === 'ar' ? "أدخل اسم المستخدم" : "Enter your username"}
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
            placeholder={language === 'ar' ? "أدخل كلمة المرور" : "Enter your password"}
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
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
          />
          <Label htmlFor="remember" className="ml-2 text-sm">
            {language === 'ar' ? "تذكرني" : "Remember me"}
          </Label>
        </div>
        
        <a href="#" className="text-sm text-primary hover:underline">
          {language === 'ar' ? "نسيت كلمة المرور؟" : "Forgot password?"}
        </a>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-accent hover:bg-opacity-90"
        disabled={isPending}
      >
        {isPending 
          ? (language === 'ar' ? "جارٍ تسجيل الدخول..." : "Logging in...")
          : (language === 'ar' ? "تسجيل الدخول" : "Log in")}
      </Button>
      
      <div className="relative flex items-center justify-center mt-6">
        <div className="absolute w-full border-t border-neutral-200"></div>
        <div className="relative bg-neutral-50 px-4 text-sm text-neutral-500">
          {language === 'ar' ? "أو تسجيل الدخول باستخدام" : "Or login with"}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" className="w-full">
          Google
        </Button>
        <Button variant="outline" type="button" className="w-full">
          Apple
        </Button>
      </div>
    </form>
  );
}
