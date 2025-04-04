import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls";

export default function Header() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  
  // User is logged in if user is not null
  const isLoggedIn = !!user;
  
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/');
      }
    });
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 py-3 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {/* Logo */}
          <Link href="/" className="text-primary font-bold text-2xl">
            <span className="text-accent">E</span>ventia
          </Link>
        </div>
        
        {/* Search Bar */}
        <div className="hidden md:flex rounded-full bg-neutral-100 px-4 py-2 w-1/3">
          <Search className="h-5 w-5 text-neutral-400 ms-2" />
          <Input
            type="search"
            placeholder={language === 'ar' ? "ابحث عن الفعاليات..." : "Search for events..."}
            className="bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Mobile Search Icon */}
        <div className="md:hidden">
          <Search className="h-6 w-6 text-neutral-500" />
        </div>
        
        {/* Accessibility Controls */}
        <div className="hidden md:flex items-center">
          <AccessibilityControls />
        </div>
        
        {/* User Menu */}
        <div className="flex items-center gap-3">
          {!isLoggedIn && (
            <Link href="/auth">
              <Button variant="outline" className="text-accent border-accent hover:bg-accent hover:text-white transition duration-200">
                {language === 'ar' ? "تسجيل دخول" : "Login"}
              </Button>
            </Link>
          )}
          
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center cursor-pointer">
                  <User className="h-5 w-5 text-neutral-500" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    {language === 'ar' ? "الملف الشخصي" : "Profile"}
                  </DropdownMenuItem>
                </Link>
                <Link href="/my-tickets">
                  <DropdownMenuItem className="cursor-pointer">
                    {language === 'ar' ? "تذاكري" : "My Tickets"}
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem 
                  className="cursor-pointer text-red-500" 
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending 
                    ? (language === 'ar' ? "جارٍ تسجيل الخروج..." : "Logging out...") 
                    : (language === 'ar' ? "تسجيل الخروج" : "Logout")}
                  <LogOut className="h-4 w-4 ml-2" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth" className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center cursor-pointer">
              <User className="h-5 w-5 text-neutral-500" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
