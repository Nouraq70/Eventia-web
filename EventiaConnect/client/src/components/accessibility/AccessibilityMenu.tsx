import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Eye, MousePointer, VolumeX, Zap } from "lucide-react";

interface AccessibilityMenuProps {
  closeMenu: () => void;
}

export function AccessibilityMenu({ closeMenu }: AccessibilityMenuProps) {
  const { language } = useLanguage();
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedHighContrast = localStorage.getItem("highContrast") === "true";
    const savedLargeText = localStorage.getItem("largeText") === "true";
    const savedReducedMotion = localStorage.getItem("reducedMotion") === "true";
    
    setHighContrast(savedHighContrast);
    setLargeText(savedLargeText);
    setReducedMotion(savedReducedMotion);
    
    // Apply stored preferences
    if (savedHighContrast) document.body.classList.add("high-contrast");
    if (savedLargeText) document.body.classList.add("large-text");
    if (savedReducedMotion) document.body.classList.add("reduced-motion");
  }, []);
  
  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem("highContrast", String(newValue));
    document.body.classList.toggle("high-contrast");
  };
  
  const toggleLargeText = () => {
    const newValue = !largeText;
    setLargeText(newValue);
    localStorage.setItem("largeText", String(newValue));
    document.body.classList.toggle("large-text");
  };
  
  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    localStorage.setItem("reducedMotion", String(newValue));
    document.body.classList.toggle("reduced-motion");
  };

  return (
    <div className="p-2">
      <div className="flex items-center justify-between py-2 px-3">
        <div className="flex items-center gap-3">
          <Eye className="h-4 w-4" />
          <Label htmlFor="high-contrast-toggle" className="text-sm cursor-pointer">
            {language === 'ar' ? "وضع التباين العالي" : "High Contrast Mode"}
          </Label>
        </div>
        <Switch 
          id="high-contrast-toggle"
          checked={highContrast}
          onCheckedChange={toggleHighContrast}
          aria-label={language === 'ar' ? "تفعيل وضع التباين العالي" : "Toggle high contrast mode"}
        />
      </div>
      
      <DropdownMenuSeparator />
      
      <div className="flex items-center justify-between py-2 px-3">
        <div className="flex items-center gap-3">
          <Zap className="h-4 w-4" />
          <Label htmlFor="large-text-toggle" className="text-sm cursor-pointer">
            {language === 'ar' ? "نص كبير" : "Large Text"}
          </Label>
        </div>
        <Switch 
          id="large-text-toggle"
          checked={largeText}
          onCheckedChange={toggleLargeText}
          aria-label={language === 'ar' ? "تفعيل النص الكبير" : "Toggle large text"}
        />
      </div>
      
      <DropdownMenuSeparator />
      
      <div className="flex items-center justify-between py-2 px-3">
        <div className="flex items-center gap-3">
          <MousePointer className="h-4 w-4" />
          <Label htmlFor="reduced-motion-toggle" className="text-sm cursor-pointer">
            {language === 'ar' ? "تقليل الحركة" : "Reduced Motion"}
          </Label>
        </div>
        <Switch 
          id="reduced-motion-toggle"
          checked={reducedMotion}
          onCheckedChange={toggleReducedMotion}
          aria-label={language === 'ar' ? "تفعيل تقليل الحركة" : "Toggle reduced motion"}
        />
      </div>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuItem 
        className="cursor-pointer flex items-center gap-3"
        onClick={() => {
          window.open("https://support.eventia.sa/accessibility", "_blank");
          closeMenu();
        }}
      >
        <VolumeX className="h-4 w-4" />
        {language === 'ar' ? "دليل إمكانية الوصول" : "Accessibility Guide"}
      </DropdownMenuItem>
    </div>
  );
}