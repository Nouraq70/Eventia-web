import { useLanguage } from "@/hooks/use-language";
import { User } from "@/lib/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    username: user.username,
    profilePicture: user.profilePicture || ""
  });
  
  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (updatedUser: Partial<User>) => {
      const response = await apiRequest("PATCH", `/api/users/${user.id}`, updatedUser);
      return await response.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      toast({
        title: language === 'ar' ? "تم التحديث بنجاح" : "Updated Successfully",
        description: language === 'ar' 
          ? "تم تحديث معلومات ملفك الشخصي بنجاح" 
          : "Your profile information has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: language === 'ar' ? "فشل التحديث" : "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-neutral-200 overflow-hidden">
              {formData.profilePicture ? (
                <img 
                  src={formData.profilePicture} 
                  alt={formData.fullName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-neutral-400">
                  {formData.fullName.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full cursor-pointer">
              <Camera className="h-4 w-4" />
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold">{formData.fullName}</h2>
            <p className="text-neutral-500">{formData.email}</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              {language === 'ar' ? "الاسم الكامل" : "Full Name"}
            </label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-neutral-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {language === 'ar' ? "البريد الإلكتروني" : "Email"}
            </label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-neutral-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {language === 'ar' ? "اسم المستخدم" : "Username"}
            </label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-neutral-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {language === 'ar' ? "رابط صورة الملف الشخصي" : "Profile Picture URL"}
            </label>
            <input 
              type="url" 
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleChange}
              className="w-full p-2 border border-neutral-300 rounded-md"
              placeholder={language === 'ar' ? "أدخل رابط الصورة" : "Enter image URL"}
            />
          </div>
          
          <Button type="submit" disabled={isPending}>
            {isPending 
              ? (language === 'ar' ? "جارٍ الحفظ..." : "Saving...")
              : (language === 'ar' ? "حفظ التغييرات" : "Save Changes")}
          </Button>
        </div>
      </form>
    </div>
  );
}
